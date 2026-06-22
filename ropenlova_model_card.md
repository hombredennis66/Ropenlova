# Ropenlova — Student Spending Prediction Model Card

> **Status:** Specification (pre-training). This documents the model as designed in
> `train.py` / `predict.py` / `retrain.py`. Metric values below are placeholders —
> fill them in after the first real training run completes.

---

## 1. Overview

| | |
|---|---|
| **Model name** | Ropenlova Spending Predictor |
| **Task** | Regression — predict a Kenyan university student's monthly spending |
| **Output unit** | KES (Kenyan Shillings) |
| **Output type** | Point estimate + confidence interval + per-prediction feature attribution |
| **Versioning scheme** | `v{training_rows // 10}.{training_rows % 10}` (e.g. 47 rows → `v4.7`) |
| **Serving framework** | FastAPI (`backend/app.py`) |
| **Training framework** | scikit-learn |

---

## 2. Problem Formulation

**Input:** 11 survey fields per student (8 numeric, 3 categorical).
**Target:** a single continuous value — predicted monthly spending in KES.
**Auxiliary outputs returned alongside the point estimate:**
- `confidence_low` / `confidence_high` — currently a naive ±15% heuristic band around the
  point estimate, not a statistical prediction interval (see Limitations).
- `shap_values` — top 8 features by absolute SHAP value, computed per-prediction.

---

## 3. Features

### Numeric (8) — StandardScaler
| Feature | Type | Range |
|---|---|---|
| `monthly_allowance` | float | 0 – 500,000 KES |
| `distance_from_campus` | float | 0 – 500 km |
| `outings_per_month` | int | 0 – 60 |
| `gaming_hours` | float | 0 – 24 (weekly) |
| `club_events` | int | 0 – 20 |
| `mobile_data_usage` | float | 0 – 100 GB |
| `year_of_study` | int | 1 – 6 |
| `printing_frequency` | int | 0 – 100 |

### Categorical (3) — OneHotEncoder(`handle_unknown="ignore"`)
| Feature | Categories |
|---|---|
| `accommodation_type` | campus_hostel, off_campus_rented, family_home, own_house |
| `transport_type` | walking, matatu, boda_boda, personal_car, cycling |
| `meal_habits` | self_cook, cafeteria, restaurant, mix |

Both transformers are combined in a single `ColumnTransformer`, wrapped with the chosen
estimator in one `sklearn.pipeline.Pipeline` — so `model.pkl` is the entire
preprocessing + inference pipeline, not just the bare estimator.

---

## 4. Candidate Models

Every training run fits **all four** of the following and keeps the best one by test-set R².
This is a from-scratch comparison each time — there is no "default" model, the winner can
change between training runs as data shifts.

| Model | Hyperparameters |
|---|---|
| `LinearRegression` | defaults (baseline) |
| `Ridge` | `alpha=1.0` |
| `Lasso` | `alpha=0.5`, `max_iter=5000` |
| `RandomForestRegressor` | `n_estimators=200`, `max_depth=10`, `min_samples_leaf=2`, `random_state=42` |

**Selection rule:** highest R² on a held-out 20% test split (`random_state=42`).
5-fold cross-validated R² is also computed and logged for reference but does not drive selection.

*Not yet implemented* (listed as `future_models` in the original plan): XGBoost, LightGBM, CatBoost.

---

## 5. Evaluation Metrics

| Metric | Computed on | Used for |
|---|---|---|
| R² | held-out test split | model selection, stored in `model_versions.r2_score` |
| RMSE (KES) | held-out test split | stored in `model_versions.rmse` |
| MAE (KES) | held-out test split | stored in `model_versions.mae` |
| CV R² (5-fold) | training split | logged, informational only |

**Target threshold:** the seed dataset must yield R² ≥ 0.72 on its own 80/20 split. If a
training run on seed data falls below this, the seed data's feature/target relationships
need to be made more linear and realistic before shipping.

*(Fill in once trained: actual R² / RMSE / MAE per model, and which model won.)*

---

## 6. Training Data & Label Strategy

There is no single fixed training set — `train.py` picks its data source by priority,
because real labeled outcomes are scarce early on:

| Priority | Source | Used when |
|---|---|---|
| 1 | `confirmed_actual_spending` (real, student-reported ground truth) | ≥ `MIN_CONFIRMED_ROWS` (default 20) confirmed rows exist |
| 2 | `predicted_spending` (proxy — prior model's own output) | confirmed rows are too sparse, but enough proxy rows exist |
| 3 | `data/seed_data.csv` (30 synthetic bootstrap rows) | combined usable rows < 10 |

Whichever source wins is recorded as `label_source` inside `model.pkl` and logged into
`model_versions.notes` (e.g. `"label_source=confirmed_actual_spending"`), so every model
version is traceable to what it actually learned from — proxy-trained and ground-truth-trained
versions are never silently conflated.

**Why this matters:** training exclusively on `predicted_spending` (the model's own past
output) would create a feedback loop rather than real learning. The `confirmed_actual_spending`
field exists specifically to break that loop once enough students self-report.

---

## 7. Explainability (SHAP)

- `RandomForestRegressor` → `shap.TreeExplainer`
- `LinearRegression` / `Ridge` / `Lasso` → `shap.LinearExplainer`
- Computed **per prediction**, at inference time, against the fitted pipeline's transformed
  feature space (post one-hot encoding).
- Top 8 features by `|SHAP value|` are kept and persisted to `predictions.shap_values` (JSONB).
- Best-effort: wrapped in try/except — a SHAP failure never blocks returning a prediction,
  it just omits the explanation for that row.

---

## 8. Versioning & Activation

- `model_versions` table: `version`, `model_type`, `r2_score`, `rmse`, `mae`, `training_rows`,
  `is_active`, `notes`, `created_at`.
- A partial unique index enforces **exactly one** `is_active = TRUE` row at a time.
- On successful training, the new version is inserted and immediately activated
  (`activate_model_version`), which flips the previous active row to `FALSE` first.
- The serialized artifact (`model.pkl`) also embeds its own `version`, `model_type`,
  `features`, and `trained_at` so the file is self-describing even outside the DB.

---

## 9. Retraining

| Trigger | Mechanism |
|---|---|
| Manual | `POST /train?force=true` (admin dashboard "Retrain" button) |
| Scheduled | Render Cron Job, weekly — Sundays 02:00 UTC — runs `retrain.py` |
| Conditional | `retrain.py` only retrains if `(current survey_response count) − (last active model's training_rows) ≥ RETRAIN_THRESHOLD` (default 50) |

After retraining, the in-process model cache (`@lru_cache` in `predict.py`) is invalidated via
`reload_model()` so the FastAPI worker picks up the new pipeline without a restart.

---

## 10. Serving Pipeline

```
Survey form (frontend)
   → Zod validation
   → Supabase insert (survey_responses)
   → POST /predict (FastAPI, Bearer JWT required)
       → Pydantic validation (schemas.SurveyInput)
       → load cached pipeline (model.pkl)
       → pipeline.predict()
       → ±15% confidence band
       → SHAP top-8 attribution
       → persist to predictions table
   → PredictionResponse → dashboard
```

On FastAPI startup, if `model.pkl` doesn't exist yet, the `lifespan` hook runs an initial
training pass automatically — the API is never left with nothing to serve.

---

## 11. Dependencies

```
scikit-learn==1.5.2
pandas==2.2.3
numpy==1.26.4
joblib==1.4.2
shap==0.46.0
fastapi==0.115.0
pydantic==2.9.2
supabase==2.9.1
```

---

## 12. Known Limitations

- **Confidence interval is a heuristic, not statistical.** The ±15% band is a placeholder —
  a real prediction interval (e.g. quantile regression forest, or bootstrapped residuals)
  should replace it once there's enough data to estimate residual variance properly.
- **Cold-start bootstrap risk.** Until `MIN_CONFIRMED_ROWS` confirmed labels exist, the model
  may train on its own past predictions (proxy labels), which can entrench early biases.
- **Small, synthetic seed set.** The 30-row seed CSV is illustrative, not measured — treat
  early predictions (before any retraining) as low-confidence.
- **Silent degradation on unseen categories.** `OneHotEncoder(handle_unknown="ignore")` zero-
  vectors any category not seen during training rather than erroring — graceful, but means a
  genuinely new accommodation/transport type contributes nothing to the prediction.
- **No outlier/leverage screening.** Survey inputs are range-validated (via Pydantic) but not
  checked for being statistically unusual relative to the training distribution.

---

## 13. Explicitly Out of Scope (Future)

- XGBoost / LightGBM / CatBoost as additional candidate models
- True quantile-based prediction intervals
- A/B testing between concurrently active model versions
- Multi-university dataset expansion

# Student Spending Prediction Platform

## Vision

Transform the original machine learning demonstration project into a production-ready full-stack ML platform capable of:

* Collecting real student survey data
* Predicting semester spending
* Visualizing spending patterns
* Continuously improving model accuracy
* Supporting thousands of users

---

# Phase 1: Database Design

## Create Supabase Tables

Required tables:

1. users
2. survey_responses
3. predictions
4. model_versions

Relationships:

users → survey_responses

survey_responses → predictions

model_versions → predictions

---

# Phase 2: Survey Collection

## Build Survey Form

Collect:

* Monthly allowance
* Distance from campus
* Accommodation type
* Transport type
* Meal habits
* Outings per month
* Gaming hours
* Club participation
* Mobile data usage
* Year of study
* Printing frequency

Requirements:

* Validation using Zod
* Authenticated users only
* Save responses to PostgreSQL

---

# Phase 3: Machine Learning Backend

## FastAPI Service

Create a separate Python service.

Responsibilities:

* Load trained model
* Accept prediction requests
* Return prediction results
* Save predictions

Suggested structure:

backend/
├── app.py
├── models/
│   └── model.pkl
├── train.py
├── schemas.py
├── database.py
└── requirements.txt

---

# Phase 4: Model Training

## Initial Models

Train:

* Linear Regression
* Ridge Regression
* Lasso Regression
* Random Forest Regressor

Metrics:

* R² Score
* RMSE
* MAE

Save:

model.pkl

Store metadata:

* Model version
* Training date
* Accuracy metrics

---

# Phase 5: Prediction System

Workflow:

User submits survey

↓

Data stored in PostgreSQL

↓

FastAPI receives request

↓

Model predicts spending

↓

Prediction stored

↓

Dashboard updates

---

# Phase 6: Dashboard

Create:

## User Dashboard

Features:

* Latest prediction
* Prediction history
* Spending trends
* Personal analytics

## Admin Dashboard

Features:

* User growth
* Dataset size
* Model accuracy
* Feature importance
* Prediction distribution

---

# Phase 7: Explainable AI

Implement SHAP.

Show:

* Top contributing features
* Positive influences
* Negative influences

Example:

Predicted Spending: KES 45,200

Top Drivers:

* Accommodation
* Monthly Allowance
* Transport Cost

---

# Phase 8: Automated Retraining

Trigger retraining when:

* New data threshold reached
* Weekly schedule executes

Process:

1. Pull latest survey data
2. Retrain models
3. Evaluate performance
4. Save best model
5. Update model version

---

# Phase 9: Deployment

Frontend:

* Vercel or Render

Backend:

* Render Web Service

Database:

* Supabase PostgreSQL

Scheduled Tasks:

* Render Cron Jobs

---

# Security Checklist

* Enable Row Level Security
* Verify email before access
* Secure API endpoints
* Validate all inputs
* Protect environment variables
* Rate-limit prediction requests

---

# Success Criteria

The platform is considered complete when:

✓ Real survey data is collected

✓ FastAPI serves live predictions

✓ PostgreSQL stores all responses

✓ Dashboard displays analytics

✓ Models are versioned

✓ Automated retraining works

✓ Authentication is enforced

✓ Application is production-ready

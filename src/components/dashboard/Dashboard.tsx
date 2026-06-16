import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ScatterChart,
  Scatter,
  Line,
  ComposedChart,
  Cell,
  PieChart,
  Pie,
} from "recharts";
import results from "../../data/results.json";

const PIE_COLORS = ["#0e1311", "#5ae14c", "#505050", "#a0a0a0"];

function Card({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-2xl border border-ink/10 bg-white/85 p-6 backdrop-blur-sm">
      <h3 className="font-schibsted font-semibold text-ink" style={{ fontSize: 18, letterSpacing: "-0.4px" }}>
        {title}
      </h3>
      <div className="mt-4">{children}</div>
    </div>
  );
}

export default function Dashboard() {
  const best = [...results.models].sort((a, b) => b.r2 - a.r2)[0];

  return (
    <section className="relative z-10 mx-auto w-full max-w-6xl px-6 py-24">
      <div className="text-center">
        <span className="font-inter text-grayink" style={{ fontSize: 14 }}>
          {results.dataset.records} records · {results.dataset.features} features
        </span>
        <h2
          className="mt-2 font-fustat font-bold text-ink"
          style={{ fontSize: 52, letterSpacing: "-2.4px", lineHeight: 1.05 }}
        >
          Student Spending Prediction
        </h2>
        <p className="mx-auto mt-4 max-w-xl font-fustat font-medium text-grayink" style={{ fontSize: 18 }}>
          Comparing regression models to forecast total semester spending — best fit:{" "}
          <span className="text-ink">{best.name}</span> (R² {best.r2}).
        </p>
      </div>

      <div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-2">
        <Card title="Model Comparison — R²">
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={results.models} margin={{ left: -16 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e5e5" />
              <XAxis dataKey="name" tick={{ fontSize: 11, fill: "#505050" }} interval={0} angle={-12} textAnchor="end" height={50} />
              <YAxis domain={[0.8, 0.95]} tick={{ fontSize: 11, fill: "#505050" }} />
              <Tooltip />
              <Bar dataKey="r2" radius={[6, 6, 0, 0]}>
                {results.models.map((m, i) => (
                  <Cell key={i} fill={m.name === best.name ? "#5ae14c" : "#0e1311"} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </Card>

        <Card title="Error Metrics — RMSE & MAE">
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={results.models} margin={{ left: -16 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e5e5" />
              <XAxis dataKey="name" tick={{ fontSize: 11, fill: "#505050" }} interval={0} angle={-12} textAnchor="end" height={50} />
              <YAxis tick={{ fontSize: 11, fill: "#505050" }} />
              <Tooltip />
              <Bar dataKey="rmse" fill="#0e1311" radius={[6, 6, 0, 0]} />
              <Bar dataKey="mae" fill="#5ae14c" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </Card>

        <Card title="Random Forest — Feature Importance">
          <ResponsiveContainer width="100%" height={320}>
            <BarChart layout="vertical" data={results.featureImportance} margin={{ left: 40 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e5e5" />
              <XAxis type="number" tick={{ fontSize: 11, fill: "#505050" }} />
              <YAxis type="category" dataKey="feature" width={120} tick={{ fontSize: 10, fill: "#505050" }} />
              <Tooltip />
              <Bar dataKey="importance" fill="#0e1311" radius={[0, 6, 6, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </Card>

        <Card title="Predicted vs Actual Spending">
          <ResponsiveContainer width="100%" height={320}>
            <ComposedChart data={results.predictedVsActual}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e5e5" />
              <XAxis dataKey="actual" name="Actual" tick={{ fontSize: 11, fill: "#505050" }} />
              <YAxis tick={{ fontSize: 11, fill: "#505050" }} />
              <Tooltip />
              <Line type="monotone" dataKey="actual" stroke="#505050" dot={false} strokeDasharray="5 5" />
              <Scatter dataKey="predicted" fill="#5ae14c" />
            </ComposedChart>
          </ResponsiveContainer>
        </Card>

        <Card title="Spending Drivers by Category">
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={results.categories}
                dataKey="share"
                nameKey="category"
                innerRadius={60}
                outerRadius={100}
                paddingAngle={3}
                label={(e: any) => `${e.category} ${e.share}%`}
              >
                {results.categories.map((_, i) => (
                  <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </Card>

        <Card title="Feature Groups">
          <ul className="space-y-3">
            {[
              { t: "Financial", d: "Monthly Allowance" },
              { t: "Lifestyle", d: "Distance, Accommodation, Transport, Meals" },
              { t: "Behavioral", d: "Outings, Gaming, Club events, Mobile data" },
              { t: "Academic", d: "Year of study, Printing frequency" },
            ].map((g) => (
              <li key={g.t} className="rounded-xl bg-lightgray p-3">
                <p className="font-schibsted font-semibold text-ink" style={{ fontSize: 14 }}>{g.t}</p>
                <p className="font-inter text-grayink" style={{ fontSize: 13 }}>{g.d}</p>
              </li>
            ))}
          </ul>
        </Card>
      </div>
    </section>
  );
}

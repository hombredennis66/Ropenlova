import { createFileRoute } from "@tanstack/react-router";
import VideoBackground from "../components/hero/VideoBackground";
import Navigation from "../components/hero/Navigation";
import HeroContent from "../components/hero/HeroContent";
import DepthScene from "../components/three/DepthScene";
import Dashboard from "../components/dashboard/Dashboard";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Transform Data Quickly — Student Spending Insights" },
      {
        name: "description",
        content:
          "An immersive 3D data experience with machine-learning predictions for student semester spending.",
      },
      { property: "og:title", content: "Transform Data Quickly" },
      {
        property: "og:description",
        content: "Immersive 3D scroll experience and student spending ML dashboard.",
      },
    ],
  }),
  component: Index,
});

function Index() {
  return (
    <main className="relative">
      {/* Hero */}
      <section className="relative min-h-screen overflow-hidden">
        <VideoBackground />
        <div className="relative z-10 flex min-h-screen flex-col" style={{ paddingTop: 0 }}>
          <Navigation />
          <div
            className="flex flex-1 items-center justify-center px-[120px]"
            style={{ marginTop: 60 }}
          >
            <HeroContent />
          </div>
        </div>
      </section>

      {/* 3D depth intro */}
      <section className="relative flex min-h-screen items-center justify-center overflow-hidden px-6 text-center">
        <DepthScene />
        <div className="relative z-10 max-w-2xl">
          <h2
            className="font-fustat font-bold text-white"
            style={{ fontSize: 56, letterSpacing: "-2.8px", lineHeight: 1.05 }}
          >
            Real depth. Real motion.
          </h2>
          <p className="mx-auto mt-5 max-w-lg font-fustat font-medium text-white/70" style={{ fontSize: 20 }}>
            Scroll to move through a living field of data — every shard and particle reacts to your
            journey in true 3D space.
          </p>
        </div>
      </section>

      {/* Dataset stats */}
      <section className="relative z-10 mx-auto grid max-w-4xl grid-cols-1 gap-6 px-6 py-16 sm:grid-cols-3">
        {[
          { n: "250", l: "Student records" },
          { n: "23", l: "Engineered features" },
          { n: "90.7%", l: "Best model R²" },
        ].map((s) => (
          <div key={s.l} className="rounded-2xl border border-ink/10 bg-white/80 p-8 text-center backdrop-blur-sm">
            <p className="font-fustat font-bold text-ink" style={{ fontSize: 44, letterSpacing: "-2px" }}>
              {s.n}
            </p>
            <p className="mt-1 font-inter text-grayink" style={{ fontSize: 14 }}>
              {s.l}
            </p>
          </div>
        ))}
      </section>

      {/* Dashboard */}
      <Dashboard />

      {/* Footer */}
      <footer className="relative z-10 border-t border-ink/10 bg-white/85 px-6 py-12 text-center backdrop-blur-sm">
        <p className="font-schibsted font-semibold text-ink" style={{ fontSize: 20, letterSpacing: "-1px" }}>
          Logoipsum
        </p>
        <p className="mt-2 font-inter text-grayink" style={{ fontSize: 13 }}>
          Built with React Three Fiber · Static front-end demo
        </p>
      </footer>
    </main>
  );
}

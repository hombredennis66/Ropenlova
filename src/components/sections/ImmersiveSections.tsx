import { useScrollReveal } from "@/hooks/useScrollReveal";
import type { ReactNode } from "react";

function Reveal({
  children,
  delay = 0,
  className = "",
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
}) {
  const { ref, visible } = useScrollReveal<HTMLDivElement>();
  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(36px)",
        transition: `opacity 0.7s ease ${delay}ms, transform 0.7s cubic-bezier(0.16,1,0.3,1) ${delay}ms`,
      }}
    >
      {children}
    </div>
  );
}

const features = [
  {
    title: "True 3D depth",
    body: "WebGL-powered parallax layers, particle fields, and rotating shards that respond to every scroll in real space.",
  },
  {
    title: "Machine learning",
    body: "Gradient-boosted models predict student semester spending with up to 90.7% R² accuracy.",
  },
  {
    title: "Live dashboards",
    body: "Interactive charts let you slice 250 records across 23 engineered features instantly.",
  },
  {
    title: "Built for motion",
    body: "Scroll-triggered reveals and smooth anchored navigation keep the whole experience fluid.",
  },
];

const projects = [
  { tag: "ML", title: "Spending Predictor", body: "Forecast semester budgets from lifestyle signals." },
  { tag: "3D", title: "Depthscape Engine", body: "Reusable parallax + particle scene renderer." },
  { tag: "Data", title: "Insight Dashboard", body: "Feature importance and correlation explorer." },
];

export function FeaturesSection() {
  return (
    <section id="features" className="relative z-10 mx-auto max-w-6xl px-6 py-28">
      <Reveal>
        <p className="font-inter font-semibold uppercase tracking-[0.2em] text-grayink" style={{ fontSize: 13 }}>
          Features
        </p>
        <h2 className="mt-3 max-w-2xl font-fustat font-bold text-ink" style={{ fontSize: 48, letterSpacing: "-2.4px", lineHeight: 1.05 }}>
          Everything you need to feel the data
        </h2>
      </Reveal>
      <div className="mt-14 grid grid-cols-1 gap-6 sm:grid-cols-2">
        {features.map((f, i) => (
          <Reveal key={f.title} delay={i * 90}>
            <div className="group h-full rounded-3xl border border-ink/10 bg-white p-8 transition-shadow hover:shadow-xl">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-upgrade/15 font-fustat font-bold text-darkbadge" style={{ fontSize: 20 }}>
                {String(i + 1).padStart(2, "0")}
              </div>
              <h3 className="mt-5 font-fustat font-bold text-ink" style={{ fontSize: 24, letterSpacing: "-1px" }}>
                {f.title}
              </h3>
              <p className="mt-2 font-inter text-grayink" style={{ fontSize: 15, lineHeight: 1.6 }}>
                {f.body}
              </p>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

export function ProjectsSection() {
  return (
    <section id="projects" className="relative z-10 bg-darkbadge py-28">
      <div className="mx-auto max-w-6xl px-6">
        <Reveal>
          <p className="font-inter font-semibold uppercase tracking-[0.2em] text-upgrade" style={{ fontSize: 13 }}>
            Projects
          </p>
          <h2 className="mt-3 max-w-2xl font-fustat font-bold text-white" style={{ fontSize: 48, letterSpacing: "-2.4px", lineHeight: 1.05 }}>
            Things built on the platform
          </h2>
        </Reveal>
        <div className="mt-14 grid grid-cols-1 gap-6 md:grid-cols-3">
          {projects.map((p, i) => (
            <Reveal key={p.title} delay={i * 100}>
              <div className="h-full rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur-sm transition-colors hover:border-upgrade/50">
                <span className="inline-block rounded-full bg-upgrade/20 px-3 py-1 font-inter font-semibold text-upgrade" style={{ fontSize: 12 }}>
                  {p.tag}
                </span>
                <h3 className="mt-5 font-fustat font-bold text-white" style={{ fontSize: 24, letterSpacing: "-1px" }}>
                  {p.title}
                </h3>
                <p className="mt-2 font-inter text-white/65" style={{ fontSize: 15, lineHeight: 1.6 }}>
                  {p.body}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

export function CommunitySection() {
  const stats = [
    { n: "12k+", l: "Builders" },
    { n: "480", l: "Shared datasets" },
    { n: "98%", l: "Would recommend" },
  ];
  return (
    <section id="community" className="relative z-10 mx-auto max-w-6xl px-6 py-28">
      <Reveal className="mx-auto max-w-2xl text-center">
        <p className="font-inter font-semibold uppercase tracking-[0.2em] text-grayink" style={{ fontSize: 13 }}>
          Community
        </p>
        <h2 className="mt-3 font-fustat font-bold text-ink" style={{ fontSize: 48, letterSpacing: "-2.4px", lineHeight: 1.05 }}>
          Join a community in motion
        </h2>
        <p className="mt-4 font-inter text-grayink" style={{ fontSize: 17, lineHeight: 1.6 }}>
          Thousands of data builders explore, share, and remix immersive datasets every week.
        </p>
      </Reveal>
      <div className="mt-14 grid grid-cols-1 gap-6 sm:grid-cols-3">
        {stats.map((s, i) => (
          <Reveal key={s.l} delay={i * 100}>
            <div className="rounded-3xl border border-ink/10 bg-lightgray p-10 text-center">
              <p className="font-fustat font-bold text-ink" style={{ fontSize: 48, letterSpacing: "-2px" }}>
                {s.n}
              </p>
              <p className="mt-1 font-inter text-grayink" style={{ fontSize: 14 }}>
                {s.l}
              </p>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

export function ContactSection() {
  return (
    <section id="contact" className="relative z-10 mx-auto max-w-3xl px-6 py-28">
      <Reveal className="overflow-hidden rounded-[40px] border border-ink/10 bg-darkbadge p-12 text-center">
        <h2 className="font-fustat font-bold text-white" style={{ fontSize: 44, letterSpacing: "-2.2px", lineHeight: 1.05 }}>
          Ready to dive in?
        </h2>
        <p className="mx-auto mt-4 max-w-md font-inter text-white/70" style={{ fontSize: 17, lineHeight: 1.6 }}>
          Create a free account and start exploring data in true 3D depth today.
        </p>
        <form
          onSubmit={(e) => e.preventDefault()}
          className="mx-auto mt-8 flex max-w-md flex-col gap-3 sm:flex-row"
        >
          <input
            type="email"
            required
            placeholder="you@email.com"
            className="flex-1 rounded-full border border-white/15 bg-white/5 px-5 py-3 font-inter text-white placeholder:text-white/40 focus:border-upgrade focus:outline-none"
          />
          <button
            type="submit"
            className="rounded-full bg-upgrade px-6 py-3 font-schibsted font-semibold text-darkbadge transition-opacity hover:opacity-90"
          >
            Get started
          </button>
        </form>
      </Reveal>
    </section>
  );
}

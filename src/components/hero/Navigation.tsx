import { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import { ChevronDown } from "./icons";
import { useAuth } from "@/hooks/useAuth";

const featureItems = [
  { label: "3D Depth Engine", desc: "Real-time WebGL parallax scenes", href: "#features" },
  { label: "ML Predictions", desc: "Student spending insight models", href: "#projects" },
  { label: "Live Dashboard", desc: "Interactive data visualizations", href: "#projects" },
  { label: "Community Hub", desc: "Share and explore datasets", href: "#community" },
];

const menu = [
  { label: "Platform", href: "#top" },
  { label: "Features", chevron: true },
  { label: "Projects", href: "#projects" },
  { label: "Community", href: "#community" },
  { label: "Contact", href: "#contact" },
];

function scrollToHash(href: string) {
  if (href === "#top") {
    window.scrollTo({ top: 0, behavior: "smooth" });
    return;
  }
  const el = document.querySelector(href);
  if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
}

export default function Navigation() {
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef<HTMLLIElement>(null);
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  return (
    <nav
      className="relative z-30 flex items-center justify-between"
      style={{ padding: "16px 120px" }}
    >
      <button
        onClick={() => scrollToHash("#top")}
        className="font-schibsted font-semibold text-ink"
        style={{ fontSize: 24, letterSpacing: "-1.44px", background: "transparent" }}
      >
        Logoipsum
      </button>

      <ul className="flex items-center gap-8">
        {menu.map((item) =>
          item.chevron ? (
            <li
              key={item.label}
              ref={dropdownRef}
              className="relative"
              onMouseEnter={() => setOpen(true)}
              onMouseLeave={() => setOpen(false)}
            >
              <button
                onClick={() => setOpen((v) => !v)}
                aria-expanded={open}
                className="flex items-center gap-1 font-schibsted font-medium text-ink/90 transition-opacity hover:opacity-60"
                style={{ fontSize: 16, letterSpacing: "-0.2px" }}
              >
                {item.label}
                <ChevronDown
                  className="transition-transform duration-200"
                  style={{ transform: open ? "rotate(180deg)" : "none" }}
                />
              </button>

              <div
                className="absolute left-1/2 top-full z-40 -translate-x-1/2 pt-3 transition-all duration-200"
                style={{
                  opacity: open ? 1 : 0,
                  transform: `translateX(-50%) translateY(${open ? "0" : "8px"})`,
                  pointerEvents: open ? "auto" : "none",
                }}
              >
                <div
                  className="w-[340px] rounded-2xl border border-ink/10 bg-white p-2 shadow-xl"
                  style={{ boxShadow: "0 20px 60px rgba(0,0,0,0.12)" }}
                >
                  {featureItems.map((f) => (
                    <button
                      key={f.label}
                      onClick={() => {
                        setOpen(false);
                        scrollToHash(f.href);
                      }}
                      className="flex w-full flex-col items-start gap-0.5 rounded-xl px-4 py-3 text-left transition-colors hover:bg-lightgray"
                    >
                      <span className="font-schibsted font-semibold text-ink" style={{ fontSize: 15 }}>
                        {f.label}
                      </span>
                      <span className="font-inter text-grayink" style={{ fontSize: 13 }}>
                        {f.desc}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            </li>
          ) : (
            <li key={item.label}>
              <button
                onClick={() => scrollToHash(item.href!)}
                className="flex items-center gap-1 font-schibsted font-medium text-ink/90 transition-opacity hover:opacity-60"
                style={{ fontSize: 16, letterSpacing: "-0.2px" }}
              >
                {item.label}
              </button>
            </li>
          ),
        )}
      </ul>

      <div className="flex items-center gap-3">
        {user ? (
          <button
            onClick={() => signOut()}
            className="rounded-full bg-ink px-5 font-schibsted font-medium text-white"
            style={{ height: 40, fontSize: 16 }}
          >
            Log Out
          </button>
        ) : (
          <>
            <button
              onClick={() => navigate({ to: "/auth" })}
              className="rounded-full font-schibsted font-medium text-ink"
              style={{ width: 82, height: 40, fontSize: 16, background: "transparent" }}
            >
              Sign Up
            </button>
            <button
              onClick={() => navigate({ to: "/auth" })}
              className="rounded-full bg-ink font-schibsted font-medium text-white"
              style={{ width: 101, height: 40, fontSize: 16 }}
            >
              Log In
            </button>
          </>
        )}
      </div>
    </nav>
  );
}

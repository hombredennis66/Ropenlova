import { ChevronDown } from "./icons";

const menu = [
  { label: "Platform" },
  { label: "Features", chevron: true },
  { label: "Projects" },
  { label: "Community" },
  { label: "Contact" },
];

export default function Navigation() {
  return (
    <nav
      className="relative z-20 flex items-center justify-between"
      style={{ padding: "16px 120px" }}
    >
      <span
        className="font-schibsted font-semibold text-ink"
        style={{ fontSize: 24, letterSpacing: "-1.44px" }}
      >
        Logoipsum
      </span>

      <ul className="flex items-center gap-8">
        {menu.map((item) => (
          <li key={item.label}>
            <button
              className="flex items-center gap-1 font-schibsted font-medium text-ink/90 transition-opacity hover:opacity-60"
              style={{ fontSize: 16, letterSpacing: "-0.2px" }}
            >
              {item.label}
              {item.chevron && <ChevronDown />}
            </button>
          </li>
        ))}
      </ul>

      <div className="flex items-center gap-3">
        <button
          className="rounded-full font-schibsted font-medium text-ink"
          style={{ width: 82, height: 40, fontSize: 16, background: "transparent" }}
        >
          Sign Up
        </button>
        <button
          className="rounded-full bg-ink font-schibsted font-medium text-white"
          style={{ width: 101, height: 40, fontSize: 16 }}
        >
          Log In
        </button>
      </div>
    </nav>
  );
}

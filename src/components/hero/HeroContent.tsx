import { Star } from "./icons";
import SearchBox from "./SearchBox";

export default function HeroContent() {
  return (
    <div className="relative z-10 flex flex-col items-center" style={{ marginTop: -50 }}>
      {/* Badge */}
      <div
        className="flex items-center gap-2 rounded-full bg-white/90 shadow-sm"
        style={{ padding: "6px 6px 6px 6px" }}
      >
        <span className="flex items-center gap-1 rounded-full bg-darkbadge px-3 py-1 text-white">
          <Star className="text-upgrade" />
          <span className="font-inter" style={{ fontSize: 14 }}>
            New
          </span>
        </span>
        <span className="font-inter text-ink" style={{ fontSize: 14, paddingRight: 10 }}>
          Discover what's possible
        </span>
      </div>

      {/* Title */}
      <h1
        className="font-fustat font-bold text-ink text-center"
        style={{ fontSize: 80, letterSpacing: "-4.8px", lineHeight: "none", marginTop: 34 }}
      >
        Transform Data Quickly
      </h1>

      {/* Subtitle */}
      <p
        className="font-fustat font-medium text-center"
        style={{
          fontSize: 20,
          letterSpacing: "-0.4px",
          color: "#505050",
          width: 542,
          maxWidth: 736,
          marginTop: 34,
        }}
      >
        Upload your information and get powerful insights right away. Work smarter and achieve goals
        effortlessly.
      </p>

      {/* Search box */}
      <div style={{ marginTop: 44, width: "100%", display: "flex", justifyContent: "center" }}>
        <SearchBox />
      </div>
    </div>
  );
}

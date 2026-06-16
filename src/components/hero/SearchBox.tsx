import { useState } from "react";
import { Sparkle, ArrowUp, Paperclip, Mic, Search } from "./icons";

export default function SearchBox() {
  const [value, setValue] = useState("");

  return (
    <div
      className="backdrop-blur-md"
      style={{
        background: "rgba(0,0,0,0.24)",
        maxWidth: 728,
        width: "100%",
        height: 200,
        borderRadius: 18,
        padding: 16,
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
      }}
    >
      {/* Top row */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="font-schibsted font-medium text-white" style={{ fontSize: 12 }}>
            60/450 credits
          </span>
          <button
            className="rounded-full font-schibsted font-medium text-ink"
            style={{ fontSize: 12, padding: "3px 10px", background: "rgba(90,225,76,0.89)" }}
          >
            Upgrade
          </button>
        </div>
        <div className="flex items-center gap-1.5 text-white">
          <Sparkle />
          <span className="font-schibsted font-medium" style={{ fontSize: 12 }}>
            Powered by GPT-4o
          </span>
        </div>
      </div>

      {/* Input area */}
      <div
        className="flex items-center bg-white shadow"
        style={{ borderRadius: 12, padding: "8px 8px 8px 16px" }}
      >
        <input
          value={value}
          onChange={(e) => setValue(e.target.value.slice(0, 3000))}
          placeholder="Type question..."
          className="flex-1 bg-transparent outline-none"
          style={{ fontSize: 16, color: "rgba(0,0,0,0.85)" }}
        />
        <button
          className="flex items-center justify-center rounded-full bg-ink text-white"
          style={{ width: 36, height: 36 }}
        >
          <ArrowUp />
        </button>
      </div>

      {/* Bottom row */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          {[
            { label: "Attach", Icon: Paperclip },
            { label: "Voice", Icon: Mic },
            { label: "Prompts", Icon: Search },
          ].map(({ label, Icon }) => (
            <button
              key={label}
              className="flex items-center gap-1.5 font-schibsted font-medium text-ink/80"
              style={{ fontSize: 12, background: "#f0f0f0", borderRadius: 6, padding: "6px 10px" }}
            >
              <Icon />
              {label}
            </button>
          ))}
        </div>
        <span className="font-schibsted font-medium text-white/70" style={{ fontSize: 12 }}>
          {value.length.toLocaleString()}/3,000
        </span>
      </div>
    </div>
  );
}

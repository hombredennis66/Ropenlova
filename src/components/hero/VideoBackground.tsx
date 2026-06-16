import { useEffect, useRef } from "react";

const VIDEO_URL =
  "https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260329_050842_be71947f-f16e-4a14-810c-06e83d23ddb5.mp4";

const FADE_MS = 250;
const FADE_OUT_THRESHOLD = 0.55;

export default function VideoBackground() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const rafRef = useRef<number | null>(null);
  const fadingOutRef = useRef(false);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const cancelRaf = () => {
      if (rafRef.current !== null) {
        cancelAnimationFrame(rafRef.current);
        rafRef.current = null;
      }
    };

    // Fade resumes from current opacity, never snaps.
    const fade = (target: number, onDone?: () => void) => {
      cancelRaf();
      const start = performance.now();
      const from = Number(video.style.opacity || "0");
      const delta = target - from;
      const step = (now: number) => {
        const t = Math.min((now - start) / FADE_MS, 1);
        video.style.opacity = String(from + delta * t);
        if (t < 1) {
          rafRef.current = requestAnimationFrame(step);
        } else {
          rafRef.current = null;
          onDone?.();
        }
      };
      rafRef.current = requestAnimationFrame(step);
    };

    const fadeIn = () => {
      fadingOutRef.current = false;
      fade(1);
    };

    const handleTimeUpdate = () => {
      if (fadingOutRef.current) return;
      const remaining = video.duration - video.currentTime;
      if (Number.isFinite(remaining) && remaining <= FADE_OUT_THRESHOLD) {
        fadingOutRef.current = true;
        fade(0);
      }
    };

    const handleEnded = () => {
      cancelRaf();
      video.style.opacity = "0";
      window.setTimeout(() => {
        video.currentTime = 0;
        void video.play();
        fadeIn();
      }, 100);
    };

    const handleLoaded = () => {
      void video.play();
      fadeIn();
    };

    video.style.opacity = "0";
    video.addEventListener("loadeddata", handleLoaded);
    video.addEventListener("timeupdate", handleTimeUpdate);
    video.addEventListener("ended", handleEnded);

    if (video.readyState >= 2) handleLoaded();

    return () => {
      cancelRaf();
      video.removeEventListener("loadeddata", handleLoaded);
      video.removeEventListener("timeupdate", handleTimeUpdate);
      video.removeEventListener("ended", handleEnded);
    };
  }, []);

  return (
    <div className="absolute inset-0 overflow-hidden bg-white">
      <video
        ref={videoRef}
        muted
        playsInline
        autoPlay
        className="absolute left-1/2 top-0 -translate-x-1/2 object-cover object-top"
        style={{ width: "115%", height: "115%", opacity: 0 }}
        src={VIDEO_URL}
      />
    </div>
  );
}

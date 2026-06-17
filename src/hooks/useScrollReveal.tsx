import { useEffect, useRef, useState } from "react";

/**
 * Reveals an element when it scrolls into view. Returns a ref to attach and a
 * boolean indicating whether it has entered the viewport.
 */
export function useScrollReveal<T extends HTMLElement = HTMLDivElement>(
  options?: IntersectionObserverInit,
) {
  const ref = useRef<T>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.unobserve(entry.target);
        }
      },
      { threshold: 0.18, rootMargin: "0px 0px -10% 0px", ...options },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return { ref, visible };
}

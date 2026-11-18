"use client";

import { useEffect, useRef } from "react";
import { trackEvent } from "@/lib/meta-client";

/** Bo'lim ekranda ko'ringanda bir marta ViewContent yuboradi */
export default function ViewTracker({ name, category, children }) {
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current;
    if (!el || typeof IntersectionObserver === "undefined") return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          trackEvent("ViewContent", { content_name: name, content_category: category });
          obs.disconnect();
        }
      },
      { threshold: 0.4 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [name, category]);
  return <div ref={ref}>{children}</div>;
}

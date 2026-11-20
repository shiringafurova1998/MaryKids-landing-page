"use client";

import { useEffect } from "react";

// Sahifani pastga aylantirganda [data-reveal] elementlarni yumshoq chiqaradi.
// JS ishlamasa ham kontent ko'rinadi: yashirish faqat "reveal-ready" klassi qo'shilgandan keyin boshlanadi.
export default function Reveal() {
  useEffect(() => {
    const root = document.documentElement;
    const els = Array.from(document.querySelectorAll("[data-reveal]"));
    if (!("IntersectionObserver" in window) || window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      els.forEach((el) => el.classList.add("is-visible"));
      return;
    }
    root.classList.add("reveal-ready");
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("is-visible");
            obs.unobserve(e.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
    );
    els.forEach((el) => obs.observe(el));
    return () => obs.disconnect();
  }, []);
  return null;
}

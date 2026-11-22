"use client";

import { useEffect, useRef } from "react";

// Hero videosi: GIF kabi o'z-o'zidan, ovozsiz, takrorlanib o'ynaydi.
// React `muted` atributini HTML'ga yozmagani uchun iPhone autoplay'ni bloklaydi —
// shu sababli muted'ni qo'lda o'rnatib, play() ni o'zimiz chaqiramiz.
export default function HeroVideo({ src, poster, className = "", label }) {
  const ref = useRef(null);

  useEffect(() => {
    const v = ref.current;
    if (!v) return;
    v.muted = true;
    v.defaultMuted = true;
    v.setAttribute("muted", "");
    v.setAttribute("playsinline", "");
    v.setAttribute("webkit-playsinline", "");

    const tryPlay = () => {
      const p = v.play();
      if (p && typeof p.catch === "function") p.catch(() => {});
    };
    tryPlay();

    // Kam quvvat rejimida brauzer autoplay'ni to'xtatsa — birinchi teginish/skrollda ishga tushadi
    const onInteract = () => {
      tryPlay();
      if (!v.paused) remove();
    };
    const events = ["touchstart", "scroll", "click", "keydown"];
    const remove = () => events.forEach((e) => window.removeEventListener(e, onInteract));
    events.forEach((e) => window.addEventListener(e, onInteract, { passive: true }));

    // Ko'rinib qolganda o'ynaydi, ekrandan chiqsa to'xtaydi (batareya tejaladi)
    const io = new IntersectionObserver(
      ([entry]) => (entry.isIntersecting ? tryPlay() : v.pause()),
      { threshold: 0.2 }
    );
    io.observe(v);

    return () => {
      remove();
      io.disconnect();
    };
  }, []);

  return (
    <video
      ref={ref}
      src={src}
      poster={poster}
      autoPlay
      muted
      loop
      playsInline
      preload="auto"
      disablePictureInPicture
      controls={false}
      aria-label={label}
      className={`pointer-events-none ${className}`}
    />
  );
}

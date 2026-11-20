// Animatsiyali logotip: yozuv yumshoq paydo bo'ladi, uchta rangli nuqta navbatma-navbat sakraydi.
// Nuqtalar rasmdan qirqib olinib, ustiga CSS doirachalar sifatida qo'yilgan.
const DOTS = [
  { left: "85.73%", top: "20%", color: "#ff5a1f", delay: "0s" },
  { left: "90.37%", top: "6.98%", color: "#2fa8ff", delay: "0.18s" },
  { left: "94.51%", top: "22.33%", color: "#ffbb00", delay: "0.36s" },
];

export default function Logo({ className = "h-12 sm:h-16", animated = true }) {
  return (
    <span className={`logo-wrap relative block aspect-[820/215] ${animated ? "logo-in" : ""} ${className}`}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/images/logo.png"
        alt="MARY KIDS"
        width="820"
        height="215"
        className="h-full w-full select-none"
        style={{ clipPath: "inset(0 14.3% 0 0)" }}
        draggable="false"
      />
      {DOTS.map((d) => (
        <span
          key={d.color}
          aria-hidden
          className="logo-dot absolute block aspect-square w-[4%] rounded-full"
          style={{ left: d.left, top: d.top, background: d.color, animationDelay: `${d.delay}, calc(${d.delay} + 0.9s)` }}
        />
      ))}
    </span>
  );
}

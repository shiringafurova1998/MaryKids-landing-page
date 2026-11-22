"use client";

import { useEffect, useState } from "react";
import { getFbCookies, newEventId, pixelTrack, trackEvent } from "@/lib/meta-client";

const CHANNEL_URL = "https://t.me/+fDIgqgEA8bljZTky";
const PROMO_DELAY = 15; // soniya

const INTERESTS = [
  "Palto va kurtkalar",
  "Disney ryukzaklar",
  "Hello Kitty naborlar",
  "Bolalar organayzerlari",
];

const initial = { name: "", phone: "+998 ", interests: [] };

function formatPhone(value) {
  const digits = value.replace(/\D/g, "").replace(/^998/, "").slice(0, 9);
  const parts = [digits.slice(0, 2), digits.slice(2, 5), digits.slice(5, 7), digits.slice(7, 9)];
  return "+998 " + parts.filter(Boolean).join(" ");
}

function SuccessCard({ name, promo }) {
  const [left, setLeft] = useState(PROMO_DELAY);

  useEffect(() => {
    if (left <= 0) return;
    const t = setTimeout(() => setLeft((s) => s - 1), 1000);
    return () => clearTimeout(t);
  }, [left]);

  const progress = ((PROMO_DELAY - left) / PROMO_DELAY) * 100;

  return (
    <div className="mt-6 bg-blush p-6 text-center text-cocoa sm:p-8">
      <p className="font-serif text-2xl">Rahmat{name ? `, ${name}` : ""}! ❤️</p>
      <p className="mt-1 text-sm">Ma&apos;lumotingiz qabul qilindi.</p>

      {left > 0 ? (
        <div className="anim-up mt-6">
          <p className="text-[11px] uppercase tracking-[0.25em] text-taupe">Sizning promokodingiz</p>
          <p className="mt-2 inline-block select-all border-2 border-dashed border-rust bg-white px-6 py-3 font-serif text-3xl tracking-[0.15em] text-rust">
            {promo}
          </p>
          <p className="mt-4 font-semibold">
            📸 Skrinshot qiling va 1-buyurtmangizdan 5% chegirma oling!
          </p>
          <p className="mt-2 text-sm">
            ⚠️ Chegirma faqat Telegram kanalimizga a&apos;zo bo&apos;lganlarga beriladi — hoziroq qo&apos;shiling.
          </p>
          <p className="mt-5 text-sm">
            Promokod <b className="text-lg text-rust">{left}</b> soniyadan keyin yopiladi
          </p>
          <div className="mx-auto mt-2 h-1.5 max-w-xs overflow-hidden bg-white/70">
            <div
              className="h-full bg-rust transition-[width] duration-1000 ease-linear"
              style={{ width: `${100 - progress}%` }}
            />
          </div>
        </div>
      ) : (
        <div className="anim-up mt-6">
          <p className="font-semibold">⏰ Vaqt tugadi</p>
          <p className="mt-2 text-sm">
            Promokodni skrinshot qilgan bo&apos;lsangiz, Telegram kanalimizga qo&apos;shiling va buyurtma berishda
            skrinshotni yuboring.
          </p>
        </div>
      )}

      <a
        href={CHANNEL_URL}
        target="_blank"
        rel="noopener noreferrer"
        onClick={() => trackEvent("Contact", { content_name: "Telegram kanal — promokod" })}
        className="pulse-soft mt-6 inline-flex items-center gap-2 bg-taupe px-7 py-3.5 text-[11px] font-semibold uppercase tracking-[0.2em] text-white transition hover:bg-cocoa"
      >
        <svg viewBox="0 0 24 24" className="h-5 w-5 fill-current" aria-hidden>
          <path d="M9.04 15.5l-.37 5.2c.53 0 .76-.23 1.04-.5l2.5-2.4 5.18 3.8c.95.52 1.62.25 1.88-.88l3.4-15.96c.3-1.4-.5-1.95-1.43-1.6L1.3 9.9c-1.37.53-1.35 1.3-.23 1.65l5.1 1.6L18 5.7c.56-.37 1.07-.17.65.2" />
        </svg>
        Hoziroq kanalga qo&apos;shiling
      </a>
    </div>
  );
}

export default function LeadForm() {
  const [form, setForm] = useState(initial);
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState("idle"); // idle | sending | success | error
  const [result, setResult] = useState({ name: "", promo: "" });

  const allSelected = form.interests.length === INTERESTS.length;

  function toggle(item) {
    setForm((f) => ({
      ...f,
      interests: f.interests.includes(item)
        ? f.interests.filter((i) => i !== item)
        : [...f.interests, item],
    }));
    setErrors((e) => ({ ...e, interests: undefined }));
  }

  function toggleAll() {
    setForm((f) => ({ ...f, interests: allSelected ? [] : [...INTERESTS] }));
    setErrors((e) => ({ ...e, interests: undefined }));
  }

  function validate() {
    const e = {};
    if (form.name.trim().length < 2) e.name = "Ismingizni kiriting";
    if (form.phone.replace(/\D/g, "").length !== 12) e.phone = "Telefon raqam to'liq emas";
    if (form.interests.length === 0) e.interests = "Kamida bittasini tanlang";
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  async function onSubmit(event) {
    event.preventDefault();
    if (!validate()) return;
    setStatus("sending");
    const eventId = newEventId();
    const interests = allSelected ? ["Barchasi"] : form.interests;
    try {
      const res = await fetch("/api/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          interests,
          eventId,
          eventSourceUrl: window.location.href,
          ...getFbCookies(),
        }),
      });
      if (!res.ok) throw new Error("Request failed");
      const json = await res.json().catch(() => ({}));
      // Brauzer Pixel'i — server CAPI bilan bir xil eventId (dublikat sanalmaydi)
      pixelTrack("Lead", { content_name: "MARY KIDS forma", content_category: interests.join(", ") }, eventId);
      setResult({ name: form.name.trim().split(/\s+/)[0], promo: json.promo || "MARY26" });
      setStatus("success");
      setForm(initial);
    } catch {
      setStatus("error");
    }
  }

  if (status === "success") {
    return <SuccessCard name={result.name} promo={result.promo} />;
  }

  const inputClass = (field) =>
    `mt-1 w-full border px-4 py-3 outline-none transition focus:ring-2 ${
      errors[field]
        ? "border-red-400 focus:ring-red-200"
        : "border-[#e2d6cf] focus:border-dusty focus:ring-blush"
    }`;

  const chip = (active) =>
    `flex cursor-pointer items-center gap-3 border px-4 py-3 transition ${
      active ? "border-dusty bg-blush text-cocoa" : "border-[#e2d6cf] hover:border-dusty"
    }`;

  return (
    <form onSubmit={onSubmit} noValidate className="mt-6 space-y-5">
      <label className="block">
        <span className="text-sm font-medium text-cocoa">Ismingiz</span>
        <input
          type="text"
          autoComplete="given-name"
          placeholder="Masalan: Madina"
          value={form.name}
          onChange={(e) => {
            setForm((f) => ({ ...f, name: e.target.value }));
            setErrors((er) => ({ ...er, name: undefined }));
          }}
          className={inputClass("name")}
        />
        {errors.name && <span className="mt-1 block text-sm text-red-600">{errors.name}</span>}
      </label>

      <label className="block">
        <span className="text-sm font-medium text-cocoa">Telefon raqamingiz</span>
        <input
          type="tel"
          inputMode="tel"
          autoComplete="tel"
          placeholder="+998 90 123 45 67"
          value={form.phone}
          onChange={(e) => {
            setForm((f) => ({ ...f, phone: formatPhone(e.target.value) }));
            setErrors((er) => ({ ...er, phone: undefined }));
          }}
          className={inputClass("phone")}
        />
        {errors.phone && <span className="mt-1 block text-sm text-red-600">{errors.phone}</span>}
      </label>

      <fieldset>
        <legend className="text-sm font-medium text-cocoa">Sizni qaysi mahsulotlar qiziqtiradi?</legend>
        <div className="mt-2 grid gap-2">
          <label className={chip(allSelected)}>
            <input type="checkbox" checked={allSelected} onChange={toggleAll} className="h-4 w-4 accent-[#9a5a3c]" />
            <span className="font-medium">Barchasi</span>
          </label>
          {INTERESTS.map((item) => (
            <label key={item} className={chip(form.interests.includes(item))}>
              <input
                type="checkbox"
                checked={form.interests.includes(item)}
                onChange={() => toggle(item)}
                className="h-4 w-4 accent-[#9a5a3c]"
              />
              <span>{item}</span>
            </label>
          ))}
        </div>
        {errors.interests && <span className="mt-1 block text-sm text-red-600">{errors.interests}</span>}
      </fieldset>

      {status === "error" && (
        <p className="bg-red-50 p-3 text-sm text-red-700">
          Xatolik yuz berdi. Iltimos, qaytadan urinib ko&apos;ring.
        </p>
      )}

      <button
        type="submit"
        disabled={status === "sending"}
        className="w-full bg-rust py-3.5 text-xs font-semibold uppercase tracking-[0.2em] text-white transition hover:bg-cocoa disabled:opacity-60"
      >
        {status === "sending" ? "Yuborilmoqda..." : "Yuborish"}
      </button>
    </form>
  );
}

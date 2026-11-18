"use client";

import { useState } from "react";
import { getFbCookies, newEventId, pixelTrack } from "@/lib/meta-client";

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

export default function LeadForm() {
  const [form, setForm] = useState(initial);
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState("idle"); // idle | sending | success | error

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
      // Brauzer Pixel'i — server CAPI bilan bir xil eventId (dublikat sanalmaydi)
      pixelTrack("Lead", { content_name: "MARY KIDS forma", content_category: interests.join(", ") }, eventId);
      setStatus("success");
      setForm(initial);
    } catch {
      setStatus("error");
    }
  }

  if (status === "success") {
    return (
      <div className="mt-6 rounded-2xl bg-pink-50 p-6 text-center text-pink-800">
        <p className="text-lg font-semibold">Rahmat! Ma&apos;lumotingiz qabul qilindi ❤️</p>
        <p className="mt-1">Tez orada siz bilan bog&apos;lanamiz.</p>
        <button onClick={() => setStatus("idle")} className="mt-4 text-sm font-medium underline">
          Yana yuborish
        </button>
      </div>
    );
  }

  const inputClass = (field) =>
    `mt-1 w-full rounded-xl border px-4 py-3 outline-none transition focus:ring-2 ${
      errors[field]
        ? "border-red-400 focus:ring-red-200"
        : "border-slate-300 focus:border-pink-400 focus:ring-pink-100"
    }`;

  const chip = (active) =>
    `flex cursor-pointer items-center gap-3 rounded-xl border px-4 py-3 transition ${
      active ? "border-pink-400 bg-pink-50 text-pink-700" : "border-slate-200 hover:border-pink-200"
    }`;

  return (
    <form onSubmit={onSubmit} noValidate className="mt-6 space-y-5">
      <label className="block">
        <span className="text-sm font-medium text-slate-700">Ismingiz</span>
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
        <span className="text-sm font-medium text-slate-700">Telefon raqamingiz</span>
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
        <legend className="text-sm font-medium text-slate-700">Sizni qaysi mahsulotlar qiziqtiradi?</legend>
        <div className="mt-2 grid gap-2">
          <label className={chip(allSelected)}>
            <input type="checkbox" checked={allSelected} onChange={toggleAll} className="h-4 w-4 accent-pink-500" />
            <span className="font-medium">Barchasi</span>
          </label>
          {INTERESTS.map((item) => (
            <label key={item} className={chip(form.interests.includes(item))}>
              <input
                type="checkbox"
                checked={form.interests.includes(item)}
                onChange={() => toggle(item)}
                className="h-4 w-4 accent-pink-500"
              />
              <span>{item}</span>
            </label>
          ))}
        </div>
        {errors.interests && <span className="mt-1 block text-sm text-red-600">{errors.interests}</span>}
      </fieldset>

      {status === "error" && (
        <p className="rounded-xl bg-red-50 p-3 text-sm text-red-700">
          Xatolik yuz berdi. Iltimos, qaytadan urinib ko&apos;ring.
        </p>
      )}

      <button
        type="submit"
        disabled={status === "sending"}
        className="w-full rounded-2xl bg-pink-500 py-3.5 font-semibold text-white shadow-lg transition hover:bg-pink-600 disabled:opacity-60"
      >
        {status === "sending" ? "Yuborilmoqda..." : "Yuborish"}
      </button>
    </form>
  );
}

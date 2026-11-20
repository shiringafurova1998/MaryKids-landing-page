"use client";

import { useState } from "react";

function formatAmount(value) {
  const digits = value.replace(/\D/g, "").slice(0, 12);
  return digits.replace(/\B(?=(\d{3})+(?!\d))/g, " ");
}

export default function PurchaseForm({ token, test, needsPin, currency }) {
  const [value, setValue] = useState("");
  const [orderNo, setOrderNo] = useState(1);
  const [pin, setPin] = useState("");
  const [status, setStatus] = useState("idle"); // idle | sending | done | error
  const [message, setMessage] = useState("");

  async function onSubmit(e) {
    e.preventDefault();
    const amount = Number(value.replace(/\D/g, ""));
    if (!amount) {
      setStatus("error");
      setMessage("Summani kiriting");
      return;
    }
    setStatus("sending");
    try {
      const res = await fetch("/api/purchase", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, value: amount, orderNo, pin, test: test || undefined }),
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(json.error || "Xatolik");
      setStatus("done");
      setMessage(
        `${json.value.toLocaleString("ru-RU")} ${json.currency} · buyurtma #${json.orderNo}` +
          (json.test ? " (test rejimi)" : "")
      );
    } catch (err) {
      setStatus("error");
      setMessage(err.message);
    }
  }

  if (status === "done") {
    return (
      <div className="anim-up mt-6 bg-blush p-6 text-center text-cocoa">
        <p className="font-serif text-2xl">✅ Yuborildi</p>
        <p className="mt-2 text-sm">{message}</p>
        <p className="mt-3 text-xs text-taupe">
          Meta bu sotuvni reklamaga bog&apos;laydi va ROAS hisobiga qo&apos;shadi.
        </p>
        <button
          onClick={() => {
            setStatus("idle");
            setValue("");
            setOrderNo((n) => n + 1);
          }}
          className="mt-4 text-sm font-medium underline"
        >
          Shu mijozdan yana buyurtma
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="mt-6 space-y-4">
      <label className="block">
        <span className="text-sm font-medium text-cocoa">To&apos;lov summasi ({currency})</span>
        <input
          inputMode="numeric"
          autoFocus
          placeholder="Masalan: 350 000"
          value={value}
          onChange={(e) => setValue(formatAmount(e.target.value))}
          className="mt-1 w-full border border-[#e2d6cf] px-4 py-3 text-lg outline-none focus:border-dusty focus:ring-2 focus:ring-blush"
        />
      </label>

      <label className="block">
        <span className="text-sm font-medium text-cocoa">Buyurtma raqami (shu mijoz bo&apos;yicha)</span>
        <input
          type="number"
          min={1}
          max={99}
          value={orderNo}
          onChange={(e) => setOrderNo(Math.max(1, parseInt(e.target.value, 10) || 1))}
          className="mt-1 w-full border border-[#e2d6cf] px-4 py-3 outline-none focus:border-dusty focus:ring-2 focus:ring-blush"
        />
        <span className="mt-1 block text-xs text-taupe">
          Birinchi xarid — 1. Bir xil raqam qayta yuborilsa, Meta uni ikki marta sanamaydi.
        </span>
      </label>

      {needsPin && (
        <label className="block">
          <span className="text-sm font-medium text-cocoa">PIN</span>
          <input
            type="password"
            inputMode="numeric"
            value={pin}
            onChange={(e) => setPin(e.target.value)}
            className="mt-1 w-full border border-[#e2d6cf] px-4 py-3 outline-none focus:border-dusty focus:ring-2 focus:ring-blush"
          />
        </label>
      )}

      {status === "error" && <p className="bg-red-50 p-3 text-sm text-red-700">{message}</p>}

      <button
        type="submit"
        disabled={status === "sending"}
        className="w-full bg-rust py-3.5 text-xs font-semibold uppercase tracking-[0.2em] text-white transition hover:bg-cocoa disabled:opacity-60"
      >
        {status === "sending" ? "Yuborilmoqda..." : "Sotuvni yuborish"}
      </button>
      {test && <p className="text-center text-xs text-taupe">Test rejimi: {test}</p>}
    </form>
  );
}

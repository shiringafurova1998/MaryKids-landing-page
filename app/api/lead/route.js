import { NextResponse } from "next/server";
import { sendCapiEvent } from "@/lib/meta-capi";

// Kerakli sozlamalar (Vercel → Settings → Environment Variables yoki .env.local):
//   TELEGRAM_BOT_TOKEN — @BotFather bergan token
//   TELEGRAM_CHAT_ID   — arizalar boradigan chat/guruh/kanal ID si (masalan -1001234567890)

const ALLOWED = ["Barchasi", "Palto va kurtkalar", "Disney ryukzaklar", "Hello Kitty naborlar", "Bolalar organayzerlari"];

function escapeHtml(s) {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

export async function POST(request) {
  let data;
  try {
    data = await request.json();
  } catch {
    return NextResponse.json({ error: "Noto'g'ri so'rov" }, { status: 400 });
  }

  const name = String(data.name || "").trim().slice(0, 100);
  const phone = String(data.phone || "").replace(/\D/g, "");
  const interests = Array.isArray(data.interests)
    ? data.interests.filter((i) => ALLOWED.includes(i))
    : [];

  if (name.length < 2 || phone.length !== 12 || interests.length === 0) {
    return NextResponse.json({ error: "Maydonlar to'liq emas" }, { status: 422 });
  }

  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;
  if (!token || !chatId) {
    console.error("TELEGRAM_BOT_TOKEN yoki TELEGRAM_CHAT_ID sozlanmagan");
    return NextResponse.json({ error: "Server sozlanmagan" }, { status: 500 });
  }

  const text = [
    "🆕 <b>Yangi mijoz — MARY KIDS</b>",
    "",
    `👤 <b>Ism:</b> ${escapeHtml(name)}`,
    `📞 <b>Telefon:</b> +${phone}`,
    `🛍 <b>Qiziqishi:</b> ${interests.map(escapeHtml).join(", ")}`,
    `🕒 ${new Date().toLocaleString("uz-UZ", { timeZone: "Asia/Tashkent" })}`,
  ].join("\n");

  const eventId = typeof data.eventId === "string" ? data.eventId.slice(0, 100) : undefined;

  // Telegram va Meta CAPI parallel yuboriladi
  const [tg, capi] = await Promise.all([
    fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ chat_id: chatId, text, parse_mode: "HTML" }),
    }),
    eventId
      ? sendCapiEvent({
          request,
          eventName: "Lead",
          eventId,
          eventSourceUrl: typeof data.eventSourceUrl === "string" ? data.eventSourceUrl.slice(0, 500) : undefined,
          user: {
            phone,
            firstName: name.split(/\s+/)[0],
            externalId: phone,
            fbp: typeof data.fbp === "string" ? data.fbp : undefined,
            fbc: typeof data.fbc === "string" ? data.fbc : undefined,
          },
          customData: { content_name: "MARY KIDS forma", content_category: interests.join(", ") },
        }).catch((e) => ({ ok: false, error: String(e) }))
      : Promise.resolve({ skipped: true }),
  ]);
  if (capi && capi.ok === false) console.error("CAPI Lead yuborilmadi");

  if (!tg.ok) {
    console.error("Telegram xatosi:", await tg.text());
    return NextResponse.json({ error: "Yuborib bo'lmadi" }, { status: 502 });
  }

  return NextResponse.json({ ok: true });
}

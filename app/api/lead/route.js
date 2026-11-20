import { NextResponse } from "next/server";
import { buildFbc, getClientIp, normalizePhone, sendCapiEvent, sha256 } from "@/lib/meta-capi";
import { sealLead } from "@/lib/lead-token";

// Kerakli sozlamalar (Vercel → Settings → Environment Variables yoki .env.local):
//   TELEGRAM_BOT_TOKEN — @BotFather bergan token
//   TELEGRAM_CHAT_ID   — arizalar boradigan chat/guruh/kanal ID si (masalan -1001234567890)
// Ixtiyoriy:
//   LEAD_LINK_SECRET   — sotuv havolalarini shifrlash kaliti
//   SITE_URL           — sotuv havolasi uchun sayt manzili (masalan https://marykids.uz)

const PROMO_CODES = ["MARY02", "MARY26", "MARY98"];

const ALLOWED = ["Barchasi", "Palto va kurtkalar", "Disney ryukzaklar", "Hello Kitty naborlar", "Bolalar organayzerlari"];

// Havola qisqa bo'lishi uchun manzilning faqat domen va yo'li (fbclid allaqachon fbc ichida)
function pageUrl(url) {
  try {
    const u = new URL(url);
    return u.origin + u.pathname;
  } catch {
    return undefined;
  }
}

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

  const promo = PROMO_CODES[Math.floor(Math.random() * PROMO_CODES.length)];

  const text = [
    "🆕 <b>Yangi mijoz — MARY KIDS</b>",
    "",
    `👤 <b>Ism:</b> ${escapeHtml(name)}`,
    `📞 <b>Telefon:</b> +${phone}`,
    `🛍 <b>Qiziqishi:</b> ${interests.map(escapeHtml).join(", ")}`,
    `🎟 <b>Promokod:</b> ${promo}`,
    `🕒 ${new Date().toLocaleString("uz-UZ", { timeZone: "Asia/Tashkent" })}`,
  ].join("\n");

  const eventId = typeof data.eventId === "string" ? data.eventId.slice(0, 100) : undefined;
  const eventSourceUrl = typeof data.eventSourceUrl === "string" ? data.eventSourceUrl.slice(0, 500) : undefined;
  const firstName = name.split(/\s+/)[0];
  const fbp = request.cookies.get("_fbp")?.value || (typeof data.fbp === "string" ? data.fbp : undefined);
  const fbc = buildFbc(request, typeof data.fbc === "string" ? data.fbc : undefined, eventSourceUrl);

  // Sotuvchi uchun shifrlangan havola: mijozning xeshlangan ma'lumotlari, cookie'lar,
  // IP va brauzer — keyin Purchase hodisasini aynan shu odamga bog'lash uchun.
  let saleUrl;
  try {
    const normalizedPhone = normalizePhone(phone);
    const linkToken = sealLead({
      v: 1,
      id: eventId || crypto.randomUUID(),
      t: Math.floor(Date.now() / 1000),
      n: firstName.slice(0, 40),
      p4: phone.slice(-4),
      i: interests.join(", ").slice(0, 120),
      ph: sha256(normalizedPhone),
      fn: sha256(firstName),
      fbp,
      fbc,
      ip: getClientIp(request),
      ua: (request.headers.get("user-agent") || "").slice(0, 300) || undefined,
      u: pageUrl(eventSourceUrl),
    });
    const origin = (process.env.SITE_URL || new URL(request.url).origin).replace(/\/$/, "");
    saleUrl = `${origin}/sotuv?t=${linkToken}`;
  } catch (e) {
    console.error("Sotuv havolasini yaratib bo'lmadi:", String(e));
  }

  const sendTelegram = (withButton) =>
    fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: chatId,
        text,
        parse_mode: "HTML",
        ...(withButton && saleUrl
          ? { reply_markup: { inline_keyboard: [[{ text: "💰 Sotuvni Meta'ga yuborish", url: saleUrl }]] } }
          : {}),
      }),
    });

  // Telegram va Meta CAPI parallel yuboriladi
  const [tgFirst, capi] = await Promise.all([
    sendTelegram(true),
    eventId
      ? sendCapiEvent({
          request,
          eventName: "Lead",
          eventId,
          eventSourceUrl,
          user: { phone, firstName, externalId: phone, fbp, fbc },
          customData: { content_name: "MARY KIDS forma", content_category: interests.join(", ") },
        }).catch((e) => ({ ok: false, error: String(e) }))
      : Promise.resolve({ skipped: true }),
  ]);

  // Tugma sabab rad etilsa ham lid yo'qolmasin — tugmasiz qayta yuboramiz
  let tg = tgFirst;
  if (!tg.ok && saleUrl) {
    console.error("Telegram (tugma bilan) xatosi:", await tg.text());
    tg = await sendTelegram(false);
  }
  if (capi && capi.ok === false) console.error("CAPI Lead yuborilmadi");

  if (!tg.ok) {
    console.error("Telegram xatosi:", await tg.text());
    return NextResponse.json({ error: "Yuborib bo'lmadi" }, { status: 502 });
  }

  return NextResponse.json({ ok: true, promo });
}

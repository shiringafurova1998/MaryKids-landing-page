import { NextResponse } from "next/server";
import { openLead } from "@/lib/lead-token";
import { postCapiEvent, sha256 } from "@/lib/meta-capi";

// Sotuvchi Telegram'dagi tugma orqali ochilgan sahifadan sotuvni yuboradi.
// Natija: Meta'ga "Purchase" hodisasi (summa + valyuta) — ROAS shundan hisoblanadi.
//
// Ixtiyoriy env:
//   SALES_PIN               — sahifada so'raladigan PIN (begonalar sotuv yubora olmasligi uchun)
//   SALES_CURRENCY          — sotuv valyutasi (standart: UZS)
//   META_PURCHASE_ACTION_SOURCE — standart: website

const MAX_AGE_DAYS = 90;

export async function POST(request) {
  let data;
  try {
    data = await request.json();
  } catch {
    return NextResponse.json({ error: "Noto'g'ri so'rov" }, { status: 400 });
  }

  const lead = openLead(data.token);
  if (!lead) {
    return NextResponse.json({ error: "Havola yaroqsiz yoki buzilgan" }, { status: 400 });
  }
  if (Date.now() / 1000 - lead.t > MAX_AGE_DAYS * 86400) {
    return NextResponse.json({ error: `Havola ${MAX_AGE_DAYS} kundan eski` }, { status: 410 });
  }

  const pin = process.env.SALES_PIN;
  if (pin && String(data.pin || "") !== pin) {
    return NextResponse.json({ error: "PIN noto'g'ri" }, { status: 401 });
  }

  const value = Number(String(data.value ?? "").replace(/[^\d.]/g, ""));
  if (!Number.isFinite(value) || value <= 0 || value > 1e12) {
    return NextResponse.json({ error: "Summani to'g'ri kiriting" }, { status: 422 });
  }
  const orderNo = Math.min(Math.max(parseInt(data.orderNo, 10) || 1, 1), 99);
  const currency = (process.env.SALES_CURRENCY || "UZS").toUpperCase();

  const userData = {
    ph: lead.ph ? [lead.ph] : undefined,
    fn: lead.fn ? [lead.fn] : undefined,
    external_id: lead.ph ? [lead.ph] : undefined, // Lead'dagi external_id = telefon xeshi
    country: [sha256("uz")],
    fbp: lead.fbp,
    fbc: lead.fbc,
    client_ip_address: lead.ip,
    client_user_agent: lead.ua,
  };
  Object.keys(userData).forEach((k) => userData[k] === undefined && delete userData[k]);

  // Bir lid uchun bir buyurtma = bitta event_id. Qayta bosilsa Meta dublikat sanamaydi.
  const orderId = `${lead.id}-${orderNo}`;
  const testEventCode =
    typeof data.test === "string" && /^TEST\w{1,20}$/.test(data.test) ? data.test : undefined;

  const result = await postCapiEvent(
    {
      event_name: "Purchase",
      event_time: Math.floor(Date.now() / 1000),
      event_id: `purchase-${orderId}`,
      action_source: process.env.META_PURCHASE_ACTION_SOURCE || "website",
      event_source_url: lead.u,
      user_data: userData,
      custom_data: {
        value,
        currency,
        order_id: orderId,
        content_name: "MARY KIDS buyurtma",
        content_category: lead.i,
      },
    },
    { testEventCode }
  );

  if (result.skipped) {
    return NextResponse.json({ error: "Meta CAPI sozlanmagan (Pixel ID yoki token yo'q)" }, { status: 500 });
  }
  if (!result.ok) {
    const msg = result.error?.error?.error_user_msg || result.error?.error?.message || "Meta xatosi";
    return NextResponse.json({ error: msg }, { status: 502 });
  }

  // Telegram'ga qayd (ixtiyoriy, xato bo'lsa ham sotuv yuborilgan hisoblanadi)
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;
  if (token && chatId && !testEventCode) {
    const text = [
      "✅ <b>Sotuv Meta'ga yuborildi</b>",
      `👤 ${String(lead.n || "").replace(/[<>&]/g, "")} · ***${lead.p4 || ""}`,
      `💰 ${value.toLocaleString("ru-RU")} ${currency} · buyurtma #${orderNo}`,
    ].join("\n");
    await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ chat_id: chatId, text, parse_mode: "HTML" }),
    }).catch(() => {});
  }

  return NextResponse.json({
    ok: true,
    eventsReceived: result.events_received ?? null,
    value,
    currency,
    orderNo,
    test: !!testEventCode,
  });
}

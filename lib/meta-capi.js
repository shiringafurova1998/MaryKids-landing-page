import { createHash } from "crypto";

// Meta Conversions API (server tomoni).
// Kerakli env: NEXT_PUBLIC_META_PIXEL_ID, META_CAPI_ACCESS_TOKEN
// Ixtiyoriy:   META_TEST_EVENT_CODE (Events Manager → Test events), META_API_VERSION

const API_VERSION = process.env.META_API_VERSION || "v23.0";

export function sha256(value) {
  if (!value) return undefined;
  return createHash("sha256").update(String(value).trim().toLowerCase()).digest("hex");
}

/** Telefon: faqat raqamlar, mamlakat kodi bilan (masalan 998901234567) */
export function normalizePhone(phone) {
  const digits = String(phone || "").replace(/\D/g, "");
  if (!digits) return undefined;
  return digits.length === 9 ? "998" + digits : digits;
}

function getClientIp(request) {
  const fwd = request.headers.get("x-forwarded-for");
  if (fwd) return fwd.split(",")[0].trim();
  return request.headers.get("x-real-ip") || undefined;
}

function buildFbc(request, fallbackFbc, eventSourceUrl) {
  const fromCookie = request.cookies.get("_fbc")?.value;
  if (fromCookie) return fromCookie;
  if (fallbackFbc) return fallbackFbc;
  try {
    const fbclid = new URL(eventSourceUrl).searchParams.get("fbclid");
    if (fbclid) return `fb.1.${Date.now()}.${fbclid}`;
  } catch {}
  return undefined;
}

/**
 * Bitta hodisani Meta CAPI ga yuboradi.
 * eventId — brauzerdagi Pixel bilan bir xil bo'lishi shart (deduplication).
 */
export async function sendCapiEvent({
  request,
  eventName,
  eventId,
  eventSourceUrl,
  user = {}, // { phone, firstName, externalId, fbp, fbc }
  customData,
}) {
  const pixelId = process.env.NEXT_PUBLIC_META_PIXEL_ID;
  const token = process.env.META_CAPI_ACCESS_TOKEN;
  if (!pixelId || !token) {
    return { skipped: true, reason: "Meta CAPI sozlanmagan" };
  }

  const phone = normalizePhone(user.phone);
  const userData = {
    client_ip_address: getClientIp(request),
    client_user_agent: request.headers.get("user-agent") || undefined,
    fbp: request.cookies.get("_fbp")?.value || user.fbp || undefined,
    fbc: buildFbc(request, user.fbc, eventSourceUrl),
    ph: phone ? [sha256(phone)] : undefined,
    fn: user.firstName ? [sha256(user.firstName)] : undefined,
    country: [sha256("uz")],
    external_id: user.externalId ? [sha256(user.externalId)] : undefined,
  };
  Object.keys(userData).forEach((k) => userData[k] === undefined && delete userData[k]);

  const payload = {
    data: [
      {
        event_name: eventName,
        event_time: Math.floor(Date.now() / 1000),
        event_id: eventId,
        action_source: "website",
        event_source_url: eventSourceUrl || request.headers.get("referer") || undefined,
        user_data: userData,
        custom_data: customData,
      },
    ],
  };
  if (process.env.META_TEST_EVENT_CODE) {
    payload.test_event_code = process.env.META_TEST_EVENT_CODE;
  }

  const res = await fetch(
    `https://graph.facebook.com/${API_VERSION}/${pixelId}/events?access_token=${encodeURIComponent(token)}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
      cache: "no-store",
    }
  );

  const body = await res.json().catch(() => ({}));
  if (!res.ok) {
    console.error("Meta CAPI xatosi:", JSON.stringify(body));
    return { ok: false, error: body };
  }
  return { ok: true, ...body };
}

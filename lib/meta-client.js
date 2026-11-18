"use client";

// Brauzer tomoni: Pixel + CAPI ni bir xil event_id bilan chaqiradi.

export function newEventId() {
  if (typeof crypto !== "undefined" && crypto.randomUUID) return crypto.randomUUID();
  return `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
}

function getCookie(name) {
  if (typeof document === "undefined") return undefined;
  const m = document.cookie.match(new RegExp("(?:^|; )" + name + "=([^;]*)"));
  return m ? decodeURIComponent(m[1]) : undefined;
}

export function getFbCookies() {
  return { fbp: getCookie("_fbp"), fbc: getCookie("_fbc") };
}

/** Faqat brauzer Pixel'i (server qismi alohida yuborilganda, masalan Lead) */
export function pixelTrack(eventName, data = {}, eventId) {
  if (typeof window === "undefined" || typeof window.fbq !== "function") return;
  window.fbq("track", eventName, data, eventId ? { eventID: eventId } : undefined);
}

/** Pixel + CAPI (server /api/meta-event orqali) — PageView, ViewContent, Contact uchun */
export function trackEvent(eventName, data = {}) {
  const eventId = newEventId();
  pixelTrack(eventName, data, eventId);
  try {
    const body = JSON.stringify({
      eventName,
      eventId,
      eventSourceUrl: window.location.href,
      customData: data,
      ...getFbCookies(),
    });
    // sendBeacon sahifadan chiqib ketilganda ham (masalan Telegram havolasi) yetkazadi
    if (navigator.sendBeacon) {
      navigator.sendBeacon("/api/meta-event", new Blob([body], { type: "application/json" }));
    } else {
      fetch("/api/meta-event", { method: "POST", body, headers: { "Content-Type": "application/json" }, keepalive: true });
    }
  } catch {}
  return eventId;
}

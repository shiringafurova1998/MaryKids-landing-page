import { NextResponse } from "next/server";
import { sendCapiEvent } from "@/lib/meta-capi";

// Brauzerdan keladigan oddiy hodisalar uchun (Lead bu yerda emas — u /api/lead da yuboriladi)
const ALLOWED_EVENTS = new Set(["PageView", "ViewContent", "Contact"]);

export async function POST(request) {
  let data;
  try {
    data = JSON.parse(await request.text());
  } catch {
    return NextResponse.json({ error: "bad request" }, { status: 400 });
  }

  const { eventName, eventId, eventSourceUrl, customData, fbp, fbc } = data || {};
  if (!ALLOWED_EVENTS.has(eventName) || typeof eventId !== "string" || eventId.length > 100) {
    return NextResponse.json({ error: "invalid event" }, { status: 400 });
  }

  const safeCustom = {};
  if (customData && typeof customData === "object") {
    for (const key of ["content_name", "content_category"]) {
      if (typeof customData[key] === "string") safeCustom[key] = customData[key].slice(0, 100);
    }
  }

  const result = await sendCapiEvent({
    request,
    eventName,
    eventId,
    eventSourceUrl: typeof eventSourceUrl === "string" ? eventSourceUrl.slice(0, 500) : undefined,
    user: { fbp, fbc },
    customData: Object.keys(safeCustom).length ? safeCustom : undefined,
  });

  return NextResponse.json({ ok: !!result.ok || !!result.skipped });
}

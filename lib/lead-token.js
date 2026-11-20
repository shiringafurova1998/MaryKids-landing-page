import { createCipheriv, createDecipheriv, createHash, randomBytes } from "crypto";

// Lid ma'lumotlarini Telegram tugmasidagi havolaga joylash uchun shifrlaydi.
// AES-256-GCM: havolani hech kim o'qiy olmaydi va o'zgartira olmaydi
// (o'zgartirilsa, havola yaroqsiz bo'ladi).
//
// Kalit: LEAD_LINK_SECRET (tavsiya etiladi, istalgan uzun tasodifiy matn).
// U berilmagan bo'lsa, TELEGRAM_BOT_TOKEN dan hosil qilinadi.
// Diqqat: kalit o'zgarsa, eski havolalar ishlamay qoladi.

function getKey() {
  const secret = process.env.LEAD_LINK_SECRET || process.env.TELEGRAM_BOT_TOKEN;
  if (!secret) throw new Error("LEAD_LINK_SECRET yoki TELEGRAM_BOT_TOKEN sozlanmagan");
  return createHash("sha256").update("marykids-lead-link:" + secret).digest();
}

export function sealLead(data) {
  const iv = randomBytes(12);
  const cipher = createCipheriv("aes-256-gcm", getKey(), iv);
  const encrypted = Buffer.concat([cipher.update(JSON.stringify(data), "utf8"), cipher.final()]);
  return Buffer.concat([iv, cipher.getAuthTag(), encrypted]).toString("base64url");
}

export function openLead(token) {
  try {
    const buf = Buffer.from(String(token || ""), "base64url");
    if (buf.length < 29) return null;
    const decipher = createDecipheriv("aes-256-gcm", getKey(), buf.subarray(0, 12));
    decipher.setAuthTag(buf.subarray(12, 28));
    const json = Buffer.concat([decipher.update(buf.subarray(28)), decipher.final()]).toString("utf8");
    const data = JSON.parse(json);
    return data && data.v === 1 ? data : null;
  } catch {
    return null;
  }
}

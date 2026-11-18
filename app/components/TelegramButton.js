"use client";

import { trackEvent } from "@/lib/meta-client";

export default function TelegramButton({ href }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      onClick={() => trackEvent("Contact", { content_name: "Telegram kanal" })}
      className="mt-6 inline-flex items-center gap-2 rounded-2xl bg-sky-500 px-8 py-3.5 font-semibold text-white shadow-lg transition hover:bg-sky-600"
    >
      <svg viewBox="0 0 24 24" className="h-5 w-5 fill-current" aria-hidden>
        <path d="M9.04 15.5l-.37 5.2c.53 0 .76-.23 1.04-.5l2.5-2.4 5.18 3.8c.95.52 1.62.25 1.88-.88l3.4-15.96c.3-1.4-.5-1.95-1.43-1.6L1.3 9.9c-1.37.53-1.35 1.3-.23 1.65l5.1 1.6L18 5.7c.56-.37 1.07-.17.65.2" />
      </svg>
      Telegram kanalga o&apos;tish
    </a>
  );
}

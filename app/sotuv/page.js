import { openLead } from "@/lib/lead-token";
import PurchaseForm from "./PurchaseForm";

export const metadata = {
  title: "Sotuvni yuborish — MARY KIDS",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

function formatDate(sec) {
  return new Date(sec * 1000).toLocaleString("uz-UZ", { timeZone: "Asia/Tashkent" });
}

export default async function SotuvPage({ searchParams }) {
  const params = await searchParams;
  const token = typeof params?.t === "string" ? params.t : "";
  const test = typeof params?.test === "string" ? params.test : "";
  const lead = token ? openLead(token) : null;

  return (
    <main className="flex min-h-screen items-start justify-center bg-greige px-4 py-12">
      <div className="w-full max-w-md bg-white p-6 shadow-[0_18px_40px_-20px_rgba(107,61,42,0.4)] sm:p-8">
        <p className="text-[11px] uppercase tracking-[0.25em] text-taupe">MARY KIDS · sotuvchi uchun</p>
        <h1 className="mt-2 font-serif text-3xl text-cocoa">Sotuvni Meta&apos;ga yuborish</h1>

        {!token ? (
          <div className="mt-6 bg-blush p-4 text-sm text-cocoa">
            <p className="font-semibold">Bu sahifa Telegram bot orqali ochiladi.</p>
            <p className="mt-2">
              Botga kelgan lid xabari tagidagi <b>&laquo;💰 Sotuvni Meta&apos;ga yuborish&raquo;</b> tugmasini
              bosing &mdash; shunda shu mijozning ma&apos;lumotlari bilan sahifa ochiladi.
            </p>
          </div>
        ) : !lead ? (
          <p className="mt-6 bg-red-50 p-4 text-sm text-red-700">
            Havola yaroqsiz yoki buzilgan. Telegram&apos;dagi tugmani qaytadan bosing.
          </p>
        ) : (
          <>
            <dl className="mt-6 space-y-2 bg-blush p-4 text-sm text-cocoa">
              <div className="flex justify-between gap-4">
                <dt className="text-taupe">Mijoz</dt>
                <dd className="font-semibold">{lead.n}</dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt className="text-taupe">Telefon</dt>
                <dd>+998 ** *** {lead.p4?.slice(0, 2)} {lead.p4?.slice(2)}</dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt className="text-taupe">Qiziqishi</dt>
                <dd className="text-right">{lead.i}</dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt className="text-taupe">Lid vaqti</dt>
                <dd>{formatDate(lead.t)}</dd>
              </div>
            </dl>
            <PurchaseForm
              token={token}
              test={test}
              needsPin={!!process.env.SALES_PIN}
              currency={(process.env.SALES_CURRENCY || "UZS").toUpperCase()}
            />
          </>
        )}
      </div>
    </main>
  );
}

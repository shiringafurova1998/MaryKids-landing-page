import LeadForm from "./components/LeadForm";

export default function Home() {
  return (
    <main>
      <section className="bg-gradient-to-br from-indigo-700 via-indigo-600 to-sky-500 text-white">
        <div className="mx-auto max-w-4xl px-6 py-20 text-center sm:py-28">
          <span className="inline-block rounded-full bg-white/15 px-4 py-1 text-sm font-medium">
            Faqat shu oy uchun
          </span>
          <h1 className="mt-6 text-4xl font-extrabold leading-tight sm:text-5xl">
            Mahsulotimizni birinchilardan bo&apos;lib oling va 30% chegirmaga ega bo&apos;ling
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-lg text-indigo-100">
            Quyidagi formani to&apos;ldiring — mutaxassisimiz 15 daqiqa ichida siz bilan
            bog&apos;lanib, barcha savollaringizga javob beradi.
          </p>
          <a
            href="#ariza"
            className="mt-8 inline-block rounded-xl bg-white px-8 py-3 font-semibold text-indigo-700 shadow-lg transition hover:bg-indigo-50"
          >
            Ariza qoldirish
          </a>
        </div>
      </section>

      <section id="ariza" className="mx-auto max-w-xl px-6 py-16">
        <div className="rounded-2xl bg-white p-8 shadow-xl ring-1 ring-slate-200">
          <h2 className="text-2xl font-bold">Ariza qoldiring</h2>
          <p className="mt-2 text-slate-600">
            Barcha maydonlarni to&apos;ldiring, biz siz bilan tez orada bog&apos;lanamiz.
          </p>
          <LeadForm />
        </div>
      </section>

      <footer className="border-t border-slate-200 py-8 text-center text-sm text-slate-500">
        © {new Date().getFullYear()} Barcha huquqlar himoyalangan.
      </footer>
    </main>
  );
}

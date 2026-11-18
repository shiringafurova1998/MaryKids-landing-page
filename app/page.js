import LeadForm from "./components/LeadForm";
import TelegramButton from "./components/TelegramButton";
import ViewTracker from "./components/ViewTracker";

// Telegram kanal havolasi (.env ichida NEXT_PUBLIC_TELEGRAM_CHANNEL_URL orqali o'zgartiriladi)
const CHANNEL_URL = process.env.NEXT_PUBLIC_TELEGRAM_CHANNEL_URL || "https://t.me/marykids";

// Rasm qo'shish: faylni public/images papkasiga joylang va image maydoniga yo'lini yozing,
// masalan image: "/images/ryukzak.jpg". Rasm bo'lmasa, rangli placeholder ko'rinadi.
const helloKitty = [
  { title: "Hello Kitty naborlar", text: "Sovg'a uchun tayyor to'plamlar: aksessuarlar, idishlar va boshqalar.", emoji: "🎀", image: "" },
  { title: "Hello Kitty aksessuarlar", text: "Soch bezaklari, hamyonchalar va kundalik mayda narsalar.", emoji: "💖", image: "" },
  { title: "Bolalar organayzerlari", text: "Maktab va uy uchun qulay, chiroyli organayzerlar.", emoji: "🗂️", image: "" },
];

const bags = [
  { title: "Disney ryukzaklar", text: "Bog'cha va maktab uchun yengil, mustahkam ryukzaklar.", emoji: "🎒", image: "" },
  { title: "Mini sumkalar", text: "Sayr va bayramlar uchun kichkina, yoqimli sumkachalar.", emoji: "👜", image: "" },
  { title: "Yangi kolleksiya", text: "Har hafta yangi modellar — kanalimizda birinchi bo'lib ko'ring.", emoji: "✨", image: "" },
];

const outerwear = [
  { title: "Palto", text: "Kuz va qish uchun issiq, chiroyli bolalar paltolari.", emoji: "🧥", image: "" },
  { title: "Kurtkalar", text: "Yengil va issiq kurtkalar — faol bolalar uchun.", emoji: "❄️", image: "" },
  { title: "Shapkalar", text: "Kurtka va paltoga mos yumshoq, issiq shapkalar.", emoji: "🧢", image: "" },
];

function ProductCard({ item }) {
  return (
    <article className="overflow-hidden rounded-3xl bg-white shadow-md ring-1 ring-rose-100 transition hover:-translate-y-1 hover:shadow-xl">
      <div className="relative flex aspect-[4/3] items-center justify-center bg-gradient-to-br from-pink-100 via-rose-50 to-amber-50 text-6xl">
        <span aria-hidden>{item.emoji}</span>
        {item.image && (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={item.image} alt={item.title} className="absolute inset-0 h-full w-full object-cover" />
        )}
      </div>
      <div className="p-6">
        <h3 className="text-lg font-bold text-slate-900">{item.title}</h3>
        <p className="mt-2 text-slate-600">{item.text}</p>
      </div>
    </article>
  );
}

function Section({ id, eyebrow, title, text, items, tint }) {
  return (
    <section id={id} className={tint}>
      <ViewTracker name={title} category={eyebrow}>
      <div className="mx-auto max-w-6xl px-6 py-20">
        <p className="text-sm font-semibold uppercase tracking-widest text-pink-500">{eyebrow}</p>
        <h2 className="mt-2 text-3xl font-extrabold sm:text-4xl">{title}</h2>
        <p className="mt-3 max-w-2xl text-lg text-slate-600">{text}</p>
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((item) => (
            <ProductCard key={item.title} item={item} />
          ))}
        </div>
      </div>
      </ViewTracker>
    </section>
  );
}

export default function Home() {
  return (
    <main>
      {/* 1. Hello Kitty bilan tanishuv */}
      <header className="bg-gradient-to-br from-pink-500 via-rose-400 to-fuchsia-500 text-white">
        <nav className="mx-auto flex max-w-6xl items-center justify-between px-6 py-5">
          <span className="text-2xl font-black tracking-tight">MARY KIDS ❤️</span>
          <a href="#ariza" className="rounded-full bg-white/20 px-5 py-2 text-sm font-semibold backdrop-blur transition hover:bg-white/30">
            Ma&apos;lumot qoldirish
          </a>
        </nav>
        <div className="mx-auto max-w-4xl px-6 pb-24 pt-12 text-center sm:pt-20">
          <span className="inline-block rounded-full bg-white/20 px-4 py-1 text-sm font-medium">🎀 Hello Kitty kolleksiyasi</span>
          <h1 className="mt-6 text-4xl font-extrabold leading-tight sm:text-6xl">
            MARY KIDS bilan Hello Kitty dunyosiga xush kelibsiz
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-pink-50">
            Bolangiz uchun eng yoqimli Hello Kitty naborlari, Disney ryukzaklar, mini sumkalar,
            issiq palto, kurtka va shapkalar — barchasi bir joyda.
          </p>
          <div className="mt-10 flex flex-wrap justify-center gap-4">
            <a href="#hello-kitty" className="rounded-2xl bg-white px-8 py-3.5 font-semibold text-pink-600 shadow-lg transition hover:bg-pink-50">
              Mahsulotlarni ko&apos;rish
            </a>
            <a href="#ariza" className="rounded-2xl border-2 border-white px-8 py-3.5 font-semibold text-white transition hover:bg-white/10">
              Maxsus taklif olish
            </a>
          </div>
        </div>
      </header>

      <Section
        id="hello-kitty"
        eyebrow="Tanishuv"
        title="Hello Kitty mahsulotlarimiz"
        text="Qizalaringiz sevadigan Hello Kitty naborlari va aksessuarlari — sovg'a uchun ham, kundalik foydalanish uchun ham."
        items={helloKitty}
      />

      {/* 2. Ryukzaklar va mini sumkalar */}
      <Section
        id="ryukzaklar"
        eyebrow="Obzor"
        title="Ryukzaklar va mini sumkalar"
        text="Disney qahramonlari tushirilgan ryukzaklar va sayr uchun yoqimli mini sumkalar."
        items={bags}
        tint="bg-white"
      />

      {/* 3. Palto, kurtka va shapkalar */}
      <Section
        id="kiyimlar"
        eyebrow="Obzor"
        title="Palto, kurtka va shapkalar"
        text="Sovuq kunlar uchun issiq va chiroyli kiyimlar — bolangiz qulay va zamonaviy ko'rinadi."
        items={outerwear}
      />

      {/* 4. Telegram kanal + forma */}
      <section id="ariza" className="bg-gradient-to-b from-white to-pink-50">
        <div className="mx-auto max-w-xl px-6 py-20">
          <div className="text-center">
            <h2 className="text-3xl font-extrabold">Telegram kanalimizga qo&apos;shiling</h2>
            <p className="mt-3 text-slate-600">
              Yangi mahsulotlar, chegirmalar va aksiyalar birinchi bo&apos;lib kanalimizda e&apos;lon qilinadi.
            </p>
            <TelegramButton href={CHANNEL_URL} />
          </div>

          <div className="mt-12 rounded-3xl bg-white p-8 shadow-xl ring-1 ring-pink-100">
            <h3 className="text-2xl font-bold">MARY KIDS bilan tanishing ❤️</h3>
            <p className="mt-2 text-slate-600">
              Yangiliklar va maxsus takliflarni olish uchun ma&apos;lumot qoldiring.
            </p>
            <LeadForm />
          </div>
        </div>
      </section>

      <footer className="border-t border-pink-100 py-8 text-center text-sm text-slate-500">
        © {new Date().getFullYear()} MARY KIDS. Barcha huquqlar himoyalangan.
      </footer>
    </main>
  );
}

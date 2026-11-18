import LeadForm from "./components/LeadForm";
import TelegramButton from "./components/TelegramButton";
import ViewTracker from "./components/ViewTracker";

const CHANNEL_URL = process.env.NEXT_PUBLIC_TELEGRAM_CHANNEL_URL || "https://t.me/marykids";
const IMG = "/images/";

// Mahsulot qo'shish: rasmni public/images ga qo'ying va ro'yxatga { title, image } yozing.
const helloKitty = [
  { title: "Organayzer quti", image: "hk-organayzer.jpg" },
  { title: "Tungi chiroq", image: "hk-chiroq.jpg" },
  { title: "Salfetka qutisi", image: "hk-salfetka.jpg" },
  { title: "Kalkulyator", image: "hk-kalkulyator.jpg" },
  { title: "Krujka", image: "hk-krujka.jpg" },
  { title: "Kosmetichka", image: "hk-kosmetichka.jpg" },
  { title: "3D stikerlar", image: "hk-stikerlar.jpg" },
  { title: "Bolalar kosmetika nabori", image: "hk-kosmetika.jpg" },
  { title: "Soch to'g'nog'ichlari va taroq", image: "hk-soch-taroq.jpg" },
  { title: "Soch aksessuarlari (binafsha)", image: "hk-soch-binafsha.jpg" },
  { title: "Soch aksessuarlari (pushti)", image: "hk-soch-pushti.jpg" },
  { title: "Bloknot", image: "hk-bloknot.jpg" },
  { title: "Kalkulyator va ruchka nabori", image: "hk-kalkulyator-nabor.jpg" },
  { title: "Taroq", image: "hk-taroq.jpg" },
  { title: "Ko'zgu", image: "hk-kozgu.jpg" },
  { title: "Kanselyariya nabori", image: "hk-kanselyariya.jpg" },
  { title: "Ruchka idishi", image: "hk-ruchka-idish.jpg" },
];

const bags = [
  { title: "Belle gulli ryukzak", image: "ryukzak-belle.jpg" },
  { title: "Stitch & Angel ryukzak", image: "ryukzak-stitch-angel.jpg" },
  { title: "Mickey ryukzak", image: "ryukzak-mickey.jpg" },
  { title: "Stitch ryukzak (bayramona)", image: "ryukzak-stitch-1.jpg" },
  { title: "Stitch ryukzak (kitob bilan)", image: "ryukzak-stitch-2.jpg" },
  { title: "Eeyore ryukzak", image: "ryukzak-eeyore.jpg" },
  { title: "Donald Duck ryukzak", image: "ryukzak-donald.jpg" },
  { title: "Snoopy ryukzak", image: "ryukzak-snoopy.jpg" },
  { title: "Pochacco ryukzak", image: "ryukzak-pochacco.jpg" },
  { title: "Hello Kitty mini sumka", image: "sumka-hk-denim.jpg" },
  { title: "Hello Kitty bantik sumka", image: "sumka-hk-bow.jpg" },
];

const outerwear = [
  { title: "Mo'ynali qishki kurtka", note: "4 rang · 116–140 sm", image: "kurtka-moynali.jpg" },
  { title: "Mo'ynali palto — kulrang", note: "116–140 sm", image: "palto-kulrang.jpg" },
  { title: "Mo'ynali palto — qora", note: "116–140 sm", image: "palto-qora.jpg" },
  { title: "Mo'ynali palto — oq", note: "116–140 sm", image: "palto-oq.jpg" },
  { title: "Mo'ynali palto — jigarrang", note: "116–140 sm", image: "palto-jigarrang.jpg" },
];

const hats = [
  { title: "Shapka + sharf — pushti", image: "shapka-pushti.jpg" },
  { title: "Shapka + sharf — kulrang", image: "shapka-kulrang.jpg" },
  { title: "Shapka + sharf — jigarrang", image: "shapka-jigarrang.jpg" },
  { title: "Shapka + sharf — bej", image: "shapka-bej.jpg" },
];

/* ---------- Bezak elementlari ---------- */

function Rainbow({ className = "" }) {
  return (
    <svg viewBox="0 0 64 40" className={className} aria-hidden>
      <path d="M6 38a26 26 0 0 1 52 0" fill="none" stroke="#9a5a3c" strokeWidth="7" />
      <path d="M15 38a17 17 0 0 1 34 0" fill="none" stroke="#dcae9b" strokeWidth="7" />
      <path d="M24 38a8 8 0 0 1 16 0" fill="none" stroke="#c9b8ad" strokeWidth="7" />
    </svg>
  );
}

function Sparkle({ className = "" }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden>
      <path d="M12 0c.6 6.4 5.6 11.4 12 12-6.4.6-11.4 5.6-12 12-.6-6.4-5.6-11.4-12-12C6.4 11.4 11.4 6.4 12 0z" fill="currentColor" />
    </svg>
  );
}

function CircleText() {
  return (
    <svg viewBox="0 0 120 120" className="animate-spin-slow h-28 w-28 text-cocoa" aria-hidden>
      <defs>
        <path id="circle" d="M60 60m-46 0a46 46 0 1 1 92 0a46 46 0 1 1-92 0" />
      </defs>
      <text fontSize="10.5" letterSpacing="3" fill="currentColor" fontFamily="var(--font-montserrat)">
        <textPath href="#circle">YANGI KOLLEKSIYA • MARY KIDS • </textPath>
      </text>
    </svg>
  );
}

/* ---------- Mahsulot kartochkalari ---------- */

function ProductCard({ item }) {
  return (
    <figure className="group w-[calc(50%-8px)] sm:w-[calc(33.333%-14px)] lg:w-[calc(25%-15px)]">
      <div className="overflow-hidden bg-blush">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={IMG + item.image}
          alt={item.title}
          loading="lazy"
          className="aspect-[4/5] w-full object-cover transition duration-500 group-hover:scale-105"
        />
      </div>
      <figcaption className="mt-3 text-center">
        <span className="block font-serif text-[15px] text-cocoa">{item.title}</span>
        {item.note && <span className="mt-0.5 block text-xs tracking-wide text-taupe">{item.note}</span>}
      </figcaption>
    </figure>
  );
}

function ProductGrid({ items }) {
  return (
    <div className="mt-10 flex flex-wrap justify-center gap-x-4 gap-y-8 sm:gap-x-5 lg:gap-x-5">
      {items.map((item) => (
        <ProductCard key={item.image} item={item} />
      ))}
    </div>
  );
}

function SectionTitle({ kicker, title, text }) {
  return (
    <div className="text-center">
      {kicker && <p className="font-script text-3xl text-rust">{kicker}</p>}
      <h2 className="mt-1 font-serif text-3xl font-medium tracking-tight text-cocoa sm:text-4xl">{title}</h2>
      {text && <p className="mx-auto mt-4 max-w-2xl text-sm leading-relaxed text-taupe sm:text-base">{text}</p>}
    </div>
  );
}

/* ---------- Sahifa ---------- */

export default function Home() {
  return (
    <main className="mx-auto max-w-[1400px] bg-white shadow-[0_0_60px_rgba(107,61,42,0.06)]">
      {/* E'lon qatori */}
      <div className="bg-rust px-4 py-2 text-center text-[11px] font-medium uppercase tracking-[0.2em] text-white">
        Yangi kolleksiya keldi · Buyurtma Telegram orqali
      </div>

      {/* Logo */}
      <header className="relative flex flex-col items-center px-6 py-7">
        <Rainbow className="h-7 w-12" />
        <span className="font-script -mb-2 mt-1 text-xl text-dusty">sevimli bolalar do&apos;koni</span>
        <span className="font-serif text-4xl font-semibold tracking-tight text-rust sm:text-5xl">
          mary <span className="text-dusty">kids</span>
        </span>
        <a
          href={CHANNEL_URL}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Telegram"
          className="absolute right-6 top-1/2 hidden -translate-y-1/2 rounded-full border border-dusty p-2 text-rust transition hover:bg-blush sm:block"
        >
          <svg viewBox="0 0 24 24" className="h-4 w-4 fill-current" aria-hidden>
            <path d="M9.04 15.5l-.37 5.2c.53 0 .76-.23 1.04-.5l2.5-2.4 5.18 3.8c.95.52 1.62.25 1.88-.88l3.4-15.96c.3-1.4-.5-1.95-1.43-1.6L1.3 9.9c-1.37.53-1.35 1.3-.23 1.65l5.1 1.6L18 5.7c.56-.37 1.07-.17.65.2" />
          </svg>
        </a>
      </header>

      {/* Menyu */}
      <nav className="bg-dusty">
        <ul className="flex flex-wrap justify-center gap-x-8 gap-y-1 px-4 py-3 text-[11px] font-semibold uppercase tracking-[0.18em] text-cocoa">
          <li><a href="#hello-kitty" className="hover:text-white">Hello Kitty</a></li>
          <li><a href="#ryukzaklar" className="hover:text-white">Ryukzaklar</a></li>
          <li><a href="#kiyimlar" className="hover:text-white">Kiyimlar</a></li>
          <li><a href="#ariza" className="hover:text-white">Aloqa</a></li>
        </ul>
      </nav>

      {/* Hero */}
      <section className="relative overflow-hidden bg-blush">
        {/* fon shakllari */}
        <svg className="absolute -left-10 bottom-0 h-56 w-40 text-rust" viewBox="0 0 100 160" aria-hidden>
          <path d="M0 20c40 0 70 30 70 70s-20 70-70 70z" fill="currentColor" />
        </svg>
        <svg className="absolute -right-6 bottom-0 h-56 w-44 text-rust md:h-80 md:w-56" viewBox="0 0 200 200" preserveAspectRatio="none" aria-hidden>
          <path d="M200 0v200H60C60 120 90 40 200 0z" fill="currentColor" />
        </svg>
        <svg className="absolute -bottom-12 right-16 h-32 w-60 text-dusty md:right-32" viewBox="0 0 300 160" aria-hidden>
          <path d="M0 160C10 80 80 30 160 40s140 60 140 120z" fill="currentColor" />
        </svg>
        <Sparkle className="absolute right-[28%] top-10 h-6 w-6 text-white" />
        <Sparkle className="absolute right-[22%] top-20 h-3 w-3 text-white" />
        <Sparkle className="absolute bottom-16 left-[46%] h-4 w-4 text-white" />

        <div className="relative mx-auto grid max-w-6xl items-end gap-10 px-6 pt-12 md:grid-cols-2 md:pt-16">
          <div className="relative mx-auto w-full max-w-sm">
            <div className="overflow-hidden rounded-t-full border-[12px] border-b-0 border-cream bg-cream">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={IMG + "ryukzak-stitch-angel.jpg"} alt="MARY KIDS ryukzaklari" className="aspect-[4/5] w-full object-cover" />
            </div>
            <div className="absolute -right-10 -top-6 hidden sm:block">
              <CircleText />
            </div>
          </div>

          <div className="relative z-10 pb-14 text-center md:pb-24 md:pr-16 md:text-left">
            <p className="font-script text-5xl leading-none text-white drop-shadow-sm sm:text-6xl">bolajonlar uchun</p>
            <h1 className="mt-2 font-serif text-4xl font-semibold leading-tight text-rust sm:text-5xl">
              eng yoqimli mahsulotlar
            </h1>
            <p className="mt-5 max-w-md text-sm leading-relaxed text-taupe md:text-base">
              Hello Kitty naborlari, Disney ryukzaklar, mini sumkalar, issiq palto, kurtka va shapka-sharf
              naborlari — barchasi MARY KIDS&apos;da.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-3 md:justify-start">
              <a href="#hello-kitty" className="bg-taupe px-8 py-3 text-[11px] font-semibold uppercase tracking-[0.2em] text-white transition hover:bg-cocoa">
                Mahsulotlarni ko&apos;rish
              </a>
              <a href="#ariza" className="border border-taupe px-8 py-3 text-[11px] font-semibold uppercase tracking-[0.2em] text-taupe transition hover:bg-white/50">
                Maxsus taklif
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Hello Kitty */}
      <section id="hello-kitty" className="scroll-mt-4">
        <ViewTracker name="Hello Kitty dunyosiga xush kelibsiz" category="Hello Kitty">
          <div className="mx-auto grid max-w-6xl items-center gap-12 px-6 py-16 md:grid-cols-2 md:py-24">
            <div>
              <p className="font-script text-3xl text-dusty">Hello Kitty</p>
              <h2 className="mt-1 font-serif text-3xl font-medium text-cocoa sm:text-4xl">
                Hello Kitty dunyosiga xush kelibsiz
              </h2>
              <p className="mt-5 text-sm leading-relaxed text-taupe sm:text-base">
                Qizalaringiz sevadigan Hello Kitty naborlari, aksessuarlari va kanselyariya buyumlari — sovg&apos;a
                uchun ham, kundalik foydalanish uchun ham.
              </p>
              <p className="mt-3 text-sm leading-relaxed text-taupe sm:text-base">
                Organayzer qutilar, tungi chiroqlar, kosmetika naborlari, soch aksessuarlari, bloknot va
                kalkulyatorlar — barchasi bir joyda.
              </p>
              <a href="#ariza" className="mt-8 inline-block bg-dusty px-7 py-3 text-[11px] font-semibold uppercase tracking-[0.2em] text-white transition hover:bg-rust">
                Buyurtma berish
              </a>
            </div>
            <div className="relative mx-auto w-full max-w-md">
              <div className="absolute -bottom-6 -right-6 h-[85%] w-[75%] bg-dusty" aria-hidden />
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={IMG + "hk-kosmetika.jpg"} alt="Hello Kitty kosmetika nabori" className="relative aspect-[4/5] w-[88%] object-cover" />
              <Rainbow className="absolute -bottom-2 right-2 h-14 w-24" />
            </div>
          </div>

          <div className="mx-auto max-w-6xl px-6 pb-20">
            <h3 className="text-center text-xs font-semibold uppercase tracking-[0.25em] text-cocoa">Hello Kitty kolleksiyasi</h3>
            <ProductGrid items={helloKitty} />
          </div>
        </ViewTracker>
      </section>

      {/* Ryukzaklar */}
      <section id="ryukzaklar" className="relative scroll-mt-4 bg-greige">
        <Sparkle className="absolute left-[12%] top-12 h-4 w-4 text-white" />
        <Sparkle className="absolute right-[15%] top-20 h-6 w-6 text-white" />
        <ViewTracker name="Ryukzaklar va mini sumkalar" category="Obzor">
          <div className="mx-auto max-w-6xl px-6 py-20">
            <SectionTitle
              kicker="obzor"
              title="Ryukzaklar va mini sumkalar"
              text="Disney qahramonlari tushirilgan ryukzaklar va sayr uchun yoqimli mini sumkalar — bog'cha, maktab va sayohat uchun."
            />
            <ProductGrid items={bags} />
          </div>
        </ViewTracker>
      </section>

      {/* Kiyimlar */}
      <section id="kiyimlar" className="scroll-mt-4">
        <ViewTracker name="Palto, kurtka va shapkalar" category="Obzor">
          <div className="mx-auto max-w-6xl px-6 py-20">
            <SectionTitle
              kicker="issiq va chiroyli"
              title="Palto, kurtka va shapkalar"
              text="Sovuq kunlar uchun mo'ynali kurtka va paltolar — 116–140 sm o'lchamlarda."
            />
            <ProductGrid items={outerwear} />

            <div className="mt-20">
              <h3 className="text-center font-serif text-2xl text-cocoa">Shapka + sharf naborlari</h3>
              <p className="mx-auto mt-3 max-w-xl text-center text-sm text-taupe">
                Har bir naborda shapka va unga mos sharf bor. Ranglar: pushti, kulrang, jigarrang, bej va qora.
              </p>
              <ProductGrid items={hats} />
            </div>
          </div>
        </ViewTracker>
      </section>

      {/* Telegram + forma */}
      <section id="ariza" className="relative scroll-mt-4 overflow-hidden bg-greige">
        <Sparkle className="absolute left-[18%] top-16 h-5 w-5 text-white" />
        <Sparkle className="absolute right-[20%] top-28 h-4 w-4 text-white" />
        <div className="relative mx-auto max-w-xl px-6 py-20 text-center">
          <p className="font-serif text-4xl font-semibold text-dusty sm:text-5xl">
            MARY KIDS <span className="font-script font-normal text-rust">bilan tanishing</span> ❤️
          </p>
          <p className="mt-4 text-sm text-taupe">
            Yangi mahsulotlar, chegirmalar va aksiyalar birinchi bo&apos;lib Telegram kanalimizda e&apos;lon qilinadi.
          </p>
          <TelegramButton href={CHANNEL_URL} />

          <div className="mt-12 bg-white p-8 text-left shadow-sm">
            <h3 className="font-serif text-2xl text-cocoa">Ma&apos;lumot qoldiring</h3>
            <p className="mt-2 text-sm text-taupe">Yangiliklar va maxsus takliflarni olish uchun.</p>
            <LeadForm />
          </div>
        </div>
      </section>

      <footer className="bg-dusty px-6 py-10 text-center text-cocoa">
        <Rainbow className="mx-auto h-7 w-12" />
        <p className="mt-3 font-serif text-2xl">mary kids</p>
        <p className="mt-2 text-xs uppercase tracking-[0.2em]">© {new Date().getFullYear()} · Barcha huquqlar himoyalangan</p>
      </footer>
    </main>
  );
}

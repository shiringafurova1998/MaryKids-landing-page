# MARY KIDS — landing page (Next.js App Router)

Sahifa tartibi:
1. Hello Kitty mahsulotlari bilan tanishuv
2. Ryukzaklar va mini sumkalar obzori
3. Palto, kurtka va shapkalar obzori
4. Telegram kanalga o'tish tugmasi + qisqa forma (ism, telefon, qiziqishlar)

Forma yuborilganda ma'lumot **to'g'ridan-to'g'ri Telegram botga** keladi.

## Telegram botni ulash

1. Telegram'da **@BotFather** → `/newbot` → token oling.
2. Botga (yoki bot qo'shilgan guruhga) biror xabar yozing.
3. `https://api.telegram.org/bot<TOKEN>/getUpdates` ni oching — `chat.id` ni oling.
   Kanalga yuborish uchun botni kanalga admin qilib qo'shing (ID odatda `-100...` bilan boshlanadi).
4. Quyidagi o'zgaruvchilarni kiriting (`.env.example` ga qarang):
   - `TELEGRAM_BOT_TOKEN`
   - `TELEGRAM_CHAT_ID`
   - `NEXT_PUBLIC_TELEGRAM_CHANNEL_URL` — kanal havolasi

## Ishga tushirish

```bash
npm install
cp .env.example .env.local   # qiymatlarni to'ldiring
npm run dev
```

## Rasmlar

Rasmlarni `public/images/` ga joylang va `app/page.js` dagi mahsulot ro'yxatlarida `image` maydoniga yo'lini yozing.

## Deploy

Repo'ni [Vercel](https://vercel.com/new) ga ulang va Environment Variables bo'limiga yuqoridagi 3 ta qiymatni kiriting.

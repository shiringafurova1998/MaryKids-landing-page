import "./globals.css";

export const metadata = {
  title: "MARY KIDS — Hello Kitty, ryukzaklar, palto va kurtkalar",
  description:
    "MARY KIDS: Hello Kitty mahsulotlari, Disney ryukzaklar, mini sumkalar, bolalar palto, kurtka va shapkalari.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="uz">
      <body className="min-h-screen bg-rose-50/40 text-slate-900 antialiased">
        {children}
      </body>
    </html>
  );
}

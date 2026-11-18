import "./globals.css";
import { Fraunces, Great_Vibes, Montserrat } from "next/font/google";
import MetaPixel from "./components/MetaPixel";

const fraunces = Fraunces({ subsets: ["latin"], variable: "--font-fraunces", display: "swap" });
const vibes = Great_Vibes({ subsets: ["latin"], weight: "400", variable: "--font-vibes", display: "swap" });
const montserrat = Montserrat({ subsets: ["latin"], variable: "--font-montserrat", display: "swap" });

export const metadata = {
  title: "MARY KIDS — Hello Kitty, ryukzaklar, palto va kurtkalar",
  description:
    "MARY KIDS: Hello Kitty mahsulotlari, Disney ryukzaklar, mini sumkalar, bolalar palto, kurtka va shapka-sharf naborlari.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="uz" className={`${fraunces.variable} ${vibes.variable} ${montserrat.variable}`}>
      <body className="min-h-screen bg-cream text-cocoa antialiased">
        <MetaPixel />
        {children}
      </body>
    </html>
  );
}

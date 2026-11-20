"use client";

import Script from "next/script";
import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";
import { trackEvent } from "@/lib/meta-client";

const PIXEL_ID = process.env.NEXT_PUBLIC_META_PIXEL_ID;

export default function MetaPixel() {
  const pathname = usePathname();
  const lastPath = useRef(null);
  // Sotuvchi sahifasida Pixel ishlamaydi — sotuvchi tashrifi mijozniki deb sanalmasin
  const disabled = !PIXEL_ID || pathname?.startsWith("/sotuv");

  // Har bir sahifa ochilishida PageView (Pixel + CAPI, bitta event_id bilan)
  useEffect(() => {
    if (disabled || lastPath.current === pathname) return;
    lastPath.current = pathname;
    const fire = () => trackEvent("PageView");
    if (typeof window.fbq === "function") fire();
    else {
      const t = setInterval(() => {
        if (typeof window.fbq === "function") {
          clearInterval(t);
          fire();
        }
      }, 100);
      setTimeout(() => clearInterval(t), 5000);
    }
  }, [pathname, disabled]);

  if (disabled) return null;

  return (
    <>
      <Script id="meta-pixel" strategy="afterInteractive">
        {`!function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?
n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;
n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;
t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,
document,'script','https://connect.facebook.net/en_US/fbevents.js');
fbq('init', '${PIXEL_ID}');`}
      </Script>
      <noscript>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          height="1"
          width="1"
          style={{ display: "none" }}
          alt=""
          src={`https://www.facebook.com/tr?id=${PIXEL_ID}&ev=PageView&noscript=1`}
        />
      </noscript>
    </>
  );
}

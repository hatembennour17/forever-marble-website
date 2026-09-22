"use client";

import { useEffect } from "react";

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
  }
}

const phoneConversion = "AW-1034233006/igMnCLT_i_0DEK7JlO0D";

export default function GoogleAdsTracking() {
  useEffect(() => {
    function trackPhoneClick(event: MouseEvent) {
      const link = (event.target as Element | null)?.closest<HTMLAnchorElement>('a[href^="tel:+12152038666"], a[href^="tel:2152038666"]');
      if (!link) return;
      window.gtag?.("event", "conversion", { send_to: phoneConversion });
    }

    document.addEventListener("click", trackPhoneClick);
    return () => document.removeEventListener("click", trackPhoneClick);
  }, []);

  return null;
}

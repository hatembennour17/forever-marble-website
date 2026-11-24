"use client";

import { useEffect } from "react";

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
  }
}

// A phone-link click indicates intent; connected calls are measured separately by Google.

export default function GoogleAdsTracking() {
  useEffect(() => {
    function trackPhoneClick(event: MouseEvent) {
      const link = (event.target as Element | null)?.closest<HTMLAnchorElement>('a[href^="tel:+12152038666"], a[href^="tel:2152038666"]');
      if (!link) return;
      window.gtag?.("event", "phone_click", { event_category: "contact" });
    }

    document.addEventListener("click", trackPhoneClick);
    return () => document.removeEventListener("click", trackPhoneClick);
  }, []);

  return null;
}

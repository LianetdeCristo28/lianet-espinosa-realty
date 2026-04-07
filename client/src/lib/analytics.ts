declare const __GA4_MEASUREMENT_ID__: string;
declare const __FB_PIXEL_ID__: string;

const GA4_ID = __GA4_MEASUREMENT_ID__;
const FB_ID = __FB_PIXEL_ID__;

const CONSENT_KEY = "cookie_consent";

type ConsentStatus = "accepted" | "rejected" | null;

export function getConsentStatus(): ConsentStatus {
  try {
    const value = localStorage.getItem(CONSENT_KEY);
    if (value === "accepted" || value === "rejected") return value;
  } catch {
    // localStorage no disponible (modo privado, Safari ITP, etc.)
  }
  return null;
}

export function setConsent(status: "accepted" | "rejected") {
  try {
    localStorage.setItem(CONSENT_KEY, status);
  } catch {
    // localStorage no disponible — continúa sin persistir
  }
  if (status === "accepted") {
    loadAnalytics();
  }
}

let analyticsLoaded = false;

export function loadAnalytics() {
  if (analyticsLoaded) return;
  if (getConsentStatus() !== "accepted") return;
  analyticsLoaded = true;

  if (GA4_ID) loadGA4(GA4_ID);
  if (FB_ID) loadFBPixel(FB_ID);
}

function loadGA4(measurementId: string) {
  const script = document.createElement("script");
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${measurementId}`;
  document.head.appendChild(script);

  (window as any).dataLayer = (window as any).dataLayer || [];
  function gtag(...args: any[]) {
    (window as any).dataLayer.push(args);
  }
  (window as any).gtag = gtag;
  gtag("js", new Date());
  gtag("config", measurementId, {
    anonymize_ip: true,
    send_page_view: true,
  });
}

function loadFBPixel(pixelId: string) {
  const f = window as any;
  const n = (f.fbq = function (...args: any[]) {
    if (n.callMethod) {
      n.callMethod.apply(n, args);
    } else {
      n.queue.push(args);
    }
  });
  if (!f._fbq) f._fbq = n;
  n.push = n;
  n.loaded = true;
  n.version = "2.0";
  n.queue = [];

  const script = document.createElement("script");
  script.async = true;
  script.src = "https://connect.facebook.net/en_US/fbevents.js";
  document.head.appendChild(script);

  n("init", pixelId);
  n("track", "PageView");
}

export function trackEvent(eventName: string, params?: Record<string, string | number | boolean>) {
  if (getConsentStatus() !== "accepted") return;

  if (GA4_ID && (window as any).gtag) {
    (window as any).gtag("event", eventName, params);
  }

  if (FB_ID && (window as any).fbq) {
    const fbEventMap: Record<string, string> = {
      lead_submitted: "Lead",
      diagnostic_completed: "CompleteRegistration",
      property_search_initiated: "Search",
    };
    const fbEvent = fbEventMap[eventName];
    if (fbEvent) {
      (window as any).fbq("track", fbEvent);
    } else {
      (window as any).fbq("trackCustom", eventName);
    }
  }
}

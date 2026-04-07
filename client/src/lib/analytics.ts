declare const __GA4_MEASUREMENT_ID__: string;
declare const __FB_PIXEL_ID__: string;

// Declaraciones globales para las APIs de analytics de terceros
declare global {
  interface Window {
    gtag: (...args: unknown[]) => void;
    dataLayer: unknown[];
    fbq: ((...args: unknown[]) => void) & {
      callMethod?: (...args: unknown[]) => void;
      queue: unknown[];
      push: (...args: unknown[]) => void;
      loaded: boolean;
      version: string;
    };
    _fbq: Window["fbq"] | undefined;
  }
}

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

  window.dataLayer = window.dataLayer || [];
  window.gtag = function (...args: unknown[]) {
    window.dataLayer.push(args);
  };
  window.gtag("js", new Date());
  window.gtag("config", measurementId, {
    anonymize_ip: true,
    send_page_view: true,
  });
}

function loadFBPixel(pixelId: string) {
  const fbq = function (...args: unknown[]) {
    if (fbq.callMethod) {
      fbq.callMethod(...args);
    } else {
      fbq.queue.push(args);
    }
  } as Window["fbq"];

  fbq.push = fbq;
  fbq.loaded = true;
  fbq.version = "2.0";
  fbq.queue = [];

  window.fbq = fbq;
  if (!window._fbq) window._fbq = fbq;

  const script = document.createElement("script");
  script.async = true;
  script.src = "https://connect.facebook.net/en_US/fbevents.js";
  document.head.appendChild(script);

  window.fbq("init", pixelId);
  window.fbq("track", "PageView");
}

export function trackEvent(eventName: string, params?: Record<string, string | number | boolean>) {
  if (getConsentStatus() !== "accepted") return;

  if (GA4_ID && window.gtag) {
    window.gtag("event", eventName, params);
  }

  if (FB_ID && window.fbq) {
    const fbEventMap: Record<string, string> = {
      lead_submitted: "Lead",
      diagnostic_completed: "CompleteRegistration",
      property_search_initiated: "Search",
    };
    const fbEvent = fbEventMap[eventName];
    if (fbEvent) {
      window.fbq("track", fbEvent);
    } else {
      window.fbq("trackCustom", eventName);
    }
  }
}

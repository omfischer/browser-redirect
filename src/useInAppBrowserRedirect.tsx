import { useEffect } from "react";

export function useInAppBrowserRedirect() {
  useEffect(() => {
    const userAgent = navigator.userAgent || navigator.vendor || "";

    const isInAppBrowser = /Instagram|FBAN|FBAV|Messenger|Line|Snapchat|Twitter|WeChat|TikTok/i.test(
      userAgent
    );

    const isAndroid = /android/i.test(userAgent);
    const isIOS = /iPad|iPhone|iPod/i.test(userAgent);

    const shareId = "3gp6ac5asmf5";
    const deepLink = `jotta://files/share/${shareId}`;

    // const siteOrigin = window.location.origin.replace(/\/$/, "");
    const siteHost = window.location.host;
    const mainSite = `https://${siteHost}`;

    const bridgeUrl = `${mainSite}/bridge-page.html`;
    const iosBridge = `x-safari-${mainSite}/?source=ios_redirect`;
    const androidIntent = `intent://${siteHost}#Intent;scheme=https;action=android.intent.action.VIEW;end`;

    const params = new URLSearchParams(window.location.search);
    const fromIOSBridge = params.get("source") === "ios_redirect";

    if (fromIOSBridge) {
      // Coming back from iOS x-safari; try to open the app. If it fails, fallback to web.
      const timeout = setTimeout(() => {
        window.location.replace(mainSite);
      }, 1200);
      // Try open deep link
      window.location.href = deepLink;
      return () => clearTimeout(timeout);
    }

    if (isInAppBrowser) {
      if (isIOS) {
        window.location.href = iosBridge;
      } else if (isAndroid) {
        window.location.href = androidIntent;
      } else {
        window.location.href = bridgeUrl;
      }
    }
  }, []);
}



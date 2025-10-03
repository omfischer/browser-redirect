// BreakoutButton.tsx
import React, { useCallback, useMemo, useState } from "react";

type Props = {
  /** Your canonical web URL (the page you want opened in Safari) */
  canonicalUrl: string;
  /** If you have Universal Links set up, this is typically the same as canonicalUrl */
  universalLink?: string;
  /** Optional: custom URL scheme to open your app if installed (e.g., yourapp://share/abc) */
  customSchemeUrl?: string;
  /** Optional: App Store URL if you want to nudge install (often best to leave null to avoid surprises) */
  appStoreUrl?: string | null;
  /** Button label */
  label?: string;
  /** Optional: className for styling (Tailwind etc.) */
  className?: string;
};

export const BreakoutButton: React.FC<Props> = ({
  canonicalUrl,
  universalLink,
  customSchemeUrl,
  appStoreUrl = null,
  label = "Open in browser",
  className,
}) => {
  const [status, setStatus] = useState<string>("");

  const env = useMemo(() => {
    if (typeof window === "undefined") {
      return { isIOS: false, isIAB: false, isMessenger: false };
    }
    const ua = navigator.userAgent || "";
    const isIOS = /iPad|iPhone|iPod/i.test(ua);
    // crude but practical IAB/Messenger detection
    const isMessenger =
      /\bFBAN|FBAV|FB_IAB\b/i.test(ua) ||
      /\bMessenger\b/i.test(ua) ||
      /FBAN\/Messenger/i.test(ua);
    const isIAB =
      isMessenger ||
      /\bInstagram|Twitter|Line\/|TikTok|Snapchat|Pinterest|Reddit\b/i.test(ua);
    return { isIOS, isIAB, isMessenger };
  }, []);

  const copyToClipboard = useCallback(async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      return true;
    } catch {
      // Fallback for older contexts
      try {
        const el = document.createElement("textarea");
        el.value = text;
        el.setAttribute("readonly", "");
        el.style.position = "absolute";
        el.style.left = "-9999px";
        document.body.appendChild(el);
        el.select();
        const ok = document.execCommand("copy");
        document.body.removeChild(el);
        return ok;
      } catch {
        return false;
      }
    }
  }, []);

  const showInstructions = useCallback(async () => {
    const copied = await copyToClipboard(canonicalUrl);
    setStatus(
      `If this didn't open Safari: tap the “•••” menu → Open in Browser${copied ? " (link copied ✅)" : ""
      }`
    );
  }, [canonicalUrl, copyToClipboard]);

  const openInNewContext = useCallback((url: string) => {
    // In some iOS in-app browsers, a user-initiated _blank open will hand off to Safari.
    // Returns true if a window handle was created (not a guarantee of breakout).
    const w = window.open(url, "_blank", "noopener,noreferrer");
    return !!w;
  }, []);

  const tryCustomSchemeThenFallback = useCallback(
    (schemeUrl: string, fallbackUrl: string, appStore?: string | null) => {
      let lostVisibility = false;
      const visHandler = () => {
        if (document.visibilityState === "hidden") lostVisibility = true;
      };
      document.addEventListener("visibilitychange", visHandler, { once: true });

      // Kick the app via custom scheme (if installed it should background our web view)
      window.location.href = schemeUrl;

      // If we stayed visible, go to universal link (web) after a short delay
      window.setTimeout(() => {
        if (!lostVisibility) {
          window.location.href = fallbackUrl;
          // Optional: after a longer delay, consider nudging to App Store (be cautious!)
          if (appStore) {
            window.setTimeout(() => {
              if (!lostVisibility) window.location.href = appStore;
            }, 1400);
          }
        }
      }, 900);
    },
    []
  );

  const handleClick = useCallback(async () => {
    setStatus("");

    const ul = universalLink || canonicalUrl;

    // 1) First attempt: _blank open. In some IABs on iOS this breaks out to Safari.
    if (env.isIOS && env.isIAB) {
      const popped = openInNewContext(canonicalUrl);
      if (popped) {
        // Give it a moment; if nothing changes we still show guidance.
        window.setTimeout(showInstructions, 1200);
        return;
      }
    }

    // 2) Try app (if installed) via custom scheme; fallback to universal link/web.
    if (customSchemeUrl) {
      tryCustomSchemeThenFallback(customSchemeUrl, ul, appStoreUrl);
    } else {
      // No scheme provided—just head to the universal link/web.
      window.location.href = ul;
    }

    // 3) Always give a helpful hint in case we're still inside IAB.
    window.setTimeout(showInstructions, 1200);
  }, [
    appStoreUrl,
    canonicalUrl,
    customSchemeUrl,
    env.isIAB,
    env.isIOS,
    openInNewContext,
    showInstructions,
    tryCustomSchemeThenFallback,
    universalLink,
  ]);

  return (
    <div className="inline-flex flex-col">
      <button
        onClick={handleClick}
        type="button"
        className={
          className ??
          "px-4 py-2 rounded-xl text-sm font-semibold shadow-sm " +
          "bg-black text-white active:opacity-80 focus:outline-none focus:ring-2 focus:ring-black/30"
        }
        aria-label="Open in browser"
      >
        {label}
      </button>

      {!!status && (
        <p
          className="mt-2 text-sm text-neutral-600"
        // Keep text selectable (useful if clipboard fails)
        >
          {status}
        </p>
      )}
    </div>
  );
};
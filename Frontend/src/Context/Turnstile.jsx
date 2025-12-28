import { useEffect } from "react";

export default function Turnstile({ onVerify }) {
  useEffect(() => {
    let widgetId;

    const siteKey =
      import.meta.env.VITE_TURNSTILE_SITE_KEY || "0x4AAAAAACI3GO-2YPvOMnNh";

    if (!siteKey) {
      console.error("Turnstile Error: VITE_TURNSTILE_SITE_KEY is missing!");
      return;
    }

    const waitForTurnstile = () => {
      if (window.turnstile?.render) {
        try {
          widgetId = window.turnstile.render("#turnstile", {
            sitekey: siteKey,
            callback: (token) => {
              onVerify(token);
            },
          });
        } catch (err) {
          console.error("Turnstile render error:", err);
        }
      } else {
        setTimeout(waitForTurnstile, 500);
      }
    };

    waitForTurnstile();

    return () => {
      if (widgetId && window.turnstile?.remove) {
        window.turnstile.remove(widgetId);
      }
    };
  }, [onVerify]);

  return <div id="turnstile" style={{ minHeight: "65px" }}></div>;
}

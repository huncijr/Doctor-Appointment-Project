import { useEffect } from "react";
export default function Turnstile({ onVerify }) {
  useEffect(() => {
    let widgetId;
    const waitForTurnstile = () => {
      if (window.turnstile?.render) {
        widgetId = window.turnstile.render("#turnstile", {
          sitekey: import.meta.env.VITE_TURNSTILE_SITE_KEY,
          callback: (token) => {
            onVerify(token);
          },
        });
      } else {
        setTimeout(waitForTurnstile, 100);
      }
    };
    waitForTurnstile();
    console.log(widgetId);
    return () => {
      if (widgetId && window.turnstile?.remove) {
        window.turnstile.remove(widgetId);
      }
    };
  }, []);
  return <div id="turnstile"></div>;
}

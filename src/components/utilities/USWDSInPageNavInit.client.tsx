
"use client";

import { useEffect } from "react";

/**
 * USWDSInit — Client-only initializer for:
 *  - In-page navigation
 *  - Accordion
 *
 * It dynamically imports USWDS JS and initializes components on the document.
 * Safe for Next.js App Router: nothing runs during SSR.
 */
export function USWDSInit() {
  useEffect(() => {
    let inPageNav: any | undefined;
       let accordion: any | undefined;

    let mounted = true;

    (async () => {
      try {
        // In-page navigation
        const inPageNavMod = await import("@uswds/uswds/js/usa-in-page-navigation");
        inPageNav = inPageNavMod?.default ?? inPageNavMod;

        // Accordion
        const accordionMod = await import("@uswds/uswds/js/usa-accordion");
        accordion = accordionMod?.default ?? accordionMod;

        if (mounted) {
          // Initialize both against the document
          inPageNav?.on(document.body);
          accordion?.on(document.body);

          // Optional: if headings are dynamically injected/updated,
          // re-init the in-page nav when <main> headings change.
          const main = document.querySelector("main");
          if (main) {
            const observer = new MutationObserver(() => {
              try {
                // Re-run to rebuild TOC (guarding against double init)
                inPageNav?.off(document.body);
                inPageNav?.on(document.body);
              } catch {
                /* no-op */
              }
            });

            observer.observe(main, {
              subtree: true,
              childList: true,
              characterData: true,
            });

            // Clean up the observer on unmount
            (USWDSInit as any)._observer = observer;
          }
        }
      } catch {
        // Silence errors to avoid noisy logs during dev hot reload
      }
    })();

    return () => {
      mounted = false;
      try {
        // Disconnect the mutation observer if we created one
        const observer = (USWDSInit as any)._observer as MutationObserver | undefined;
        observer?.disconnect();
      } catch {
        /* no-op */
      }

      try {
        inPageNav?.off(document.body);
      } catch {
        /* no-op */
      }

      try {
        accordion?.off(document.body);
      } catch {
        /* no-op */
      }
    };
  }, []);

  return null;
}

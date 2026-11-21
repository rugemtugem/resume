"use client";

import { useEffect, useState } from "react";
import Script from "next/script";
import { EVENTO_CONSENTIMENTO, lerConsentimento } from "@/lib/consent";
import { GA_ID, track } from "@/lib/analytics";

/**
 * Carrega o GA4 só depois do aceite e mede os cliques de contato:
 * link para o WhatsApp, link de e-mail e elementos marcados com data-cta.
 */
export function AnalyticsLoader() {
    const [aceito, setAceito] = useState(false);

    useEffect(() => {
        const atualizar = () => setAceito(lerConsentimento() === "aceito");
        atualizar();
        window.addEventListener(EVENTO_CONSENTIMENTO, atualizar);
        return () => window.removeEventListener(EVENTO_CONSENTIMENTO, atualizar);
    }, []);

    useEffect(() => {
        const aoClicar = (evento: MouseEvent) => {
            const alvo = evento.target as Element | null;
            if (!alvo?.closest) return;

            const cta = alvo.closest<HTMLElement>("[data-cta]");
            if (cta) {
                track("cta_click", {
                    cta_id: cta.dataset.cta ?? "",
                    cta_destination: cta.dataset.ctaDestino ?? "",
                });
            }

            const link = alvo.closest<HTMLAnchorElement>("a[href]");
            if (!link) return;
            const href = link.getAttribute("href") ?? "";
            const local = link.dataset.local ?? link.closest<HTMLElement>("[data-local]")?.dataset.local ?? "pagina";
            if (href.startsWith("https://wa.me/")) track("whatsapp_click", { button_location: local });
            else if (href.startsWith("mailto:")) track("email_click", { button_location: local });
        };
        document.addEventListener("click", aoClicar);
        return () => document.removeEventListener("click", aoClicar);
    }, []);

    if (!aceito) return null;

    return (
        <>
            <Script src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`} strategy="afterInteractive" />
            <Script id="google-analytics" strategy="afterInteractive">
                {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${GA_ID}');
        `}
            </Script>
        </>
    );
}

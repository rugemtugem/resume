"use client";

import { FaWhatsapp } from "react-icons/fa";
import { FAB } from "@/components/ui/buttons";

/**
 * WhatsAppButton Component
 * 
 * Floating WhatsApp button using the premium FAB component.
 * Features pulse animation, tooltip, and hide-on-scroll behavior.
 * 
 * @example
 * ```tsx
 * <WhatsAppButton />
 * ```
 */
export function WhatsAppButton() {
    const whatsappNumber = "5511986514401";
    const whatsappLink = `https://wa.me/${whatsappNumber}`;

    return (
        <FAB
            icon={<FaWhatsapp className="w-7 h-7" />}
            ariaLabel="Contato via WhatsApp"
            href={whatsappLink}
            tooltip="Fale comigo pelo WhatsApp"
            variant="whatsapp"
            position="bottom-right"
            pulse={true}
            size="lg"
        />
    );
}

import { useState, memo, useEffect } from "react";
import { MessageCircle } from "lucide-react";

const PHONE_NUMBER = "+905393160007";

function FloatingWhatsApp() {
    const [showTooltip, setShowTooltip] = useState(false);
    const [hasScrolled, setHasScrolled] = useState(false);

    const whatsappLink = `https://wa.me/${PHONE_NUMBER}?text=${encodeURIComponent(
        "Merhaba, bilgi almak istiyorum."
    )}`;

    // Show after scrolling 300px
    useEffect(() => {
        const handleScroll = () => {
            setHasScrolled(window.scrollY > 300);
        };
        window.addEventListener("scroll", handleScroll, { passive: true });
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    // Auto-show tooltip after 3 seconds if visible
    useEffect(() => {
        if (!hasScrolled) return;
        const timer = setTimeout(() => setShowTooltip(true), 3000);
        const hideTimer = setTimeout(() => setShowTooltip(false), 7000);
        return () => {
            clearTimeout(timer);
            clearTimeout(hideTimer);
        };
    }, [hasScrolled]);

    return (
        <div
            className={`fixed bottom-6 right-6 z-50 transition-all duration-500 ${hasScrolled
                    ? "translate-y-0 opacity-100"
                    : "translate-y-20 opacity-0 pointer-events-none"
                }`}
        >
            {/* Tooltip */}
            <div
                className={`absolute bottom-full right-0 mb-3 transition-all duration-300 ${showTooltip
                        ? "opacity-100 translate-y-0"
                        : "opacity-0 translate-y-2 pointer-events-none"
                    }`}
            >
                <div className="bg-white rounded-xl shadow-xl px-4 py-3 text-sm text-[#2F2F2F] font-medium whitespace-nowrap border border-[#2F2F2F]/10">
                    💬 Hemen yazın, anında cevap!
                    <div className="absolute -bottom-1.5 right-6 w-3 h-3 bg-white border-r border-b border-[#2F2F2F]/10 rotate-45" />
                </div>
            </div>

            {/* Button */}
            <a
                href={whatsappLink}
                target="_blank"
                rel="noopener noreferrer"
                className="group relative flex items-center justify-center w-16 h-16 rounded-full bg-[#25D366] shadow-2xl hover:bg-[#128C7E] transition-all duration-300 hover:scale-110"
                aria-label="WhatsApp ile iletişime geçin"
                onMouseEnter={() => setShowTooltip(true)}
                onMouseLeave={() => setShowTooltip(false)}
            >
                {/* Pulse rings */}
                <span className="absolute inset-0 rounded-full bg-[#25D366] animate-ping opacity-20" />
                <span className="absolute inset-[-4px] rounded-full bg-[#25D366]/20 animate-pulse" />

                {/* Icon */}
                <MessageCircle className="w-7 h-7 text-white relative z-10" />
            </a>
        </div>
    );
}

export default memo(FloatingWhatsApp);

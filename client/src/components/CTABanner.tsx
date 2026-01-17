import { Button } from "@/components/ui/button";
import { Phone, MessageCircle } from "lucide-react";

const PHONE_NUMBER = "+905393160007";
const PHONE_DISPLAY = "+90 539 316 00 07";

export default function CTABanner() {
  const whatsappLink = `https://wa.me/${PHONE_NUMBER}?text=${encodeURIComponent("Merhaba, bilgi almak istiyorum.")}`;
  const phoneLink = `tel:${PHONE_NUMBER}`;

  return (
    <section className="relative py-16 md:py-20 lg:py-24 bg-[#2F2F2F] overflow-hidden">
      {/* Geometric Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 left-0 w-96 h-96 bg-[#FFD300] rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-[#FFD300] rounded-full blur-3xl translate-x-1/2 translate-y-1/2" />
      </div>

      <div className="relative container">
        <div className="text-center max-w-4xl mx-auto">
          <h2 className="text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-extrabold text-white mb-4 lg:mb-6">
            DETAYLI BİLGİ VE İLETİŞİM İÇİN
          </h2>
          <p className="text-xl md:text-2xl lg:text-3xl text-gray-300 mb-8 lg:mb-10">
            Hemen arayın veya WhatsApp'tan yazın
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-5 lg:gap-6">
            {/* Phone Button */}
            <a href={phoneLink}>
              <Button
                size="lg"
                className="bg-[#FFD300] text-[#2F2F2F] hover:bg-[#FFD300]/90 text-lg lg:text-xl px-8 lg:px-10 py-5 lg:py-6 h-auto font-bold gap-3 shadow-lg hover:shadow-xl transition-all"
              >
                <Phone className="w-6 h-6" />
                {PHONE_DISPLAY}
              </Button>
            </a>

            {/* WhatsApp Button */}
            <a href={whatsappLink} target="_blank" rel="noopener noreferrer">
              <Button
                size="lg"
                className="bg-[#25D366] hover:bg-[#128C7E] text-white text-lg lg:text-xl px-8 lg:px-10 py-5 lg:py-6 h-auto font-bold gap-3 shadow-lg hover:shadow-xl transition-all"
              >
                <MessageCircle className="w-6 h-6" />
                WhatsApp ile Yazın
              </Button>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

import { MessageCircle } from "lucide-react";

const PHONE_NUMBER = "+905393160007";

export default function WhatsAppButton() {
  const whatsappLink = `https://wa.me/${PHONE_NUMBER}?text=${encodeURIComponent("Merhaba, bilgi almak istiyorum.")}`;

  return (
    <a
      href={whatsappLink}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-50 w-16 h-16 bg-[#25D366] hover:bg-[#128C7E] rounded-full flex items-center justify-center shadow-lg hover:shadow-xl transition-all hover:scale-110 min-w-[48px] min-h-[48px]"
      aria-label="WhatsApp ile iletişime geçin"
    >
      <MessageCircle className="w-8 h-8 text-white" />
    </a>
  );
}

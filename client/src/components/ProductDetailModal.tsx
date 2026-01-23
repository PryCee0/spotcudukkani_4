import { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MessageCircle, X, Phone, MapPin, Clock, Share2, Check, Copy } from "lucide-react";
import ImageCarousel from "./ImageCarousel";
import { toast } from "sonner";

const PHONE_NUMBER = "+905393160007";
const PHONE_DISPLAY = "+90 539 316 00 07";

// Alt kategori etiketleri
const SUB_CATEGORY_LABELS: Record<string, string> = {
  // Beyaz Eşya
  buzdolabi: "Buzdolabı",
  camasir_makinesi: "Çamaşır Makinesi",
  bulasik_makinesi: "Bulaşık Makinesi",
  firin_ocak: "Fırın/Ocak",
  derin_dondurucu: "Derin Dondurucu",
  klima: "Klima",
  // Mobilya
  koltuk_takimi: "Koltuk Takımı",
  kose_koltuk: "Köşe Koltuk",
  yatak_baza: "Yatak/Baza",
  gardrop: "Gardırop",
  yemek_masasi: "Yemek Masası",
  tv_unitesi: "TV Ünitesi",
  sehpa: "Sehpa",
};

interface ProductImage {
  url: string;
  key: string;
}

interface ProductDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: {
    id: number;
    title: string;
    description?: string | null;
    category: "mobilya" | "beyaz_esya";
    subCategory?: string | null;
    imageUrl?: string | null;
    images?: ProductImage[] | null;
  } | null;
  // v5.0: Deep linking support
  enableDeepLink?: boolean;
}

export default function ProductDetailModal({ 
  isOpen, 
  onClose, 
  product,
  enableDeepLink = true,
}: ProductDetailModalProps) {
  const [copied, setCopied] = useState(false);

  // v5.0: Update URL when modal opens (deep linking)
  useEffect(() => {
    if (enableDeepLink && isOpen && product?.id) {
      const currentUrl = new URL(window.location.href);
      currentUrl.searchParams.set("id", product.id.toString());
      window.history.replaceState(null, "", currentUrl.toString());
    }
  }, [isOpen, product?.id, enableDeepLink]);

  // v5.0: Remove product ID from URL when modal closes
  const handleClose = () => {
    if (enableDeepLink) {
      const currentUrl = new URL(window.location.href);
      currentUrl.searchParams.delete("id");
      window.history.replaceState(null, "", currentUrl.toString());
    }
    onClose();
  };

  if (!product) return null;

  const whatsappMessage = encodeURIComponent(
    `Merhaba, "${product.title}" ürünü hakkında fiyat ve bilgi almak istiyorum.`
  );
  const whatsappLink = `https://wa.me/${PHONE_NUMBER}?text=${whatsappMessage}`;

  const categoryLabel = product.category === "mobilya" ? "2.El Mobilya" : "2.El Beyaz Eşya";
  const subCategoryLabel = product.subCategory ? SUB_CATEGORY_LABELS[product.subCategory] : null;

  // v5.0: Generate shareable URL
  const getShareUrl = () => {
    const baseUrl = window.location.origin;
    return `${baseUrl}/urunler?id=${product.id}`;
  };

  // Share functionality
  const handleShare = async () => {
    const shareUrl = getShareUrl();
    const shareData = {
      title: product.title,
      text: `${product.title} - Spotçu Dükkanı Kadıköy Fikirtepe`,
      url: shareUrl,
    };

    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        await navigator.clipboard.writeText(shareUrl);
        setCopied(true);
        toast.success("Link kopyalandı!");
        setTimeout(() => setCopied(false), 2000);
      }
    } catch (error) {
      // User cancelled or error - try clipboard as fallback
      try {
        await navigator.clipboard.writeText(shareUrl);
        setCopied(true);
        toast.success("Link kopyalandı!");
        setTimeout(() => setCopied(false), 2000);
      } catch {
        // Clipboard also failed
      }
    }
  };

  // Format description with paragraphs
  const formatDescription = (text: string) => {
    return text.split('\n').filter(p => p.trim()).map((paragraph, index) => (
      <p key={index} className="mb-4 last:mb-0">
        {paragraph}
      </p>
    ));
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && handleClose()}>
      <DialogContent className="max-w-3xl max-h-[95vh] overflow-y-auto p-0 gap-0">
        {/* v5.0: Explicit close button - always visible */}
        <Button
          variant="ghost"
          size="icon"
          onClick={handleClose}
          className="absolute right-4 top-4 z-50 rounded-full bg-white/95 hover:bg-white shadow-md w-10 h-10 border border-gray-200"
          aria-label="Kapat"
        >
          <X className="w-5 h-5" />
        </Button>

        {/* Header */}
        <DialogHeader className="sticky top-0 z-10 bg-white border-b border-[#2F2F2F]/10 px-6 py-4">
          <div className="flex items-start justify-between gap-4 pr-12">
            <div className="flex-1 min-w-0">
              <div className="flex flex-wrap gap-2 mb-2">
                <Badge
                  className={`text-sm ${
                    product.category === "mobilya"
                      ? "bg-[#FFD300] text-[#2F2F2F] hover:bg-[#FFD300]"
                      : "bg-[#2F2F2F] text-white hover:bg-[#2F2F2F]"
                  }`}
                >
                  {categoryLabel}
                </Badge>
                {subCategoryLabel && (
                  <Badge
                    variant="outline"
                    className="text-sm bg-white text-[#2F2F2F] border-[#2F2F2F]/20"
                  >
                    {subCategoryLabel}
                  </Badge>
                )}
              </div>
              <DialogTitle className="text-xl md:text-2xl font-bold text-[#2F2F2F]">
                {product.title}
              </DialogTitle>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="icon"
                className="w-9 h-9 rounded-full"
                onClick={handleShare}
                aria-label="Paylaş"
              >
                {copied ? (
                  <Check className="w-5 h-5 text-green-500" />
                ) : (
                  <Share2 className="w-5 h-5" />
                )}
              </Button>
            </div>
          </div>
        </DialogHeader>

        {/* Content */}
        <div className="px-6 py-6">
          {/* Image Carousel */}
          <div className="mb-6">
            <ImageCarousel
              images={product.images}
              fallbackImage={product.imageUrl}
              title={product.title}
              showThumbnails={true}
            />
          </div>

          {/* Description */}
          {product.description && (
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-[#2F2F2F] mb-3">Ürün Açıklaması</h3>
              <div className="text-[#2F2F2F]/70 text-base leading-relaxed">
                {formatDescription(product.description)}
              </div>
            </div>
          )}

          {/* Store Info */}
          <div className="bg-[#F9F8F4] rounded-xl p-5 mb-6">
            <h3 className="text-lg font-semibold text-[#2F2F2F] mb-4">Mağaza Bilgileri</h3>
            <div className="space-y-3">
              <div className="flex items-center gap-3 text-[#2F2F2F]/70">
                <div className="w-10 h-10 rounded-full bg-[#FFD300]/20 flex items-center justify-center">
                  <MapPin className="w-5 h-5 text-[#FFD300]" />
                </div>
                <div>
                  <p className="font-medium text-[#2F2F2F]">Kadıköy Fikirtepe</p>
                  <p className="text-sm">Özbey Caddesi No: 59, Kadıköy/İstanbul</p>
                </div>
              </div>
              <div className="flex items-center gap-3 text-[#2F2F2F]/70">
                <div className="w-10 h-10 rounded-full bg-[#FFD300]/20 flex items-center justify-center">
                  <Clock className="w-5 h-5 text-[#FFD300]" />
                </div>
                <div>
                  <p className="font-medium text-[#2F2F2F]">Çalışma Saatleri</p>
                  <p className="text-sm">Pazartesi - Cumartesi: 09:00 - 19:00</p>
                </div>
              </div>
              <div className="flex items-center gap-3 text-[#2F2F2F]/70">
                <div className="w-10 h-10 rounded-full bg-[#25D366]/20 flex items-center justify-center">
                  <Phone className="w-5 h-5 text-[#25D366]" />
                </div>
                <div>
                  <p className="font-medium text-[#2F2F2F]">Telefon</p>
                  <p className="text-sm">{PHONE_DISPLAY}</p>
                </div>
              </div>
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="space-y-3">
            <a href={whatsappLink} target="_blank" rel="noopener noreferrer" className="block">
              <Button className="w-full bg-[#25D366] hover:bg-[#128C7E] text-white gap-3 text-lg py-6 h-auto font-semibold shadow-lg">
                <MessageCircle className="w-6 h-6" />
                WhatsApp ile Fiyat & Bilgi Al
              </Button>
            </a>
            <a href={`tel:${PHONE_NUMBER}`} className="block">
              <Button variant="outline" className="w-full gap-3 text-lg py-5 h-auto border-2 border-[#2F2F2F]/20 hover:border-[#FFD300] hover:bg-[#FFD300]/5">
                <Phone className="w-5 h-5" />
                Hemen Ara
              </Button>
            </a>
          </div>
        </div>

        {/* Footer Note */}
        <div className="border-t border-[#2F2F2F]/10 px-6 py-4 bg-[#F9F8F4]">
          <p className="text-sm text-[#2F2F2F]/60 text-center">
            Ürünü yerinde görmek için randevu alabilirsiniz. Aynı gün teslimat ve ücretsiz nakliye hizmeti sunuyoruz.
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}

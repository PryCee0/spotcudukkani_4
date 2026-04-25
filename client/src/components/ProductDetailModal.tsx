import { useEffect, useState, useCallback, useRef } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MessageCircle, X, Phone, MapPin, Clock, Share2, Check } from "lucide-react";
import ImageCarousel from "./ImageCarousel";
import ProductLightbox from "./ProductLightbox";
import { toast } from "sonner";
import { trpc } from "@/lib/trpc";
import { ProductSchema } from "./SEO";

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
  // v10.0: Callback for selecting a related product
  onSelectProduct?: (product: any) => void;
}

export default function ProductDetailModal({
  isOpen,
  onClose,
  product,
  enableDeepLink = true,
  onSelectProduct,
}: ProductDetailModalProps) {
  const [copied, setCopied] = useState(false);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);
  // v9.0: Carousel ve Lightbox arasında senkronize index
  const [carouselIndex, setCarouselIndex] = useState(0);

  // v9.0: pushState'in bu modal tarafından yapılıp yapılmadığını izle
  const didPushStateRef = useRef(false);

  // v6.0: Increment view count mutation
  const incrementViewMutation = trpc.products.incrementView.useMutation();

  // v10.0: Related products query
  const relatedProducts = trpc.products.related.useQuery(
    {
      productId: product?.id ?? 0,
      category: product?.category ?? "mobilya",
      subCategory: product?.subCategory ?? null,
      limit: 3,
    },
    {
      enabled: isOpen && !!product?.id,
      staleTime: 5 * 60 * 1000, // 5 dakika cache
    }
  );

  // v9.0: Deep linking — replaceState kullanarak çift history entry sorununu çöz
  useEffect(() => {
    if (enableDeepLink && isOpen && product?.id) {
      const currentUrl = new URL(window.location.href);
      currentUrl.searchParams.set("id", product.id.toString());
      window.history.replaceState({ productId: product.id }, "", currentUrl.toString());
      didPushStateRef.current = true;
    }
    // v9.0: View count'u idle callback ile tetikle (modal animasyonuyla yarışmasın)
    if (isOpen && product?.id) {
      const cb = () => incrementViewMutation.mutate({ id: product.id });
      if (typeof requestIdleCallback !== "undefined") {
        requestIdleCallback(cb, { timeout: 2000 });
      } else {
        setTimeout(cb, 500);
      }
    }
    // Reset carousel index
    if (isOpen) {
      setCarouselIndex(0);
      setLightboxIndex(0);
    }
  }, [isOpen, product?.id, enableDeepLink]);

  // v6.0: Handle browser back button to close modal
  useEffect(() => {
    if (!enableDeepLink || !isOpen) return;

    const handlePopState = () => {
      onClose();
    };

    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, [isOpen, enableDeepLink, onClose]);

  // v9.0: Tek tutarlı kapatma fonksiyonu
  const handleClose = useCallback(() => {
    if (enableDeepLink) {
      const currentUrl = new URL(window.location.href);
      if (currentUrl.searchParams.has("id")) {
        currentUrl.searchParams.delete("id");
        window.history.replaceState(null, "", currentUrl.toString());
      }
    }
    didPushStateRef.current = false;
    setLightboxOpen(false);
    onClose();
  }, [enableDeepLink, onClose]);

  if (!product) return null;

  // Build allImages array for lightbox
  const allImages: Array<{ url: string; key: string }> = product.images && product.images.length > 0
    ? product.images
    : product.imageUrl
      ? [{ url: product.imageUrl, key: "main" }]
      : [];

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
    <>
      <Dialog open={isOpen} onOpenChange={(open) => !open && handleClose()}>
        {/* v6.0: Product JSON-LD Schema for SEO */}
        {isOpen && product && (
          <ProductSchema
            name={product.title}
            description={product.description}
            image={product.images?.[0]?.url || product.imageUrl}
            category={categoryLabel}
            url={getShareUrl()}
          />
        )}
        <DialogContent
          aria-describedby={undefined}
          className="max-w-3xl max-h-[95vh] overflow-y-auto p-0 gap-0"
          showCloseButton={false}
          style={{ fontSize: '1.25rem' }}  /* v11.0: %80 ölçeklemeyi dengele — modal içi 100% boyut */
        >
          {/* v9.0: Tek kapatma butonu — Radix built-in kaldırıldı */}
          {/* v11.0: Kapatma butonu — mobil erişilebilirlik için büyütüldü */}
          <Button
            variant="ghost"
            size="icon"
            onClick={handleClose}
            className="absolute top-3 right-3 z-50 rounded-full bg-background/95 hover:bg-muted shadow-md w-14 h-14 border border-border"
            aria-label="Kapat"
          >
            <X className="w-7 h-7" />
          </Button>

          {/* Header */}
          <DialogHeader className="sticky top-0 z-10 bg-background border-b border-border px-6 py-4">
            <div className="flex items-start justify-between gap-4 pr-12">
              <div className="flex-1 min-w-0">
                <div className="flex flex-wrap gap-2 mb-2">
                  <Badge
                    className={`text-sm ${product.category === "mobilya"
                      ? "bg-[#FFD300] text-[#2F2F2F] hover:bg-[#FFD300]"
                      : "bg-[#2F2F2F] text-white hover:bg-[#2F2F2F]"
                      }`}
                  >
                    {categoryLabel}
                  </Badge>
                  {subCategoryLabel && (
                    <Badge
                      variant="outline"
                      className="text-sm bg-background text-foreground border-foreground/20"
                    >
                      {subCategoryLabel}
                    </Badge>
                  )}
                </div>
                {/* v11.0: Başlık büyütüldü */}
                <DialogTitle className="text-2xl md:text-3xl font-bold text-foreground">
                  {product.title}
                </DialogTitle>
              </div>
              <div className="flex items-center gap-2">
                {/* v11.0: Paylaş butonu — mobil erişilebilirlik için büyütüldü */}
                <Button
                  variant="ghost"
                  size="icon"
                  className="w-12 h-12 rounded-full"
                  onClick={handleShare}
                  aria-label="Paylaş"
                >
                  {copied ? (
                    <Check className="w-6 h-6 text-green-500" />
                  ) : (
                    <Share2 className="w-6 h-6" />
                  )}
                </Button>
              </div>
            </div>
          </DialogHeader>

          {/* Content */}
          <div className="px-6 py-6">
            {/* v9.0: Image Carousel — sarmalayan zoom div KALDIRILDI, zoom butonu Carousel içinde */}
            <div className="mb-6">
              <ImageCarousel
                images={product.images}
                fallbackImage={product.imageUrl}
                title={product.title}
                showThumbnails={true}
                currentIndex={carouselIndex}
                onIndexChange={setCarouselIndex}
                onZoomClick={(index) => {
                  setLightboxIndex(index);
                  setLightboxOpen(true);
                }}
              />
            </div>

            {/* v8.0: Product Video */}
            {(product as any).videoUrl && (
              <div className="mb-6 rounded-xl overflow-hidden bg-black aspect-video flex items-center justify-center">
                <video
                  src={(product as any).videoUrl}
                  controls
                  className="w-full h-full object-contain"
                  preload="metadata"
                >
                  Tarayıcınız video etiketini desteklemiyor.
                </video>
              </div>
            )}

            {/* Description */}
            {product.description && (
              <div className="mb-6">
                <h3 className="text-xl font-semibold text-foreground mb-3">Ürün Açıklaması</h3>
                <div className="text-muted-foreground text-lg leading-relaxed">
                  {formatDescription(product.description)}
                </div>
              </div>
            )}

            {/* Store Info */}
            <div className="bg-muted/50 rounded-xl p-5 mb-6">
              <h3 className="text-lg font-semibold text-foreground mb-4">Mağaza Bilgileri</h3>
              <div className="space-y-3">
                <div className="flex items-center gap-3 text-muted-foreground">
                  <div className="w-10 h-10 rounded-full bg-[#FFD300]/20 flex items-center justify-center">
                    <MapPin className="w-5 h-5 text-[#FFD300]" />
                  </div>
                  <div>
                    <p className="font-medium text-foreground">Kadıköy Fikirtepe</p>
                    <p className="text-sm">Özbey caddesi no 59, 34773 Fikirtepe Kadıköy/İstanbul</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 text-muted-foreground">
                  <div className="w-10 h-10 rounded-full bg-[#FFD300]/20 flex items-center justify-center">
                    <Clock className="w-5 h-5 text-[#FFD300]" />
                  </div>
                  <div>
                    <p className="font-medium text-foreground">Çalışma Saatleri</p>
                    <p className="text-sm">Haftanın 7 Günü: 09:00 - 19:00</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 text-muted-foreground">
                  <div className="w-10 h-10 rounded-full bg-[#25D366]/20 flex items-center justify-center">
                    <Phone className="w-5 h-5 text-[#25D366]" />
                  </div>
                  <div>
                    <p className="font-medium text-foreground">Telefon</p>
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

          {/* v10.0: Benzer Ürünler */}
          {relatedProducts.data && relatedProducts.data.length > 0 && (
            <div className="border-t border-border px-6 py-5">
              <h3 className="text-base font-bold text-foreground mb-3">Benzer Ürünler</h3>
              <div className="grid grid-cols-3 gap-3">
                {relatedProducts.data.map((rp: any) => {
                  const rpImage = rp.images
                    ? (typeof rp.images === 'string' ? JSON.parse(rp.images) : rp.images)?.[0]?.url
                    : rp.imageUrl;
                  return (
                    <button
                      key={rp.id}
                      onClick={() => {
                        if (onSelectProduct) {
                          onSelectProduct(rp);
                        }
                      }}
                      className="group text-left rounded-xl overflow-hidden border border-border/50 hover:border-[#FFD300]/50 hover:shadow-md transition-all"
                    >
                      <div className="aspect-square bg-muted overflow-hidden">
                        {rpImage ? (
                          <img
                            src={rpImage}
                            alt={rp.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                            loading="lazy"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-muted-foreground text-2xl">📦</div>
                        )}
                      </div>
                      <div className="p-2">
                        <p className="text-xs font-medium text-foreground line-clamp-2 leading-tight">{rp.title}</p>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Footer Note */}
          <div className="border-t border-border px-6 py-4 bg-muted/50">
            <p className="text-sm text-muted-foreground text-center">
              Ürünü yerinde görmek için randevu alabilirsiniz. Aynı gün teslimat ve ücretsiz nakliye hizmeti sunuyoruz.
            </p>
          </div>
        </DialogContent>
      </Dialog>

      {/* v9.0: Full-screen Lightbox — senkronize index ile */}
      <ProductLightbox
        images={allImages}
        initialIndex={lightboxIndex}
        isOpen={lightboxOpen}
        onClose={() => setLightboxOpen(false)}
        onIndexChange={(index) => {
          setCarouselIndex(index);
          setLightboxIndex(index);
        }}
        title={product.title}
      />
    </>
  );
}

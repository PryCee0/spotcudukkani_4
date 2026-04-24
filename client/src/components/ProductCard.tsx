import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MessageCircle, ImageOff, Images, Eye, Play } from "lucide-react";
import ProductDetailModal from "./ProductDetailModal";

const PHONE_NUMBER = "+905393160007";

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

interface ProductCardProps {
  id: number;
  title: string;
  description?: string | null;
  imageUrl?: string | null;
  images?: ProductImage[] | null;
  category: "mobilya" | "beyaz_esya";
  subCategory?: string | null;
  videoUrl?: string | null;
}

export default function ProductCard({
  id,
  title,
  description,
  imageUrl,
  images,
  category,
  subCategory,
  videoUrl
}: ProductCardProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const whatsappMessage = encodeURIComponent(
    `Merhaba, "${title}" hakkında fiyat ve bilgi almak istiyorum.`
  );
  const whatsappLink = `https://wa.me/${PHONE_NUMBER}?text=${whatsappMessage}`;

  const categoryLabel = category === "mobilya" ? "Mobilya" : "Beyaz Eşya";
  const subCategoryLabel = subCategory ? SUB_CATEGORY_LABELS[subCategory] : null;

  // Get display image (first from images array or fallback to imageUrl)
  const displayImage = images && images.length > 0 ? images[0].url : imageUrl;

  // Get image count
  const imageCount = images && images.length > 0 ? images.length : (imageUrl ? 1 : 0);

  // Product data for modal
  const productData = {
    id,
    title,
    description,
    category,
    subCategory,
    imageUrl,
    images,
    videoUrl,
  };

  return (
    <>
      <Card className="group overflow-hidden bg-card border-none shadow-lg hover:shadow-xl transition-all duration-300">
        {/* Product Image - Clickable to open modal */}
        <div
          className="relative aspect-[4/3] overflow-hidden bg-muted cursor-pointer"
          onClick={() => setIsModalOpen(true)}
          onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setIsModalOpen(true); } }}
          role="button"
          tabIndex={0}
          aria-label={`${title} ürün detaylarını görüntüle`}
        >
          {displayImage ? (
            <img
              src={displayImage}
              alt={`${title} - Spotçu Dükkanı İstanbul ikinci el ${categoryLabel}`}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              loading="lazy"
              decoding="async"
              width={800}
              height={600}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-muted">
              <ImageOff className="w-14 h-14 lg:w-16 lg:h-16 text-muted-foreground/30" />
            </div>
          )}

          {/* Badges */}
          <div className="absolute top-4 left-4 flex flex-wrap gap-2">
            <Badge
              className={`text-sm lg:text-base px-3 lg:px-4 py-1.5 ${category === "mobilya"
                  ? "bg-[#FFD300] text-[#2F2F2F] hover:bg-[#FFD300]"
                  : "bg-[#2F2F2F] text-white hover:bg-[#2F2F2F]"
                }`}
            >
              {categoryLabel}
            </Badge>
            {subCategoryLabel && (
              <Badge
                variant="outline"
                className="text-sm px-3 py-1.5 bg-card/90 text-foreground border-border"
              >
                {subCategoryLabel}
              </Badge>
            )}
          </div>

          {/* Image count indicator */}
          {imageCount > 1 && (
            <div className="absolute bottom-3 right-3 bg-black/70 text-white text-xs px-2.5 py-1 rounded-full flex items-center gap-1.5">
              <Images className="w-3.5 h-3.5" />
              <span>{imageCount}</span>
            </div>
          )}

          {/* Video indicator */}
          {videoUrl && (
            <div className="absolute bottom-3 left-3 bg-black/70 text-white text-xs px-2.5 py-1 rounded-full flex items-center gap-1.5">
              <Play className="w-3.5 h-3.5" fill="currentColor" />
              <span>Video</span>
            </div>
          )}

          {/* View details overlay on hover */}
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors duration-300 flex items-center justify-center">
            <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-card rounded-full p-3 shadow-lg">
              <Eye className="w-6 h-6 text-foreground" />
            </div>
          </div>
        </div>

        {/* Product Info */}
        <CardContent className="p-5 lg:p-6">
          <h3
            className="text-lg lg:text-xl font-bold text-foreground mb-2 lg:mb-3 line-clamp-1 group-hover:text-[#FFD300] transition-colors cursor-pointer"
            onClick={() => setIsModalOpen(true)}
          >
            {title}
          </h3>
          {description && (
            <p className="text-base lg:text-lg text-muted-foreground mb-4 lg:mb-5 line-clamp-2 leading-relaxed">
              {description}
            </p>
          )}

          {/* Action Buttons */}
          <div className="flex gap-2">
            <Button
              variant="outline"
              className="flex-1 border-2 border-border hover:border-[#FFD300] hover:bg-[#FFD300]/5 text-foreground gap-2 text-base py-3 h-auto"
              onClick={() => setIsModalOpen(true)}
            >
              <Eye className="w-4 h-4" />
              Detay
            </Button>
            <a href={whatsappLink} target="_blank" rel="noopener noreferrer" className="flex-1">
              <Button className="w-full bg-[#25D366] hover:bg-[#128C7E] text-white gap-2 text-base py-3 h-auto font-semibold">
                <MessageCircle className="w-5 h-5" />
                Bilgi Al
              </Button>
            </a>
          </div>
        </CardContent>
      </Card>

      {/* Product Detail Modal with deep linking support */}
      <ProductDetailModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        product={productData}
        enableDeepLink={true}
      />
    </>
  );
}

import { useState, useCallback, useEffect, useRef } from "react";
import { ChevronLeft, ChevronRight, ImageOff, ZoomIn, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface ProductImage {
  url: string;
  key: string;
}

interface ImageCarouselProps {
  images: ProductImage[] | null | undefined;
  fallbackImage?: string | null;
  title: string;
  className?: string;
  showThumbnails?: boolean;
  autoPlay?: boolean;
  autoPlayInterval?: number;
  /** v9.0: Dışarıdan index kontrolü — Lightbox ile senkronizasyon */
  currentIndex?: number;
  onIndexChange?: (index: number) => void;
  /** v9.0: Zoom butonuna tıklandığında tetiklenir */
  onZoomClick?: (index: number) => void;
}

// v5.0: Lazy loading image component
function LazyImage({
  src,
  alt,
  className,
  onLoad,
}: {
  src: string;
  alt: string;
  className?: string;
  onLoad?: () => void;
}) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);

  return (
    <div className="relative w-full h-full">
      {!isLoaded && !hasError && (
        <div className="absolute inset-0 flex items-center justify-center bg-[#F9F8F4] dark:bg-[#1a1a1a]">
          <Loader2 className="w-8 h-8 animate-spin text-[#FFD300]" />
        </div>
      )}
      {hasError ? (
        <div className="absolute inset-0 flex items-center justify-center bg-[#F9F8F4] dark:bg-[#1a1a1a]">
          <ImageOff className="w-12 h-12 text-[#2F2F2F]/20" />
        </div>
      ) : (
        <img
          src={src}
          alt={alt}
          className={cn(
            className,
            "transition-opacity duration-300",
            isLoaded ? "opacity-100" : "opacity-0"
          )}
          loading="lazy"
          decoding="async"
          onLoad={() => {
            setIsLoaded(true);
            onLoad?.();
          }}
          onError={() => setHasError(true)}
        />
      )}
    </div>
  );
}

export default function ImageCarousel({
  images,
  fallbackImage,
  title,
  className,
  showThumbnails = true,
  autoPlay = false,
  autoPlayInterval = 5000,
  currentIndex: controlledIndex,
  onIndexChange,
  onZoomClick,
}: ImageCarouselProps) {
  const [internalIndex, setInternalIndex] = useState(0);
  // v9.0: Controlled/uncontrolled pattern — Lightbox senkronizasyonu
  const currentIndex = controlledIndex ?? internalIndex;
  const setCurrentIndex = useCallback((indexOrFn: number | ((prev: number) => number)) => {
    const newIndex = typeof indexOrFn === "function" ? indexOrFn(currentIndex) : indexOrFn;
    setInternalIndex(newIndex);
    onIndexChange?.(newIndex);
  }, [currentIndex, onIndexChange]);

  // v8.0: Use refs for touch tracking to avoid re-renders during swipe
  const touchStartRef = useRef<number | null>(null);
  const touchEndRef = useRef<number | null>(null);
  const isDraggingRef = useRef(false);
  const sliderRef = useRef<HTMLDivElement>(null);
  const isTransitioning = useRef(false);

  // Build image array from images or fallback
  const imageList: string[] = [];
  if (images && Array.isArray(images) && images.length > 0) {
    images.forEach((img) => imageList.push(img.url));
  } else if (fallbackImage) {
    imageList.push(fallbackImage);
  }

  const hasMultipleImages = imageList.length > 1;

  // Navigation functions with transition guard
  const goToNext = useCallback(() => {
    if (imageList.length === 0 || isTransitioning.current) return;
    isTransitioning.current = true;
    setCurrentIndex((prev) => (prev + 1) % imageList.length);
    setTimeout(() => { isTransitioning.current = false; }, 200);
  }, [imageList.length, setCurrentIndex]);

  const goToPrev = useCallback(() => {
    if (imageList.length === 0 || isTransitioning.current) return;
    isTransitioning.current = true;
    setCurrentIndex((prev) => (prev - 1 + imageList.length) % imageList.length);
    setTimeout(() => { isTransitioning.current = false; }, 200);
  }, [imageList.length, setCurrentIndex]);

  const goToIndex = useCallback((index: number) => {
    if (isTransitioning.current) return;
    isTransitioning.current = true;
    setCurrentIndex(index);
    setTimeout(() => { isTransitioning.current = false; }, 200);
  }, [setCurrentIndex]);

  // Auto-play functionality
  useEffect(() => {
    if (!autoPlay || !hasMultipleImages) return;
    const interval = setInterval(goToNext, autoPlayInterval);
    return () => clearInterval(interval);
  }, [autoPlay, autoPlayInterval, goToNext, hasMultipleImages]);

  // v11.0: Touch swipe — basitleştirildi (layout thrashing kaldırıldı)
  const minSwipeDistance = 40;

  const onTouchStart = useCallback((e: React.TouchEvent) => {
    touchEndRef.current = null;
    touchStartRef.current = e.targetTouches[0].clientX;
    isDraggingRef.current = true;
  }, []);

  const onTouchMove = useCallback((e: React.TouchEvent) => {
    if (!isDraggingRef.current || touchStartRef.current === null) return;
    touchEndRef.current = e.targetTouches[0].clientX;
  }, []);

  const onTouchEnd = useCallback(() => {
    isDraggingRef.current = false;

    if (touchStartRef.current === null || touchEndRef.current === null) return;

    const distance = touchStartRef.current - touchEndRef.current;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;

    if (isLeftSwipe) {
      goToNext();
    } else if (isRightSwipe) {
      goToPrev();
    }
    touchStartRef.current = null;
    touchEndRef.current = null;
  }, [goToNext, goToPrev]);

  // No images state
  if (imageList.length === 0) {
    return (
      <div className={cn("relative bg-[#F9F8F4] dark:bg-[#1a1a1a] rounded-xl overflow-hidden", className)}>
        <div className="aspect-[4/3] flex items-center justify-center">
          <div className="text-center text-[#2F2F2F]/30">
            <ImageOff className="w-16 h-16 mx-auto mb-2" />
            <p className="text-sm">Fotoğraf yok</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Main Carousel */}
      <div className={cn("relative bg-[#F9F8F4] dark:bg-[#1a1a1a] rounded-xl overflow-hidden", className)}>
        {/* Main Image */}
        <div
          className="relative aspect-[4/3] select-none"
          style={{ touchAction: "pan-y" }}
          onTouchStart={onTouchStart}
          onTouchMove={onTouchMove}
          onTouchEnd={onTouchEnd}
        >
          <div
            ref={sliderRef}
            style={{
              willChange: "transform",
              transform: "translate3d(0px, 0, 0)",
            }}
            className="w-full h-full"
          >
            <LazyImage
              src={imageList[currentIndex]}
              alt={`${title} - Spotçu Dükkanı İstanbul ikinci el eşya fotoğraf ${currentIndex + 1}`}
              className="w-full h-full object-cover"
            />
          </div>

          {/* v11.0: Zoom butonu — büyütüldü */}
          {onZoomClick && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onZoomClick(currentIndex);
              }}
              className="absolute top-3 right-3 z-20 w-14 h-14 rounded-full bg-black/50 hover:bg-black/70 flex items-center justify-center text-white transition-colors backdrop-blur-sm"
              aria-label="Tam ekran görüntüle"
            >
              <ZoomIn className="w-7 h-7 pointer-events-none" />
            </button>
          )}

          {/* Image counter */}
          {hasMultipleImages && (
            <div className="absolute bottom-3 left-3 bg-black/60 text-white text-sm px-3 py-1 rounded-full">
              {currentIndex + 1} / {imageList.length}
            </div>
          )}
        </div>

        {/* v9.0: Navigasyon Okları — HER ZAMAN GÖRÜNÜR (mobil uyumlu) */}
        {hasMultipleImages && (
          <>
            <Button
              variant="ghost"
              size="icon"
              className="absolute left-2 top-1/2 -translate-y-1/2 w-14 h-14 rounded-full bg-white/90 hover:bg-white shadow-md text-[#2F2F2F] z-40"
              onClick={(e) => {
                e.stopPropagation();
                goToPrev();
              }}
              onTouchStart={(e) => e.stopPropagation()}
              aria-label="Önceki fotoğraf"
            >
              <ChevronLeft className="w-7 h-7 pointer-events-none" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-2 top-1/2 -translate-y-1/2 w-14 h-14 rounded-full bg-white/90 hover:bg-white shadow-md text-[#2F2F2F] z-40"
              onClick={(e) => {
                e.stopPropagation();
                goToNext();
              }}
              onTouchStart={(e) => e.stopPropagation()}
              aria-label="Sonraki fotoğraf"
            >
              <ChevronRight className="w-7 h-7 pointer-events-none" />
            </Button>
          </>
        )}

        {/* Dot indicators */}
        {hasMultipleImages && (
          <div className="absolute bottom-3 right-3 flex gap-1.5">
            {imageList.map((_, index) => (
              <button
                key={index}
                onClick={(e) => {
                  e.stopPropagation();
                  goToIndex(index);
                }}
                className={cn(
                  "w-2 h-2 rounded-full transition-all",
                  index === currentIndex
                    ? "bg-[#FFD300] w-4"
                    : "bg-white/70 hover:bg-white"
                )}
                aria-label={`Fotoğraf ${index + 1}`}
              />
            ))}
          </div>
        )}
      </div>

      {/* Thumbnails with lazy loading */}
      {showThumbnails && hasMultipleImages && (
        <div className="flex gap-2 mt-3 overflow-x-auto pb-2">
          {imageList.map((url, index) => (
            <button
              key={index}
              onClick={() => goToIndex(index)}
              className={cn(
                "flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 transition-all",
                index === currentIndex
                  ? "border-[#FFD300] ring-2 ring-[#FFD300]/30"
                  : "border-transparent hover:border-[#2F2F2F]/30"
              )}
            >
              <img
                src={url}
                alt={`${title} - Spotçu Dükkanı küçük resim ${index + 1}`}
                className="w-full h-full object-cover"
                loading="lazy"
                decoding="async"
              />
            </button>
          ))}
        </div>
      )}

      {/* v9.0: Dahili fullscreen modu KALDIRILDI — tüm fullscreen sorumluluğu ProductLightbox'a devredildi */}
    </>
  );
}

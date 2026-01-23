import { useState, useCallback, useEffect } from "react";
import { ChevronLeft, ChevronRight, ImageOff, X, ZoomIn, Loader2 } from "lucide-react";
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
        <div className="absolute inset-0 flex items-center justify-center bg-[#F9F8F4]">
          <Loader2 className="w-8 h-8 animate-spin text-[#FFD300]" />
        </div>
      )}
      {hasError ? (
        <div className="absolute inset-0 flex items-center justify-center bg-[#F9F8F4]">
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
}: ImageCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);
  const [preloadedImages, setPreloadedImages] = useState<Set<number>>(new Set([0]));

  // Build image array from images or fallback
  const imageList: string[] = [];
  if (images && Array.isArray(images) && images.length > 0) {
    images.forEach((img) => imageList.push(img.url));
  } else if (fallbackImage) {
    imageList.push(fallbackImage);
  }

  const hasMultipleImages = imageList.length > 1;

  // v5.0: Preload adjacent images
  useEffect(() => {
    if (imageList.length <= 1) return;

    const toPreload = new Set(preloadedImages);
    const prevIndex = (currentIndex - 1 + imageList.length) % imageList.length;
    const nextIndex = (currentIndex + 1) % imageList.length;
    
    toPreload.add(prevIndex);
    toPreload.add(nextIndex);
    
    setPreloadedImages(toPreload);
  }, [currentIndex, imageList.length]);

  // Navigation functions
  const goToNext = useCallback(() => {
    if (imageList.length === 0) return;
    setCurrentIndex((prev) => (prev + 1) % imageList.length);
  }, [imageList.length]);

  const goToPrev = useCallback(() => {
    if (imageList.length === 0) return;
    setCurrentIndex((prev) => (prev - 1 + imageList.length) % imageList.length);
  }, [imageList.length]);

  const goToIndex = (index: number) => {
    setCurrentIndex(index);
  };

  // Auto-play functionality
  useEffect(() => {
    if (!autoPlay || !hasMultipleImages) return;

    const interval = setInterval(goToNext, autoPlayInterval);
    return () => clearInterval(interval);
  }, [autoPlay, autoPlayInterval, goToNext, hasMultipleImages]);

  // Keyboard navigation
  useEffect(() => {
    if (!isFullscreen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") goToPrev();
      if (e.key === "ArrowRight") goToNext();
      if (e.key === "Escape") setIsFullscreen(false);
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isFullscreen, goToNext, goToPrev]);

  // Touch swipe handling
  const minSwipeDistance = 50;

  const onTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const onTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;

    if (isLeftSwipe) {
      goToNext();
    } else if (isRightSwipe) {
      goToPrev();
    }
  };

  // No images state
  if (imageList.length === 0) {
    return (
      <div className={cn("relative bg-[#F9F8F4] rounded-xl overflow-hidden", className)}>
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
      <div className={cn("relative bg-[#F9F8F4] rounded-xl overflow-hidden", className)}>
        {/* Main Image */}
        <div
          className="relative aspect-[4/3] cursor-pointer group"
          onTouchStart={onTouchStart}
          onTouchMove={onTouchMove}
          onTouchEnd={onTouchEnd}
          onClick={() => setIsFullscreen(true)}
        >
          <LazyImage
            src={imageList[currentIndex]}
            alt={`${title} - Fotoğraf ${currentIndex + 1}`}
            className="w-full h-full object-cover transition-transform duration-300"
          />
          
          {/* Zoom indicator */}
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors flex items-center justify-center pointer-events-none">
            <div className="opacity-0 group-hover:opacity-100 transition-opacity bg-white/90 rounded-full p-3 shadow-lg">
              <ZoomIn className="w-6 h-6 text-[#2F2F2F]" />
            </div>
          </div>

          {/* Image counter */}
          {hasMultipleImages && (
            <div className="absolute bottom-3 left-3 bg-black/60 text-white text-sm px-3 py-1 rounded-full">
              {currentIndex + 1} / {imageList.length}
            </div>
          )}
        </div>

        {/* Navigation Arrows */}
        {hasMultipleImages && (
          <>
            <Button
              variant="ghost"
              size="icon"
              className="absolute left-2 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/90 hover:bg-white shadow-md text-[#2F2F2F]"
              onClick={(e) => {
                e.stopPropagation();
                goToPrev();
              }}
              aria-label="Önceki fotoğraf"
            >
              <ChevronLeft className="w-6 h-6" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/90 hover:bg-white shadow-md text-[#2F2F2F]"
              onClick={(e) => {
                e.stopPropagation();
                goToNext();
              }}
              aria-label="Sonraki fotoğraf"
            >
              <ChevronRight className="w-6 h-6" />
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
                alt={`${title} - Küçük resim ${index + 1}`}
                className="w-full h-full object-cover"
                loading="lazy"
              />
            </button>
          ))}
        </div>
      )}

      {/* Fullscreen Modal */}
      {isFullscreen && (
        <div 
          className="fixed inset-0 z-[100] bg-black/95 flex items-center justify-center"
          onClick={() => setIsFullscreen(false)}
        >
          {/* Close button */}
          <Button
            variant="ghost"
            size="icon"
            className="absolute top-4 right-4 w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 text-white z-10"
            onClick={() => setIsFullscreen(false)}
            aria-label="Kapat"
          >
            <X className="w-6 h-6" />
          </Button>

          {/* Image counter */}
          {hasMultipleImages && (
            <div className="absolute top-4 left-4 text-white text-lg font-medium">
              {currentIndex + 1} / {imageList.length}
            </div>
          )}

          {/* Main image */}
          <div 
            className="relative max-w-[90vw] max-h-[90vh]"
            onClick={(e) => e.stopPropagation()}
            onTouchStart={onTouchStart}
            onTouchMove={onTouchMove}
            onTouchEnd={onTouchEnd}
          >
            <img
              src={imageList[currentIndex]}
              alt={`${title} - Fotoğraf ${currentIndex + 1}`}
              className="max-w-full max-h-[90vh] object-contain"
            />
          </div>

          {/* Navigation Arrows */}
          {hasMultipleImages && (
            <>
              <Button
                variant="ghost"
                size="icon"
                className="absolute left-4 top-1/2 -translate-y-1/2 w-14 h-14 rounded-full bg-white/10 hover:bg-white/20 text-white"
                onClick={(e) => {
                  e.stopPropagation();
                  goToPrev();
                }}
                aria-label="Önceki fotoğraf"
              >
                <ChevronLeft className="w-8 h-8" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="absolute right-4 top-1/2 -translate-y-1/2 w-14 h-14 rounded-full bg-white/10 hover:bg-white/20 text-white"
                onClick={(e) => {
                  e.stopPropagation();
                  goToNext();
                }}
                aria-label="Sonraki fotoğraf"
              >
                <ChevronRight className="w-8 h-8" />
              </Button>
            </>
          )}

          {/* Thumbnail strip at bottom */}
          {hasMultipleImages && (
            <div 
              className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 p-2 bg-black/50 rounded-xl max-w-[90vw] overflow-x-auto"
              onClick={(e) => e.stopPropagation()}
            >
              {imageList.map((url, index) => (
                <button
                  key={index}
                  onClick={() => goToIndex(index)}
                  className={cn(
                    "flex-shrink-0 w-14 h-14 rounded-lg overflow-hidden border-2 transition-all",
                    index === currentIndex
                      ? "border-[#FFD300]"
                      : "border-transparent opacity-60 hover:opacity-100"
                  )}
                >
                  <img
                    src={url}
                    alt={`${title} - Küçük resim ${index + 1}`}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      {/* v5.0: Preload adjacent images */}
      <div className="hidden">
        {imageList.map((url, index) => 
          preloadedImages.has(index) && index !== currentIndex ? (
            <link key={index} rel="preload" as="image" href={url} />
          ) : null
        )}
      </div>
    </>
  );
}

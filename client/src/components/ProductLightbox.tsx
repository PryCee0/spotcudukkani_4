import { useState, useCallback, useEffect, useRef, memo } from "react";
import { X, ChevronLeft, ChevronRight, ZoomIn, ZoomOut, Loader2 } from "lucide-react";

/**
 * v11.0: BAŞTAN YENİDEN YAZILDI
 * 
 * Çözülen sorunlar:
 * - Mobilde sağ/sol butonları ve kapatma butonu çalışmıyordu
 * - Pointer + Touch event çakışması kaldırıldı
 * - Lightbox açıldıktan sonra site afallamış çalışıyordu (memory leak)
 * - Görsel yükleme çok uzun sürüyordu (preloading eklendi)
 * - Butonlar çok küçüktü (mobil erişilebilirlik artırıldı)
 * 
 * Yeni yaklaşım:
 * - Sadece Touch event'leri (mobil) + onClick (desktop) — pointer event yok
 * - Komşu görselleri prefetch ile önyükleme
 * - useEffect cleanup garantili — body overflow her zaman reset
 * - Butonlar izole z-index + pointer-events: auto
 */

interface ProductLightboxProps {
    images: Array<{ url: string; key: string }>;
    initialIndex?: number;
    isOpen: boolean;
    onClose: () => void;
    onIndexChange?: (index: number) => void;
    title?: string;
}

function ProductLightbox({
    images,
    initialIndex = 0,
    isOpen,
    onClose,
    onIndexChange,
    title = "Ürün",
}: ProductLightboxProps) {
    const [currentIndex, setCurrentIndex] = useState(initialIndex);
    const [isZoomed, setIsZoomed] = useState(false);
    const [imageLoaded, setImageLoaded] = useState(false);

    // Touch swipe refs — sadece ref kullanarak sıfır re-render
    const touchStartX = useRef(0);
    const touchStartY = useRef(0);
    const isSwiping = useRef(false);

    // Reset when opening or initialIndex changes
    useEffect(() => {
        if (isOpen) {
            setCurrentIndex(initialIndex);
            setIsZoomed(false);
            setImageLoaded(false);
        }
    }, [isOpen, initialIndex]);

    // Lock body scroll — cleanup GARANTILI
    useEffect(() => {
        if (!isOpen) return;
        
        const originalOverflow = document.body.style.overflow;
        const originalTouchAction = document.body.style.touchAction;
        document.body.style.overflow = "hidden";
        document.body.style.touchAction = "none";
        
        return () => {
            document.body.style.overflow = originalOverflow;
            document.body.style.touchAction = originalTouchAction;
        };
    }, [isOpen]);

    // Preload komşu görselleri
    useEffect(() => {
        if (!isOpen || images.length <= 1) return;

        const preloadIndexes = [
            (currentIndex + 1) % images.length,
            (currentIndex - 1 + images.length) % images.length,
        ];

        preloadIndexes.forEach(idx => {
            const img = new Image();
            img.src = images[idx]?.url || "";
        });
    }, [isOpen, currentIndex, images]);

    const updateIndex = useCallback((newIndex: number) => {
        setCurrentIndex(newIndex);
        setIsZoomed(false);
        setImageLoaded(false);
        onIndexChange?.(newIndex);
    }, [onIndexChange]);

    const goNext = useCallback(() => {
        if (images.length <= 1) return;
        updateIndex((currentIndex + 1) % images.length);
    }, [images.length, currentIndex, updateIndex]);

    const goPrev = useCallback(() => {
        if (images.length <= 1) return;
        updateIndex((currentIndex - 1 + images.length) % images.length);
    }, [images.length, currentIndex, updateIndex]);

    const toggleZoom = useCallback(() => {
        setIsZoomed(prev => !prev);
    }, []);

    const handleClose = useCallback(() => {
        setIsZoomed(false);
        setImageLoaded(false);
        onClose();
    }, [onClose]);

    // Keyboard navigation
    useEffect(() => {
        if (!isOpen) return;

        const handleKeyDown = (e: KeyboardEvent) => {
            switch (e.key) {
                case "ArrowRight":
                    e.preventDefault();
                    goNext();
                    break;
                case "ArrowLeft":
                    e.preventDefault();
                    goPrev();
                    break;
                case "Escape":
                    e.preventDefault();
                    handleClose();
                    break;
            }
        };

        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [isOpen, goNext, goPrev, handleClose]);

    // Touch handlers — basit swipe, pointer event yok
    const onTouchStart = useCallback((e: React.TouchEvent) => {
        if (isZoomed) return;
        touchStartX.current = e.touches[0].clientX;
        touchStartY.current = e.touches[0].clientY;
        isSwiping.current = true;
    }, [isZoomed]);

    const onTouchEnd = useCallback((e: React.TouchEvent) => {
        if (!isSwiping.current || isZoomed) return;
        isSwiping.current = false;

        const touchEndX = e.changedTouches[0].clientX;
        const touchEndY = e.changedTouches[0].clientY;
        const diffX = touchStartX.current - touchEndX;
        const diffY = Math.abs(touchStartY.current - touchEndY);

        // Yatay swipe threshold: 50px, dikey hareket çok büyük değilse
        if (Math.abs(diffX) > 50 && diffY < 100) {
            if (diffX > 0) goNext();
            else goPrev();
        }
    }, [isZoomed, goNext, goPrev]);

    if (!isOpen || images.length === 0) return null;

    const currentImage = images[currentIndex];
    if (!currentImage) return null;

    return (
        <div
            className="fixed inset-0 z-[200] bg-black/95 flex flex-col"
            role="dialog"
            aria-label={`${title} - Fotoğraf büyütme`}
        >
            {/* Top Bar — büyütülmüş butonlar (%85 büyütme) */}
            <div className="flex items-center justify-between px-4 md:px-6 py-3 shrink-0 relative z-[220]">
                <div className="flex items-center gap-3 text-white/80">
                    <span className="text-base md:text-lg font-medium">
                        {currentIndex + 1} / {images.length}
                    </span>
                    <span className="text-sm text-white/50 hidden md:block">— {title}</span>
                </div>
                <div className="flex items-center gap-3">
                    <button
                        onClick={toggleZoom}
                        className="w-12 h-12 md:w-14 md:h-14 rounded-full bg-white/15 hover:bg-white/25 active:bg-white/35 flex items-center justify-center transition-colors"
                        style={{ pointerEvents: 'auto' }}
                        aria-label={isZoomed ? "Küçült" : "Büyüt"}
                    >
                        {isZoomed ? (
                            <ZoomOut className="w-6 h-6 md:w-7 md:h-7 text-white" />
                        ) : (
                            <ZoomIn className="w-6 h-6 md:w-7 md:h-7 text-white" />
                        )}
                    </button>
                    <button
                        onClick={handleClose}
                        className="w-12 h-12 md:w-14 md:h-14 rounded-full bg-white/15 hover:bg-white/25 active:bg-white/35 flex items-center justify-center transition-colors"
                        style={{ pointerEvents: 'auto' }}
                        aria-label="Kapat"
                    >
                        <X className="w-6 h-6 md:w-7 md:h-7 text-white" />
                    </button>
                </div>
            </div>

            {/* Main Image Area */}
            <div
                className="flex-1 flex items-center justify-center relative overflow-hidden select-none"
                onTouchStart={onTouchStart}
                onTouchEnd={onTouchEnd}
                onClick={(e) => {
                    // Arka plana tıklayınca kapat (butonlar stopPropagation ile korunuyor)
                    if (e.target === e.currentTarget) handleClose();
                }}
            >
                {/* Loading spinner */}
                {!imageLoaded && (
                    <div className="absolute inset-0 flex items-center justify-center z-10">
                        <Loader2 className="w-10 h-10 text-[#FFD300] animate-spin" />
                    </div>
                )}

                <img
                    key={currentImage.url}  // Force re-mount on index change
                    src={currentImage.url}
                    alt={`${title} - Fotoğraf ${currentIndex + 1}`}
                    className={`max-h-[75vh] max-w-[90vw] object-contain transition-all duration-300 ${
                        isZoomed ? "scale-[2] cursor-move" : "scale-100"
                    } ${imageLoaded ? "opacity-100" : "opacity-0"}`}
                    draggable={false}
                    onLoad={() => setImageLoaded(true)}
                    onDoubleClick={toggleZoom}
                />

                {/* Navigasyon Okları — her zaman görünür, izole z-index */}
                {images.length > 1 && (
                    <>
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                goPrev();
                            }}
                            className="absolute left-3 md:left-6 top-1/2 -translate-y-1/2 w-14 h-14 md:w-16 md:h-16 rounded-full bg-white/20 hover:bg-white/35 active:bg-white/50 flex items-center justify-center text-white transition-all z-[220]"
                            style={{ pointerEvents: 'auto' }}
                            aria-label="Önceki fotoğraf"
                        >
                            <ChevronLeft className="w-7 h-7 md:w-8 md:h-8" />
                        </button>
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                goNext();
                            }}
                            className="absolute right-3 md:right-6 top-1/2 -translate-y-1/2 w-14 h-14 md:w-16 md:h-16 rounded-full bg-white/20 hover:bg-white/35 active:bg-white/50 flex items-center justify-center text-white transition-all z-[220]"
                            style={{ pointerEvents: 'auto' }}
                            aria-label="Sonraki fotoğraf"
                        >
                            <ChevronRight className="w-7 h-7 md:w-8 md:h-8" />
                        </button>
                    </>
                )}
            </div>

            {/* Thumbnail Strip */}
            {images.length > 1 && (
                <div className="flex items-center justify-center gap-2 px-4 py-3 overflow-x-auto shrink-0 relative z-[220]">
                    {images.map((img, index) => (
                        <button
                            key={img.key}
                            onClick={() => updateIndex(index)}
                            className={`w-16 h-16 md:w-18 md:h-18 rounded-lg overflow-hidden flex-shrink-0 border-2 transition-all ${index === currentIndex
                                    ? "border-[#FFD300] opacity-100 scale-110"
                                    : "border-transparent opacity-50 hover:opacity-80"
                                }`}
                            aria-label={`Fotoğraf ${index + 1}`}
                        >
                            <img
                                src={img.url}
                                alt={`Küçük resim ${index + 1}`}
                                className="w-full h-full object-cover"
                                loading="lazy"
                            />
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}

export default memo(ProductLightbox);

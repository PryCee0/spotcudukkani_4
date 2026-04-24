import { useState, useCallback, useEffect, useRef, memo } from "react";
import { X, ChevronLeft, ChevronRight, ZoomIn, ZoomOut } from "lucide-react";

/**
 * v9.0: Tamamen yeniden yazıldı.
 * - onIndexChange callback ile dış bileşenle senkronizasyon
 * - Touch swipe desteği
 * - Çift katmanlı lightbox çakışması çözüldü (ImageCarousel'ın fullscreen'i kaldırıldı)
 * - Yön tuşları her zaman görünür ve çalışır
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
    const [scale, setScale] = useState(1);
    const [position, setPosition] = useState({ x: 0, y: 0 });
    const [isDragging, setIsDragging] = useState(false);
    const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

    // Touch swipe refs
    const touchStartRef = useRef<number | null>(null);
    const touchEndRef = useRef<number | null>(null);

    // Reset when opening
    useEffect(() => {
        if (isOpen) {
            setCurrentIndex(initialIndex);
            setScale(1);
            setPosition({ x: 0, y: 0 });
        }
    }, [isOpen, initialIndex]);

    // Lock body scroll when lightbox is open
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = "hidden";
        }
        return () => {
            document.body.style.overflow = "";
        };
    }, [isOpen]);

    const updateIndex = useCallback((newIndex: number) => {
        setCurrentIndex(newIndex);
        setScale(1);
        setPosition({ x: 0, y: 0 });
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
        if (scale > 1) {
            setScale(1);
            setPosition({ x: 0, y: 0 });
        } else {
            setScale(2);
        }
    }, [scale]);

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
                    onClose();
                    break;
                case "+":
                case "=":
                    setScale((s) => Math.min(s + 0.5, 3));
                    break;
                case "-":
                    setScale((s) => {
                        const newScale = Math.max(s - 0.5, 1);
                        if (newScale === 1) setPosition({ x: 0, y: 0 });
                        return newScale;
                    });
                    break;
            }
        };

        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [isOpen, goNext, goPrev, onClose]);

    // Touch swipe support
    const onTouchStart = useCallback((e: React.TouchEvent) => {
        if (scale > 1) return; // Zoom modunda swipe yapma
        touchStartRef.current = e.touches[0].clientX;
        touchEndRef.current = null;
    }, [scale]);

    const onTouchMove = useCallback((e: React.TouchEvent) => {
        if (scale > 1) return;
        touchEndRef.current = e.touches[0].clientX;
    }, [scale]);

    const onTouchEnd = useCallback(() => {
        if (scale > 1) return;
        if (touchStartRef.current === null || touchEndRef.current === null) return;
        const distance = touchStartRef.current - touchEndRef.current;
        const minSwipe = 50;
        if (distance > minSwipe) goNext();
        else if (distance < -minSwipe) goPrev();
        touchStartRef.current = null;
        touchEndRef.current = null;
    }, [scale, goNext, goPrev]);

    // Mouse/touch drag for panning when zoomed
    const handlePointerDown = useCallback(
        (e: React.PointerEvent) => {
            if (scale <= 1) return;
            e.preventDefault();
            setIsDragging(true);
            setDragStart({ x: e.clientX - position.x, y: e.clientY - position.y });
        },
        [scale, position]
    );

    const handlePointerMove = useCallback(
        (e: React.PointerEvent) => {
            if (!isDragging || scale <= 1) return;
            setPosition({
                x: e.clientX - dragStart.x,
                y: e.clientY - dragStart.y,
            });
        },
        [isDragging, scale, dragStart]
    );

    const handlePointerUp = useCallback(() => {
        setIsDragging(false);
    }, []);

    if (!isOpen || images.length === 0) return null;

    const currentImage = images[currentIndex];
    if (!currentImage) return null;

    return (
        <div
            className="fixed inset-0 z-[200] bg-black/95 backdrop-blur-sm flex flex-col"
            onClick={(e) => {
                if (e.target === e.currentTarget) onClose();
            }}
        >
            {/* Top Bar */}
            <div className="flex items-center justify-between px-4 md:px-6 py-3 text-white/80 shrink-0">
                <div className="flex items-center gap-3">
                    <span className="text-sm font-medium">
                        {currentIndex + 1} / {images.length}
                    </span>
                    <span className="text-sm text-white/50 hidden md:block">— {title}</span>
                </div>
                <div className="flex items-center gap-2">
                    <button
                        onClick={toggleZoom}
                        className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"
                        aria-label={scale > 1 ? "Küçült" : "Büyüt"}
                    >
                        {scale > 1 ? (
                            <ZoomOut className="w-5 h-5" />
                        ) : (
                            <ZoomIn className="w-5 h-5" />
                        )}
                    </button>
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            onClose();
                        }}
                        className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"
                        aria-label="Kapat"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>
            </div>

            {/* Main Image Area */}
            <div
                className="flex-1 flex items-center justify-center relative overflow-hidden select-none"
                onPointerDown={handlePointerDown}
                onPointerMove={handlePointerMove}
                onPointerUp={handlePointerUp}
                onPointerLeave={handlePointerUp}
                onTouchStart={onTouchStart}
                onTouchMove={onTouchMove}
                onTouchEnd={onTouchEnd}
                style={{ cursor: scale > 1 ? (isDragging ? "grabbing" : "grab") : "default" }}
            >
                <img
                    src={currentImage.url}
                    alt={`${title} - Fotoğraf ${currentIndex + 1}`}
                    className="max-h-[80vh] max-w-[90vw] object-contain transition-transform duration-200"
                    style={{
                        transform: `scale(${scale}) translate(${position.x / scale}px, ${position.y / scale}px)`,
                    }}
                    draggable={false}
                    onDoubleClick={toggleZoom}
                />

                {/* v9.0: Navigasyon Okları — z-index yükseltildi, her zaman görünür */}
                {images.length > 1 && (
                    <>
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                goPrev();
                            }}
                            onPointerDown={(e) => e.stopPropagation()}
                            onTouchStart={(e) => e.stopPropagation()}
                            className="absolute left-3 md:left-6 top-1/2 -translate-y-1/2 w-12 h-12 md:w-14 md:h-14 rounded-full bg-white/15 hover:bg-white/30 flex items-center justify-center text-white transition-all backdrop-blur-sm z-[210]"
                            aria-label="Önceki fotoğraf"
                        >
                            <ChevronLeft className="w-6 h-6 md:w-7 md:h-7 pointer-events-none" />
                        </button>
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                goNext();
                            }}
                            onPointerDown={(e) => e.stopPropagation()}
                            onTouchStart={(e) => e.stopPropagation()}
                            className="absolute right-3 md:right-6 top-1/2 -translate-y-1/2 w-12 h-12 md:w-14 md:h-14 rounded-full bg-white/15 hover:bg-white/30 flex items-center justify-center text-white transition-all backdrop-blur-sm z-[210]"
                            aria-label="Sonraki fotoğraf"
                        >
                            <ChevronRight className="w-6 h-6 md:w-7 md:h-7 pointer-events-none" />
                        </button>
                    </>
                )}
            </div>

            {/* Thumbnail Strip */}
            {images.length > 1 && (
                <div className="flex items-center justify-center gap-2 px-4 py-3 overflow-x-auto shrink-0">
                    {images.map((img, index) => (
                        <button
                            key={img.key}
                            onClick={(e) => {
                                e.stopPropagation();
                                updateIndex(index);
                            }}
                            className={`w-14 h-14 md:w-16 md:h-16 rounded-lg overflow-hidden flex-shrink-0 border-2 transition-all ${index === currentIndex
                                    ? "border-[#FFD300] opacity-100 scale-105"
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

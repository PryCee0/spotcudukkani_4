import { useState, useEffect, useCallback, useRef, useMemo, memo } from "react";
import { Link } from "wouter";
import { Phone, ChevronLeft, ChevronRight, ChevronDown, BookOpen } from "lucide-react";

const PHONE_NUMBER = "+905393160007";
const FACEBOOK_URL = "https://www.facebook.com/ikincielesyadudullu";

/**
 * v12.2: Mobil App-Tarzı Karşılama Ekranı — Full Revize
 *
 * Değişiklikler v12.1 → v12.2:
 * - Slide: 2.5s auto-slide interval eklendi
 * - Telefon/WhatsApp: Tam yeşil box
 * - Facebook: Tam mavi box
 * - Blog: Kitap ikonlu şık box
 * - "Ücretsiz Ekspertiz": Letter-spacing azaltıldı, box %15-20 kısaltıldı
 * - Sol kart metni: "2.El Spot Eşya Merkezi" → şık yerleşim
 * - Sağ kart metni: Boyut korundu (kullanıcı isteği)
 * - Sol kart fotoğrafı: Yeni interior fotoğraf
 * - Entrance animasyonları: Staggered slide-in (CSS-only)
 */

// Trust stats — 3 slide
const trustSlides = [
  {
    value: "12+",
    label: "Yıllık Deneyim",
    sublabel: "2012'den beri İstanbul'da hizmet",
    bgImage: "/uploads/slider1.webp",
    href: "/hakkimizda",
  },
  {
    value: "10.000+",
    label: "Mutlu Müşteri",
    sublabel: "Güvenilir alım-satım deneyimi",
    bgImage: "/uploads/slider2.webp",
    href: "/blog",
  },
  {
    value: "Tüm İstanbul",
    label: "Her Yerindeyiz",
    sublabel: "Avrupa & Anadolu Yakası",
    bgImage: "/uploads/slider3.webp",
    href: "/iletisim",
  },
];

// ═══════════════════════════════════════════
// BENTO GRID — Sol + Sağ Kartlar
// ═══════════════════════════════════════════

function BentoGrid() {
  const whatsappLink = `https://wa.me/${PHONE_NUMBER}?text=${encodeURIComponent("Merhaba, bilgi almak istiyorum.")}`;

  return (
    <div
      className="grid grid-cols-[3fr_2fr] gap-[2vw] px-[3vw] pt-[2vw]"
      style={{ height: "calc(52dvh)" }}
    >
      {/* ═══ SOL KART — "2.El Spot Eşya Merkezi" ═══ */}
      <div className="relative rounded-[4vw] overflow-hidden hero-box-left">
        <img
          src="/uploads/card-spot-furniture.webp"
          alt="Spot eşya showroom"
          className="absolute inset-0 w-full h-full object-cover"
          loading="lazy"
          decoding="async"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#2A1010]/70 to-[#1a0808]/80" />

        <div className="relative flex flex-col justify-between h-full p-[3.5vw]">
          {/* Başlık — şık dikey yerleşim, %20 büyük */}
          <div>
            <p className="text-[#FFD300] font-semibold tracking-widest uppercase" style={{ fontSize: "clamp(9px, 2.5vw, 12px)" }}>
              Spotçu Dükkanı
            </p>
            <h2 className="text-white font-light leading-tight mt-[1vw]" style={{ fontSize: "clamp(18px, 5.5vw, 26px)" }}>
              2.El Spot
            </h2>
            <h2 className="text-[#FFD300] font-bold leading-tight" style={{ fontSize: "clamp(18px, 5.5vw, 26px)" }}>
              Eşya Merkezi
            </h2>
          </div>

          {/* Butonlar — %15 büyütülmüş */}
          <div className="flex flex-col gap-[2vw] mt-auto">
            <Link href="/urunler/mobilya">
              <div className="relative rounded-[3vw] overflow-hidden group cursor-pointer" style={{ height: "clamp(55px, 9.2vw, 74px)" }}>
                <img
                  src="/uploads/card-mobilya.webp"
                  alt="2.El Mobilya"
                  className="absolute inset-0 w-full h-full object-cover group-active:scale-105 transition-transform duration-300"
                  loading="lazy"
                  decoding="async"
                />
                <div className="absolute inset-0 bg-[#E88A2D]/75 group-active:bg-[#E88A2D]/85 transition-colors" />
                <div className="relative flex items-center justify-center h-full">
                  <span className="text-white font-semibold" style={{ fontSize: "clamp(14px, 4.2vw, 19px)" }}>2.El Mobilya</span>
                </div>
              </div>
            </Link>

            <Link href="/urunler/beyaz-esya">
              <div className="relative rounded-[3vw] overflow-hidden group cursor-pointer" style={{ height: "clamp(55px, 9.2vw, 74px)" }}>
                <img
                  src="/uploads/card-beyaz-esya.webp"
                  alt="2.El Beyaz Eşya"
                  className="absolute inset-0 w-full h-full object-cover group-active:scale-105 transition-transform duration-300"
                  loading="lazy"
                  decoding="async"
                />
                <div className="absolute inset-0 bg-[#D4781A]/75 group-active:bg-[#D4781A]/85 transition-colors" />
                <div className="relative flex items-center justify-center h-full">
                  <span className="text-white font-semibold" style={{ fontSize: "clamp(14px, 4.2vw, 19px)" }}>2.El Beyaz Eşya</span>
                </div>
              </div>
            </Link>
          </div>
        </div>
      </div>

      {/* ═══ SAĞ KOLON — Satış + İletişim ═══ */}
      <div className="flex flex-col gap-[2vw]">
        {/* Üst: Satış Teklifi — %15-20 kısaltıldı (flex-[2.5] → eskiden flex-[3]) */}
        <div className="relative rounded-[4vw] overflow-hidden flex-[2.5] hero-box-right">
          <img
            src="/uploads/card-handshake.webp"
            alt="Eşya satış anlaşması"
            className="absolute inset-0 w-full h-full object-cover"
            loading="lazy"
            decoding="async"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[#2A1010]/65 to-[#1a0808]/80" />
          <div className="relative flex flex-col justify-between p-[3vw] h-full">
            <p className="text-white/95 font-light leading-snug tracking-wide" style={{ fontSize: "clamp(11px, 3vw, 14px)" }}>
              Spot Eşyanı Değerinde Tarafımıza Satmak İstermisin?
            </p>
            {/* Letter-spacing azaltıldı — daha şık */}
            <Link href="/esya-sat">
              <div
                className="bg-[#E88A2D] active:bg-[#D4781A] text-white text-center font-semibold rounded-[3vw] transition-colors cursor-pointer mt-auto tracking-tight"
                style={{ padding: "clamp(10px, 2.5vw, 14px)", fontSize: "clamp(12px, 3.4vw, 16px)" }}
              >
                Ücretsiz Ekspertiz
              </div>
            </Link>
          </div>
        </div>

        {/* Alt: İletişim İkonları — yeşil/mavi tam kutu + blog kitap ikonu */}
        <div className="grid grid-cols-2 gap-[1.5vw] flex-[2.5] hero-box-icons">
          {/* Telefon — TAM YEŞİL */}
          <a
            href={`tel:${PHONE_NUMBER}`}
            className="flex items-center justify-center rounded-[3vw] bg-emerald-500 active:bg-emerald-600 shadow-md active:shadow-lg transition-all cursor-pointer"
            aria-label="Telefon ile ara"
          >
            <Phone className="text-white" style={{ width: "clamp(20px, 5.5vw, 28px)", height: "clamp(20px, 5.5vw, 28px)" }} />
          </a>

          {/* WhatsApp — TAM YEŞİL */}
          <a
            href={whatsappLink}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center rounded-[3vw] bg-[#25D366] active:bg-[#1fbd58] shadow-md active:shadow-lg transition-all cursor-pointer"
            aria-label="WhatsApp ile yaz"
          >
            <svg style={{ width: "clamp(20px, 5.5vw, 28px)", height: "clamp(20px, 5.5vw, 28px)" }} className="text-white" viewBox="0 0 24 24" fill="currentColor">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
              <path d="M12 2C6.477 2 2 6.477 2 12c0 1.89.525 3.66 1.438 5.168L2 22l4.832-1.438A9.955 9.955 0 0012 22c5.523 0 10-4.477 10-10S17.523 2 12 2zm0 18a8 8 0 01-4.16-1.168l-.29-.174-3.012.79.804-2.94-.192-.303A8 8 0 1112 20z" />
            </svg>
          </a>

          {/* Blog — Kitap ikonlu şık kutu */}
          <Link href="/blog">
            <div className="flex flex-col items-center justify-center h-full rounded-[3vw] bg-[#2F2F2F] active:bg-[#404040] shadow-md active:shadow-lg transition-all cursor-pointer gap-[0.5vw]">
              <BookOpen className="text-[#FFD300]" style={{ width: "clamp(16px, 4.5vw, 22px)", height: "clamp(16px, 4.5vw, 22px)" }} />
              <span className="font-semibold text-white/90" style={{ fontSize: "clamp(9px, 2.5vw, 12px)" }}>BLOG</span>
            </div>
          </Link>

          {/* Facebook — TAM MAVİ */}
          <a
            href={FACEBOOK_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center rounded-[3vw] bg-[#1877F2] active:bg-[#1565d8] shadow-md active:shadow-lg transition-all cursor-pointer"
            aria-label="Facebook sayfamız"
          >
            <svg style={{ width: "clamp(20px, 5.5vw, 28px)", height: "clamp(20px, 5.5vw, 28px)" }} className="text-white" viewBox="0 0 24 24" fill="currentColor">
              <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
            </svg>
          </a>
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════
// TRUST SLIDE CAROUSEL — 2.5s auto-slide
// ═══════════════════════════════════════════

function TrustSlideCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [hasNudged, setHasNudged] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const goNext = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % trustSlides.length);
  }, []);

  const goPrev = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + trustSlides.length) % trustSlides.length);
  }, []);

  const prefersReducedMotion = useMemo(() => {
    if (typeof window === "undefined") return false;
    return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  }, []);

  // İlk nudge — 2.5s sonra tetikle
  useEffect(() => {
    if (hasNudged || prefersReducedMotion) return;
    const timer = setTimeout(() => {
      setHasNudged(true);
      setTimeout(goNext, 1500);
    }, 2500);
    return () => clearTimeout(timer);
  }, [hasNudged, goNext, prefersReducedMotion]);

  // Auto-slide — her 2.5 saniyede bir (nudge bittikten sonra)
  useEffect(() => {
    if (!hasNudged) return;
    const interval = setInterval(goNext, 2500);
    return () => clearInterval(interval);
  }, [hasNudged, goNext]);

  // Touch swipe
  const touchStartX = useRef(0);
  const onTouchStart = useCallback((e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  }, []);
  const onTouchEnd = useCallback((e: React.TouchEvent) => {
    const diff = touchStartX.current - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 50) {
      if (diff > 0) goNext();
      else goPrev();
    }
  }, [goNext, goPrev]);

  const slide = trustSlides[currentIndex];

  return (
    <div className="px-[3vw] mt-[2vw] hero-box-carousel">
      <div className="relative rounded-[4vw] overflow-hidden shadow-lg">
        <Link href={slide.href}>
          <div
            ref={containerRef}
            className={`relative cursor-pointer ${hasNudged || prefersReducedMotion ? "" : "slide-nudge"}`}
            style={{ height: "clamp(120px, 22dvh, 180px)", touchAction: "pan-y" }}
            onTouchStart={onTouchStart}
            onTouchEnd={onTouchEnd}
          >
            {/* Background — slider fotoğrafları */}
            {trustSlides.map((s, idx) => (
              <div
                key={idx}
                className={`absolute inset-0 transition-opacity duration-400 ${
                  idx === currentIndex ? "opacity-100" : "opacity-0"
                }`}
              >
                <img
                  src={s.bgImage}
                  alt={s.label}
                  className="w-full h-full object-cover"
                  loading="lazy"
                  decoding="async"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-[#4A1A8A]/75 to-[#6B3FA0]/60" />
              </div>
            ))}

            {/* Trust Stat Content */}
            <div className="relative h-full flex flex-col items-center justify-center text-white z-10 px-[6vw]">
              <span className="font-bold drop-shadow-lg tracking-wide" style={{ fontSize: "clamp(28px, 8vw, 40px)" }}>{slide.value}</span>
              <span className="font-normal mt-[0.5vw] drop-shadow tracking-wide" style={{ fontSize: "clamp(14px, 4.2vw, 20px)" }}>{slide.label}</span>
              <span className="font-light text-white/70 mt-[0.3vw] tracking-wide" style={{ fontSize: "clamp(11px, 3vw, 15px)" }}>{slide.sublabel}</span>
            </div>
          </div>
        </Link>

        {/* Navigation Arrows */}
        <button
          onClick={(e) => { e.stopPropagation(); goPrev(); }}
          className="absolute left-[2vw] top-1/2 -translate-y-1/2 rounded-full bg-white/20 active:bg-white/50 flex items-center justify-center text-white transition-colors z-20 backdrop-blur-sm cursor-pointer"
          style={{ width: "clamp(32px, 8vw, 44px)", height: "clamp(32px, 8vw, 44px)" }}
          aria-label="Önceki"
        >
          <ChevronLeft style={{ width: "clamp(16px, 4.5vw, 24px)", height: "clamp(16px, 4.5vw, 24px)" }} />
        </button>
        <button
          onClick={(e) => { e.stopPropagation(); goNext(); }}
          className="absolute right-[2vw] top-1/2 -translate-y-1/2 rounded-full bg-white/20 active:bg-white/50 flex items-center justify-center text-white transition-colors z-20 backdrop-blur-sm cursor-pointer"
          style={{ width: "clamp(32px, 8vw, 44px)", height: "clamp(32px, 8vw, 44px)" }}
          aria-label="Sonraki"
        >
          <ChevronRight style={{ width: "clamp(16px, 4.5vw, 24px)", height: "clamp(16px, 4.5vw, 24px)" }} />
        </button>

        {/* Dot indicators */}
        <div className="absolute bottom-[1.5vw] left-1/2 -translate-x-1/2 flex gap-[1vw] z-20">
          {trustSlides.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentIndex(idx)}
              className={`rounded-full transition-all cursor-pointer ${
                idx === currentIndex ? "bg-[#FFD300]" : "bg-white/50"
              }`}
              style={{
                height: "clamp(6px, 1.5vw, 10px)",
                width: idx === currentIndex ? "clamp(16px, 5vw, 24px)" : "clamp(6px, 1.5vw, 10px)",
              }}
              aria-label={`Slide ${idx + 1}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════
// SCROLL DOWN BUTTON
// ═══════════════════════════════════════════

function ScrollDownButton() {
  return (
    <div className="flex justify-center" style={{ paddingTop: "clamp(12px, 3dvh, 24px)", paddingBottom: "clamp(8px, 2dvh, 16px)" }}>
      <button
        onClick={() => document.getElementById("categories")?.scrollIntoView({ behavior: "smooth" })}
        className="text-[#E88A2D] active:text-[#D4781A] transition-colors animate-custom-bounce cursor-pointer"
        aria-label="Kategorilere git"
      >
        <ChevronDown style={{ width: "clamp(32px, 8vw, 48px)", height: "clamp(32px, 8vw, 48px)" }} className="drop-shadow-lg" />
      </button>
    </div>
  );
}

// ═══════════════════════════════════════════
// ANA BİLEŞEN — kemik rengi background
// ═══════════════════════════════════════════

function MobileHeroApp() {
  return (
    <div className="md:hidden bg-[#F9F8F4] dark:bg-background">
      <BentoGrid />
      <TrustSlideCarousel />
      <ScrollDownButton />
    </div>
  );
}

export default memo(MobileHeroApp);

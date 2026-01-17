import { useState, useEffect, useCallback, memo } from "react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

const PHONE_NUMBER = "+905393160007";

const slides = [
  {
    id: 1,
    title: "Eviniz İçin Uygun Fiyatlı Çözümler",
    subtitle: "Kadıköy Fikirtepe'de kaliteli ve temiz spot eşya fırsatları.",
    bgGradient: "from-[#2F2F2F]/95 to-[#2F2F2F]/80",
    bgImage: "/uploads/slider1.webp",
  },
  {
    id: 2,
    title: "2.El eşyalarınızı değerinde alıyoruz.",
    subtitle: "Fikirtepe'de anında nakit ödeme ve yerinden alım hizmeti.",
    bgGradient: "from-[#2F2F2F]/95 to-[#2F2F2F]/80",
    bgImage: "/uploads/slider2.webp",
  },
  {
    id: 3,
    title: "spotcudukkani.com",
    subtitle: "Kadıköy Fikirtepe'de Güvenilir 2.EL Eşya Alım Satım Merkezi",
    bgGradient: "from-[#2F2F2F]/95 to-[#2F2F2F]/80",
    bgImage: "/uploads/slider3.webp",
  },
];

function HeroSlider() {
  const [currentSlide, setCurrentSlide] = useState(0);

  const nextSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  }, []);

  const prevSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  }, []);

  useEffect(() => {
    const interval = setInterval(nextSlide, 5000);
    return () => clearInterval(interval);
  }, [nextSlide]);

  const whatsappLink = `https://wa.me/${PHONE_NUMBER}?text=${encodeURIComponent("Merhaba, bilgi almak istiyorum.")}`;

  return (
    <section className="relative h-[550px] md:h-[700px] lg:h-[800px] xl:h-[850px] overflow-hidden">
      {/* Slides */}
      {slides.map((slide, index) => (
        <div
          key={slide.id}
          className={`absolute inset-0 transition-opacity duration-700 ${
            index === currentSlide ? "opacity-100" : "opacity-0 pointer-events-none"
          }`}
        >
          {/* Background Image - LCP optimized */}
          <img
            src={slide.bgImage}
            alt=""
            className="absolute inset-0 w-full h-full object-cover"
            loading={index === 0 ? "eager" : "lazy"}
            fetchPriority={index === 0 ? "high" : "auto"}
            decoding={index === 0 ? "sync" : "async"}
          />
          {/* Overlay */}
          <div className={`absolute inset-0 bg-gradient-to-r ${slide.bgGradient}`} />

          {/* Content */}
          <div className="relative h-full container flex items-center">
            <div className="max-w-3xl xl:max-w-4xl text-white">
              <h1
                className={`text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-extrabold mb-5 lg:mb-6 leading-tight transition-all duration-700 ${
                  index === currentSlide
                    ? "translate-y-0 opacity-100"
                    : "translate-y-8 opacity-0"
                }`}
              >
                {slide.title}
              </h1>
              <p
                className={`text-xl md:text-2xl lg:text-3xl text-gray-200 mb-10 lg:mb-12 transition-all duration-700 delay-100 ${
                  index === currentSlide
                    ? "translate-y-0 opacity-100"
                    : "translate-y-8 opacity-0"
                }`}
              >
                {slide.subtitle}
              </p>
              <div
                className={`flex flex-wrap gap-5 lg:gap-6 transition-all duration-700 delay-200 ${
                  index === currentSlide
                    ? "translate-y-0 opacity-100"
                    : "translate-y-8 opacity-0"
                }`}
              >
                <Link href="/urunler">
                  <Button 
                    size="lg" 
                    className="bg-[#FFD300] text-[#2F2F2F] hover:bg-[#FFD300]/90 text-lg lg:text-xl px-8 lg:px-10 py-5 lg:py-6 h-auto font-bold shadow-lg hover:shadow-xl transition-all min-h-[48px] min-w-[48px]"
                  >
                    Ürünleri İncele
                  </Button>
                </Link>
                <a href={whatsappLink} target="_blank" rel="noopener noreferrer">
                  <Button
                    size="lg"
                    variant="outline"
                    className="bg-white/10 border-2 border-white/40 text-white hover:bg-white/20 text-lg lg:text-xl px-8 lg:px-10 py-5 lg:py-6 h-auto font-semibold min-h-[48px] min-w-[48px]"
                  >
                    İletişime Geç
                  </Button>
                </a>
              </div>
            </div>
          </div>
        </div>
      ))}

      {/* Navigation Arrows */}
      <button
        onClick={prevSlide}
        className="absolute left-4 lg:left-8 top-1/2 -translate-y-1/2 w-12 h-12 md:w-14 md:h-14 lg:w-16 lg:h-16 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center text-white transition-all backdrop-blur-sm min-h-[48px] min-w-[48px]"
        aria-label="Önceki slayt"
      >
        <ChevronLeft className="w-6 h-6 md:w-7 md:h-7 lg:w-8 lg:h-8" />
      </button>
      <button
        onClick={nextSlide}
        className="absolute right-4 lg:right-8 top-1/2 -translate-y-1/2 w-12 h-12 md:w-14 md:h-14 lg:w-16 lg:h-16 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center text-white transition-all backdrop-blur-sm min-h-[48px] min-w-[48px]"
        aria-label="Sonraki slayt"
      >
        <ChevronRight className="w-6 h-6 md:w-7 md:h-7 lg:w-8 lg:h-8" />
      </button>

      {/* Dots */}
      <div className="absolute bottom-8 lg:bottom-10 left-1/2 -translate-x-1/2 flex gap-3">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={`h-4 lg:h-5 rounded-full transition-all min-h-[20px] ${
              index === currentSlide ? "bg-[#FFD300] w-10 lg:w-12 min-w-[40px]" : "bg-white/50 hover:bg-white/70 w-4 lg:w-5 min-w-[16px]"
            }`}
            aria-label={`Slayt ${index + 1}`}
          />
        ))}
      </div>
    </section>
  );
}

export default memo(HeroSlider);

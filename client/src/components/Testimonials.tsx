import { useState, useEffect, useCallback } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { ChevronLeft, ChevronRight, Quote } from "lucide-react";

const testimonials = [
  {
    id: 1,
    name: "Ahmet Y.",
    location: "Kadıköy",
    text: "Öğrenci evi için eşya aldık, çok yardımcı oldular. Fiyatlar da gayet uygundu. Teşekkürler!",
  },
  {
    id: 2,
    name: "Fatma K.",
    location: "Fikirtepe",
    text: "Eski buzdolabımı aynı gün gelip aldılar. Hızlı ve güvenilir bir hizmet aldık.",
  },
  {
    id: 3,
    name: "Mehmet S.",
    location: "Ataşehir",
    text: "Yeni evimiz için koltuk takımı aldık. Temiz ve bakımlı ürünler. Memnun kaldık.",
  },
  {
    id: 4,
    name: "Ayşe D.",
    location: "Üsküdar",
    text: "Taşınırken tüm eski eşyalarımızı değerinde aldılar. Çok pratik bir çözüm oldu.",
  },
  {
    id: 5,
    name: "Mustafa B.",
    location: "Maltepe",
    text: "Çamaşır makinesi arızalanınca hemen yeni bir tane bulduk. Uygun fiyat ve hızlı teslimat.",
  },
  {
    id: 6,
    name: "Zeynep A.",
    location: "Kadıköy",
    text: "İkinci el eşya alırken güven çok önemli. Bu dükkan gerçekten güvenilir.",
  },
  {
    id: 7,
    name: "Ali R.",
    location: "Fikirtepe",
    text: "Yıllardır bu dükkandan alışveriş yapıyorum. Her zaman dürüst ve samimi davrandılar.",
  },
  {
    id: 8,
    name: "Elif T.",
    location: "Göztepe",
    text: "Mutfak masası ve sandalye seti aldık. Kaliteli ürünler, makul fiyatlar.",
  },
  {
    id: 9,
    name: "Hasan M.",
    location: "Bostancı",
    text: "Ofis için masa ve koltuk aldık. Profesyonel hizmet, teşekkürler Spotçu Dükkanı!",
  },
];

export default function Testimonials() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [itemsPerView, setItemsPerView] = useState(3);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 640) {
        setItemsPerView(1);
      } else if (window.innerWidth < 1024) {
        setItemsPerView(2);
      } else {
        setItemsPerView(3);
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const maxIndex = Math.max(0, testimonials.length - itemsPerView);

  const nextSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev >= maxIndex ? 0 : prev + 1));
  }, [maxIndex]);

  const prevSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev <= 0 ? maxIndex : prev - 1));
  }, [maxIndex]);

  useEffect(() => {
    const interval = setInterval(nextSlide, 4000);
    return () => clearInterval(interval);
  }, [nextSlide]);

  return (
    <section className="py-16 md:py-20 bg-background">
      <div className="container">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-3">
            Müşterilerimiz Ne Diyor?
          </h2>
          <p className="text-muted-foreground">
            Binlerce mutlu müşterimizden bazı yorumlar
          </p>
        </div>

        {/* Testimonials Slider */}
        <div className="relative">
          {/* Navigation Buttons */}
          <button
            onClick={prevSlide}
            className="absolute -left-4 md:-left-6 top-1/2 -translate-y-1/2 z-10 w-10 h-10 md:w-12 md:h-12 rounded-full bg-white shadow-lg border border-border flex items-center justify-center hover:bg-muted transition-colors"
            aria-label="Önceki yorum"
          >
            <ChevronLeft className="w-5 h-5 text-foreground" />
          </button>
          <button
            onClick={nextSlide}
            className="absolute -right-4 md:-right-6 top-1/2 -translate-y-1/2 z-10 w-10 h-10 md:w-12 md:h-12 rounded-full bg-white shadow-lg border border-border flex items-center justify-center hover:bg-muted transition-colors"
            aria-label="Sonraki yorum"
          >
            <ChevronRight className="w-5 h-5 text-foreground" />
          </button>

          {/* Slider Container */}
          <div className="overflow-hidden mx-4 md:mx-8">
            <div
              className="flex transition-transform duration-500 ease-out"
              style={{
                transform: `translateX(-${currentIndex * (100 / itemsPerView)}%)`,
              }}
            >
              {testimonials.map((testimonial) => (
                <div
                  key={testimonial.id}
                  className="flex-shrink-0 px-2 md:px-3"
                  style={{ width: `${100 / itemsPerView}%` }}
                >
                  <Card className="h-full bg-card border-border/50 hover:border-primary/30 transition-colors">
                    <CardContent className="p-6">
                      <Quote className="w-8 h-8 text-primary/30 mb-4" />
                      <p className="text-foreground mb-4 leading-relaxed">
                        "{testimonial.text}"
                      </p>
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                          <span className="text-primary font-semibold">
                            {testimonial.name.charAt(0)}
                          </span>
                        </div>
                        <div>
                          <p className="font-medium text-foreground">{testimonial.name}</p>
                          <p className="text-sm text-muted-foreground">{testimonial.location}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Dots */}
        <div className="flex justify-center gap-2 mt-8">
          {Array.from({ length: maxIndex + 1 }).map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`w-2 h-2 rounded-full transition-all ${
                index === currentIndex ? "bg-primary w-6" : "bg-border hover:bg-muted-foreground"
              }`}
              aria-label={`Yorum grubu ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

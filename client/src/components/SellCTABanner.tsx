import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles } from "lucide-react";
import ScrollAnimation from "./ScrollAnimation";
import { memo } from "react";

function SellCTABanner() {
  return (
    <section className="py-12 md:py-16 lg:py-20 bg-background">
      <div className="container">
        <ScrollAnimation direction="up">
          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-[#FFD300] via-[#FFD300] to-amber-400 p-8 md:p-12 lg:p-14 shadow-xl">
            {/* Decorative shapes */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-[80px] translate-x-1/3 -translate-y-1/3" />
            <div className="absolute bottom-0 left-1/2 w-48 h-48 bg-[#2F2F2F]/5 rounded-full blur-[60px]" />

            <div className="relative flex flex-col md:flex-row items-center justify-between gap-8">
              {/* Text Content */}
              <div className="flex-1 text-center md:text-left">
                <div className="inline-flex items-center gap-2 bg-[#2F2F2F]/10 text-[#2F2F2F] px-4 py-2 rounded-full text-sm font-semibold mb-4">
                  <Sparkles className="w-4 h-4" />
                  Hızlı & Kolay
                </div>
                <h2 className="text-2xl md:text-3xl lg:text-4xl font-extrabold text-[#2F2F2F] mb-3 leading-tight">
                  Eşyanızı Satmak mı İstiyorsunuz?
                </h2>
                <p className="text-base md:text-lg text-[#2F2F2F]/70 max-w-lg">
                  Kullanmadığınız mobilya ve beyaz eşyalarınızı en iyi fiyatla alıyoruz.
                  Ücretsiz nakliye, anında ödeme.
                </p>
              </div>

              {/* CTA Button */}
              <div className="flex-shrink-0">
                <Link href="/esya-sat">
                  <Button
                    size="lg"
                    className="bg-[#2F2F2F] hover:bg-[#1a1a1a] text-white text-lg px-8 py-6 h-auto font-bold gap-3 shadow-lg hover:shadow-xl transition-all hover:-translate-y-0.5 group"
                  >
                    Detaylı Bilgi Al
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </ScrollAnimation>
      </div>
    </section>
  );
}

export default memo(SellCTABanner);

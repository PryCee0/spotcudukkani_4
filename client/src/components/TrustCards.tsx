import { Shield, Truck, Sparkles } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const trustItems = [
  {
    icon: Shield,
    title: "Güvenilir Ticaret",
    description: "2012'den beri binlerce müşterinin güvenini kazandık. Kadıköy Fikirtepe'de şeffaf ve dürüst ticaret anlayışımızla hizmetinizdeyiz.",
  },
  {
    icon: Truck,
    title: "Hızlı Teslimat",
    description: "Aynı gün teslimat ve yerinden alım hizmeti. Kadıköy Fikirtepe ve çevresinde hızlı ve güvenli nakliye.",
  },
  {
    icon: Sparkles,
    title: "Temiz Ürün Garantisi",
    description: "Tüm ürünlerimiz kontrol edilmiş ve temizlenmiştir. Kaliteli ve bakımlı eşya garantisi.",
  },
];

export default function TrustCards() {
  return (
    <section className="py-16 md:py-20 lg:py-24 bg-[#F9F8F4]">
      <div className="container">
        {/* Section Header - Büyütülmüş */}
        <div className="text-center mb-12 lg:mb-16">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-[#2F2F2F] mb-4 lg:mb-5">
            Spotçu Dükkanı
          </h2>
          <p className="text-lg md:text-xl lg:text-2xl text-[#2F2F2F]/70 max-w-3xl mx-auto leading-relaxed">
            Kadıköy Fikirtepede beyaz eşya ve mobilya alım satım dükkanı
          </p>
        </div>

        {/* Trust Cards Grid - Büyütülmüş */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          {trustItems.map((item, index) => (
            <Card
              key={index}
              className="bg-white border-none shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 overflow-hidden group"
            >
              <CardContent className="p-8 lg:p-10 text-center">
                <div className="w-18 h-18 lg:w-20 lg:h-20 mx-auto mb-6 lg:mb-8 rounded-2xl bg-[#FFD300]/10 flex items-center justify-center group-hover:bg-[#FFD300]/20 transition-colors">
                  <item.icon className="w-9 h-9 lg:w-10 lg:h-10 text-[#FFD300]" />
                </div>
                <h3 className="text-xl lg:text-2xl font-bold text-[#2F2F2F] mb-3 lg:mb-4">
                  {item.title}
                </h3>
                <p className="text-base lg:text-lg text-[#2F2F2F]/70 leading-relaxed">
                  {item.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}

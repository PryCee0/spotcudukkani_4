import Layout from "@/components/Layout";
import ScrollAnimation, { StaggerContainer, StaggerItem } from "@/components/ScrollAnimation";
import { Button } from "@/components/ui/button";
import { useMetaTags } from "@/components/SEO";
import {
  Camera,
  MessageCircle,
  BadgeDollarSign,
  Truck,
  ShieldCheck,
  Clock,
  Sofa,
  Refrigerator,
  Phone,
  CheckCircle2,
  ArrowRight,
  Sparkles,
  ChevronDown,
} from "lucide-react";
import { useState } from "react";
import ChatAnimation from "@/components/ChatAnimation";

const PHONE_NUMBER = "+905393160007";

// Nasıl çalışır adımları
const steps = [
  {
    icon: Camera,
    title: "Fotoğraf Çekin",
    description:
      "Satmak istediğiniz eşyanın birkaç fotoğrafını çekin. Ön, arka ve detay fotoğrafları yeterli.",
    color: "text-blue-500",
    bg: "bg-blue-500/10",
    number: "01",
  },
  {
    icon: MessageCircle,
    title: "WhatsApp'tan Gönderin",
    description:
      "Fotoğrafları ve kısa bir açıklamayı WhatsApp üzerinden bize iletin. Anında dönüş yapıyoruz.",
    color: "text-[#25D366]",
    bg: "bg-[#25D366]/10",
    number: "02",
  },
  {
    icon: BadgeDollarSign,
    title: "Anında Teklif Alın",
    description:
      "Uzman ekibimiz eşyanızı değerlendirir ve size en adil teklifi sunar. Nakit veya havale ile ödeme.",
    color: "text-[#FFD300]",
    bg: "bg-[#FFD300]/10",
    number: "03",
  },
];

// Alınan eşya türleri
const acceptedItems = {
  mobilya: [
    "Koltuk Takımı",
    "Köşe Koltuk",
    "Yatak & Baza",
    "Gardırop",
    "Yemek Masası Takımı",
    "TV Ünitesi",
    "Sehpa",
    "Vitrin & Konsol",
  ],
  beyazEsya: [
    "Buzdolabı",
    "Çamaşır Makinesi",
    "Bulaşık Makinesi",
    "Fırın & Ocak",
    "Klima",
    "Derin Dondurucu",
    "Kurutma Makinesi",
    "Mikrodalga Fırın",
  ],
};

// SSS
const faqItems = [
  {
    q: "Hangi eşyaları alıyorsunuz?",
    a: "İkinci el mobilya (koltuk, yatak, gardırop vb.) ve beyaz eşya (buzdolabı, çamaşır makinesi vb.) dahil olmak üzere geniş bir yelpazede ev eşyası alımı yapıyoruz.",
  },
  {
    q: "Eşyamın değerini nasıl belirliyorsunuz?",
    a: "Uzman ekibimiz eşyanızın markasını, yaşını, durumunu ve piyasa değerini göz önünde bulundurarak adil bir fiyat belirler. Gerekirse yerinde ekspertiz hizmeti sunuyoruz.",
  },
  {
    q: "Ödeme nasıl yapılıyor?",
    a: "Anlaşma sağlandığında nakit veya havale/EFT ile anında ödeme yapıyoruz. Eşya teslim alındığı anda ödemeniz gerçekleşir.",
  },
  {
    q: "Hangi bölgelere hizmet veriyorsunuz?",
    a: "İstanbul'un Anadolu ve Avrupa yakasındaki tüm ilçelere hizmet veriyoruz. Yerinde değerleme ve nakliye tamamen ücretsizdir.",
  },
  {
    q: "Eşyamı ne kadar sürede teslim alıyorsunuz?",
    a: "Anlaşma sonrası genellikle aynı gün veya ertesi gün eşyanızı teslim alıyoruz. Acil durumlarda birkaç saat içinde ekibimiz kapınızda olabilir.",
  },
];

function FAQItem({ q, a }: { q: string; a: string }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border border-border/50 rounded-xl overflow-hidden transition-all">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-5 md:p-6 text-left hover:bg-muted/30 transition-colors"
      >
        <span className="text-base md:text-lg font-semibold text-foreground pr-4">{q}</span>
        <ChevronDown
          className={`w-5 h-5 text-muted-foreground flex-shrink-0 transition-transform duration-300 ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>
      <div
        className={`overflow-hidden transition-all duration-300 ${
          isOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <p className="px-5 md:px-6 pb-5 md:pb-6 text-muted-foreground text-base leading-relaxed">
          {a}
        </p>
      </div>
    </div>
  );
}

export default function SellPage() {
  const whatsappLink = `https://wa.me/${PHONE_NUMBER}?text=${encodeURIComponent(
    "Merhaba, satmak istediğim eşyalar hakkında bilgi almak istiyorum."
  )}`;

  // v10.0: SEO meta tags
  useMetaTags({
    title: "2. El Eşya Sat | İstanbul İkinci El Eşya Alım - Spotçu Dükkanı",
    description: "İstanbul'da ikinci el mobilya ve beyaz eşya satmak mı istiyorsunuz? Spotçu Dükkanı ile anında ekspertiz, yerinde değerleme ve hızlı ödeme. Tüm İstanbul'a ücretsiz nakliye.",
  });

  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative min-h-[100svh] lg:min-h-[85vh] flex flex-col justify-center bg-[#2F2F2F] overflow-hidden pt-20 pb-4 lg:py-0">
        {/* Decorative Elements - Reduced blur on mobile for performance */}
        <div className="absolute inset-0 opacity-20 pointer-events-none">
          <div className="absolute top-1/4 left-10 w-96 h-96 bg-[#FFD300] rounded-full blur-[60px] md:blur-[120px] will-change-transform" />
          <div className="absolute bottom-1/4 right-10 w-[300px] md:w-[500px] h-[300px] md:h-[500px] bg-[#FFD300] rounded-full blur-[80px] md:blur-[150px] will-change-transform" />
        </div>
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSA2MCAwIEwgMCAwIDAgNjAiIGZpbGw9Im5vbmUiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS13aWR0aD0iMC41IiBzdHJva2Utb3BhY2l0eT0iMC4wMyIvPjwvcGF0dGVybj48L2RlZnM+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0idXJsKCNncmlkKSIvPjwvc3ZnPg==')] opacity-30 md:opacity-50 pointer-events-none" />

        <div className="relative container z-10 flex-1 flex flex-col justify-center">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8 items-center h-full">
            {/* Left Content */}
            <ScrollAnimation direction="right">
              <div className="text-center lg:text-left max-w-2xl mx-auto lg:mx-0 flex flex-col justify-center items-center lg:items-start">
                <div className="inline-flex items-center gap-2 bg-[#FFD300]/10 text-[#FFD300] px-4 py-1.5 md:px-6 md:py-3 rounded-full text-xs md:text-base font-semibold mb-5 md:mb-8 backdrop-blur-sm border border-[#FFD300]/20 w-fit">
                  <Sparkles className="w-3 h-3 md:w-5 md:h-5" />
                  Kullanmadığınız Eşyalar Değer Kazansın
                </div>

                <h1 className="text-[1.8rem] leading-[1.1] md:text-5xl lg:text-6xl font-black text-white mb-6 md:mb-8 tracking-tight">
                  Yüzlerce Mutlu Müşterimiz Gibi, Siz De Eşyanızı <br className="hidden md:block" />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FFD300] to-yellow-200">Değerinde Satın</span>
                </h1>

                <div className="flex flex-row items-center justify-center lg:justify-start gap-2 md:gap-4 w-full">
                  <a href={whatsappLink} target="_blank" rel="noopener noreferrer" className="flex-1 sm:flex-none">
                    <Button
                      size="sm"
                      className="w-full sm:w-auto bg-[#25D366] hover:bg-[#1fbd58] text-white text-[13px] md:text-lg px-3 py-4 md:px-8 md:py-7 h-auto font-extrabold gap-1.5 md:gap-3 shadow-[0_0_20px_rgba(37,211,102,0.2)] md:shadow-[0_0_30px_rgba(37,211,102,0.3)] transition-all hover:-translate-y-1 rounded-xl md:rounded-2xl"
                    >
                      <MessageCircle className="w-4 h-4 md:w-6 md:h-6" />
                      Fotoğraf Gönder
                    </Button>
                  </a>
                  <a href={`tel:${PHONE_NUMBER}`} className="flex-1 sm:flex-none">
                    <Button
                      size="sm"
                      variant="outline"
                      className="w-full sm:w-auto bg-transparent border-2 border-white/20 text-white hover:bg-white/10 hover:border-white/40 text-[13px] md:text-lg px-3 py-4 md:px-8 md:py-7 h-auto font-bold gap-1.5 md:gap-3 transition-all rounded-xl md:rounded-2xl"
                    >
                      <Phone className="w-4 h-4 md:w-6 md:h-6" />
                      Hemen Ara
                    </Button>
                  </a>
                </div>
              </div>
            </ScrollAnimation>

            {/* Right Content - Chat Animation */}
            <ScrollAnimation direction="left" delay={0.2} className="flex justify-center items-center">
              <div className="relative pt-4 lg:pt-0 w-full flex justify-center">
                {/* Decorative glowing orb behind phone */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[200px] md:w-[400px] h-[200px] md:h-[400px] bg-[#25D366] rounded-full blur-[60px] md:blur-[100px] opacity-10 md:opacity-20 pointer-events-none will-change-transform" />
                <ChatAnimation />
              </div>
            </ScrollAnimation>
          </div>
        </div>
      </section>

      {/* Nasıl Çalışır - Modern Asymmetric Timeline */}
      <section className="py-20 md:py-32 bg-background relative overflow-hidden transition-colors duration-300">
        {/* Subtle background pattern */}
        <div className="absolute inset-0 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] dark:bg-[radial-gradient(#2F2F2F_1px,transparent_1px)] [background-size:16px_16px] opacity-30 dark:opacity-20" />
        
        <div className="container relative">
          <ScrollAnimation direction="up">
            <div className="max-w-3xl mb-20">
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-foreground mb-6 tracking-tight">
                Nasıl <span className="text-[#FFD300]">Çalışır?</span>
              </h2>
              <p className="text-xl md:text-2xl text-muted-foreground font-medium">
                Eşyanızı satmak hiç bu kadar kolay olmamıştı. Sadece 3 adımda nakit ödemenizi alın.
              </p>
            </div>
          </ScrollAnimation>

          <div className="relative">
            {/* Connection Line (Desktop) */}
            <div className="hidden md:block absolute left-[50%] top-0 bottom-0 w-1 bg-gradient-to-b from-[#FFD300] via-[#FFD300]/50 to-transparent -translate-x-1/2 rounded-full" />

            <div className="space-y-12 md:space-y-24">
              {steps.map((step, index) => {
                const isEven = index % 2 === 0;
                return (
                  <ScrollAnimation key={step.number} direction={isEven ? "left" : "right"} delay={index * 0.1}>
                    <div className={`relative flex flex-col ${isEven ? 'md:flex-row' : 'md:flex-row-reverse'} items-center gap-8 md:gap-16`}>
                      
                      {/* Number Node */}
                      <div className="md:absolute left-[50%] md:-translate-x-1/2 w-16 h-16 md:w-20 md:h-20 bg-background border-4 border-[#FFD300] rounded-full flex items-center justify-center z-10 shadow-[0_0_20px_rgba(255,211,0,0.3)] transition-colors duration-300">
                        <span className="text-2xl md:text-3xl font-black text-foreground">{step.number}</span>
                      </div>

                      {/* Content Box */}
                      <div className={`w-full md:w-1/2 ${isEven ? 'md:pr-16 text-left md:text-right' : 'md:pl-16 text-left'}`}>
                        <div className={`bg-card p-8 md:p-10 rounded-[2rem] shadow-xl hover:shadow-2xl transition-all border border-border/50 relative overflow-hidden group`}>
                          <div className={`absolute top-0 ${isEven ? 'right-0' : 'left-0'} w-32 h-32 ${step.bg} rounded-full blur-[50px] group-hover:scale-150 transition-transform duration-500`} />
                          
                          <div className={`inline-flex items-center justify-center w-16 h-16 rounded-2xl ${step.bg} mb-6 relative z-10`}>
                            <step.icon className={`w-8 h-8 ${step.color}`} />
                          </div>
                          
                          <h3 className="text-2xl md:text-3xl font-bold text-foreground mb-4 relative z-10">
                            {step.title}
                          </h3>
                          <p className="text-muted-foreground text-lg leading-relaxed relative z-10">
                            {step.description}
                          </p>
                        </div>
                      </div>

                      {/* Empty space for the other half */}
                      <div className="hidden md:block w-1/2" />
                    </div>
                  </ScrollAnimation>
                );
              })}
            </div>
          </div>
        </div>
      </section>



      {/* Hangi Eşyalar Alınır - Bento Grid Design */}
      <section className="py-20 md:py-32 bg-muted/30 relative transition-colors duration-300">
        <div className="container">
          <ScrollAnimation direction="up">
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
              <div className="max-w-2xl">
                <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-foreground mb-6 tracking-tight">
                  Ne Tür Eşyalar <span className="text-[#FFD300]">Alıyoruz?</span>
                </h2>
                <p className="text-xl text-muted-foreground font-medium">
                  Evlerinizde yer kaplayan ve artık kullanmadığınız eşyaları nakite çeviriyoruz. 
                  İşte en çok talep ettiğimiz ürün grupları:
                </p>
              </div>
            </div>
          </ScrollAnimation>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
            {/* Mobilya Bento Box */}
            <ScrollAnimation direction="up" className="h-full">
              <div className="bg-[#2F2F2F] rounded-[2rem] p-8 md:p-12 h-full relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-full h-full bg-gradient-to-bl from-orange-500/20 to-transparent opacity-50" />
                
                {/* Floating Abstract Sofa Icon */}
                <Sofa className="absolute -bottom-10 -right-10 w-64 h-64 md:w-80 md:h-80 text-white/5 -rotate-12 group-hover:rotate-0 group-hover:scale-110 transition-transform duration-700" />
                
                <div className="relative z-10 h-full flex flex-col">
                  <div className="flex items-center gap-4 mb-8">
                    <div className="w-16 h-16 rounded-2xl bg-orange-500 flex items-center justify-center shadow-lg flex-shrink-0">
                      <Sofa className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="text-3xl md:text-4xl font-bold text-white">Mobilya <br/><span className="text-orange-400">Grupları</span></h3>
                  </div>
                  
                  <div className="flex flex-col gap-3 mt-auto">
                    {acceptedItems.mobilya.map((item) => (
                      <div key={item} className="flex items-center gap-3 bg-white/10 backdrop-blur-md px-5 py-4 rounded-xl border border-white/5 hover:bg-white/20 transition-colors">
                        <CheckCircle2 className="w-5 h-5 text-orange-400 flex-shrink-0" />
                        <span className="text-white font-medium text-lg">{item}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </ScrollAnimation>

            {/* Beyaz Eşya Bento Box */}
            <ScrollAnimation direction="up" delay={0.2} className="h-full">
              <div className="bg-card dark:bg-[#1A1A1A] rounded-[2rem] p-8 md:p-12 h-full shadow-lg border border-border/50 relative overflow-hidden group transition-colors duration-300">
                <div className="absolute top-0 right-0 w-full h-full bg-gradient-to-bl from-blue-500/10 to-transparent opacity-50" />
                
                {/* Floating Abstract Fridge Icon */}
                <Refrigerator className="absolute -bottom-10 -right-10 w-64 h-64 md:w-80 md:h-80 text-blue-500/5 rotate-12 group-hover:rotate-0 group-hover:scale-110 transition-transform duration-700" />
                
                <div className="relative z-10 h-full flex flex-col">
                  <div className="flex items-center gap-4 mb-8">
                    <div className="w-16 h-16 rounded-2xl bg-blue-500 flex items-center justify-center shadow-lg flex-shrink-0">
                      <Refrigerator className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="text-3xl md:text-4xl font-bold text-foreground">Beyaz <br/><span className="text-blue-500">Eşyalar</span></h3>
                  </div>
                  
                  <div className="flex flex-col gap-3 mt-auto">
                    {acceptedItems.beyazEsya.map((item) => (
                      <div key={item} className="flex items-center gap-3 bg-muted/50 dark:bg-white/5 px-5 py-4 rounded-xl border border-border/50 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors">
                        <CheckCircle2 className="w-5 h-5 text-blue-500 flex-shrink-0" />
                        <span className="text-foreground font-medium text-lg">{item}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </ScrollAnimation>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-16 md:py-20 lg:py-24 bg-[#FFD300] overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 right-0 w-96 h-96 bg-white rounded-full blur-[120px]" />
          <div className="absolute bottom-0 left-0 w-72 h-72 bg-[#2F2F2F] rounded-full blur-[100px]" />
        </div>

        <div className="relative container">
          <ScrollAnimation direction="up">
            <div className="text-center max-w-3xl mx-auto">
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-[#2F2F2F] mb-6">
                Hemen Eşyanızın Değerini Öğrenin
              </h2>
              <p className="text-lg md:text-xl text-[#2F2F2F]/70 mb-10">
                Tek yapmanız gereken fotoğraf çekip göndermek. Ücretsiz değerleme, hızlı dönüş.
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <a href={whatsappLink} target="_blank" rel="noopener noreferrer">
                  <Button
                    size="lg"
                    className="bg-[#2F2F2F] hover:bg-[#1a1a1a] text-white text-lg lg:text-xl px-10 py-6 h-auto font-bold gap-3 shadow-xl hover:shadow-2xl transition-all"
                  >
                    <MessageCircle className="w-6 h-6" />
                    WhatsApp ile Yazın
                  </Button>
                </a>
                <a href={`tel:${PHONE_NUMBER}`}>
                  <Button
                    size="lg"
                    variant="outline"
                    className="bg-transparent border-2 border-[#2F2F2F]/30 text-[#2F2F2F] hover:bg-[#2F2F2F]/10 text-lg lg:text-xl px-10 py-6 h-auto font-bold gap-3"
                  >
                    <Phone className="w-6 h-6" />
                    +90 539 316 00 07
                  </Button>
                </a>
              </div>
            </div>
          </ScrollAnimation>
        </div>
      </section>

      {/* SSS / FAQ */}
      <section className="py-16 md:py-20 lg:py-24 bg-card">
        <div className="container">
          <ScrollAnimation direction="up">
            <div className="text-center mb-14">
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-foreground mb-4">
                Sık Sorulan Sorular
              </h2>
              <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
                Merak ettiklerinize hızlıca yanıt bulun
              </p>
            </div>
          </ScrollAnimation>

          <div className="max-w-3xl mx-auto space-y-3">
            {faqItems.map((item, i) => (
              <ScrollAnimation key={i} direction="up" delay={i * 0.05}>
                <FAQItem q={item.q} a={item.a} />
              </ScrollAnimation>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Schema (SEO) */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: faqItems.map((item) => ({
              "@type": "Question",
              name: item.q,
              acceptedAnswer: {
                "@type": "Answer",
                text: item.a,
              },
            })),
          }),
        }}
      />
    </Layout>
  );
}

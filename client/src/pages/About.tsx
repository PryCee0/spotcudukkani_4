import Layout from "@/components/Layout";
import { Card, CardContent } from "@/components/ui/card";
import { Shield, Heart, Users, Clock, Target, Award, MapPin, Calendar } from "lucide-react";

const values = [
  {
    icon: Heart,
    title: "İnsani Değerler",
    description: "Ticaretin ötesinde, insani değerlere ve güvene önem veriyoruz.",
  },
  {
    icon: Shield,
    title: "Güvenilirlik",
    description: "2012'den beri binlerce müşterinin güvenini kazandık.",
  },
  {
    icon: Users,
    title: "Müşteri Odaklılık",
    description: "Müşteri memnuniyeti bizim için her şeyden önemlidir.",
  },
  {
    icon: Clock,
    title: "Hızlı Hizmet",
    description: "Aynı gün teslimat ve yerinden alım hizmeti sunuyoruz.",
  },
];

const milestones = [
  { year: "2012", title: "Kuruluş", description: "Küçükyalı Spotçular Çarşısı'nda sektöre adım attık." },
  { year: "2015", title: "Büyüme", description: "Anadolu Yakası'nda tanınan bir marka olduk." },
  { year: "2018", title: "Genişleme", description: "Hizmet ağımızı tüm İstanbul'a yaydık." },
  { year: "2021", title: "Fikirtepe", description: "Kadıköy Fikirtepe'de yeni mağazamızla hizmet vermeye başladık." },
  { year: "2024", title: "Dijitalleşme", description: "Online platformumuzla müşterilerimize daha yakınız." },
];

export default function About() {
  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative bg-foreground py-16 md:py-24 overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 right-0 w-96 h-96 bg-primary rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-primary rounded-full blur-3xl" />
        </div>
        <div className="relative container">
          <div className="max-w-3xl">
            <h1 className="text-3xl md:text-5xl font-bold text-white mb-6">
              Hikayemiz
            </h1>
            <p className="text-xl text-gray-300 leading-relaxed">
              2012 yılında Küçükyalı Spotçular Çarşısı'nda sektöre başlayan firmamız, Anadolu Yakası'nın farklı ilçelerinde faaliyet gösterdikten sonra 2021 yılından itibaren Kadıköy Fikirtepe'de hizmet vermeye devam etmektedir.
            </p>
          </div>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-16 md:py-20">
        <div className="container">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-6">
                Önce İnsan, Sonra Ticaret
              </h2>
              <div className="space-y-4 text-muted-foreground leading-relaxed">
                <p>
                  <strong className="text-foreground">2012 yılında Küçükyalı Spotçular Çarşısı'nda sektöre başlayan firmamız</strong>, Anadolu Yakası'nın farklı ilçelerinde faaliyet gösterdikten sonra <strong className="text-foreground">2021 yılından itibaren Kadıköy Fikirtepe'de</strong> hizmet vermeye devam etmektedir.
                </p>
                <p>
                  Zamanla yalnızca alım satım değil, hizmet kalitesi ve insan iletişiminin de en az ticaret kadar önemli olduğunu fark ettik. Kurulduğumuz günden bu yana değişmeyen önceliğimiz; insani değerler, dürüstlük ve müşteri memnuniyeti olmuştur.
                </p>
                <p className="italic border-l-4 border-primary pl-4 py-2 bg-primary/5 rounded-r-lg">
                  "Her müşterimizi bir aile ferdi gibi görüyor, ihtiyaçlarını doğru anlayarak en uygun ve güvenilir çözümleri sunuyoruz."
                </p>
                <p>
                  Yılların kazandırdığı tecrübe sayesinde bugün Kadıköy Fikirtepe ve çevresinde bilinen ve tercih edilen bir marka hâline geldik. İkinci el eşya alım satımında güven her şeyden önemlidir. Biz de bu güveni korumak ve sürdürmek için her gün daha iyisini yapmaya çalışıyoruz.
                </p>
              </div>
            </div>
            {/* v4.5: Hakkımızda görseli güncellendi */}
            <div className="relative">
              <div className="aspect-[4/3] rounded-2xl overflow-hidden shadow-2xl">
                <img 
                  src="/uploads/hakkimizda.webp" 
                  alt="Spotçu Dükkanı - Profesyonel Taşıma Hizmeti"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="absolute -bottom-6 -left-6 bg-primary text-foreground p-6 rounded-2xl shadow-xl">
                <div className="text-4xl font-bold">12+</div>
                <div className="text-sm font-medium">Yıllık Tecrübe</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-16 md:py-20 bg-muted/30">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-4">
              Değerlerimiz
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              İşimizi yaparken bizi yönlendiren temel değerler
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((value, index) => (
              <Card key={index} className="bg-card border-border/50 hover:border-primary/30 transition-colors">
                <CardContent className="p-6 text-center">
                  <div className="w-14 h-14 mx-auto mb-4 rounded-2xl bg-primary/10 flex items-center justify-center">
                    <value.icon className="w-7 h-7 text-primary" />
                  </div>
                  <h3 className="text-lg font-semibold text-foreground mb-2">{value.title}</h3>
                  <p className="text-sm text-muted-foreground">{value.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline Section */}
      <section className="py-16 md:py-20">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-4">
              Yolculuğumuz
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              2012'den bugüne uzanan başarı hikayemiz
            </p>
          </div>
          <div className="max-w-3xl mx-auto">
            <div className="relative">
              {/* Timeline Line */}
              <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-0.5 bg-border md:-translate-x-1/2" />
              
              {milestones.map((milestone, index) => (
                <div
                  key={index}
                  className={`relative flex items-center gap-6 mb-8 ${
                    index % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"
                  }`}
                >
                  {/* Dot */}
                  <div className="absolute left-4 md:left-1/2 w-4 h-4 rounded-full bg-primary border-4 border-background md:-translate-x-1/2 z-10" />
                  
                  {/* Content */}
                  <div className={`ml-12 md:ml-0 md:w-1/2 ${index % 2 === 0 ? "md:pr-12 md:text-right" : "md:pl-12"}`}>
                    <div className="bg-card p-6 rounded-xl border border-border/50 shadow-sm">
                      <div className="text-primary font-bold text-lg mb-1">{milestone.year}</div>
                      <h3 className="text-foreground font-semibold mb-2">{milestone.title}</h3>
                      <p className="text-sm text-muted-foreground">{milestone.description}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Vision Section */}
      <section className="py-16 md:py-20 bg-foreground text-white">
        <div className="container">
          <div className="max-w-3xl mx-auto text-center">
            <Target className="w-12 h-12 mx-auto mb-6 text-primary" />
            <h2 className="text-2xl md:text-3xl font-bold mb-6">Vizyonumuz</h2>
            <p className="text-gray-300 text-lg leading-relaxed">
              İkinci el eşya sektöründe güvenin ve kalitenin adresi olmak, müşterilerimize
              her zaman en iyi hizmeti sunmak ve sektörde örnek alınan bir marka olmaya
              devam etmek. Sürdürülebilir tüketim anlayışıyla çevreye katkıda bulunurken,
              İstanbul'un Avrupa ve Anadolu yakasındaki binlerce aileye uygun fiyatlı çözümler sunmak en büyük hedefimizdir.
            </p>
          </div>
        </div>
      </section>
    </Layout>
  );
}

import { Link } from "wouter";
import Layout from "@/components/Layout";
import { Card, CardContent } from "@/components/ui/card";
import { Armchair, Refrigerator, ArrowRight } from "lucide-react";

const categories = [
  {
    id: "mobilya",
    title: "2.EL MOBİLYA",
    description: "Kadıköy Fikirtepe'de koltuk takımları, yemek masaları, yatak odası takımları ve daha fazlası",
    icon: Armchair,
    href: "/urunler/mobilya",
    image: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800&q=80",
  },
  {
    id: "beyaz-esya",
    title: "2.EL BEYAZ EŞYA",
    description: "Kadıköy Fikirtepe'de buzdolabı, çamaşır makinesi, bulaşık makinesi ve diğer beyaz eşyalar",
    icon: Refrigerator,
    href: "/urunler/beyaz-esya",
    image: "https://images.unsplash.com/photo-1584568694244-14fbdf83bd30?w=800&q=80",
  },
];

export default function Products() {
  return (
    <Layout>
      {/* Page Header */}
      <section className="bg-foreground py-12 md:py-16">
        <div className="container">
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-3">Ürünlerimiz</h1>
          <p className="text-gray-300 max-w-2xl">
            Kadıköy Fikirtepe'de ikinci el mobilya ve beyaz eşya kategorilerimizi keşfedin. Tüm ürünlerimiz
            kontrol edilmiş ve temizlenmiş olarak satışa sunulmaktadır.
          </p>
        </div>
      </section>

      {/* Category Cards */}
      <section className="py-12 md:py-20">
        <div className="container">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 max-w-5xl mx-auto">
            {categories.map((category) => (
              <Link key={category.id} href={category.href}>
                <Card className="group h-full overflow-hidden cursor-pointer border-border/50 hover:border-primary/50 hover:shadow-2xl transition-all duration-500">
                  {/* Image */}
                  <div className="relative h-48 md:h-64 overflow-hidden">
                    <img
                      src={category.image}
                      alt={category.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-foreground/80 via-foreground/20 to-transparent" />
                    
                    {/* Icon Badge */}
                    <div className="absolute top-4 right-4 w-14 h-14 rounded-2xl bg-primary flex items-center justify-center shadow-lg">
                      <category.icon className="w-7 h-7 text-foreground" />
                    </div>
                  </div>

                  {/* Content */}
                  <CardContent className="p-6 md:p-8">
                    <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-3 group-hover:text-primary transition-colors">
                      {category.title}
                    </h2>
                    <p className="text-muted-foreground mb-6">{category.description}</p>
                    <div className="flex items-center gap-2 text-primary font-medium">
                      <span>Ürünleri İncele</span>
                      <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform" />
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </Layout>
  );
}

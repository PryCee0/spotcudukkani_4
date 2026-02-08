import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { ArrowRight, Package } from "lucide-react";
import { trpc } from "@/lib/trpc";
import ProductCard from "./ProductCard";
import { Skeleton } from "@/components/ui/skeleton";
import ScrollAnimation, { StaggerContainer, StaggerItem } from "./ScrollAnimation";

export default function FeaturedProducts() {
  const { data: products, isLoading } = trpc.products.featured.useQuery({ limit: 4 });

  return (
    <section className="py-16 md:py-20 lg:py-24 bg-white">
      <div className="container">
        {/* Section Header - Büyütülmüş */}
        <ScrollAnimation direction="up">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-5 mb-10 lg:mb-14">
            <div>
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-[#2F2F2F] mb-3 lg:mb-4">
                Son Eklenen Ürünler
              </h2>
              <p className="text-lg md:text-xl lg:text-2xl text-[#2F2F2F]/70">
                İstanbul genelinde en yeni ikinci el mobilya ve beyaz eşya fırsatları
              </p>
            </div>
            <Link href="/urunler">
              <Button variant="outline" className="gap-2 text-base lg:text-lg px-6 lg:px-8 py-3 lg:py-4 h-auto border-2 border-[#2F2F2F]/20 hover:border-[#FFD300] hover:bg-[#FFD300]/5">
                Tüm Ürünler
                <ArrowRight className="w-5 h-5" />
              </Button>
            </Link>
          </div>
        </ScrollAnimation>

        {/* Products Grid - Büyütülmüş */}
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="space-y-4">
                <Skeleton className="aspect-[4/3] w-full rounded-xl" />
                <Skeleton className="h-7 w-3/4" />
                <Skeleton className="h-5 w-full" />
                <Skeleton className="h-12 w-full rounded-lg" />
              </div>
            ))}
          </div>
        ) : products && products.length > 0 ? (
          <StaggerContainer className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8" staggerDelay={0.12}>
            {products.map((product) => (
              <StaggerItem key={product.id} direction="up">
                <ProductCard
                  id={product.id}
                  title={product.title}
                  description={product.description}
                  imageUrl={product.imageUrl}
                  images={product.images as any}
                  category={product.category}
                  subCategory={product.subCategory}
                />
              </StaggerItem>
            ))}
          </StaggerContainer>
        ) : (
          <ScrollAnimation direction="up">
            <div className="text-center py-16 lg:py-20 bg-[#F9F8F4] rounded-2xl">
              <Package className="w-18 h-18 lg:w-20 lg:h-20 mx-auto text-[#2F2F2F]/20 mb-5" />
              <h3 className="text-xl lg:text-2xl font-semibold text-[#2F2F2F] mb-3">
                Henüz ürün eklenmedi
              </h3>
              <p className="text-base lg:text-lg text-[#2F2F2F]/60 mb-6">
                Yakında yeni ürünler eklenecektir.
              </p>
              <Link href="/iletisim">
                <Button className="bg-[#FFD300] text-[#2F2F2F] hover:bg-[#FFD300]/90 text-base lg:text-lg px-8 py-3 h-auto font-semibold">
                  Bizimle İletişime Geçin
                </Button>
              </Link>
            </div>
          </ScrollAnimation>
        )}
      </div>
    </section>
  );
}

import { useState } from "react";
import { Link } from "wouter";
import Layout from "@/components/Layout";
import ProductCard from "@/components/ProductCard";
import { trpc } from "@/lib/trpc";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Package, ArrowLeft, Refrigerator, X } from "lucide-react";
import { cn } from "@/lib/utils";

// Alt kategori tanımları
const SUB_CATEGORIES = [
  { value: "buzdolabi", label: "Buzdolabı" },
  { value: "camasir_makinesi", label: "Çamaşır Makinesi" },
  { value: "bulasik_makinesi", label: "Bulaşık Makinesi" },
  { value: "firin_ocak", label: "Fırın/Ocak" },
  { value: "derin_dondurucu", label: "Derin Dondurucu" },
  { value: "klima", label: "Klima" },
];

export default function ProductsBeyazEsya() {
  const [selectedSubCategory, setSelectedSubCategory] = useState<string | null>(null);
  
  const { data: products, isLoading } = trpc.products.list.useQuery({ 
    category: "beyaz_esya",
    subCategory: selectedSubCategory || undefined,
  });

  const handleSubCategoryClick = (value: string) => {
    setSelectedSubCategory(selectedSubCategory === value ? null : value);
  };

  const clearFilter = () => {
    setSelectedSubCategory(null);
  };

  return (
    <Layout>
      {/* Banner Section */}
      <section className="relative bg-gradient-to-br from-[#1a1a2e] via-[#16213e] to-[#0f3460] py-16 md:py-20 overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-0 right-0 w-96 h-96 bg-[#FFD300] rounded-full blur-3xl transform translate-x-1/2 -translate-y-1/2" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-400 rounded-full blur-3xl transform -translate-x-1/2 translate-y-1/2" />
        </div>
        
        <div className="container relative">
          <div className="flex items-center gap-3 text-gray-400 text-sm mb-4">
            <Link href="/" className="hover:text-white transition-colors">
              Anasayfa
            </Link>
            <span>/</span>
            <Link href="/urunler" className="hover:text-white transition-colors">
              Ürünlerimiz
            </Link>
            <span>/</span>
            <span className="text-[#FFD300]">2.El Beyaz Eşya</span>
          </div>
          <div className="flex items-center gap-5">
            <div className="w-16 h-16 md:w-20 md:h-20 rounded-2xl bg-[#FFD300] flex items-center justify-center shadow-lg">
              <Refrigerator className="w-8 h-8 md:w-10 md:h-10 text-[#2F2F2F]" />
            </div>
            <div>
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-white mb-2">
                2.EL BEYAZ EŞYA
              </h1>
              <p className="text-gray-300 text-lg md:text-xl">
                Kadıköy Fikirtepe'de uygun fiyatlı ikinci el beyaz eşya
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Products Section */}
      <section className="py-12 md:py-16">
        <div className="container">
          {/* Back Button */}
          <Link href="/urunler">
            <Button variant="ghost" className="mb-6 gap-2">
              <ArrowLeft className="w-4 h-4" />
              Tüm Kategoriler
            </Button>
          </Link>

          <div className="flex flex-col lg:flex-row gap-8">
            {/* Sidebar Filter - Desktop */}
            <aside className="hidden lg:block w-64 flex-shrink-0">
              <div className="sticky top-24 bg-card rounded-2xl border border-border/50 p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-foreground">Alt Kategoriler</h3>
                  {selectedSubCategory && (
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={clearFilter}
                      className="h-auto p-1 text-muted-foreground hover:text-foreground"
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  )}
                </div>
                <div className="space-y-2">
                  {SUB_CATEGORIES.map((subCat) => (
                    <button
                      key={subCat.value}
                      onClick={() => handleSubCategoryClick(subCat.value)}
                      className={cn(
                        "w-full text-left px-4 py-3 rounded-xl text-sm font-medium transition-all",
                        selectedSubCategory === subCat.value
                          ? "bg-primary text-foreground"
                          : "bg-muted/50 text-muted-foreground hover:bg-muted hover:text-foreground"
                      )}
                    >
                      {subCat.label}
                    </button>
                  ))}
                </div>
              </div>
            </aside>

            {/* Mobile Filter */}
            <div className="lg:hidden overflow-x-auto pb-4 -mx-4 px-4">
              <div className="flex gap-2 min-w-max">
                {selectedSubCategory && (
                  <Badge 
                    variant="outline" 
                    className="cursor-pointer px-4 py-2 text-sm bg-muted hover:bg-muted/80"
                    onClick={clearFilter}
                  >
                    <X className="w-3 h-3 mr-1" />
                    Temizle
                  </Badge>
                )}
                {SUB_CATEGORIES.map((subCat) => (
                  <Badge
                    key={subCat.value}
                    variant={selectedSubCategory === subCat.value ? "default" : "outline"}
                    className={cn(
                      "cursor-pointer px-4 py-2 text-sm whitespace-nowrap transition-all",
                      selectedSubCategory === subCat.value
                        ? "bg-primary text-foreground hover:bg-primary/90"
                        : "hover:bg-muted"
                    )}
                    onClick={() => handleSubCategoryClick(subCat.value)}
                  >
                    {subCat.label}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Products Grid */}
            <div className="flex-1">
              {isLoading ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                  {[...Array(6)].map((_, i) => (
                    <div key={i} className="space-y-4">
                      <Skeleton className="aspect-[4/3] w-full rounded-lg" />
                      <Skeleton className="h-6 w-3/4" />
                      <Skeleton className="h-4 w-full" />
                      <Skeleton className="h-10 w-full" />
                    </div>
                  ))}
                </div>
              ) : products && products.length > 0 ? (
                <>
                  <div className="flex items-center justify-between mb-6">
                    <p className="text-muted-foreground">
                      {products.length} ürün bulundu
                      {selectedSubCategory && (
                        <span className="ml-2">
                          - <span className="text-primary font-medium">
                            {SUB_CATEGORIES.find(s => s.value === selectedSubCategory)?.label}
                          </span>
                        </span>
                      )}
                    </p>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                    {products.map((product) => (
                      <ProductCard
                        key={product.id}
                        id={product.id}
                        title={product.title}
                        description={product.description}
                        imageUrl={product.imageUrl}
                        images={product.images as any}
                        category={product.category}
                        subCategory={product.subCategory}
                      />
                    ))}
                  </div>
                </>
              ) : (
                <div className="text-center py-16 bg-card rounded-2xl border border-border/50">
                  <Package className="w-16 h-16 mx-auto text-muted-foreground/50 mb-4" />
                  <h3 className="text-lg font-medium text-foreground mb-2">
                    {selectedSubCategory 
                      ? "Bu alt kategoride henüz ürün yok" 
                      : "Bu kategoride henüz ürün yok"}
                  </h3>
                  <p className="text-muted-foreground text-sm mb-6">
                    {selectedSubCategory 
                      ? "Farklı bir alt kategori deneyin veya filtreyi temizleyin."
                      : "Yakında yeni beyaz eşya ürünleri eklenecektir."}
                  </p>
                  {selectedSubCategory ? (
                    <Button variant="outline" onClick={clearFilter}>
                      Filtreyi Temizle
                    </Button>
                  ) : (
                    <Link href="/iletisim">
                      <Button variant="outline">Bizimle İletişime Geçin</Button>
                    </Link>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}

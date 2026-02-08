import { useState, useEffect } from "react";
import { Link, useSearch, useLocation } from "wouter";
import Layout from "@/components/Layout";
import ProductCard from "@/components/ProductCard";
import ProductDetailModal from "@/components/ProductDetailModal";
import { trpc } from "@/lib/trpc";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Package, Armchair, Refrigerator, X, ChevronDown, ChevronRight, Filter } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

// v5.0: Default subcategories (fallback when no dynamic categories exist)
const DEFAULT_SUB_CATEGORIES = {
  beyaz_esya: [
    { value: "buzdolabi", label: "Buzdolabı" },
    { value: "camasir_makinesi", label: "Çamaşır Makinesi" },
    { value: "bulasik_makinesi", label: "Bulaşık Makinesi" },
    { value: "firin_ocak", label: "Fırın/Ocak" },
    { value: "derin_dondurucu", label: "Derin Dondurucu" },
    { value: "klima", label: "Klima" },
  ],
  mobilya: [
    { value: "koltuk_takimi", label: "Koltuk Takımı" },
    { value: "kose_koltuk", label: "Köşe Koltuk" },
    { value: "yatak_baza", label: "Yatak/Baza" },
    { value: "gardrop", label: "Gardırop" },
    { value: "yemek_masasi", label: "Yemek Masası" },
    { value: "tv_unitesi", label: "TV Ünitesi" },
    { value: "sehpa", label: "Sehpa" },
  ],
};

export default function Products() {
  const [, setLocation] = useLocation();
  const searchString = useSearch();
  const searchParams = new URLSearchParams(searchString);
  
  // Parse URL parameters
  const urlCategory = searchParams.get("category") as "mobilya" | "beyaz_esya" | null;
  const urlSubCategory = searchParams.get("sub");
  const urlProductId = searchParams.get("id");
  
  const [selectedCategory, setSelectedCategory] = useState<"mobilya" | "beyaz_esya" | null>(urlCategory);
  const [selectedSubCategory, setSelectedSubCategory] = useState<string | null>(urlSubCategory);
  // v6.0: Alt kategoriler varsayılan olarak kapalı - sadece ilgili kategori seçiliyse açık
  const [mobilyaOpen, setMobilyaOpen] = useState(urlCategory === "mobilya");
  const [beyazEsyaOpen, setBeyazEsyaOpen] = useState(urlCategory === "beyaz_esya");
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  // v6.0: Deep linking state - Products seviyesinde yönetiliyor
  const [deepLinkModalOpen, setDeepLinkModalOpen] = useState(false);
  const [deepLinkProductId, setDeepLinkProductId] = useState<number | null>(
    urlProductId ? parseInt(urlProductId, 10) : null
  );

  // Fetch products
  const { data: products, isLoading } = trpc.products.list.useQuery({
    category: selectedCategory || undefined,
    subCategory: selectedSubCategory || undefined,
  });

  // v6.0: Deep linking - URL'de id varsa tRPC ile ürünü çek
  const { data: deepLinkProduct, isLoading: isDeepLinkLoading } = trpc.products.byId.useQuery(
    { id: deepLinkProductId! },
    { enabled: deepLinkProductId !== null && deepLinkProductId > 0 }
  );

  // v5.0: Fetch dynamic categories
  const { data: dynamicCategories } = trpc.categories.list.useQuery();

  // v6.0: Deep link ürünü geldiğinde modalı otomatik aç
  useEffect(() => {
    if (deepLinkProduct && deepLinkProductId !== null) {
      setDeepLinkModalOpen(true);
    }
  }, [deepLinkProduct, deepLinkProductId]);

  // v6.0: Sayfa ilk yüklendiğinde URL'deki id'yi kontrol et
  useEffect(() => {
    if (urlProductId) {
      const parsedId = parseInt(urlProductId, 10);
      if (!isNaN(parsedId) && parsedId > 0) {
        setDeepLinkProductId(parsedId);
      }
    }
  }, []); // Sadece mount'ta çalışır

  // v6.0: Deep link modalı kapatıldığında state ve URL temizle
  const handleDeepLinkModalClose = () => {
    setDeepLinkModalOpen(false);
    setDeepLinkProductId(null);
    // URL'den id parametresini temizle
    const currentUrl = new URL(window.location.href);
    if (currentUrl.searchParams.has("id")) {
      currentUrl.searchParams.delete("id");
      const cleanUrl = currentUrl.searchParams.toString();
      const newUrl = cleanUrl ? `/urunler?${cleanUrl}` : "/urunler";
      window.history.replaceState(null, "", newUrl);
    }
  };

  // Update URL when filters change
  useEffect(() => {
    // Deep link aktifken filtre URL'sini güncelleme
    if (deepLinkModalOpen || deepLinkProductId) return;

    const params = new URLSearchParams();
    if (selectedCategory) params.set("category", selectedCategory);
    if (selectedSubCategory) params.set("sub", selectedSubCategory);
    
    const newSearch = params.toString();
    const newUrl = newSearch ? `/urunler?${newSearch}` : "/urunler";
    
    // Only update if different
    if (window.location.pathname + window.location.search !== newUrl) {
      window.history.replaceState(null, "", newUrl);
    }
  }, [selectedCategory, selectedSubCategory, deepLinkModalOpen, deepLinkProductId]);

  // v5.0: Get subcategories (dynamic + default)
  const getSubCategories = (category: "mobilya" | "beyaz_esya") => {
    const dynamicCats = dynamicCategories?.filter(c => c.parentCategory === category) || [];
    const defaultCats = DEFAULT_SUB_CATEGORIES[category];
    
    // Merge dynamic categories with defaults
    const allCats = [...dynamicCats.map(c => ({ value: c.slug, label: c.name }))];
    
    // Add defaults that don't exist in dynamic
    defaultCats.forEach(dc => {
      if (!allCats.some(c => c.value === dc.value)) {
        allCats.push(dc);
      }
    });
    
    return allCats;
  };

  const handleCategoryClick = (category: "mobilya" | "beyaz_esya") => {
    if (selectedCategory === category) {
      // If clicking same category, clear it
      setSelectedCategory(null);
      setSelectedSubCategory(null);
    } else {
      setSelectedCategory(category);
      setSelectedSubCategory(null);
      // v6.0: Ana kategoriye tıklayınca alt kategorileri aç
      if (category === "mobilya") {
        setMobilyaOpen(true);
        setBeyazEsyaOpen(false);
      } else {
        setBeyazEsyaOpen(true);
        setMobilyaOpen(false);
      }
    }
  };

  const handleSubCategoryClick = (category: "mobilya" | "beyaz_esya", subCategory: string) => {
    if (selectedCategory === category && selectedSubCategory === subCategory) {
      // If clicking same subcategory, clear it but keep category
      setSelectedSubCategory(null);
    } else {
      setSelectedCategory(category);
      setSelectedSubCategory(subCategory);
    }
    setMobileFilterOpen(false);
  };

  const clearFilters = () => {
    setSelectedCategory(null);
    setSelectedSubCategory(null);
    setMobileFilterOpen(false);
  };

  // Get active filter label
  const getActiveFilterLabel = () => {
    if (selectedSubCategory && selectedCategory) {
      const subCats = getSubCategories(selectedCategory);
      const found = subCats.find(s => s.value === selectedSubCategory);
      return found?.label || selectedSubCategory;
    }
    if (selectedCategory) {
      return selectedCategory === "mobilya" ? "2.El Mobilya" : "2.El Beyaz Eşya";
    }
    return null;
  };

  // Sidebar content (shared between desktop and mobile)
  const SidebarContent = () => (
    <div className="space-y-2">
      {/* Clear Filter Button */}
      {(selectedCategory || selectedSubCategory) && (
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={clearFilters}
          className="w-full justify-start text-muted-foreground hover:text-foreground mb-4"
        >
          <X className="w-4 h-4 mr-2" />
          Filtreleri Temizle
        </Button>
      )}

      {/* Mobilya Category */}
      <Collapsible open={mobilyaOpen} onOpenChange={setMobilyaOpen}>
        <CollapsibleTrigger asChild>
          <button
            className={cn(
              "w-full flex items-center justify-between p-4 rounded-xl text-left font-semibold transition-all",
              selectedCategory === "mobilya" && !selectedSubCategory
                ? "bg-[#FFD300] text-[#2F2F2F]"
                : "bg-muted/50 text-foreground hover:bg-muted"
            )}
            onClick={(e) => {
              if (!mobilyaOpen) {
                setMobilyaOpen(true);
              }
              handleCategoryClick("mobilya");
            }}
          >
            <div className="flex items-center gap-3">
              <Armchair className="w-5 h-5" />
              <span>2.El Mobilya</span>
            </div>
            {mobilyaOpen ? (
              <ChevronDown className="w-4 h-4" />
            ) : (
              <ChevronRight className="w-4 h-4" />
            )}
          </button>
        </CollapsibleTrigger>
        <CollapsibleContent className="mt-2 ml-4 space-y-1">
          {getSubCategories("mobilya").map((subCat) => (
            <button
              key={subCat.value}
              onClick={() => handleSubCategoryClick("mobilya", subCat.value)}
              className={cn(
                "w-full text-left px-4 py-2.5 rounded-lg text-sm transition-all",
                selectedCategory === "mobilya" && selectedSubCategory === subCat.value
                  ? "bg-[#FFD300] text-[#2F2F2F] font-medium"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              )}
            >
              {subCat.label}
            </button>
          ))}
        </CollapsibleContent>
      </Collapsible>

      {/* Beyaz Eşya Category */}
      <Collapsible open={beyazEsyaOpen} onOpenChange={setBeyazEsyaOpen}>
        <CollapsibleTrigger asChild>
          <button
            className={cn(
              "w-full flex items-center justify-between p-4 rounded-xl text-left font-semibold transition-all",
              selectedCategory === "beyaz_esya" && !selectedSubCategory
                ? "bg-[#2F2F2F] text-white"
                : "bg-muted/50 text-foreground hover:bg-muted"
            )}
            onClick={(e) => {
              if (!beyazEsyaOpen) {
                setBeyazEsyaOpen(true);
              }
              handleCategoryClick("beyaz_esya");
            }}
          >
            <div className="flex items-center gap-3">
              <Refrigerator className="w-5 h-5" />
              <span>2.El Beyaz Eşya</span>
            </div>
            {beyazEsyaOpen ? (
              <ChevronDown className="w-4 h-4" />
            ) : (
              <ChevronRight className="w-4 h-4" />
            )}
          </button>
        </CollapsibleTrigger>
        <CollapsibleContent className="mt-2 ml-4 space-y-1">
          {getSubCategories("beyaz_esya").map((subCat) => (
            <button
              key={subCat.value}
              onClick={() => handleSubCategoryClick("beyaz_esya", subCat.value)}
              className={cn(
                "w-full text-left px-4 py-2.5 rounded-lg text-sm transition-all",
                selectedCategory === "beyaz_esya" && selectedSubCategory === subCat.value
                  ? "bg-[#2F2F2F] text-white font-medium"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              )}
            >
              {subCat.label}
            </button>
          ))}
        </CollapsibleContent>
      </Collapsible>
    </div>
  );

  // v6.0: Deep link ürün verisini modal formatına dönüştür
  const deepLinkProductData = deepLinkProduct ? {
    id: deepLinkProduct.id,
    title: deepLinkProduct.title,
    description: deepLinkProduct.description,
    category: deepLinkProduct.category as "mobilya" | "beyaz_esya",
    subCategory: deepLinkProduct.subCategory,
    imageUrl: deepLinkProduct.imageUrl,
    images: deepLinkProduct.images as any,
  } : null;

  return (
    <Layout>
      {/* Page Header */}
      <section className="bg-foreground py-12 md:py-16">
        <div className="container">
          <div className="flex items-center gap-3 text-gray-400 text-sm mb-4">
            <Link href="/" className="hover:text-white transition-colors">
              Anasayfa
            </Link>
            <span>/</span>
            <span className="text-[#FFD300]">Ürünlerimiz</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-3">Ürünlerimiz</h1>
          <p className="text-gray-300 max-w-2xl">
            İstanbul genelinde ikinci el mobilya ve beyaz eşya kategorilerimizi keşfedin. Tüm ürünlerimiz
            kontrol edilmiş ve temizlenmiş olarak satışa sunulmaktadır.
          </p>
        </div>
      </section>

      {/* Products Section */}
      <section className="py-12 md:py-16">
        <div className="container">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Desktop Sidebar */}
            <aside className="hidden lg:block w-72 flex-shrink-0">
              <div className="sticky top-24 bg-card rounded-2xl border border-border/50 p-6 max-h-[calc(100vh-8rem)] overflow-y-auto">
                <h3 className="font-bold text-foreground mb-4 text-lg">Kategoriler</h3>
                <SidebarContent />
              </div>
            </aside>

            {/* Mobile Filter Button & Sheet */}
            <div className="lg:hidden">
              <Sheet open={mobileFilterOpen} onOpenChange={setMobileFilterOpen}>
                <SheetTrigger asChild>
                  <Button variant="outline" className="w-full gap-2 mb-4">
                    <Filter className="w-4 h-4" />
                    Filtrele
                    {getActiveFilterLabel() && (
                      <Badge variant="secondary" className="ml-2">
                        {getActiveFilterLabel()}
                      </Badge>
                    )}
                  </Button>
                </SheetTrigger>
                <SheetContent side="left" className="w-80">
                  <SheetHeader>
                    <SheetTitle>Kategoriler</SheetTitle>
                  </SheetHeader>
                  <div className="mt-6">
                    <SidebarContent />
                  </div>
                </SheetContent>
              </Sheet>
            </div>

            {/* Products Grid */}
            <div className="flex-1">
              {/* Active Filter Badge (Mobile) */}
              {getActiveFilterLabel() && (
                <div className="flex items-center gap-2 mb-6 lg:hidden">
                  <span className="text-sm text-muted-foreground">Filtre:</span>
                  <Badge 
                    variant="secondary" 
                    className="cursor-pointer gap-1"
                    onClick={clearFilters}
                  >
                    {getActiveFilterLabel()}
                    <X className="w-3 h-3" />
                  </Badge>
                </div>
              )}

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
                      <span className="font-semibold text-foreground">{products.length}</span> ürün bulundu
                      {getActiveFilterLabel() && (
                        <span className="hidden lg:inline ml-2">
                          - <span className="text-primary font-medium">{getActiveFilterLabel()}</span>
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
                    {selectedCategory || selectedSubCategory
                      ? "Bu filtrede ürün bulunamadı"
                      : "Henüz ürün yok"}
                  </h3>
                  <p className="text-muted-foreground text-sm mb-6">
                    {selectedCategory || selectedSubCategory
                      ? "Farklı bir kategori deneyin veya filtreleri temizleyin."
                      : "Yakında yeni ürünler eklenecektir."}
                  </p>
                  {(selectedCategory || selectedSubCategory) ? (
                    <Button variant="outline" onClick={clearFilters}>
                      Filtreleri Temizle
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

      {/* v6.0: Deep Link Modal - Products seviyesinde, sayfa yüklenince URL'den id okuyup açılır */}
      <ProductDetailModal
        isOpen={deepLinkModalOpen}
        onClose={handleDeepLinkModalClose}
        product={deepLinkProductData}
        enableDeepLink={true}
      />
    </Layout>
  );
}

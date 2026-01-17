import { useState, useRef, useEffect, useCallback } from "react";
import { useLocation } from "wouter";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import {
  Plus,
  Package,
  LogOut,
  Trash2,
  Star,
  StarOff,
  Eye,
  EyeOff,
  Upload,
  ImageIcon,
  Home,
  Loader2,
  X,
  Images,
  GripVertical,
} from "lucide-react";
import { Link } from "wouter";

// Alt kategori tanımları
const SUB_CATEGORIES = {
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

// Image preview type
interface ImagePreview {
  id: string;
  file: File;
  preview: string;
}

// Max images per product
const MAX_IMAGES = 5;

export default function AdminDashboard() {
  const [, setLocation] = useLocation();
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [newProduct, setNewProduct] = useState({
    title: "",
    description: "",
    category: "" as "mobilya" | "beyaz_esya" | "",
    subCategory: "",
    isFeatured: false,
  });
  
  // v4.0: Multiple images state
  const [selectedImages, setSelectedImages] = useState<ImagePreview[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const dropZoneRef = useRef<HTMLDivElement>(null);

  // Check admin session
  const { data: sessionData, isLoading: sessionLoading } = trpc.admin.checkSession.useQuery();

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!sessionLoading && !sessionData?.isLoggedIn) {
      setLocation("/admin");
    }
  }, [sessionLoading, sessionData, setLocation]);

  const utils = trpc.useUtils();
  const { data: products, isLoading: productsLoading } = trpc.products.adminList.useQuery(
    undefined,
    { enabled: sessionData?.isLoggedIn === true }
  );

  const logoutMutation = trpc.admin.logout.useMutation({
    onSuccess: () => {
      toast.success("Çıkış yapıldı");
      setLocation("/admin");
    },
  });

  const createMutation = trpc.products.create.useMutation({
    onSuccess: () => {
      toast.success("Ürün başarıyla eklendi!");
      utils.products.adminList.invalidate();
      utils.products.featured.invalidate();
      utils.products.list.invalidate();
      setIsAddDialogOpen(false);
      resetForm();
    },
    onError: (error) => {
      toast.error(`Hata: ${error.message}`);
    },
  });

  const deleteMutation = trpc.products.delete.useMutation({
    onSuccess: () => {
      toast.success("Ürün silindi!");
      utils.products.adminList.invalidate();
      utils.products.featured.invalidate();
      utils.products.list.invalidate();
    },
    onError: (error) => {
      toast.error(`Hata: ${error.message}`);
    },
  });

  const toggleFeaturedMutation = trpc.products.toggleFeatured.useMutation({
    onSuccess: () => {
      utils.products.adminList.invalidate();
      utils.products.featured.invalidate();
    },
  });

  const toggleActiveMutation = trpc.products.toggleActive.useMutation({
    onSuccess: () => {
      utils.products.adminList.invalidate();
      utils.products.list.invalidate();
    },
  });

  const resetForm = () => {
    setNewProduct({ title: "", description: "", category: "", subCategory: "", isFeatured: false });
    setSelectedImages([]);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  // v4.0: Handle multiple image selection
  const handleImageSelect = useCallback((files: FileList | null) => {
    if (!files) return;

    const newImages: ImagePreview[] = [];
    const remainingSlots = MAX_IMAGES - selectedImages.length;

    Array.from(files).slice(0, remainingSlots).forEach((file) => {
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onloadend = () => {
          const preview: ImagePreview = {
            id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
            file,
            preview: reader.result as string,
          };
          setSelectedImages((prev) => {
            if (prev.length >= MAX_IMAGES) return prev;
            return [...prev, preview];
          });
        };
        reader.readAsDataURL(file);
      }
    });
  }, [selectedImages.length]);

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleImageSelect(e.target.files);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  // v4.0: Drag and drop handlers
  const handleDragEnter = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.currentTarget === dropZoneRef.current) {
      setIsDragging(false);
    }
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    handleImageSelect(e.dataTransfer.files);
  }, [handleImageSelect]);

  // v4.0: Remove single image from selection
  const removeImage = (id: string) => {
    setSelectedImages((prev) => prev.filter((img) => img.id !== id));
  };

  // v4.0: Reorder images (move to front)
  const moveImageToFront = (id: string) => {
    setSelectedImages((prev) => {
      const index = prev.findIndex((img) => img.id === id);
      if (index <= 0) return prev;
      const newImages = [...prev];
      const [removed] = newImages.splice(index, 1);
      newImages.unshift(removed);
      return newImages;
    });
  };

  const handleCategoryChange = (value: "mobilya" | "beyaz_esya") => {
    setNewProduct({ ...newProduct, category: value, subCategory: "" });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProduct.category) {
      toast.error("Lütfen bir kategori seçin");
      return;
    }

    // v4.0: Process multiple images
    const images: { base64: string; mimeType: string }[] = [];

    if (selectedImages.length > 0) {
      for (const img of selectedImages) {
        const base64 = img.preview.split(",")[1];
        images.push({
          base64,
          mimeType: img.file.type,
        });
      }
    }

    createMutation.mutate({
      title: newProduct.title,
      description: newProduct.description || undefined,
      category: newProduct.category as "mobilya" | "beyaz_esya",
      subCategory: newProduct.subCategory || undefined,
      isFeatured: newProduct.isFeatured,
      images: images.length > 0 ? images : undefined,
    });
  };

  // Alt kategori etiketini getir
  const getSubCategoryLabel = (category: string, subCategory: string | null) => {
    if (!subCategory) return null;
    const categoryKey = category as keyof typeof SUB_CATEGORIES;
    const subCats = SUB_CATEGORIES[categoryKey];
    if (!subCats) return null;
    const found = subCats.find(sc => sc.value === subCategory);
    return found?.label || null;
  };

  // Get image count for product
  const getImageCount = (product: any) => {
    if (product.images && Array.isArray(product.images)) {
      return product.images.length;
    }
    return product.imageUrl ? 1 : 0;
  };

  // Loading state
  if (sessionLoading) {
    return (
      <div className="min-h-screen bg-[#F9F8F4] flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-[#FFD300]" />
      </div>
    );
  }

  // Not authenticated - will redirect
  if (!sessionData?.isLoggedIn) {
    return (
      <div className="min-h-screen bg-[#F9F8F4] flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-[#FFD300]" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F9F8F4]">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white border-b border-[#2F2F2F]/10 shadow-sm">
        <div className="container py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/">
                <span className="text-xl font-bold text-[#2F2F2F]">
                  Spotçu <span className="text-[#FFD300]">Dükkanı</span>
                </span>
              </Link>
              <Badge className="bg-[#FFD300] text-[#2F2F2F]">Admin Panel</Badge>
            </div>
            <div className="flex items-center gap-3">
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => logoutMutation.mutate()}
                className="gap-2 text-[#2F2F2F]/70 hover:text-[#2F2F2F]"
              >
                <LogOut className="w-4 h-4" />
                <span className="hidden sm:inline">Çıkış</span>
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container py-8">
        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          <Card className="bg-white border-none shadow-md">
            <CardContent className="p-4 flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-[#FFD300]/10 flex items-center justify-center">
                <Package className="w-6 h-6 text-[#FFD300]" />
              </div>
              <div>
                <p className="text-sm text-[#2F2F2F]/60">Toplam Ürün</p>
                <p className="text-2xl font-bold text-[#2F2F2F]">
                  {products?.length || 0}
                </p>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-white border-none shadow-md">
            <CardContent className="p-4 flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-green-100 flex items-center justify-center">
                <Eye className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-[#2F2F2F]/60">Aktif Ürün</p>
                <p className="text-2xl font-bold text-[#2F2F2F]">
                  {products?.filter((p) => p.isActive === 1).length || 0}
                </p>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-white border-none shadow-md">
            <CardContent className="p-4 flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-yellow-100 flex items-center justify-center">
                <Star className="w-6 h-6 text-yellow-600" />
              </div>
              <div>
                <p className="text-sm text-[#2F2F2F]/60">Öne Çıkan</p>
                <p className="text-2xl font-bold text-[#2F2F2F]">
                  {products?.filter((p) => p.isFeatured === 1).length || 0}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Add Product Button */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-[#2F2F2F]">Ürün Yönetimi</h2>
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-[#FFD300] text-[#2F2F2F] hover:bg-[#FFD300]/90 gap-2">
                <Plus className="w-4 h-4" />
                Ürün Ekle
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Yeni Ürün Ekle</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                {/* v4.0: Multiple Image Upload Dropzone */}
                <div>
                  <Label className="flex items-center gap-2">
                    <Images className="w-4 h-4" />
                    Ürün Fotoğrafları (Maks. {MAX_IMAGES})
                  </Label>
                  <div className="mt-2">
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={handleFileInputChange}
                      className="hidden"
                      id="image-upload"
                    />
                    
                    {/* Dropzone */}
                    <div
                      ref={dropZoneRef}
                      onDragEnter={handleDragEnter}
                      onDragLeave={handleDragLeave}
                      onDragOver={handleDragOver}
                      onDrop={handleDrop}
                      onClick={() => selectedImages.length < MAX_IMAGES && fileInputRef.current?.click()}
                      className={`
                        relative border-2 border-dashed rounded-xl p-4 transition-all cursor-pointer
                        ${isDragging 
                          ? 'border-[#FFD300] bg-[#FFD300]/10' 
                          : 'border-[#2F2F2F]/20 hover:border-[#FFD300] bg-[#F9F8F4]'
                        }
                        ${selectedImages.length >= MAX_IMAGES ? 'opacity-50 cursor-not-allowed' : ''}
                      `}
                    >
                      {selectedImages.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-8 text-[#2F2F2F]/60">
                          <Upload className="w-10 h-10 mb-3" />
                          <p className="text-sm font-medium">Fotoğrafları sürükleyin veya tıklayın</p>
                          <p className="text-xs mt-1">PNG, JPG, WEBP (Maks. 5 adet)</p>
                        </div>
                      ) : (
                        <div className="grid grid-cols-3 gap-2">
                          {selectedImages.map((img, index) => (
                            <div 
                              key={img.id} 
                              className="relative aspect-square rounded-lg overflow-hidden group"
                            >
                              <img
                                src={img.preview}
                                alt={`Preview ${index + 1}`}
                                className="w-full h-full object-cover"
                              />
                              {/* Main image badge */}
                              {index === 0 && (
                                <div className="absolute top-1 left-1 bg-[#FFD300] text-[#2F2F2F] text-xs px-1.5 py-0.5 rounded font-medium">
                                  Ana
                                </div>
                              )}
                              {/* Actions overlay */}
                              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-1">
                                {index !== 0 && (
                                  <Button
                                    type="button"
                                    size="icon"
                                    variant="ghost"
                                    className="w-7 h-7 text-white hover:bg-white/20"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      moveImageToFront(img.id);
                                    }}
                                    title="Ana fotoğraf yap"
                                  >
                                    <Star className="w-4 h-4" />
                                  </Button>
                                )}
                                <Button
                                  type="button"
                                  size="icon"
                                  variant="ghost"
                                  className="w-7 h-7 text-white hover:bg-red-500/50"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    removeImage(img.id);
                                  }}
                                  title="Fotoğrafı kaldır"
                                >
                                  <X className="w-4 h-4" />
                                </Button>
                              </div>
                            </div>
                          ))}
                          {/* Add more button */}
                          {selectedImages.length < MAX_IMAGES && (
                            <div 
                              className="aspect-square rounded-lg border-2 border-dashed border-[#2F2F2F]/20 flex items-center justify-center hover:border-[#FFD300] transition-colors"
                            >
                              <Plus className="w-6 h-6 text-[#2F2F2F]/40" />
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                    <p className="text-xs text-[#2F2F2F]/50 mt-2">
                      İlk fotoğraf ana görsel olarak kullanılacaktır. Sürükleyerek sıralayabilirsiniz.
                    </p>
                  </div>
                </div>

                {/* Category */}
                <div>
                  <Label>Kategori</Label>
                  <Select
                    value={newProduct.category}
                    onValueChange={handleCategoryChange}
                  >
                    <SelectTrigger className="mt-1.5">
                      <SelectValue placeholder="Kategori seçin" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="mobilya">2.EL MOBİLYA</SelectItem>
                      <SelectItem value="beyaz_esya">2.EL BEYAZ EŞYA</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Sub Category */}
                {newProduct.category && (
                  <div>
                    <Label>Alt Kategori</Label>
                    <Select
                      value={newProduct.subCategory}
                      onValueChange={(value) =>
                        setNewProduct({ ...newProduct, subCategory: value })
                      }
                    >
                      <SelectTrigger className="mt-1.5">
                        <SelectValue placeholder="Alt kategori seçin (opsiyonel)" />
                      </SelectTrigger>
                      <SelectContent>
                        {SUB_CATEGORIES[newProduct.category as keyof typeof SUB_CATEGORIES]?.map(
                          (subCat) => (
                            <SelectItem key={subCat.value} value={subCat.value}>
                              {subCat.label}
                            </SelectItem>
                          )
                        )}
                      </SelectContent>
                    </Select>
                  </div>
                )}

                {/* Title */}
                <div>
                  <Label>Ürün Adı</Label>
                  <Input
                    value={newProduct.title}
                    onChange={(e) =>
                      setNewProduct({ ...newProduct, title: e.target.value })
                    }
                    placeholder="Örn: 3'lü Koltuk Takımı"
                    required
                    className="mt-1.5"
                  />
                </div>

                {/* Description */}
                <div>
                  <Label>Açıklama (Opsiyonel)</Label>
                  <Textarea
                    value={newProduct.description}
                    onChange={(e) =>
                      setNewProduct({ ...newProduct, description: e.target.value })
                    }
                    placeholder="Ürün hakkında detaylı bilgi yazın. Birden fazla paragraf kullanabilirsiniz..."
                    rows={5}
                    className="mt-1.5"
                  />
                </div>

                {/* Featured Toggle */}
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="featured"
                    checked={newProduct.isFeatured}
                    onChange={(e) =>
                      setNewProduct({ ...newProduct, isFeatured: e.target.checked })
                    }
                    className="w-4 h-4 rounded border-[#2F2F2F]/20"
                  />
                  <Label htmlFor="featured" className="cursor-pointer">
                    Ana sayfada öne çıkar
                  </Label>
                </div>

                <Button
                  type="submit"
                  disabled={createMutation.isPending}
                  className="w-full bg-[#FFD300] text-[#2F2F2F] hover:bg-[#FFD300]/90"
                >
                  {createMutation.isPending ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Ekleniyor...
                    </>
                  ) : (
                    "Ürünü Ekle"
                  )}
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {/* Products List */}
        {productsLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[...Array(6)].map((_, i) => (
              <Card key={i} className="bg-white border-none shadow-md">
                <CardContent className="p-4">
                  <Skeleton className="aspect-video w-full rounded-lg mb-3" />
                  <Skeleton className="h-5 w-3/4 mb-2" />
                  <Skeleton className="h-4 w-1/2" />
                </CardContent>
              </Card>
            ))}
          </div>
        ) : products && products.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {products.map((product) => (
              <Card key={product.id} className="bg-white border-none shadow-md overflow-hidden">
                <CardContent className="p-0">
                  {/* Product Image */}
                  <div className="aspect-video bg-[#F9F8F4] relative">
                    {product.imageUrl ? (
                      <img
                        src={product.imageUrl}
                        alt={product.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <ImageIcon className="w-12 h-12 text-[#2F2F2F]/20" />
                      </div>
                    )}
                    {/* Badges */}
                    <div className="absolute top-2 left-2 flex flex-wrap gap-1">
                      {product.isFeatured === 1 && (
                        <Badge className="bg-[#FFD300] text-[#2F2F2F]">Öne Çıkan</Badge>
                      )}
                      {product.isActive === 0 && (
                        <Badge variant="secondary">Pasif</Badge>
                      )}
                      {product.subCategory && (
                        <Badge variant="outline" className="bg-white/90">
                          {getSubCategoryLabel(product.category, product.subCategory)}
                        </Badge>
                      )}
                    </div>
                    {/* v4.0: Image count badge */}
                    {getImageCount(product) > 1 && (
                      <div className="absolute bottom-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded-full flex items-center gap-1">
                        <Images className="w-3 h-3" />
                        {getImageCount(product)}
                      </div>
                    )}
                  </div>

                  {/* Product Info */}
                  <div className="p-4">
                    <h3 className="font-semibold text-[#2F2F2F] mb-1 line-clamp-1">
                      {product.title}
                    </h3>
                    <p className="text-sm text-[#2F2F2F]/60 mb-3">
                      {product.category === "mobilya" ? "2.EL MOBİLYA" : "2.EL BEYAZ EŞYA"}
                    </p>

                    {/* Actions */}
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => toggleFeaturedMutation.mutate({ id: product.id })}
                        className="flex-1"
                      >
                        {product.isFeatured === 1 ? (
                          <StarOff className="w-4 h-4" />
                        ) : (
                          <Star className="w-4 h-4" />
                        )}
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => toggleActiveMutation.mutate({ id: product.id })}
                        className="flex-1"
                      >
                        {product.isActive === 1 ? (
                          <EyeOff className="w-4 h-4" />
                        ) : (
                          <Eye className="w-4 h-4" />
                        )}
                      </Button>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="outline" size="sm" className="text-red-500 hover:text-red-600">
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Ürünü Sil</AlertDialogTitle>
                            <AlertDialogDescription>
                              "{product.title}" ürününü silmek istediğinize emin misiniz?
                              Bu işlem geri alınamaz.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>İptal</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => deleteMutation.mutate({ id: product.id })}
                              className="bg-red-500 hover:bg-red-600"
                            >
                              Sil
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card className="bg-white border-none shadow-md">
            <CardContent className="p-12 text-center">
              <Package className="w-16 h-16 mx-auto text-[#2F2F2F]/20 mb-4" />
              <h3 className="text-lg font-semibold text-[#2F2F2F] mb-2">
                Henüz ürün yok
              </h3>
              <p className="text-[#2F2F2F]/60 mb-4">
                İlk ürününüzü ekleyerek başlayın
              </p>
              <Button
                onClick={() => setIsAddDialogOpen(true)}
                className="bg-[#FFD300] text-[#2F2F2F] hover:bg-[#FFD300]/90 gap-2"
              >
                <Plus className="w-4 h-4" />
                Ürün Ekle
              </Button>
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  );
}

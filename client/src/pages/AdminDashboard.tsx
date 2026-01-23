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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
  FileText,
  Calendar,
  Newspaper,
  Edit,
  FolderTree,
  Save,
} from "lucide-react";
import { Link } from "wouter";
import { format } from "date-fns";
import { tr } from "date-fns/locale";

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

// Image preview type
interface ImagePreview {
  id: string;
  file?: File;
  preview: string;
  key?: string; // For existing images
  isExisting?: boolean;
}

// Max images per product
const MAX_IMAGES = 5;

export default function AdminDashboard() {
  const [, setLocation] = useLocation();
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isBlogDialogOpen, setIsBlogDialogOpen] = useState(false);
  const [isCategoryDialogOpen, setIsCategoryDialogOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("products");
  const [editingProduct, setEditingProduct] = useState<any>(null);
  const [newProduct, setNewProduct] = useState({
    title: "",
    description: "",
    category: "" as "mobilya" | "beyaz_esya" | "",
    subCategory: "",
    isFeatured: false,
  });
  
  // v5.0: Blog state
  const [newBlog, setNewBlog] = useState({
    title: "",
    content: "",
    excerpt: "",
    isPublished: true,
  });
  const [blogCoverImage, setBlogCoverImage] = useState<ImagePreview | null>(null);
  const blogFileInputRef = useRef<HTMLInputElement>(null);

  // v5.0: Category state
  const [newCategory, setNewCategory] = useState({
    name: "",
    parentCategory: "" as "mobilya" | "beyaz_esya" | "",
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

  // v4.5: Blog posts query
  const { data: blogPosts, isLoading: blogLoading } = trpc.blog.adminList.useQuery(
    undefined,
    { enabled: sessionData?.isLoggedIn === true }
  );

  // v5.0: Categories query
  const { data: dynamicCategories } = trpc.categories.adminList.useQuery(
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

  // v5.0: Update product mutation
  const updateMutation = trpc.products.update.useMutation({
    onSuccess: () => {
      toast.success("Ürün başarıyla güncellendi!");
      utils.products.adminList.invalidate();
      utils.products.featured.invalidate();
      utils.products.list.invalidate();
      setIsEditDialogOpen(false);
      setEditingProduct(null);
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

  // v5.0: Blog mutations
  const createBlogMutation = trpc.blog.create.useMutation({
    onSuccess: () => {
      toast.success("Blog yazısı başarıyla eklendi!");
      utils.blog.adminList.invalidate();
      utils.blog.list.invalidate();
      setIsBlogDialogOpen(false);
      resetBlogForm();
    },
    onError: (error) => {
      toast.error(`Hata: ${error.message}`);
    },
  });

  const deleteBlogMutation = trpc.blog.delete.useMutation({
    onSuccess: () => {
      toast.success("Blog yazısı silindi!");
      utils.blog.adminList.invalidate();
      utils.blog.list.invalidate();
    },
    onError: (error) => {
      toast.error(`Hata: ${error.message}`);
    },
  });

  // v5.0: Category mutations
  const createCategoryMutation = trpc.categories.create.useMutation({
    onSuccess: () => {
      toast.success("Kategori başarıyla eklendi!");
      utils.categories.adminList.invalidate();
      utils.categories.list.invalidate();
      setIsCategoryDialogOpen(false);
      setNewCategory({ name: "", parentCategory: "" });
    },
    onError: (error) => {
      toast.error(`Hata: ${error.message}`);
    },
  });

  const deleteCategoryMutation = trpc.categories.delete.useMutation({
    onSuccess: () => {
      toast.success("Kategori silindi!");
      utils.categories.adminList.invalidate();
      utils.categories.list.invalidate();
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

  const resetBlogForm = () => {
    setNewBlog({ title: "", content: "", excerpt: "", isPublished: true });
    setBlogCoverImage(null);
    if (blogFileInputRef.current) {
      blogFileInputRef.current.value = "";
    }
  };

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

  // v4.0: Handle multiple image selection
  const handleImageSelect = useCallback((files: FileList | null) => {
    if (!files) return;

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

  // v5.0: Handle blog cover image
  const handleBlogImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setBlogCoverImage({
          id: `blog-${Date.now()}`,
          file,
          preview: reader.result as string,
        });
      };
      reader.readAsDataURL(file);
    }
    if (blogFileInputRef.current) {
      blogFileInputRef.current.value = "";
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

  // v5.0: Open edit dialog
  const openEditDialog = (product: any) => {
    setEditingProduct(product);
    setNewProduct({
      title: product.title,
      description: product.description || "",
      category: product.category,
      subCategory: product.subCategory || "",
      isFeatured: product.isFeatured === 1,
    });
    
    // Load existing images
    if (product.images && Array.isArray(product.images)) {
      setSelectedImages(product.images.map((img: any, index: number) => ({
        id: `existing-${index}`,
        preview: img.url,
        key: img.key,
        isExisting: true,
      })));
    } else if (product.imageUrl) {
      setSelectedImages([{
        id: 'existing-0',
        preview: product.imageUrl,
        key: product.imageKey,
        isExisting: true,
      }]);
    } else {
      setSelectedImages([]);
    }
    
    setIsEditDialogOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProduct.category) {
      toast.error("Lütfen bir kategori seçin");
      return;
    }

    // v4.0: Process multiple images
    const images: { base64: string; mimeType: string }[] = [];

    // Only process new images (not existing ones)
    for (const img of selectedImages) {
      if (!img.isExisting && img.file) {
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

  // v5.0: Handle edit submit
  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProduct) return;

    // Process new images
    const newImages: { base64: string; mimeType: string }[] = [];
    const existingImages: { url: string; key: string }[] = [];

    for (const img of selectedImages) {
      if (img.isExisting && img.key) {
        existingImages.push({ url: img.preview, key: img.key });
      } else if (img.file) {
        const base64 = img.preview.split(",")[1];
        newImages.push({
          base64,
          mimeType: img.file.type,
        });
      }
    }

    updateMutation.mutate({
      id: editingProduct.id,
      title: newProduct.title,
      description: newProduct.description || undefined,
      clearDescription: !newProduct.description,
      category: newProduct.category as "mobilya" | "beyaz_esya",
      subCategory: newProduct.subCategory || undefined,
      images: newImages.length > 0 ? newImages : undefined,
      existingImages: existingImages.length > 0 ? existingImages : undefined,
    });
  };

  // v5.0: Handle blog submit
  const handleBlogSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newBlog.title || !newBlog.content) {
      toast.error("Başlık ve içerik gerekli");
      return;
    }

    let coverImageBase64: string | undefined;
    let coverImageMimeType: string | undefined;

    if (blogCoverImage?.file) {
      coverImageBase64 = blogCoverImage.preview.split(",")[1];
      coverImageMimeType = blogCoverImage.file.type;
    }

    createBlogMutation.mutate({
      title: newBlog.title,
      content: newBlog.content,
      excerpt: newBlog.excerpt || undefined,
      isPublished: newBlog.isPublished,
      coverImageBase64,
      coverImageMimeType,
    });
  };

  // v5.0: Handle category submit
  const handleCategorySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCategory.name || !newCategory.parentCategory) {
      toast.error("Kategori adı ve ana kategori gerekli");
      return;
    }

    createCategoryMutation.mutate({
      name: newCategory.name,
      parentCategory: newCategory.parentCategory as "mobilya" | "beyaz_esya",
    });
  };

  // Alt kategori etiketini getir
  const getSubCategoryLabel = (category: string, subCategory: string | null) => {
    if (!subCategory) return null;
    const categoryKey = category as keyof typeof DEFAULT_SUB_CATEGORIES;
    
    // Check dynamic categories first
    const dynamicCat = dynamicCategories?.find(c => c.slug === subCategory);
    if (dynamicCat) return dynamicCat.name;
    
    // Fall back to defaults
    const subCats = DEFAULT_SUB_CATEGORIES[categoryKey];
    if (!subCats) return null;
    const found = subCats.find(sc => sc.value === subCategory);
    return found?.label || subCategory;
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

  // Product form component (shared between add and edit)
  const ProductForm = ({ isEdit = false }: { isEdit?: boolean }) => (
    <form onSubmit={isEdit ? handleEditSubmit : handleSubmit} className="space-y-4">
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
                    {/* Existing image badge */}
                    {img.isExisting && (
                      <div className="absolute bottom-1 left-1 bg-blue-500 text-white text-xs px-1.5 py-0.5 rounded font-medium">
                        Mevcut
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
            İlk fotoğraf ana görsel olarak kullanılacaktır.
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
              {getSubCategories(newProduct.category as "mobilya" | "beyaz_esya").map(
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
          id={isEdit ? "featured-edit" : "featured"}
          checked={newProduct.isFeatured}
          onChange={(e) =>
            setNewProduct({ ...newProduct, isFeatured: e.target.checked })
          }
          className="w-4 h-4 rounded border-[#2F2F2F]/20"
        />
        <Label htmlFor={isEdit ? "featured-edit" : "featured"} className="cursor-pointer">
          Ana sayfada öne çıkar
        </Label>
      </div>

      <Button
        type="submit"
        disabled={isEdit ? updateMutation.isPending : createMutation.isPending}
        className="w-full bg-[#FFD300] text-[#2F2F2F] hover:bg-[#FFD300]/90"
      >
        {(isEdit ? updateMutation.isPending : createMutation.isPending) ? (
          <>
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            {isEdit ? "Güncelleniyor..." : "Ekleniyor..."}
          </>
        ) : (
          <>
            <Save className="w-4 h-4 mr-2" />
            {isEdit ? "Değişiklikleri Kaydet" : "Ürünü Ekle"}
          </>
        )}
      </Button>
    </form>
  );

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
              <Badge className="bg-[#FFD300] text-[#2F2F2F]">Admin Panel v5.0</Badge>
            </div>
            <div className="flex items-center gap-2">
              <Link href="/">
                <Button variant="ghost" size="sm" className="gap-2 text-[#2F2F2F]/70 hover:text-[#2F2F2F]">
                  <Home className="w-4 h-4" />
                  <span className="hidden sm:inline">Siteye Git</span>
                </Button>
              </Link>
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
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
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
          <Card className="bg-white border-none shadow-md">
            <CardContent className="p-4 flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center">
                <Newspaper className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-[#2F2F2F]/60">Blog Yazısı</p>
                <p className="text-2xl font-bold text-[#2F2F2F]">
                  {blogPosts?.length || 0}
                </p>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-white border-none shadow-md">
            <CardContent className="p-4 flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-purple-100 flex items-center justify-center">
                <FolderTree className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-[#2F2F2F]/60">Alt Kategori</p>
                <p className="text-2xl font-bold text-[#2F2F2F]">
                  {dynamicCategories?.length || 0}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="bg-white shadow-md">
            <TabsTrigger value="products" className="gap-2">
              <Package className="w-4 h-4" />
              Ürünler
            </TabsTrigger>
            <TabsTrigger value="blog" className="gap-2">
              <Newspaper className="w-4 h-4" />
              Blog
            </TabsTrigger>
            <TabsTrigger value="categories" className="gap-2">
              <FolderTree className="w-4 h-4" />
              Kategoriler
            </TabsTrigger>
          </TabsList>

          {/* Products Tab */}
          <TabsContent value="products">
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
                  <ProductForm />
                </DialogContent>
              </Dialog>
            </div>

            {/* v5.0: Edit Product Dialog */}
            <Dialog open={isEditDialogOpen} onOpenChange={(open) => {
              setIsEditDialogOpen(open);
              if (!open) {
                setEditingProduct(null);
                resetForm();
              }
            }}>
              <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>Ürünü Düzenle</DialogTitle>
                </DialogHeader>
                <ProductForm isEdit />
              </DialogContent>
            </Dialog>

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
                        {/* Image count badge */}
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
                          {/* v5.0: Edit button */}
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => openEditDialog(product)}
                            className="flex-1"
                            title="Düzenle"
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => toggleFeaturedMutation.mutate({ id: product.id })}
                            title={product.isFeatured === 1 ? "Öne çıkarmayı kaldır" : "Öne çıkar"}
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
                            title={product.isActive === 1 ? "Pasif yap" : "Aktif yap"}
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
          </TabsContent>

          {/* v5.0: Blog Tab */}
          <TabsContent value="blog">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-[#2F2F2F]">Blog Yönetimi</h2>
              <Dialog open={isBlogDialogOpen} onOpenChange={setIsBlogDialogOpen}>
                <DialogTrigger asChild>
                  <Button className="bg-[#FFD300] text-[#2F2F2F] hover:bg-[#FFD300]/90 gap-2">
                    <Plus className="w-4 h-4" />
                    Blog Yazısı Ekle
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>Yeni Blog Yazısı</DialogTitle>
                  </DialogHeader>
                  <form onSubmit={handleBlogSubmit} className="space-y-4">
                    {/* Cover Image */}
                    <div>
                      <Label>Kapak Fotoğrafı</Label>
                      <div className="mt-2">
                        <input
                          ref={blogFileInputRef}
                          type="file"
                          accept="image/*"
                          onChange={handleBlogImageSelect}
                          className="hidden"
                          id="blog-image-upload"
                        />
                        {blogCoverImage ? (
                          <div className="relative aspect-video rounded-lg overflow-hidden">
                            <img
                              src={blogCoverImage.preview}
                              alt="Cover preview"
                              className="w-full h-full object-cover"
                            />
                            <Button
                              type="button"
                              size="icon"
                              variant="ghost"
                              className="absolute top-2 right-2 bg-black/50 hover:bg-black/70 text-white"
                              onClick={() => setBlogCoverImage(null)}
                            >
                              <X className="w-4 h-4" />
                            </Button>
                          </div>
                        ) : (
                          <div
                            onClick={() => blogFileInputRef.current?.click()}
                            className="border-2 border-dashed border-[#2F2F2F]/20 rounded-xl p-8 text-center cursor-pointer hover:border-[#FFD300] transition-colors"
                          >
                            <Upload className="w-10 h-10 mx-auto mb-3 text-[#2F2F2F]/40" />
                            <p className="text-sm text-[#2F2F2F]/60">Kapak fotoğrafı yüklemek için tıklayın</p>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Title */}
                    <div>
                      <Label>Başlık</Label>
                      <Input
                        value={newBlog.title}
                        onChange={(e) => setNewBlog({ ...newBlog, title: e.target.value })}
                        placeholder="Blog yazısı başlığı"
                        required
                        className="mt-1.5"
                      />
                    </div>

                    {/* Excerpt */}
                    <div>
                      <Label>Özet (Opsiyonel)</Label>
                      <Textarea
                        value={newBlog.excerpt}
                        onChange={(e) => setNewBlog({ ...newBlog, excerpt: e.target.value })}
                        placeholder="Kısa özet (liste görünümünde gösterilir)"
                        rows={2}
                        className="mt-1.5"
                      />
                    </div>

                    {/* Content */}
                    <div>
                      <Label>İçerik</Label>
                      <Textarea
                        value={newBlog.content}
                        onChange={(e) => setNewBlog({ ...newBlog, content: e.target.value })}
                        placeholder="Blog yazısı içeriği... HTML veya Markdown kullanabilirsiniz."
                        rows={10}
                        required
                        className="mt-1.5 font-mono text-sm"
                      />
                    </div>

                    {/* Published Toggle */}
                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        id="blog-published"
                        checked={newBlog.isPublished}
                        onChange={(e) => setNewBlog({ ...newBlog, isPublished: e.target.checked })}
                        className="w-4 h-4 rounded border-[#2F2F2F]/20"
                      />
                      <Label htmlFor="blog-published" className="cursor-pointer">
                        Hemen yayınla
                      </Label>
                    </div>

                    <Button
                      type="submit"
                      disabled={createBlogMutation.isPending}
                      className="w-full bg-[#FFD300] text-[#2F2F2F] hover:bg-[#FFD300]/90"
                    >
                      {createBlogMutation.isPending ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          Ekleniyor...
                        </>
                      ) : (
                        "Blog Yazısını Ekle"
                      )}
                    </Button>
                  </form>
                </DialogContent>
              </Dialog>
            </div>

            {/* Blog Posts List */}
            {blogLoading ? (
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
            ) : blogPosts && blogPosts.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {blogPosts.map((post) => (
                  <Card key={post.id} className="bg-white border-none shadow-md overflow-hidden">
                    <CardContent className="p-0">
                      {/* Cover Image */}
                      <div className="aspect-video bg-[#F9F8F4] relative">
                        {post.coverImage ? (
                          <img
                            src={post.coverImage}
                            alt={post.title}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <FileText className="w-12 h-12 text-[#2F2F2F]/20" />
                          </div>
                        )}
                        {/* Badges */}
                        <div className="absolute top-2 left-2 flex flex-wrap gap-1">
                          {post.isPublished === 0 && (
                            <Badge variant="secondary">Taslak</Badge>
                          )}
                          {post.isManual === 1 && (
                            <Badge className="bg-purple-500 text-white">Manuel</Badge>
                          )}
                          {post.isManual === 0 && (
                            <Badge className="bg-blue-500 text-white">n8n</Badge>
                          )}
                        </div>
                      </div>

                      {/* Post Info */}
                      <div className="p-4">
                        <h3 className="font-semibold text-[#2F2F2F] mb-1 line-clamp-2">
                          {post.title}
                        </h3>
                        <p className="text-sm text-[#2F2F2F]/60 mb-3 flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {format(new Date(post.createdAt), "d MMM yyyy", { locale: tr })}
                        </p>

                        {/* Actions */}
                        <div className="flex items-center gap-2">
                          <Link href={`/blog/${post.slug}`} className="flex-1">
                            <Button variant="outline" size="sm" className="w-full gap-1">
                              <Eye className="w-4 h-4" />
                              Görüntüle
                            </Button>
                          </Link>
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button variant="outline" size="sm" className="text-red-500 hover:text-red-600">
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Blog Yazısını Sil</AlertDialogTitle>
                                <AlertDialogDescription>
                                  "{post.title}" yazısını silmek istediğinize emin misiniz?
                                  Bu işlem geri alınamaz.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>İptal</AlertDialogCancel>
                                <AlertDialogAction
                                  onClick={() => deleteBlogMutation.mutate({ id: post.id })}
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
                  <Newspaper className="w-16 h-16 mx-auto text-[#2F2F2F]/20 mb-4" />
                  <h3 className="text-lg font-semibold text-[#2F2F2F] mb-2">
                    Henüz blog yazısı yok
                  </h3>
                  <p className="text-[#2F2F2F]/60 mb-4">
                    İlk blog yazınızı ekleyerek başlayın
                  </p>
                  <Button
                    onClick={() => setIsBlogDialogOpen(true)}
                    className="bg-[#FFD300] text-[#2F2F2F] hover:bg-[#FFD300]/90 gap-2"
                  >
                    <Plus className="w-4 h-4" />
                    Blog Yazısı Ekle
                  </Button>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* v5.0: Categories Tab */}
          <TabsContent value="categories">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-xl font-bold text-[#2F2F2F]">Kategori Yönetimi</h2>
                <p className="text-sm text-[#2F2F2F]/60 mt-1">
                  Dinamik alt kategoriler ekleyin. Bu kategoriler ürün ekleme/düzenleme formunda ve filtrelerde görünecektir.
                </p>
              </div>
              <Dialog open={isCategoryDialogOpen} onOpenChange={setIsCategoryDialogOpen}>
                <DialogTrigger asChild>
                  <Button className="bg-[#FFD300] text-[#2F2F2F] hover:bg-[#FFD300]/90 gap-2">
                    <Plus className="w-4 h-4" />
                    Alt Kategori Ekle
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-md">
                  <DialogHeader>
                    <DialogTitle>Yeni Alt Kategori</DialogTitle>
                  </DialogHeader>
                  <form onSubmit={handleCategorySubmit} className="space-y-4">
                    {/* Parent Category */}
                    <div>
                      <Label>Ana Kategori</Label>
                      <Select
                        value={newCategory.parentCategory}
                        onValueChange={(value) => setNewCategory({ ...newCategory, parentCategory: value as "mobilya" | "beyaz_esya" })}
                      >
                        <SelectTrigger className="mt-1.5">
                          <SelectValue placeholder="Ana kategori seçin" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="mobilya">2.EL MOBİLYA</SelectItem>
                          <SelectItem value="beyaz_esya">2.EL BEYAZ EŞYA</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Category Name */}
                    <div>
                      <Label>Alt Kategori Adı</Label>
                      <Input
                        value={newCategory.name}
                        onChange={(e) => setNewCategory({ ...newCategory, name: e.target.value })}
                        placeholder="Örn: Ütü Masası, Robot Süpürge"
                        required
                        className="mt-1.5"
                      />
                    </div>

                    <Button
                      type="submit"
                      disabled={createCategoryMutation.isPending}
                      className="w-full bg-[#FFD300] text-[#2F2F2F] hover:bg-[#FFD300]/90"
                    >
                      {createCategoryMutation.isPending ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          Ekleniyor...
                        </>
                      ) : (
                        "Kategori Ekle"
                      )}
                    </Button>
                  </form>
                </DialogContent>
              </Dialog>
            </div>

            {/* Categories List */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Mobilya Categories */}
              <Card className="bg-white border-none shadow-md">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Badge className="bg-[#FFD300] text-[#2F2F2F]">2.EL MOBİLYA</Badge>
                    Alt Kategorileri
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {/* Default categories */}
                    {DEFAULT_SUB_CATEGORIES.mobilya.map((cat) => (
                      <div key={cat.value} className="flex items-center justify-between p-3 bg-[#F9F8F4] rounded-lg">
                        <span className="text-[#2F2F2F]">{cat.label}</span>
                        <Badge variant="outline" className="text-xs">Varsayılan</Badge>
                      </div>
                    ))}
                    {/* Dynamic categories */}
                    {dynamicCategories?.filter(c => c.parentCategory === "mobilya").map((cat) => (
                      <div key={cat.id} className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
                        <span className="text-[#2F2F2F]">{cat.name}</span>
                        <div className="flex items-center gap-2">
                          <Badge className="bg-purple-500 text-white text-xs">Özel</Badge>
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button variant="ghost" size="sm" className="text-red-500 hover:text-red-600 h-8 w-8 p-0">
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Kategoriyi Sil</AlertDialogTitle>
                                <AlertDialogDescription>
                                  "{cat.name}" kategorisini silmek istediğinize emin misiniz?
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>İptal</AlertDialogCancel>
                                <AlertDialogAction
                                  onClick={() => deleteCategoryMutation.mutate({ id: cat.id })}
                                  className="bg-red-500 hover:bg-red-600"
                                >
                                  Sil
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Beyaz Eşya Categories */}
              <Card className="bg-white border-none shadow-md">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Badge className="bg-[#2F2F2F] text-white">2.EL BEYAZ EŞYA</Badge>
                    Alt Kategorileri
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {/* Default categories */}
                    {DEFAULT_SUB_CATEGORIES.beyaz_esya.map((cat) => (
                      <div key={cat.value} className="flex items-center justify-between p-3 bg-[#F9F8F4] rounded-lg">
                        <span className="text-[#2F2F2F]">{cat.label}</span>
                        <Badge variant="outline" className="text-xs">Varsayılan</Badge>
                      </div>
                    ))}
                    {/* Dynamic categories */}
                    {dynamicCategories?.filter(c => c.parentCategory === "beyaz_esya").map((cat) => (
                      <div key={cat.id} className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
                        <span className="text-[#2F2F2F]">{cat.name}</span>
                        <div className="flex items-center gap-2">
                          <Badge className="bg-purple-500 text-white text-xs">Özel</Badge>
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button variant="ghost" size="sm" className="text-red-500 hover:text-red-600 h-8 w-8 p-0">
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Kategoriyi Sil</AlertDialogTitle>
                                <AlertDialogDescription>
                                  "{cat.name}" kategorisini silmek istediğinize emin misiniz?
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>İptal</AlertDialogCancel>
                                <AlertDialogAction
                                  onClick={() => deleteCategoryMutation.mutate({ id: cat.id })}
                                  className="bg-red-500 hover:bg-red-600"
                                >
                                  Sil
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}

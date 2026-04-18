import Layout from "@/components/Layout";
import { useMetaTags } from "@/components/SEO";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { trpc } from "@/lib/trpc";
import { Link } from "wouter";
import { Calendar, ArrowRight, FileText, Newspaper } from "lucide-react";
import { format } from "date-fns";
import { tr } from "date-fns/locale";

export default function Blog() {
  useMetaTags({
    title: "Blog | Spotçu Dükkanı - İkinci El Eşya Rehberi",
    description: "Kadıköy Fikirtepe'den ikinci el mobilya ve beyaz eşya rehberleri, bakım ipuçları ve spot eşya fiyatları hakkında yazılar.",
    "og:title": "Blog | Spotçu Dükkanı",
    "og:description": "Fikirtepe spotçu rehberi - ikinci el eşya ipuçları ve fiyatlar.",
    "og:url": "https://spotcudukkani.com/blog",
  });

  const { data: posts, isLoading } = trpc.blog.list.useQuery();

  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-[#2F2F2F] via-[#3a3a3a] to-[#2F2F2F] py-16 md:py-20 overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 right-0 w-96 h-96 bg-[#FFD300] rounded-full blur-3xl transform translate-x-1/2 -translate-y-1/2" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-[#FFD300] rounded-full blur-3xl transform -translate-x-1/2 translate-y-1/2" />
        </div>
        
        <div className="container relative">
          <div className="flex items-center gap-3 text-gray-400 text-sm mb-4">
            <Link href="/" className="hover:text-white transition-colors">
              Anasayfa
            </Link>
            <span>/</span>
            <span className="text-[#FFD300]">Blog</span>
          </div>
          <div className="flex items-center gap-5">
            <div className="w-16 h-16 md:w-20 md:h-20 rounded-2xl bg-[#FFD300] flex items-center justify-center shadow-lg">
              <Newspaper className="w-8 h-8 md:w-10 md:h-10 text-[#2F2F2F]" />
            </div>
            <div>
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-white mb-2">
                Blog
              </h1>
              <p className="text-gray-300 text-lg md:text-xl">
                Kadıköy Fikirtepe'den ikinci el eşya rehberleri ve ipuçları
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Blog Posts */}
      <section className="py-12 lg:py-20 bg-background transition-colors duration-300">
        <div className="container">
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
              {[...Array(6)].map((_, i) => (
                <Card key={i} className="bg-card border-none shadow-lg">
                  <CardContent className="p-0">
                    <Skeleton className="aspect-video w-full" />
                    <div className="p-6 space-y-4">
                      <Skeleton className="h-6 w-3/4" />
                      <Skeleton className="h-4 w-full" />
                      <Skeleton className="h-4 w-2/3" />
                      <Skeleton className="h-10 w-full" />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : posts && posts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
              {posts.map((post) => (
                <Card key={post.id} className="bg-card border-none shadow-lg hover:shadow-xl transition-all group overflow-hidden">
                  <CardContent className="p-0">
                    {/* Cover Image */}
                    {post.coverImage ? (
                      <div className="aspect-video overflow-hidden">
                        <img
                          src={post.coverImage}
                          alt={`${post.title} - Spotçu Dükkanı Blog İstanbul ikinci el eşya`}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          loading="lazy"
                          decoding="async"
                        />
                      </div>
                    ) : (
                      <div className="aspect-video bg-muted flex items-center justify-center">
                        <FileText className="w-16 h-16 text-muted-foreground/30" />
                      </div>
                    )}
                    
                    {/* Content */}
                    <div className="p-6 lg:p-8">
                      {/* Date */}
                      <div className="flex items-center gap-2 text-sm text-muted-foreground mb-3">
                        <Calendar className="w-4 h-4" />
                        <span>
                          {format(new Date(post.createdAt), "d MMMM yyyy", { locale: tr })}
                        </span>
                      </div>
                      
                      {/* Title */}
                      <h2 className="text-xl lg:text-2xl font-bold text-foreground mb-3 line-clamp-2 group-hover:text-[#FFD300] transition-colors">
                        {post.title}
                      </h2>
                      
                      {/* Excerpt */}
                      {post.excerpt && (
                        <p className="text-base lg:text-lg text-muted-foreground mb-5 line-clamp-3">
                          {post.excerpt}
                        </p>
                      )}
                      
                      {/* Read More */}
                      <Link href={`/blog/${post.slug}`}>
                        <Button variant="outline" className="w-full gap-2 border-2 border-border hover:border-[#FFD300] hover:bg-[#FFD300]/5 text-base lg:text-lg py-3 h-auto">
                          Devamını Oku
                          <ArrowRight className="w-4 h-4" />
                        </Button>
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-16 lg:py-24">
              <FileText className="w-20 h-20 lg:w-24 lg:h-24 mx-auto text-muted-foreground/30 mb-6" />
              <h2 className="text-2xl lg:text-3xl font-bold text-foreground mb-4">
                Henüz blog yazısı yok
              </h2>
              <p className="text-lg lg:text-xl text-muted-foreground mb-8 max-w-md mx-auto">
                Yakında Fikirtepe spotçu fiyatları, ikinci el eşya rehberleri ve daha fazlası burada olacak.
              </p>
              <Link href="/iletisim">
                <Button className="bg-[#FFD300] text-[#2F2F2F] hover:bg-[#FFD300]/90 text-lg px-8 py-4 h-auto font-semibold">
                  Bizimle İletişime Geçin
                </Button>
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* SEO Content Section */}
      <section className="py-12 md:py-16 bg-card transition-colors duration-300">
        <div className="container">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-6">
              Fikirtepe Spotçu Rehberi
            </h2>
            <p className="text-muted-foreground leading-relaxed mb-6">
              Kadıköy Fikirtepe'de ikinci el mobilya ve beyaz eşya alım satımı hakkında bilmeniz gereken her şey blogumuzda. 
              Fikirtepe spotçu fiyatları, 2.el eşya değerleme ipuçları, mobilya bakım önerileri ve daha fazlası için 
              yazılarımızı takip edin.
            </p>
            <div className="flex flex-wrap justify-center gap-2">
              <Badge variant="outline" className="text-sm">Fikirtepe Spotçu</Badge>
              <Badge variant="outline" className="text-sm">2.El Mobilya</Badge>
              <Badge variant="outline" className="text-sm">Beyaz Eşya Fiyatları</Badge>
              <Badge variant="outline" className="text-sm">Kadıköy İkinci El</Badge>
              <Badge variant="outline" className="text-sm">Spot Eşya</Badge>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}

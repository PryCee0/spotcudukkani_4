import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { trpc } from "@/lib/trpc";
import { Link, useParams } from "wouter";
import { Calendar, ArrowLeft, Share2 } from "lucide-react";
import { format } from "date-fns";
import { tr } from "date-fns/locale";
import { Streamdown } from "streamdown";

export default function BlogPost() {
  const params = useParams<{ slug: string }>();
  const { data: post, isLoading, error } = trpc.blog.bySlug.useQuery(
    { slug: params.slug || "" },
    { enabled: !!params.slug }
  );

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: post?.title,
          url: window.location.href,
        });
      } catch (err) {
        console.log("Share cancelled");
      }
    } else {
      navigator.clipboard.writeText(window.location.href);
    }
  };

  if (isLoading) {
    return (
      <Layout>
        <div className="container py-12 lg:py-20">
          <div className="max-w-4xl mx-auto">
            <Skeleton className="h-8 w-32 mb-8" />
            <Skeleton className="aspect-video w-full rounded-2xl mb-8" />
            <Skeleton className="h-12 w-3/4 mb-4" />
            <Skeleton className="h-6 w-48 mb-8" />
            <div className="space-y-4">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  if (error || !post) {
    return (
      <Layout>
        <div className="container py-20 text-center">
          <h1 className="text-3xl font-bold text-[#2F2F2F] mb-4">
            Blog yazısı bulunamadı
          </h1>
          <p className="text-[#2F2F2F]/60 mb-8">
            Aradığınız blog yazısı mevcut değil veya kaldırılmış olabilir.
          </p>
          <Link href="/blog">
            <Button className="bg-[#FFD300] text-[#2F2F2F] hover:bg-[#FFD300]/90">
              Blog'a Dön
            </Button>
          </Link>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <article className="py-12 lg:py-20">
        <div className="container">
          <div className="max-w-4xl mx-auto">
            {/* Back Button */}
            <Link href="/blog">
              <Button variant="ghost" className="gap-2 mb-8 text-[#2F2F2F]/70 hover:text-[#2F2F2F]">
                <ArrowLeft className="w-4 h-4" />
                Blog'a Dön
              </Button>
            </Link>

            {/* Cover Image */}
            {post.coverImage && (
              <div className="aspect-video rounded-2xl overflow-hidden mb-8 shadow-lg">
                <img
                  src={post.coverImage}
                  alt={post.title}
                  className="w-full h-full object-cover"
                />
              </div>
            )}

            {/* Header */}
            <header className="mb-10">
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-[#2F2F2F] mb-4 leading-tight">
                {post.title}
              </h1>
              
              <div className="flex items-center justify-between flex-wrap gap-4">
                <div className="flex items-center gap-2 text-[#2F2F2F]/60">
                  <Calendar className="w-5 h-5" />
                  <span className="text-lg">
                    {format(new Date(post.createdAt), "d MMMM yyyy", { locale: tr })}
                  </span>
                </div>
                
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleShare}
                  className="gap-2"
                >
                  <Share2 className="w-4 h-4" />
                  Paylaş
                </Button>
              </div>
            </header>

            {/* Content */}
            <div className="prose prose-lg max-w-none prose-headings:text-[#2F2F2F] prose-p:text-[#2F2F2F]/80 prose-a:text-[#FFD300] prose-strong:text-[#2F2F2F]">
              <Streamdown>{post.content}</Streamdown>
            </div>

            {/* Footer CTA */}
            <div className="mt-12 pt-8 border-t border-[#2F2F2F]/10">
              <div className="bg-[#F9F8F4] rounded-2xl p-8 text-center">
                <h3 className="text-2xl font-bold text-[#2F2F2F] mb-4">
                  İkinci el eşya mı arıyorsunuz?
                </h3>
                <p className="text-[#2F2F2F]/70 mb-6">
                  Kaliteli ve uygun fiyatlı 2.el mobilya ve beyaz eşya için bize ulaşın.
                </p>
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                  <Link href="/urunler">
                    <Button className="bg-[#FFD300] text-[#2F2F2F] hover:bg-[#FFD300]/90 px-8">
                      Ürünleri İncele
                    </Button>
                  </Link>
                  <Link href="/iletisim">
                    <Button variant="outline" className="px-8">
                      İletişime Geç
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </article>
    </Layout>
  );
}

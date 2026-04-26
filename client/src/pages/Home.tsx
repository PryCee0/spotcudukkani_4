import Layout from "@/components/Layout";
import HeroSlider from "@/components/HeroSlider";
import TrustBanner from "@/components/TrustBanner";
import TrustCards from "@/components/TrustCards";
import CategoryCards from "@/components/CategoryCards";
import FeaturedProducts from "@/components/FeaturedProducts";
import SellCTABanner from "@/components/SellCTABanner";
import CTABanner from "@/components/CTABanner";
import Testimonials from "@/components/Testimonials";
import MobileHeroApp from "@/components/MobileHeroApp";

export default function Home() {
  return (
    <Layout>
      {/* v12.0: Mobil — App tarzı karşılama ekranı */}
      <MobileHeroApp />

      {/* Desktop — Mevcut HeroSlider (mobilde gizli) */}
      <div className="hidden md:block">
        <HeroSlider />
      </div>

      {/* TrustBanner — desktop'ta görünür, mobilde MobileHeroApp carousel'i bu rolü üstleniyor */}
      <TrustBanner />

      <div id="categories">
        <CategoryCards />
      </div>
      <TrustCards />
      <FeaturedProducts />
      <SellCTABanner />
      <CTABanner />
      <Testimonials />
    </Layout>
  );
}

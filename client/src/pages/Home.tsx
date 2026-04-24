import Layout from "@/components/Layout";
import HeroSlider from "@/components/HeroSlider";
import TrustBanner from "@/components/TrustBanner";
import TrustCards from "@/components/TrustCards";
import CategoryCards from "@/components/CategoryCards";
import FeaturedProducts from "@/components/FeaturedProducts";
import SellCTABanner from "@/components/SellCTABanner";
import CTABanner from "@/components/CTABanner";
import Testimonials from "@/components/Testimonials";

export default function Home() {
  return (
    <Layout>
      <HeroSlider />
      <TrustBanner />
      <CategoryCards />
      <TrustCards />
      <FeaturedProducts />
      <SellCTABanner />
      <CTABanner />
      <Testimonials />
    </Layout>
  );
}

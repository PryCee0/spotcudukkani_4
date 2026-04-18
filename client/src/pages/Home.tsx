import Layout from "@/components/Layout";
import HeroSlider from "@/components/HeroSlider";
import TrustBanner from "@/components/TrustBanner";
import TrustCards from "@/components/TrustCards";
import CategoryCards from "@/components/CategoryCards";
import FeaturedProducts from "@/components/FeaturedProducts";
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
      <CTABanner />
      <Testimonials />
    </Layout>
  );
}

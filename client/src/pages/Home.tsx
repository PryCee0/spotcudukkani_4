import Layout from "@/components/Layout";
import HeroSlider from "@/components/HeroSlider";
import TrustCards from "@/components/TrustCards";
import FeaturedProducts from "@/components/FeaturedProducts";
import CTABanner from "@/components/CTABanner";
import Testimonials from "@/components/Testimonials";

export default function Home() {
  return (
    <Layout>
      <HeroSlider />
      <TrustCards />
      <FeaturedProducts />
      <CTABanner />
      <Testimonials />
    </Layout>
  );
}

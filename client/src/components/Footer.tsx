import { Link } from "wouter";
import { Phone, Mail, MapPin, MessageCircle, ExternalLink } from "lucide-react";

const PHONE_NUMBER = "+905393160007";
const PHONE_DISPLAY = "+90 539 316 00 07";
const EMAIL = "spotcudukkani@gmail.com";
// v5.0: Updated address - Kurumsal Standart
const ADDRESS = "Özbey caddesi no 59, 34773 Fikirtepe Kadıköy/İstanbul (Fikirtepe metrobüs çıkışı)";
const GOOGLE_MAPS_URL = "https://maps.google.com/?q=Özbey+Caddesi+No+59+Fikirtepe+Kadıköy+İstanbul";
const FACEBOOK_URL = "https://facebook.com/ikincielesyadudullu";
const INSTAGRAM_URL = "https://instagram.com/spotcudukkani.comm";

const quickLinks = [
  { href: "/", label: "Anasayfa" },
  { href: "/hakkimizda", label: "Hakkımızda" },
  { href: "/urunler", label: "Ürünlerimiz" },
  { href: "/urunler?category=mobilya", label: "2.El Mobilya" },
  { href: "/urunler?category=beyaz_esya", label: "2.El Beyaz Eşya" },
  { href: "/blog", label: "Blog" },
  { href: "/iletisim", label: "İletişim" },
];

// v5.0: SEO keywords for footer
const seoKeywords = [
  "Fikirtepe Spotçu",
  "Kadıköy İkinci El",
  "2.El Mobilya",
  "2.El Beyaz Eşya",
  "Spot Eşya",
  "İkinci El Eşya",
];

export default function Footer() {
  const currentYear = new Date().getFullYear();
  const whatsappLink = `https://wa.me/${PHONE_NUMBER}?text=${encodeURIComponent("Merhaba, bilgi almak istiyorum.")}`;

  return (
    <footer className="bg-[#2F2F2F] text-white">
      {/* Main Footer - Büyütülmüş */}
      <div className="container py-14 lg:py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-12">
          {/* Brand Column */}
          <div className="lg:col-span-1">
            <Link href="/" className="inline-block mb-5 lg:mb-6">
              <img 
                src="/logo.png" 
                alt="Spotçu Dükkanı Logo" 
                className="h-12 lg:h-14 w-auto brightness-0 invert"
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                }}
              />
              <span className="text-2xl lg:text-3xl font-extrabold">
                Spotçu <span className="text-[#FFD300]">Dükkanı</span>
              </span>
            </Link>
            <p className="text-gray-400 text-base lg:text-lg leading-relaxed mb-6 lg:mb-8">
              2012 yılında Küçükyalı Spotçular Çarşısı'nda sektöre başlayan firmamız, Anadolu Yakası'nın farklı ilçelerinde faaliyet gösterdikten sonra 2021 yılından itibaren Kadıköy Fikirtepe'de hizmet vermeye devam etmektedir.
            </p>
            {/* Social Media */}
            <div className="flex gap-3">
              <a
                href={FACEBOOK_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="w-11 h-11 lg:w-12 lg:h-12 rounded-xl bg-white/10 hover:bg-[#1877F2] flex items-center justify-center transition-colors"
                aria-label="Facebook"
              >
                <svg className="w-5 h-5 lg:w-6 lg:h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                </svg>
              </a>
              <a
                href={INSTAGRAM_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="w-11 h-11 lg:w-12 lg:h-12 rounded-xl bg-white/10 hover:bg-gradient-to-br hover:from-[#833AB4] hover:via-[#FD1D1D] hover:to-[#F77737] flex items-center justify-center transition-all"
                aria-label="Instagram"
              >
                <svg className="w-5 h-5 lg:w-6 lg:h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                </svg>
              </a>
              <a
                href={whatsappLink}
                target="_blank"
                rel="noopener noreferrer"
                className="w-11 h-11 lg:w-12 lg:h-12 rounded-xl bg-white/10 hover:bg-[#25D366] flex items-center justify-center transition-colors"
                aria-label="WhatsApp"
              >
                <MessageCircle className="w-5 h-5 lg:w-6 lg:h-6" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg lg:text-xl font-bold mb-5 lg:mb-6">Hızlı Linkler</h3>
            <ul className="space-y-3 lg:space-y-4">
              {quickLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-gray-400 hover:text-[#FFD300] transition-colors text-base lg:text-lg"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg lg:text-xl font-bold mb-5 lg:mb-6">İletişim</h3>
            <ul className="space-y-4 lg:space-y-5">
              <li>
                <a
                  href={whatsappLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-start gap-3 text-gray-400 hover:text-[#FFD300] transition-colors group"
                >
                  <Phone className="w-5 h-5 lg:w-6 lg:h-6 mt-0.5 text-[#FFD300]" />
                  <span className="text-base lg:text-lg">{PHONE_DISPLAY}</span>
                </a>
              </li>
              <li>
                <a
                  href={`mailto:${EMAIL}`}
                  className="flex items-start gap-3 text-gray-400 hover:text-[#FFD300] transition-colors"
                >
                  <Mail className="w-5 h-5 lg:w-6 lg:h-6 mt-0.5 text-[#FFD300]" />
                  <span className="text-base lg:text-lg">{EMAIL}</span>
                </a>
              </li>
              <li>
                <a
                  href={GOOGLE_MAPS_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-start gap-3 text-gray-400 hover:text-[#FFD300] transition-colors group"
                >
                  <MapPin className="w-5 h-5 lg:w-6 lg:h-6 mt-0.5 text-[#FFD300] flex-shrink-0" />
                  <span className="text-base lg:text-lg">
                    {ADDRESS}
                    <ExternalLink className="w-3 h-3 inline-block ml-1 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </span>
                </a>
              </li>
            </ul>
          </div>

          {/* Working Hours */}
          <div>
            <h3 className="text-lg lg:text-xl font-bold mb-5 lg:mb-6">Çalışma Saatleri</h3>
            <ul className="space-y-3 lg:space-y-4 text-gray-400 text-base lg:text-lg">
              <li className="flex justify-between">
                <span>Pazartesi - Cuma</span>
                <span className="text-white">09:00 - 19:00</span>
              </li>
              <li className="flex justify-between">
                <span>Cumartesi</span>
                <span className="text-white">09:00 - 18:00</span>
              </li>
              <li className="flex justify-between">
                <span>Pazar</span>
                <span className="text-[#FFD300]">Kapalı</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* v5.0: SEO Keywords Section */}
      <div className="border-t border-white/5">
        <div className="container py-6">
          <div className="flex flex-wrap justify-center gap-3">
            {seoKeywords.map((keyword) => (
              <span
                key={keyword}
                className="text-xs text-gray-500 bg-white/5 px-3 py-1.5 rounded-full"
              >
                {keyword}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-white/10">
        <div className="container py-5 lg:py-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-center md:text-left">
            <p className="text-gray-500 text-sm lg:text-base">
              © {currentYear} Spotçu Dükkanı. Tüm hakları saklıdır.
            </p>
            <p className="text-gray-500 text-sm lg:text-base">
              Kadıköy Fikirtepe - İstanbul | İkinci El Mobilya & Beyaz Eşya
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}

import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Phone, MapPin, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";

const PHONE_NUMBER = "+905393160007";
const PHONE_DISPLAY = "+90 539 316 00 07";
const LOCATION = "İstanbul Avrupa/Anadolu";

const navLinks = [
  { href: "/", label: "Anasayfa" },
  { href: "/hakkimizda", label: "Hakkımızda" },
  { href: "/urunler", label: "Ürünlerimiz" },
  { href: "/blog", label: "Blog" },
  { href: "/iletisim", label: "İletişim" },
];

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [location] = useLocation();

  const whatsappLink = `https://wa.me/${PHONE_NUMBER}?text=${encodeURIComponent("Merhaba, bilgi almak istiyorum.")}`;

  return (
    <header className="sticky top-0 z-50 bg-white shadow-md">
      {/* Top Row - Contact Info - Premium büyütülmüş */}
      <div className="border-b border-border/50 bg-[#F9F8F4]">
        <div className="container py-3 lg:py-4">
          <div className="flex items-center justify-between">
            {/* v5.1 FIX: Logo + "Spotçu Dükkanı" text restored */}
            <Link href="/" className="flex items-center gap-3">
              <img 
                src="/logo.png?v=2" 
                alt="Spotçu Dükkanı Logo" 
                className="h-10 md:h-12 lg:h-14 w-auto object-contain"
                style={{ maxWidth: '160px' }}
                onError={(e) => {
                  // Fallback to uploads folder if root fails
                  const target = e.currentTarget;
                  if (!target.src.includes('/uploads/')) {
                    target.src = '/uploads/logo.png?v=2';
                  } else {
                    target.style.display = 'none';
                  }
                }}
              />
              <span className="text-xl md:text-2xl font-bold text-[#2F2F2F]">
                Spotçu <span className="text-[#FFD300]">Dükkanı</span>
              </span>
            </Link>

            {/* Contact Info - Desktop - Büyütülmüş */}
            <div className="hidden md:flex items-center gap-8 lg:gap-10">
              <a
                href={whatsappLink}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 text-base lg:text-lg font-semibold text-[#2F2F2F] hover:text-[#FFD300] transition-colors"
              >
                <div className="w-10 h-10 lg:w-12 lg:h-12 rounded-full bg-[#25D366] flex items-center justify-center shadow-md">
                  <Phone className="w-5 h-5 lg:w-6 lg:h-6 text-white" />
                </div>
                <span>{PHONE_DISPLAY}</span>
              </a>
              <div className="flex items-center gap-3 text-base lg:text-lg text-[#2F2F2F]/70">
                <MapPin className="w-5 h-5 lg:w-6 lg:h-6 text-[#FFD300]" />
                <span>{LOCATION}</span>
              </div>
            </div>

            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden w-12 h-12"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Menüyü aç/kapat"
            >
              {mobileMenuOpen ? <X className="w-7 h-7" /> : <Menu className="w-7 h-7" />}
            </Button>
          </div>
        </div>
      </div>

      {/* Bottom Row - Navigation - Desktop - Büyütülmüş */}
      <nav className="hidden md:block bg-white border-b border-border/30">
        <div className="container">
          <ul className="flex items-center gap-2 lg:gap-4">
            {navLinks.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className={`block px-5 lg:px-6 py-4 lg:py-5 text-base lg:text-lg font-medium transition-all hover:text-[#FFD300] ${
                    location === link.href
                      ? "text-[#FFD300] border-b-3 border-[#FFD300] bg-[#FFD300]/5"
                      : "text-[#2F2F2F]"
                  }`}
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </nav>

      {/* Mobile Menu - Büyütülmüş */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-t border-border animate-fade-in">
          <div className="container py-5">
            {/* Mobile Contact Info */}
            <div className="flex flex-col gap-4 pb-5 mb-5 border-b border-border">
              <a
                href={whatsappLink}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 text-base font-semibold"
              >
                <div className="w-10 h-10 rounded-full bg-[#25D366] flex items-center justify-center">
                  <Phone className="w-5 h-5 text-white" />
                </div>
                <span>{PHONE_DISPLAY}</span>
              </a>
              <div className="flex items-center gap-3 text-base text-[#2F2F2F]/70">
                <MapPin className="w-5 h-5 text-[#FFD300]" />
                <span>{LOCATION}</span>
              </div>
            </div>

            {/* Mobile Navigation */}
            <ul className="flex flex-col gap-2">
              {navLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className={`block px-5 py-4 rounded-xl text-base font-medium transition-colors ${
                      location === link.href
                        ? "bg-[#FFD300]/10 text-[#FFD300]"
                        : "text-[#2F2F2F] hover:bg-[#F9F8F4]"
                    }`}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </header>
  );
}

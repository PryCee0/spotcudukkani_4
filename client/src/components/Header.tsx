import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Phone, MapPin, Menu, X, Sun, Moon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/contexts/ThemeContext";

const PHONE_NUMBER = "+905393160007";
const PHONE_DISPLAY = "+90 539 316 00 07";
const LOCATION = "İstanbul Anadolu/Avrupa";

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
  const { theme, toggleTheme } = useTheme();

  const whatsappLink = `https://wa.me/${PHONE_NUMBER}?text=${encodeURIComponent("Merhaba, bilgi almak istiyorum.")}`;

  return (
    <header className="sticky top-0 z-50 bg-card shadow-md transition-colors duration-300">
      {/* Top Row - Contact Info - Premium büyütülmüş */}
      <div className="border-b border-border/50 bg-background transition-colors duration-300">
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
              <span className="text-xl md:text-2xl font-bold text-foreground transition-colors">
                Spotçu <span className="text-[#FFD300]">Dükkanı</span>
              </span>
            </Link>

            {/* Contact Info + Theme Toggle - Desktop - Büyütülmüş */}
            <div className="hidden md:flex items-center gap-6 lg:gap-8">
              <a
                href={whatsappLink}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 text-base lg:text-lg font-semibold text-foreground hover:text-[#FFD300] transition-colors"
              >
                <div className="w-10 h-10 lg:w-12 lg:h-12 rounded-full bg-[#25D366] flex items-center justify-center shadow-md">
                  <Phone className="w-5 h-5 lg:w-6 lg:h-6 text-white" />
                </div>
                <span>{PHONE_DISPLAY}</span>
              </a>
              <div className="flex items-center gap-3 text-base lg:text-lg text-muted-foreground">
                <MapPin className="w-5 h-5 lg:w-6 lg:h-6 text-[#FFD300]" />
                <span>{LOCATION}</span>
              </div>

              {/* Theme Toggle Button - Desktop */}
              <button
                onClick={toggleTheme}
                className="relative w-12 h-12 rounded-full bg-muted hover:bg-muted/80 flex items-center justify-center transition-all duration-300 hover:scale-105 group"
                aria-label={theme === 'light' ? 'Karanlık temaya geç' : 'Aydınlık temaya geç'}
                title={theme === 'light' ? 'Karanlık Tema' : 'Aydınlık Tema'}
              >
                <Sun className={`w-5 h-5 text-[#FFD300] absolute transition-all duration-300 ${
                  theme === 'light' ? 'rotate-0 scale-100 opacity-100' : 'rotate-90 scale-0 opacity-0'
                }`} />
                <Moon className={`w-5 h-5 text-[#FFD300] absolute transition-all duration-300 ${
                  theme === 'dark' ? 'rotate-0 scale-100 opacity-100' : '-rotate-90 scale-0 opacity-0'
                }`} />
              </button>
            </div>

            {/* Mobile: Theme Toggle + Menu Button */}
            <div className="flex md:hidden items-center gap-2">
              {/* Theme Toggle - Mobile */}
              <button
                onClick={toggleTheme}
                className="w-11 h-11 rounded-full bg-muted hover:bg-muted/80 flex items-center justify-center transition-all duration-300"
                aria-label={theme === 'light' ? 'Karanlık temaya geç' : 'Aydınlık temaya geç'}
              >
                <Sun className={`w-5 h-5 text-[#FFD300] absolute transition-all duration-300 ${
                  theme === 'light' ? 'rotate-0 scale-100 opacity-100' : 'rotate-90 scale-0 opacity-0'
                }`} />
                <Moon className={`w-5 h-5 text-[#FFD300] absolute transition-all duration-300 ${
                  theme === 'dark' ? 'rotate-0 scale-100 opacity-100' : '-rotate-90 scale-0 opacity-0'
                }`} />
              </button>

              {/* Mobile Menu Button */}
              <Button
                variant="ghost"
                size="icon"
                className="w-12 h-12"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                aria-label="Menüyü aç/kapat"
              >
                {mobileMenuOpen ? <X className="w-7 h-7" /> : <Menu className="w-7 h-7" />}
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Row - Navigation - Desktop - Büyütülmüş */}
      <nav className="hidden md:block bg-card border-b border-border/30 transition-colors duration-300">
        <div className="container">
          <ul className="flex items-center gap-2 lg:gap-4">
            {navLinks.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className={`block px-5 lg:px-6 py-4 lg:py-5 text-base lg:text-lg font-medium transition-all hover:text-[#FFD300] ${
                    location === link.href
                      ? "text-[#FFD300] border-b-3 border-[#FFD300] bg-[#FFD300]/5"
                      : "text-foreground"
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
        <div className="md:hidden bg-card border-t border-border animate-fade-in transition-colors duration-300">
          <div className="container py-5">
            {/* Mobile Contact Info */}
            <div className="flex flex-col gap-4 pb-5 mb-5 border-b border-border">
              <a
                href={whatsappLink}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 text-base font-semibold text-foreground"
              >
                <div className="w-10 h-10 rounded-full bg-[#25D366] flex items-center justify-center">
                  <Phone className="w-5 h-5 text-white" />
                </div>
                <span>{PHONE_DISPLAY}</span>
              </a>
              <div className="flex items-center gap-3 text-base text-muted-foreground">
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
                        : "text-foreground hover:bg-muted"
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

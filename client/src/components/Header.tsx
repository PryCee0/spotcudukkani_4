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
  { href: "/esya-sat", label: "Eşya Sat" },
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
    <header className="sticky top-0 z-50 bg-card shadow-md transition-colors duration-300" style={{ fontSize: '1.25rem' }}>
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
              <span className="font-brand text-2xl md:text-3xl lg:text-4xl font-bold text-foreground transition-colors tracking-wide">
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
              {/* Theme Toggle - Mobile v11.0: büyütüldü */}
              <button
                onClick={toggleTheme}
                className="w-14 h-14 rounded-full bg-muted hover:bg-muted/80 flex items-center justify-center transition-all duration-300"
                aria-label={theme === 'light' ? 'Karanlık temaya geç' : 'Aydınlık temaya geç'}
              >
                <Sun className={`w-6 h-6 text-[#FFD300] absolute transition-all duration-300 ${
                  theme === 'light' ? 'rotate-0 scale-100 opacity-100' : 'rotate-90 scale-0 opacity-0'
                }`} />
                <Moon className={`w-6 h-6 text-[#FFD300] absolute transition-all duration-300 ${
                  theme === 'dark' ? 'rotate-0 scale-100 opacity-100' : '-rotate-90 scale-0 opacity-0'
                }`} />
              </button>

              {/* Mobile Menu Button v11.0: büyütüldü */}
              <Button
                variant="ghost"
                size="icon"
                className="w-16 h-16"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                aria-label="Menüyü aç/kapat"
              >
                {mobileMenuOpen ? <X className="w-8 h-8" /> : <Menu className="w-8 h-8" />}
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Row - Navigation - Desktop - Büyütülmüş ve 3D Efektli */}
      <nav className="hidden md:block bg-card border-b-[4px] border-border/60 shadow-[0_8px_20px_-4px_rgba(0,0,0,0.2)] dark:shadow-[0_8px_20px_-4px_rgba(0,0,0,0.5)] transition-colors duration-300 relative z-40 transform-gpu">
        <div className="container">
          <ul className="flex items-center gap-4 lg:gap-8">
            {navLinks.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className={`block px-6 lg:px-8 py-5 lg:py-6 text-[1.15rem] lg:text-[1.35rem] font-bold transition-all hover:text-[#FFD300] ${
                    location === link.href
                      ? "text-[#FFD300] border-b-[4px] border-[#FFD300] bg-[#FFD300]/10 shadow-[inset_0_-8px_16px_-8px_rgba(255,211,0,0.3)]"
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
                    className={`block px-5 py-5 rounded-xl text-lg font-medium transition-colors ${
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

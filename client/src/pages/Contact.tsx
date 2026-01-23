import Layout from "@/components/Layout";
import { Phone, Mail, MapPin, Clock, MessageCircle, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

const PHONE_NUMBER = "+905393160007";
const PHONE_DISPLAY = "+90 539 316 00 07";
const EMAIL = "spotcudukkani@gmail.com";
// v5.0: Updated address
const ADDRESS = "Dumlupınar Mahallesi, Fikirtepe, Kadıköy/İstanbul";
const FACEBOOK_URL = "https://facebook.com/ikincielesyadudullu";
const INSTAGRAM_URL = "https://instagram.com/spotcudukkani.comm";

// v5.0: Updated coordinates for Dumlupınar Mahallesi
const GOOGLE_MAPS_EMBED = "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3011.5!2d29.047!3d40.995!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zNDDCsDU5JzQyLjAiTiAyOcKwMDInNDkuMiJF!5e0!3m2!1str!2str!4v1705500000000";

const contactInfo = [
  {
    icon: Phone,
    title: "Telefon",
    value: PHONE_DISPLAY,
    href: `tel:${PHONE_NUMBER}`,
    color: "bg-[#FFD300]",
  },
  {
    icon: MessageCircle,
    title: "WhatsApp",
    value: "Hemen Yazın",
    href: `https://wa.me/${PHONE_NUMBER}?text=${encodeURIComponent("Merhaba, bilgi almak istiyorum.")}`,
    color: "bg-[#25D366]",
  },
  {
    icon: Mail,
    title: "E-posta",
    value: EMAIL,
    href: `mailto:${EMAIL}`,
    color: "bg-[#2F2F2F]",
  },
];

const workingHours = [
  { day: "Pazartesi - Cuma", hours: "09:00 - 19:00" },
  { day: "Cumartesi", hours: "09:00 - 18:00" },
  { day: "Pazar", hours: "Kapalı" },
];

export default function Contact() {
  const whatsappLink = `https://wa.me/${PHONE_NUMBER}?text=${encodeURIComponent("Merhaba, bilgi almak istiyorum.")}`;
  const phoneLink = `tel:${PHONE_NUMBER}`;
  
  // v5.0: Google Maps yol tarifi linki - Dumlupınar Mahallesi
  const directionsLink = `https://www.google.com/maps/dir/?api=1&destination=Dumlupınar+Mahallesi+Fikirtepe+Kadıköy+İstanbul`;

  return (
    <Layout>
      {/* Hero Section */}
      <section className="bg-[#2F2F2F] py-16 lg:py-24">
        <div className="container text-center">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-white mb-4 lg:mb-6">
            İletişim
          </h1>
          <p className="text-xl md:text-2xl text-gray-300 max-w-2xl mx-auto">
            Kadıköy Fikirtepe'de size yardımcı olmaktan mutluluk duyarız
          </p>
        </div>
      </section>

      {/* Main CTA Buttons - Büyük ve Belirgin */}
      <section className="py-12 lg:py-16 bg-[#F9F8F4]">
        <div className="container">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-[#2F2F2F] text-center mb-8 lg:mb-10">
              Hemen Bize Ulaşın
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 lg:gap-6">
              {/* Telefon Butonu */}
              <a href={phoneLink} className="block">
                <Button 
                  size="lg" 
                  className="w-full bg-[#FFD300] text-[#2F2F2F] hover:bg-[#FFD300]/90 text-xl lg:text-2xl px-8 py-8 lg:py-10 h-auto font-bold gap-4 shadow-lg hover:shadow-xl transition-all"
                >
                  <Phone className="w-8 h-8 lg:w-10 lg:h-10" />
                  <div className="text-left">
                    <div className="text-sm lg:text-base font-normal opacity-80">Hemen Arayın</div>
                    <div>{PHONE_DISPLAY}</div>
                  </div>
                </Button>
              </a>

              {/* WhatsApp Butonu */}
              <a href={whatsappLink} target="_blank" rel="noopener noreferrer" className="block">
                <Button 
                  size="lg" 
                  className="w-full bg-[#25D366] hover:bg-[#128C7E] text-white text-xl lg:text-2xl px-8 py-8 lg:py-10 h-auto font-bold gap-4 shadow-lg hover:shadow-xl transition-all"
                >
                  <MessageCircle className="w-8 h-8 lg:w-10 lg:h-10" />
                  <div className="text-left">
                    <div className="text-sm lg:text-base font-normal opacity-80">WhatsApp ile</div>
                    <div>Mesaj Gönderin</div>
                  </div>
                </Button>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Info Cards */}
      <section className="py-12 lg:py-16 bg-white">
        <div className="container">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 max-w-5xl mx-auto">
            {contactInfo.map((info, index) => (
              <a
                key={index}
                href={info.href}
                target={info.title === "WhatsApp" ? "_blank" : undefined}
                rel={info.title === "WhatsApp" ? "noopener noreferrer" : undefined}
                className="block"
              >
                <Card className="h-full bg-white border-none shadow-lg hover:shadow-xl transition-all hover:-translate-y-1 group">
                  <CardContent className="p-6 lg:p-8 text-center">
                    <div className={`w-16 h-16 lg:w-20 lg:h-20 mx-auto mb-5 rounded-2xl ${info.color} flex items-center justify-center shadow-md group-hover:scale-110 transition-transform`}>
                      <info.icon className="w-8 h-8 lg:w-10 lg:h-10 text-white" />
                    </div>
                    <h3 className="text-lg lg:text-xl font-bold text-[#2F2F2F] mb-2">
                      {info.title}
                    </h3>
                    <p className="text-base lg:text-lg text-[#2F2F2F]/70 group-hover:text-[#FFD300] transition-colors">
                      {info.value}
                    </p>
                  </CardContent>
                </Card>
              </a>
            ))}
          </div>

          {/* Social Media */}
          <div className="flex justify-center gap-4 mt-10">
            <a
              href={FACEBOOK_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="w-14 h-14 lg:w-16 lg:h-16 rounded-xl bg-[#1877F2] flex items-center justify-center text-white hover:opacity-90 transition-opacity shadow-md"
              aria-label="Facebook"
            >
              <svg className="w-6 h-6 lg:w-7 lg:h-7" fill="currentColor" viewBox="0 0 24 24">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
              </svg>
            </a>
            <a
              href={INSTAGRAM_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="w-14 h-14 lg:w-16 lg:h-16 rounded-xl bg-gradient-to-br from-[#833AB4] via-[#FD1D1D] to-[#F77737] flex items-center justify-center text-white hover:opacity-90 transition-opacity shadow-md"
              aria-label="Instagram"
            >
              <svg className="w-6 h-6 lg:w-7 lg:h-7" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
              </svg>
            </a>
          </div>
        </div>
      </section>

      {/* Address & Map Section */}
      <section className="py-12 lg:py-16 bg-[#F9F8F4]">
        <div className="container">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 max-w-6xl mx-auto">
            {/* Address Info */}
            <div>
              <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-[#2F2F2F] mb-6 lg:mb-8">
                Adresimiz - Kadıköy Fikirtepe
              </h2>
              
              <Card className="bg-white border-none shadow-lg mb-6 lg:mb-8">
                <CardContent className="p-6 lg:p-8">
                  <div className="flex items-start gap-4">
                    <div className="w-14 h-14 lg:w-16 lg:h-16 rounded-xl bg-[#FFD300]/10 flex items-center justify-center flex-shrink-0">
                      <MapPin className="w-7 h-7 lg:w-8 lg:h-8 text-[#FFD300]" />
                    </div>
                    <div>
                      <h3 className="text-lg lg:text-xl font-bold text-[#2F2F2F] mb-2">
                        Spotçu Dükkanı
                      </h3>
                      <p className="text-base lg:text-lg text-[#2F2F2F]/70 leading-relaxed mb-4">
                        {ADDRESS}
                      </p>
                      {/* v5.0: Yol tarifi butonu */}
                      <a 
                        href={directionsLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 text-[#FFD300] hover:text-[#FFD300]/80 font-semibold transition-colors"
                      >
                        <MapPin className="w-4 h-4" />
                        Yol Tarifi Al
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Working Hours */}
              <Card className="bg-white border-none shadow-lg">
                <CardContent className="p-6 lg:p-8">
                  <div className="flex items-start gap-4 mb-5">
                    <div className="w-14 h-14 lg:w-16 lg:h-16 rounded-xl bg-[#FFD300]/10 flex items-center justify-center flex-shrink-0">
                      <Clock className="w-7 h-7 lg:w-8 lg:h-8 text-[#FFD300]" />
                    </div>
                    <div>
                      <h3 className="text-lg lg:text-xl font-bold text-[#2F2F2F]">
                        Çalışma Saatleri
                      </h3>
                    </div>
                  </div>
                  <ul className="space-y-3 lg:space-y-4">
                    {workingHours.map((item, index) => (
                      <li key={index} className="flex justify-between text-base lg:text-lg">
                        <span className="text-[#2F2F2F]/70">{item.day}</span>
                        <span className={`font-semibold ${item.hours === "Kapalı" ? "text-red-500" : "text-[#2F2F2F]"}`}>
                          {item.hours}
                        </span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </div>

            {/* Map */}
            <div>
              <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-[#2F2F2F] mb-6 lg:mb-8">
                Harita
              </h2>
              <div className="rounded-2xl overflow-hidden shadow-lg h-[400px] lg:h-[500px]">
                <iframe
                  src={GOOGLE_MAPS_EMBED}
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Spotçu Dükkanı Konum - Dumlupınar Mahallesi, Fikirtepe, Kadıköy"
                />
              </div>
              {/* v5.0: Harita altı bilgi */}
              <p className="text-sm text-[#2F2F2F]/60 mt-4 text-center">
                Fikirtepe Metrobüs Durağı yakını | Kadıköy Fikirtepe
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="py-12 lg:py-16 bg-[#2F2F2F]">
        <div className="container text-center">
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-white mb-4 lg:mb-6">
            Sorularınız mı var?
          </h2>
          <p className="text-lg lg:text-xl text-gray-300 mb-8 lg:mb-10 max-w-2xl mx-auto">
            Kadıköy Fikirtepe'de 2.el mobilya ve beyaz eşya alım satım konusunda size yardımcı olmaktan mutluluk duyarız.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 lg:gap-6">
            <a href={phoneLink}>
              <Button 
                size="lg" 
                className="bg-[#FFD300] text-[#2F2F2F] hover:bg-[#FFD300]/90 text-lg lg:text-xl px-8 lg:px-10 py-5 lg:py-6 h-auto font-bold gap-3"
              >
                <Phone className="w-6 h-6" />
                Hemen Arayın
              </Button>
            </a>
            <a href={whatsappLink} target="_blank" rel="noopener noreferrer">
              <Button 
                size="lg" 
                className="bg-[#25D366] hover:bg-[#128C7E] text-white text-lg lg:text-xl px-8 lg:px-10 py-5 lg:py-6 h-auto font-bold gap-3"
              >
                <MessageCircle className="w-6 h-6" />
                WhatsApp'tan Yazın
              </Button>
            </a>
          </div>
        </div>
      </section>
    </Layout>
  );
}

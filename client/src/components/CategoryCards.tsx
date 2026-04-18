import { Link } from "wouter";
import { memo } from "react";
import ScrollAnimation, { StaggerContainer, StaggerItem } from "./ScrollAnimation";

const categoryCards = [
    {
        title: "2.El Mobilya",
        subtitle: "Koltuk, Yatak, Gardırop & Daha Fazlası",
        href: "/urunler/mobilya",
        emoji: "🛋️",
        gradient: "from-orange-500/90 to-amber-700/90",
        bgImage: "/uploads/slider1.webp",
        items: ["Koltuk Takımı", "Köşe Koltuk", "Yatak/Baza", "Gardırop", "Yemek Masası"],
    },
    {
        title: "2.El Beyaz Eşya",
        subtitle: "Buzdolabı, Çamaşır Makinesi & Daha Fazlası",
        href: "/urunler/beyaz-esya",
        emoji: "🧊",
        gradient: "from-stone-500/90 to-stone-700/90",
        bgImage: "/uploads/slider2.webp",
        items: ["Buzdolabı", "Çamaşır Makinesi", "Bulaşık Makinesi", "Fırın/Ocak", "Klima"],
    },
];

function CategoryCards() {
    return (
        <section className="py-12 md:py-16 lg:py-20 bg-card transition-colors duration-300">
            <div className="container">
                <ScrollAnimation direction="up">
                    <div className="text-center mb-10 lg:mb-14">
                        <h2 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-foreground mb-3 lg:mb-4">
                            Kategoriler
                        </h2>
                        <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
                            Aradığınız ürünü hızlıca bulun
                        </p>
                    </div>
                </ScrollAnimation>

                <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8" staggerDelay={0.15}>
                    {categoryCards.map((card) => (
                        <StaggerItem key={card.title} direction="up">
                            <Link href={card.href}>
                                <div className="group relative h-[280px] md:h-[320px] lg:h-[360px] rounded-2xl overflow-hidden cursor-pointer shadow-lg hover:shadow-2xl transition-all duration-500">
                                    {/* Background Image */}
                                    <img
                                        src={card.bgImage}
                                        alt={card.title}
                                        className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                                        loading="lazy"
                                        decoding="async"
                                    />
                                    {/* Gradient Overlay */}
                                    <div className={`absolute inset-0 bg-gradient-to-t ${card.gradient}`} />

                                    {/* Content */}
                                    <div className="relative h-full flex flex-col justify-end p-6 md:p-8 text-white">
                                        <div className="text-4xl md:text-5xl mb-3 group-hover:scale-110 transition-transform duration-300 w-fit">
                                            {card.emoji}
                                        </div>
                                        <h3 className="text-2xl md:text-3xl lg:text-4xl font-extrabold mb-2 group-hover:translate-x-1 transition-transform duration-300">
                                            {card.title}
                                        </h3>
                                        <p className="text-white/80 text-base md:text-lg mb-4">
                                            {card.subtitle}
                                        </p>

                                        {/* Tags */}
                                        <div className="flex flex-wrap gap-2">
                                            {card.items.slice(0, 4).map((item) => (
                                                <span
                                                    key={item}
                                                    className="text-xs md:text-sm bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full"
                                                >
                                                    {item}
                                                </span>
                                            ))}
                                            <span className="text-xs md:text-sm bg-[#FFD300]/30 text-[#FFD300] backdrop-blur-sm px-3 py-1 rounded-full font-medium">
                                                +Daha fazla
                                            </span>
                                        </div>
                                    </div>

                                    {/* Hover Arrow */}
                                    <div className="absolute top-6 right-6 w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover:opacity-100 translate-x-4 group-hover:translate-x-0 transition-all duration-300">
                                        <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                        </svg>
                                    </div>
                                </div>
                            </Link>
                        </StaggerItem>
                    ))}
                </StaggerContainer>
            </div>
        </section>
    );
}

export default memo(CategoryCards);

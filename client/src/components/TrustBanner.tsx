import { memo } from "react";
import { Award, Truck, Users, MapPin } from "lucide-react";
import ScrollAnimation from "./ScrollAnimation";

const stats = [
    {
        icon: Award,
        value: "12+",
        label: "Yıllık Tecrübe",
        color: "text-[#FFD300]",
        bg: "bg-[#FFD300]/10",
    },
    {
        icon: Truck,
        value: "Ücretsiz",
        label: "Ekspertiz Hizmeti",
        color: "text-emerald-500",
        bg: "bg-emerald-500/10",
    },
    {
        icon: Users,
        value: "10.000+",
        label: "Mutlu Müşteri",
        color: "text-blue-500",
        bg: "bg-blue-500/10",
    },
    {
        icon: MapPin,
        value: "Tüm İstanbul",
        label: "Avrupa & Anadolu Yakası",
        color: "text-rose-500",
        bg: "bg-rose-500/10",
    },
];

function TrustBanner() {
    return (
        <section className="relative -mt-8 md:-mt-10 z-10 pb-4">
            <div className="container">
                <ScrollAnimation direction="up">
                    <div className="bg-white rounded-2xl shadow-xl border border-[#2F2F2F]/5 px-6 py-6 md:px-8 md:py-7">
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
                            {stats.map((stat, index) => (
                                <div
                                    key={index}
                                    className="flex items-center gap-3 md:gap-4"
                                >
                                    <div
                                        className={`w-12 h-12 md:w-14 md:h-14 rounded-xl ${stat.bg} flex items-center justify-center flex-shrink-0`}
                                    >
                                        <stat.icon className={`w-6 h-6 md:w-7 md:h-7 ${stat.color}`} />
                                    </div>
                                    <div className="min-w-0">
                                        <p className="text-lg md:text-xl lg:text-2xl font-extrabold text-[#2F2F2F] leading-tight">
                                            {stat.value}
                                        </p>
                                        <p className="text-xs md:text-sm text-[#2F2F2F]/60 leading-tight">
                                            {stat.label}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </ScrollAnimation>
            </div>
        </section>
    );
}

export default memo(TrustBanner);

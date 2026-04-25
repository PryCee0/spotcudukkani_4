import { memo } from "react";
import { Award, Truck, Users, MapPin } from "lucide-react";
import ScrollAnimation from "./ScrollAnimation";

const stats = [
    {
        icon: Award,
        value: "12+",
        label: "Yıllık Tecrübe",
        mobileValue: "12+",
        mobileLabel: "Yıl",
        color: "text-[#FFD300]",
        bg: "bg-[#FFD300]/10",
        lineColor: "bg-[#FFD300]/40",
    },
    {
        icon: Truck,
        value: "Ücretsiz",
        label: "Ekspertiz Hizmeti",
        mobileValue: "Ücr",
        mobileLabel: "siz",
        color: "text-emerald-500",
        bg: "bg-emerald-500/10",
        lineColor: "bg-emerald-500/40",
    },
    {
        icon: Users,
        value: "10.000+",
        label: "Mutlu Müşteri",
        mobileValue: "10K",
        mobileLabel: "+",
        color: "text-blue-500",
        bg: "bg-blue-500/10",
        lineColor: "bg-blue-500/40",
    },
    {
        icon: MapPin,
        value: "Tüm İstanbul",
        label: "Avrupa & Anadolu Yakası",
        mobileValue: "İst",
        mobileLabel: "anb",
        color: "text-rose-500",
        bg: "bg-rose-500/10",
        lineColor: "bg-rose-500/40",
    },
];

function TrustBanner() {
    return (
        <section className="relative z-10 w-full -mt-[170px] md:-mt-10 pb-4">
            <div className="container md:px-4">
                <ScrollAnimation direction="up">
                    {/* Desktop View */}
                    <div className="hidden md:block bg-card rounded-2xl shadow-xl border border-border/30 px-8 py-7 transition-colors duration-300">
                        <div className="grid grid-cols-4 gap-8">
                            {stats.map((stat, index) => (
                                <div
                                    key={index}
                                    className="flex items-center gap-4"
                                >
                                    <div
                                        className={`w-14 h-14 rounded-xl ${stat.bg} flex items-center justify-center flex-shrink-0`}
                                    >
                                        <stat.icon className={`w-7 h-7 ${stat.color}`} />
                                    </div>
                                    <div className="min-w-0">
                                        <p className="text-xl lg:text-2xl font-extrabold text-foreground leading-tight">
                                            {stat.value}
                                        </p>
                                        <p className="text-sm text-muted-foreground leading-tight">
                                            {stat.label}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Mobile View - Sarkan İpler */}
                    <div className="md:hidden flex justify-between items-start pt-4">
                        {stats.map((stat, index) => (
                            <div key={index} className="flex flex-col items-center w-[23%] relative">
                                {/* Dönen Daire */}
                                <div className={`w-10 h-10 rounded-full ${stat.bg} flex items-center justify-center relative z-10 animate-slow-spin shadow-sm`}>
                                    <stat.icon className={`w-5 h-5 ${stat.color}`} />
                                </div>
                                {/* İp */}
                                <div className={`w-[2px] h-6 ${stat.lineColor} -mt-1 relative z-0`}></div>
                                {/* Kutu */}
                                <div className="bg-card/95 backdrop-blur-sm border border-border/40 rounded-lg py-2 w-full text-center shadow-md relative z-10">
                                    <p className={`text-[13px] font-extrabold ${stat.color} leading-none`}>{stat.mobileValue}</p>
                                    <p className="text-[11px] text-foreground/80 leading-none mt-1 font-bold">{stat.mobileLabel}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </ScrollAnimation>
            </div>
        </section>
    );
}

export default memo(TrustBanner);

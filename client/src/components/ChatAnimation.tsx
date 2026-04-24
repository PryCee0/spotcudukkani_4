import { motion } from "framer-motion";
import { Sofa, CheckCheck, Camera } from "lucide-react";

export default function ChatAnimation() {
  const container = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.5,
        delayChildren: 0.1,
      },
    },
  };

  const bubble = {
    hidden: { opacity: 0, y: 20, scale: 0.9 },
    visible: { 
      opacity: 1, 
      y: 0, 
      scale: 1,
      transition: { type: "spring", stiffness: 260, damping: 20 }
    },
  };

  return (
    <div className="relative w-full max-w-[300px] sm:max-w-[340px] md:max-w-sm mx-auto h-[380px] sm:h-[420px] md:h-[520px] bg-[#0b141a] rounded-[2rem] md:rounded-[2.5rem] border-[6px] md:border-[12px] border-[#1f2c34] shadow-2xl overflow-hidden flex flex-col group hover:shadow-[0_0_40px_rgba(37,211,102,0.2)] transition-shadow duration-500 will-change-transform">
      
      {/* Phone Top Notch Area */}
      <div className="absolute top-0 inset-x-0 h-4 md:h-6 flex justify-center z-20">
        <div className="w-16 md:w-24 h-3 md:h-4 bg-[#1f2c34] rounded-b-lg md:rounded-b-xl"></div>
      </div>

      {/* Header */}
      <div className="bg-[#202c33] px-3 md:px-4 pt-4 md:pt-6 pb-3 md:pb-4 flex items-center gap-2 md:gap-3 shadow-md z-10">
        <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-gradient-to-br from-[#FFD300] to-orange-400 flex items-center justify-center font-bold text-black flex-shrink-0 text-xs md:text-base">
          SD
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="text-[#e9edef] font-semibold text-[13px] md:text-sm leading-tight truncate">Spotçu Dükkanı</h3>
          <p className="text-[#8696a0] text-[10px] md:text-xs truncate">Çevrimiçi</p>
        </div>
        <Camera className="w-4 h-4 md:w-5 md:h-5 text-[#8696a0] flex-shrink-0" />
      </div>

      {/* Chat Area */}
      <div className="flex-1 relative">
        {/* WhatsApp Pattern Background */}
        <div className="absolute inset-0 opacity-[0.05] bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCI+CjxwYXRoIGQ9Ik0wIDBoNDB2NDBIMHoiIGZpbGw9Im5vbmUiLz4KPHBhdGggZD0iTTEyIDBDNi41IDAgMCA2LjUgMCAxMnM2LjUgMTIgMTIgMTIgMTItNi41IDEyLTEyUzE3LjUgMCAxMiAwek0yLjUgMTJjMC01LjIgNC4zLTkuNSA5LjUtOS41czkuNSA0LjMgOS41IDkuNS00LjMgOS41LTkuNSA5LjVTMi41IDE3LjIgMi41IDEyeiIgZmlsbD0iI2ZmZiIvPgo8L3N2Zz4=')] bg-repeat" />
        
        <motion.div 
          className="relative h-full p-3 md:p-5 flex flex-col gap-2 md:gap-4 overflow-hidden"
          variants={container}
          initial="hidden"
          animate="visible"
          viewport={{ once: true, amount: 0.1 }}
        >
          {/* Date Badge */}
          <motion.div variants={bubble} className="flex justify-center mb-1 md:mb-2">
            <span className="bg-[#182229] text-[#8696a0] text-[9px] md:text-[11px] px-2 py-0.5 md:px-3 md:py-1 rounded-lg">BUGÜN</span>
          </motion.div>

          {/* Message 1: Müşteri */}
          <motion.div variants={bubble} className="flex justify-end">
            <div className="bg-[#005c4b] text-[#e9edef] px-2.5 py-1.5 md:px-3 md:py-2 rounded-xl md:rounded-2xl rounded-tr-sm max-w-[85%] shadow-sm relative">
              <p className="text-[12px] md:text-[15px] leading-snug">Merhaba, 2.El eşyamı Satmak İstiyorum</p>
              <div className="flex justify-end items-center gap-1 mt-0.5 md:mt-1">
                <span className="text-[9px] md:text-[10px] text-[#8696a0]">14:00</span>
                <CheckCheck className="w-[12px] h-[12px] md:w-[14px] md:h-[14px] text-[#53bdeb]" />
              </div>
            </div>
          </motion.div>

          {/* Message 2: Spotçu */}
          <motion.div variants={bubble} className="flex justify-start">
            <div className="bg-[#202c33] text-[#e9edef] px-2.5 py-1.5 md:px-3 md:py-2 rounded-xl md:rounded-2xl rounded-tl-sm max-w-[90%] shadow-sm relative">
              <p className="text-[12px] md:text-[15px] leading-snug">Tabii efendim, ürünün görselini yollayın hemen ekspertiz yapalım. 📸</p>
              <div className="flex justify-end mt-0.5 md:mt-1">
                <span className="text-[9px] md:text-[10px] text-[#8696a0]">14:01</span>
              </div>
            </div>
          </motion.div>

          {/* Message 3: Müşteri (Görsel) */}
          <motion.div variants={bubble} className="flex justify-end">
            <div className="bg-[#005c4b] p-1 rounded-xl md:rounded-2xl rounded-tr-sm max-w-[65%] md:max-w-[75%] shadow-sm relative">
              <div className="w-full aspect-square bg-[#1f2c34] rounded-lg md:rounded-xl flex items-center justify-center overflow-hidden relative border border-white/5">
                <Sofa className="w-10 h-10 md:w-16 md:h-16 text-[#e9edef]/40" />
                <div className="absolute inset-0 bg-gradient-to-tr from-transparent to-white/5"></div>
              </div>
              <div className="flex justify-end items-center gap-1 mt-0.5 md:mt-1 pr-1 md:pr-2">
                <span className="text-[9px] md:text-[10px] text-[#e9edef]/70">14:02</span>
                <CheckCheck className="w-[12px] h-[12px] md:w-[14px] md:h-[14px] text-[#53bdeb]" />
              </div>
            </div>
          </motion.div>

          {/* Message 4: Spotçu */}
          <motion.div variants={bubble} className="flex justify-start mt-1 md:mt-2">
            <div className="bg-[#202c33] text-[#e9edef] px-2.5 py-1.5 md:px-3 md:py-2 rounded-xl md:rounded-2xl rounded-tl-sm max-w-[95%] shadow-sm relative">
              <p className="text-[12px] md:text-[15px] leading-snug font-medium text-[#00a884] mb-0.5 md:mb-1">
                Teklifimiz: 4.500 TL
              </p>
              <p className="text-[12px] md:text-[15px] leading-snug">
                Ürün satıldı! 🎉 Anında nakit ödemeniz hazır.
              </p>
              <div className="flex justify-end mt-0.5 md:mt-1">
                <span className="text-[9px] md:text-[10px] text-[#8696a0]">14:02</span>
              </div>
            </div>
          </motion.div>

        </motion.div>
      </div>
    </div>
  );
}

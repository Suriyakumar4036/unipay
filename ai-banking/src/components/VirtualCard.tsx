"use client";

import { motion } from "framer-motion";
import { CreditCard, ShieldCheck, Zap } from "lucide-react";

interface VirtualCardProps {
  number: string;
  expiry: string;
  cvv: string;
  name: string;
  type: string;
  network: "VISA" | "MASTERCARD";
}

export default function VirtualCard({ number, expiry, cvv, name, type, network }: VirtualCardProps) {
  const isVisa = network === "VISA";

  return (
    <motion.div
      whileHover={{ scale: 1.02, rotateY: 5, rotateX: -5 }}
      className="relative w-full max-w-md aspect-[1.586/1] rounded-[2rem] p-8 overflow-hidden shadow-2xl group cursor-pointer"
    >
      {/* Dynamic Background */}
      <div className={`absolute inset-0 bg-gradient-to-br transition-all duration-700 ${
        type === "CREDIT" 
        ? "from-zinc-900 via-indigo-950 to-black" 
        : "from-indigo-600 via-indigo-900 to-black"
      }`} />
      
      {/* Holographic Mesh Overlay */}
      <div className="absolute inset-0 opacity-20 mix-blend-overlay bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]" />
      
      {/* Animated Shine Effect */}
      <motion.div 
        animate={{ x: ['-100%', '100%'] }}
        transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent skew-x-12"
      />

      {/* Card Content */}
      <div className="relative h-full flex flex-col justify-between">
        <div className="flex justify-between items-start">
          <div className="space-y-1">
            <p className="text-[10px] font-black tracking-[0.2em] text-white/50 uppercase">{type} CARD</p>
            <div className="flex items-center gap-2">
              <Zap className="w-5 h-5 text-indigo-400 fill-indigo-400" />
              <span className="text-white font-black italic tracking-tighter text-xl">UNIPAY</span>
            </div>
          </div>
          <div className="text-right">
            {isVisa ? (
              <span className="text-white font-black italic text-2xl tracking-tighter">VISA</span>
            ) : (
              <div className="flex -space-x-3">
                <div className="w-8 h-8 rounded-full bg-rose-500/80" />
                <div className="w-8 h-8 rounded-full bg-amber-500/80" />
              </div>
            )}
          </div>
        </div>

        <div className="space-y-6">
          <h4 className="text-2xl md:text-3xl font-mono text-white tracking-[0.15em] drop-shadow-lg">
            {number}
          </h4>
          
          <div className="flex justify-between items-end">
            <div className="space-y-1">
              <p className="text-[8px] font-bold text-white/40 uppercase tracking-widest">Card Holder</p>
              <p className="text-sm font-bold text-white tracking-wide uppercase">{name}</p>
            </div>
            <div className="flex gap-8">
              <div className="space-y-1">
                <p className="text-[8px] font-bold text-white/40 uppercase tracking-widest">Expires</p>
                <p className="text-sm font-bold text-white">{expiry}</p>
              </div>
              <div className="space-y-1">
                <p className="text-[8px] font-bold text-white/40 uppercase tracking-widest">CVV</p>
                <p className="text-sm font-bold text-white">***</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Security Badge */}
      <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
         <div className="flex items-center gap-1 bg-white/10 backdrop-blur-md px-2 py-1 rounded-full border border-white/20">
            <ShieldCheck className="w-3 h-3 text-green-400" />
            <span className="text-[8px] font-black text-white uppercase">Protected</span>
         </div>
      </div>
    </motion.div>
  );
}

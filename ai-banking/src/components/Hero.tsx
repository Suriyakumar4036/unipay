"use client";

import { motion } from "framer-motion";
import { ArrowRight, ShieldCheck, Zap, Globe } from "lucide-react";

import Link from "next/link";

export default function Hero() {
  return (
    <section className="relative pt-32 pb-20 px-6 overflow-hidden">
      <div className="max-w-7xl mx-auto text-center relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass mb-8"
        >
          <span className="w-2 h-2 bg-indigo-500 rounded-full animate-pulse" />
          <span className="text-xs font-bold tracking-widest uppercase text-indigo-400">
            Powered by Antigravity AI
          </span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-6xl md:text-8xl font-black mb-8 font-outfit tracking-tight"
        >
          <span className="text-white">Banking Without</span> <br />
          <span className="text-gradient-primary">Gravity.</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="text-zinc-400 text-xl md:text-2xl mb-12 max-w-2xl mx-auto leading-relaxed"
        >
          UniPay is the world's first AI-native banking platform designed for the elite. 
          Real-time intelligence for your wealth.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="flex flex-col md:flex-row items-center justify-center gap-6"
        >
          <Link href="/login">
            <button className="group relative px-8 py-4 bg-white text-black font-bold rounded-2xl overflow-hidden transition-all hover:scale-105 active:scale-95">
              <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-cyan-500 opacity-0 group-hover:opacity-10 transition-opacity" />
              <span className="flex items-center gap-2">
                Get Started <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </span>
            </button>
          </Link>
          <button className="px-8 py-4 glass text-white font-bold rounded-2xl hover:bg-white/10 transition-all">
            View Demo
          </button>
        </motion.div>

        {/* Floating Icons */}
        <div className="absolute top-0 left-0 w-full h-full pointer-events-none -z-10">
          <motion.div
            animate={{ 
              y: [0, -20, 0],
              rotate: [0, 10, 0]
            }}
            transition={{ duration: 5, repeat: Infinity }}
            className="absolute top-[20%] left-[10%] p-4 glass rounded-2xl"
          >
            <ShieldCheck className="text-indigo-400 w-8 h-8" />
          </motion.div>
          <motion.div
            animate={{ 
              y: [0, 20, 0],
              rotate: [0, -10, 0]
            }}
            transition={{ duration: 7, repeat: Infinity }}
            className="absolute bottom-[20%] right-[10%] p-4 glass rounded-2xl"
          >
            <Zap className="text-cyan-400 w-8 h-8" />
          </motion.div>
          <motion.div
            animate={{ 
              x: [0, 20, 0],
              rotate: [0, 360]
            }}
            transition={{ duration: 15, repeat: Infinity }}
            className="absolute top-[60%] left-[5%] p-4 glass rounded-full"
          >
            <Globe className="text-zinc-500 w-6 h-6" />
          </motion.div>
        </div>
      </div>
    </section>
  );
}

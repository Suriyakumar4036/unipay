"use client";

import { motion } from "framer-motion";
import { Shield, Zap, Target, Cpu } from "lucide-react";

const features = [
  {
    title: "Quantum Security",
    description: "End-to-end neural encryption with biometric heart-rate verification.",
    icon: Shield,
    color: "text-indigo-400",
    bg: "bg-indigo-500/10",
  },
  {
    title: "Neural Insights",
    description: "AI-driven wealth forecasting with 99.8% historical accuracy.",
    icon: Cpu,
    color: "text-cyan-400",
    bg: "bg-cyan-500/10",
  },
  {
    title: "Instant Liquidity",
    description: "Move assets across global markets in under 200 milliseconds.",
    icon: Zap,
    color: "text-amber-400",
    bg: "bg-amber-500/10",
  },
  {
    title: "Precision Wealth",
    description: "Automated tax optimization and risk-balanced asset allocation.",
    icon: Target,
    color: "text-rose-400",
    bg: "bg-rose-500/10",
  },
];

export default function Features() {
  return (
    <section className="py-32 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-24">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl font-black mb-6 text-white"
          >
            Engineered for the <span className="text-gradient-primary">Elite.</span>
          </motion.h2>
          <p className="text-zinc-500 text-lg max-w-2xl mx-auto">
            Experience financial tools that think, adapt, and evolve with your wealth.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="glass p-8 rounded-[2.5rem] glass-hover transition-all group"
            >
              <div className={`w-14 h-14 ${f.bg} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                <f.icon className={`${f.color} w-7 h-7`} />
              </div>
              <h3 className="text-xl font-bold text-white mb-4">{f.title}</h3>
              <p className="text-zinc-500 text-sm leading-relaxed">
                {f.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

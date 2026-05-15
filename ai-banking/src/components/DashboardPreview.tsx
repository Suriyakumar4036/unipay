"use client";

import { motion } from "framer-motion";
import { TrendingUp, CreditCard, PieChart, Activity } from "lucide-react";

export default function DashboardPreview() {
  return (
    <section className="py-20 px-6">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1 }}
          className="glass rounded-[3rem] p-8 md:p-12 shadow-2xl relative overflow-hidden"
        >
          {/* Dashboard Header */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8 mb-12">
            <div>
              <h2 className="text-3xl font-bold text-white mb-2">Neural Portfolio</h2>
              <p className="text-zinc-500">AI Analysis of your global assets</p>
            </div>
            <div className="flex gap-4">
              <div className="p-4 glass rounded-3xl text-center min-w-[120px]">
                <span className="block text-xs text-zinc-500 uppercase font-bold mb-1">Status</span>
                <span className="text-green-400 font-bold flex items-center justify-center gap-1">
                  <Activity className="w-4 h-4" /> Optimized
                </span>
              </div>
              <div className="p-4 glass rounded-3xl text-center min-w-[120px]">
                <span className="block text-xs text-zinc-500 uppercase font-bold mb-1">AI Yield</span>
                <span className="text-indigo-400 font-bold">+12.4%</span>
              </div>
            </div>
          </div>

          {/* Grid Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Balance */}
            <div className="lg:col-span-2 glass p-8 rounded-[2rem] bg-gradient-to-br from-indigo-500/10 to-transparent border-indigo-500/20">
              <div className="flex justify-between items-start mb-12">
                <div>
                  <span className="text-zinc-500 text-sm font-bold uppercase tracking-widest">Total Liquidity</span>
                  <h3 className="text-5xl font-black text-white mt-2">$2,840,192.00</h3>
                </div>
                <TrendingUp className="text-indigo-400 w-8 h-8" />
              </div>
              
              {/* Fake Graph */}
              <div className="h-48 flex items-end gap-2">
                {[40, 70, 45, 90, 65, 80, 100, 85, 95, 110, 100, 120].map((h, i) => (
                  <motion.div
                    key={i}
                    initial={{ height: 0 }}
                    whileInView={{ height: `${h}%` }}
                    transition={{ delay: i * 0.05, duration: 1 }}
                    className="flex-1 bg-gradient-to-t from-indigo-500 to-cyan-500 rounded-t-lg opacity-50"
                  />
                ))}
              </div>
            </div>

            {/* Sidebar Cards */}
            <div className="flex flex-col gap-8">
              <div className="glass p-6 rounded-[2rem] glass-hover transition-all">
                <div className="flex items-center gap-4 mb-4">
                  <div className="p-3 bg-cyan-500/10 rounded-2xl">
                    <CreditCard className="text-cyan-400 w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="font-bold text-white">Quantum Card</h4>
                    <p className="text-zinc-500 text-xs">.... 4242</p>
                  </div>
                </div>
                <div className="text-xl font-bold text-white">$12,400.00</div>
              </div>

              <div className="glass p-6 rounded-[2rem] glass-hover transition-all">
                <div className="flex items-center gap-4 mb-4">
                  <div className="p-3 bg-rose-500/10 rounded-2xl">
                    <PieChart className="text-rose-400 w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="font-bold text-white">Risk Engine</h4>
                    <p className="text-zinc-500 text-xs">Moderate / Balanced</p>
                  </div>
                </div>
                <div className="h-2 bg-zinc-800 rounded-full overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }}
                    whileInView={{ width: "65%" }}
                    className="h-full bg-rose-500"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Decorative Mesh in Card */}
          <div className="absolute -bottom-24 -right-24 w-64 h-64 bg-indigo-500/20 rounded-full blur-[100px] pointer-events-none" />
        </motion.div>
      </div>
    </section>
  );
}

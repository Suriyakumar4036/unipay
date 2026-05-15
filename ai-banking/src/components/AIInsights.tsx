"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageSquare, Sparkles, BrainCircuit, LineChart } from "lucide-react";

const insights = [
  {
    trigger: "Analyze risk-adjusted return",
    response: "Based on current market volatility and your risk profile, I recommend shifting 12% of liquid assets to Quantum Bonds to hedge against the upcoming tech sector correction. This will optimize your Sharpe ratio by 0.45.",
    icon: LineChart,
  },
  {
    trigger: "Evaluate tax strategy",
    response: "Neural analysis suggests a potential tax-loss harvesting opportunity in your crypto sub-portfolio. Executing now would reduce your taxable liability by an estimated $42,300 for this fiscal year.",
    icon: Sparkles,
  },
  {
    trigger: "Predict wealth milestone",
    response: "With sustained compounding at 8.4% and currently planned contributions, you are on track to exceed your $10M liquidity target by Q3 2027—approximately 14 months ahead of schedule.",
    icon: BrainCircuit,
  },
];

export default function AIInsights() {
  const [activeInsight, setActiveInsight] = useState(0);

  return (
    <section className="py-32 px-6 bg-gradient-to-b from-black to-zinc-950">
      <div className="max-w-5xl mx-auto">
        <div className="flex flex-col lg:flex-row gap-16 items-center">
          <div className="flex-1">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-bold uppercase tracking-widest mb-6"
            >
              <Sparkles className="w-3 h-3" /> AI Engine v4.0
            </motion.div>
            <h2 className="text-4xl md:text-5xl font-black text-white mb-8 leading-tight">
              Real-time wealth <br />
              <span className="text-gradient-primary">intelligence.</span>
            </h2>
            
            <div className="space-y-4">
              {insights.map((insight, i) => (
                <button
                  key={i}
                  onClick={() => setActiveInsight(i)}
                  className={`w-full text-left p-6 rounded-2xl border transition-all flex items-center gap-4 ${
                    activeInsight === i 
                    ? "bg-white/10 border-white/20 scale-105 shadow-xl shadow-indigo-500/10" 
                    : "bg-white/5 border-white/5 hover:bg-white/8 text-zinc-500"
                  }`}
                >
                  <insight.icon className={`w-6 h-6 ${activeInsight === i ? "text-indigo-400" : "text-zinc-600"}`} />
                  <span className={`font-bold ${activeInsight === i ? "text-white" : ""}`}>
                    {insight.trigger}
                  </span>
                </button>
              ))}
            </div>
          </div>

          <div className="flex-1 w-full">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeInsight}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="glass p-10 rounded-[3rem] min-h-[350px] flex flex-col justify-between relative"
              >
                <div className="absolute top-8 right-10">
                  <MessageSquare className="text-indigo-500/20 w-12 h-12" />
                </div>
                
                <div>
                  <div className="text-indigo-400 font-bold mb-6 flex items-center gap-2">
                    <div className="w-2 h-2 bg-indigo-500 rounded-full" />
                    Nexus Analysis
                  </div>
                  <p className="text-white text-lg md:text-xl leading-relaxed font-medium italic">
                    "{insights[activeInsight].response}"
                  </p>
                </div>

                <div className="mt-8 pt-8 border-t border-white/5 flex justify-between items-center">
                  <div className="flex -space-x-2">
                    {[1,2,3].map(i => (
                      <div key={i} className="w-8 h-8 rounded-full border-2 border-black bg-zinc-800" />
                    ))}
                    <div className="w-8 h-8 rounded-full border-2 border-black bg-indigo-500 flex items-center justify-center text-[10px] font-bold">
                      +12
                    </div>
                  </div>
                  <button className="text-sm font-bold text-indigo-400 hover:text-white transition-colors">
                    Execute Optimization →
                  </button>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
}

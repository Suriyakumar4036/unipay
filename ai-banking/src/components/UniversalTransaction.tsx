"use client";

import { useState } from "react";
import { Check, Wallet, Info, Activity, Shield, Zap, Globe, Cpu, ArrowRight, Target } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

function CustomSlider({ min, max, step, value, onValueChange }: { min: number, max: number, step: number, value: number[], onValueChange: (val: number[]) => void }) {
  return (
    <div className="relative w-full flex items-center h-6">
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value[0]}
        onChange={(e) => onValueChange([parseFloat(e.target.value)])}
        className="w-full h-1 bg-zinc-800 rounded-full appearance-none outline-none cursor-pointer accent-indigo-500"
      />
    </div>
  );
}

export default function UniversalTransaction() {
  const [serviceType, setServiceType] = useState<"design" | "development" | "both">("both");
  const [pages, setPages] = useState([5]);
  const [needContent, setNeedContent] = useState(false);
  const [needSEO, setNeedSEO] = useState(false);
  const [timeline, setTimeline] = useState<"regular" | "fast" | "rush">("regular");
  
  const calculatePrice = () => {
    let base = 0;
    let perPage = 0;
    if (serviceType === "design") { base = 399; perPage = 100; }
    else if (serviceType === "development") { base = 199; perPage = 100; }
    else if (serviceType === "both") { base = 499; perPage = 200; }

    let total = Math.max(base, base + (pages[0] - 1) * perPage);

    if (needContent) total += pages[0] * 50;
    if (needSEO) total += pages[0] * 50;
    if (timeline === "rush") total += pages[0] * 100;
    if (timeline === "fast") total += pages[0] * 25;

    return total;
  };

  const price = calculatePrice();

  return (
    <div className="card max-w-4xl mx-auto overflow-hidden">
      <div className="grid grid-cols-1 md:grid-cols-2">
        {/* Left Side: Controls */}
        <div className="p-8 border-b md:border-b-0 md:border-r border-white/5">
          <h2 className="text-xl font-bold mb-6">Quote Calculator</h2>
          
          <div className="space-y-8">
            <div>
              <label className="text-xs font-bold text-zinc-500 uppercase mb-3 block">Service Type</label>
              <div className="flex gap-2">
                {(["design", "development", "both"] as const).map((t) => (
                  <button
                    key={t}
                    onClick={() => setServiceType(t)}
                    className={cn(
                      "flex-1 py-2 px-3 rounded-lg text-xs font-bold border transition-all",
                      serviceType === t ? "bg-indigo-600 border-indigo-600 text-white" : "border-white/5 text-zinc-400 hover:border-white/10"
                    )}
                  >
                    {t.toUpperCase()}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-3">
                <label className="text-xs font-bold text-zinc-500 uppercase">Complexity</label>
                <span className="text-sm font-bold text-white">{pages[0]} Units</span>
              </div>
              <CustomSlider min={1} max={50} step={1} value={pages} onValueChange={setPages} />
            </div>

            <div>
              <label className="text-xs font-bold text-zinc-500 uppercase mb-3 block">Add-ons</label>
              <div className="space-y-2">
                <button 
                  onClick={() => setNeedContent(!needContent)}
                  className={cn(
                    "w-full flex justify-between items-center p-3 rounded-lg border text-sm font-medium",
                    needContent ? "border-indigo-500/50 bg-indigo-500/5 text-white" : "border-white/5 text-zinc-400"
                  )}
                >
                  Content Generation {needContent && <Check className="w-4 h-4 text-indigo-400" />}
                </button>
                <button 
                  onClick={() => setNeedSEO(!needSEO)}
                  className={cn(
                    "w-full flex justify-between items-center p-3 rounded-lg border text-sm font-medium",
                    needSEO ? "border-indigo-500/50 bg-indigo-500/5 text-white" : "border-white/5 text-zinc-400"
                  )}
                >
                  SEO Optimization {needSEO && <Check className="w-4 h-4 text-indigo-400" />}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side: Price */}
        <div className="p-8 bg-zinc-950/50 flex flex-col justify-between">
          <div>
            <span className="text-xs font-bold text-indigo-400 uppercase tracking-widest block mb-4">Estimated Total</span>
            <div className="text-6xl font-black text-white mb-2">${price.toLocaleString()}</div>
            <p className="text-zinc-500 text-sm">Customized for your specific needs.</p>
          </div>

          <div className="space-y-4 mt-8">
            <div className="flex items-center gap-3 p-4 bg-white/5 rounded-xl border border-white/5">
              <Zap className="w-5 h-5 text-indigo-400" />
              <div className="text-xs text-zinc-400 leading-relaxed">
                Prices are subject to change based on project scope.
              </div>
            </div>
            <button className="btn-primary w-full justify-center text-sm py-4">
              Get Started Now <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

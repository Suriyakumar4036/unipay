"use client";

import Hero from "@/components/Hero";
import DashboardPreview from "@/components/DashboardPreview";
import Features from "@/components/Features";
import AIInsights from "@/components/AIInsights";
import { Menu } from "lucide-react";
import Link from "next/link";
import { useEffect } from "react";

export default function Home() {
  useEffect(() => {
    document.title = "UNIPAY | AI Wealth Intelligence";
  }, []);

  return (

    <main className="min-h-screen bg-white">
      <div className="mesh-bg" />

      {/* Navigation */}
      <nav className="fixed top-0 left-0 w-full z-50 bg-white/70 backdrop-blur-xl px-6 py-6 border-b border-[#edf2f7]">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-12">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-[#0066ff] rounded-xl flex items-center justify-center text-white font-bold text-xl">
                U
              </div>
              <span className="text-[#001a33] font-bold text-2xl tracking-tighter">UniPay</span>
            </div>
            
            <div className="hidden lg:flex items-center gap-8">
              {["Home", "Features", "Pricing", "Business", "Developers", "About Us"].map(item => (
                <a 
                  key={item} 
                  href="#" 
                  className={`text-sm font-bold ${item === 'Home' ? 'text-[#0066ff]' : 'text-[#64748b] hover:text-[#0066ff]'} transition-colors`}
                >
                  {item}
                </a>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-4">
            <Link href="/login">
              <button className="text-[#64748b] hover:text-[#0066ff] text-sm font-bold px-6 transition-colors">
                Log In
              </button>
            </Link>
            <Link href="/login">
              <button className="bg-[#0066ff] text-white px-8 py-2.5 rounded-xl text-sm font-bold hover:bg-[#0052cc] transition-all shadow-lg shadow-[#0066ff]/20">
                Sign Up
              </button>
            </Link>
          </div>
        </div>
      </nav>

      <Hero />
      <DashboardPreview />
      
      <div className="py-24">
        <Features />
      </div>
      
      <AIInsights />

      {/* Footer */}
      <footer className="py-20 px-6 border-t border-[#edf2f7] bg-white/50 backdrop-blur-md">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-12 text-center md:text-left">
          <div className="space-y-4">
            <div className="flex items-center gap-3 justify-center md:justify-start">
              <div className="w-8 h-8 bg-[#0066ff] rounded-lg flex items-center justify-center text-white font-bold">U</div>
              <span className="text-[#001a33] font-bold text-xl tracking-tight">UniPay</span>
            </div>
            <p className="text-[#64748b] text-sm max-w-xs font-medium">
              Seamlessly bridge the gap between global economies with our ultra-fast financial network.
            </p>
          </div>
          
          <div className="flex gap-12 text-[10px] font-bold text-[#64748b] uppercase tracking-widest">
            <a href="#" className="hover:text-[#0066ff]">About</a>
            <a href="#" className="hover:text-[#0066ff]">Careers</a>
            <a href="#" className="hover:text-[#0066ff]">Privacy</a>
            <a href="#" className="hover:text-[#0066ff]">Twitter</a>
          </div>
        </div>
      </footer>
    </main>
  );
}

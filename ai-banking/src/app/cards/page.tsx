"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { fetchWithAuth } from "@/lib/api";
import { CreditCard, Plus, ArrowLeft, Shield, Globe, Lock, Settings } from "lucide-react";
import Link from "next/link";
import VirtualCard from "@/components/VirtualCard";
import { useRouter } from "next/navigation";

export default function CardsPage() {
  const router = useRouter();
  const [cards, setCards] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadCards = async () => {
      try {
        const data = await fetchWithAuth("/cards");
        setCards(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    loadCards();
  }, []);

  const issueNewCard = async (type: string, network: string) => {
    try {
      const newCard = await fetchWithAuth(`/cards/issue?type=${type}&network=${network}`, {
        method: 'POST'
      });
      setCards([...cards, newCard]);
    } catch (err) {
      alert("Failed to issue card");
    }
  };

  return (
    <main className="min-h-screen p-4 md:p-8 bg-black">
      <div className="max-w-6xl mx-auto">
        <header className="flex justify-between items-center mb-12">
          <div>
             <Link href="/dashboard" className="flex items-center gap-2 text-zinc-500 hover:text-white mb-4 transition-colors">
                <ArrowLeft className="w-4 h-4" /> Back to Dashboard
             </Link>
             <h1 className="text-4xl font-black text-white font-outfit">Card Management</h1>
             <p className="text-zinc-500 text-sm mt-1">Manage your virtual and physical global cards.</p>
          </div>
          <button 
            onClick={() => issueNewCard("CREDIT", "MASTERCARD")}
            className="bg-indigo-500 hover:bg-indigo-600 text-white px-6 py-3 rounded-2xl font-black transition-all flex items-center gap-2 shadow-lg shadow-indigo-500/20"
          >
            <Plus className="w-5 h-5" /> New Virtual Card
          </button>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Cards List */}
          <div className="lg:col-span-2 space-y-8">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
               <CreditCard className="w-5 h-5 text-indigo-400" /> Active Cards
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {loading ? (
                Array(2).fill(0).map((_, i) => (
                  <div key={i} className="w-full aspect-[1.586/1] bg-white/5 animate-pulse rounded-[2rem]" />
                ))
              ) : (
                cards.map((card) => (
                  <VirtualCard 
                    key={card.id}
                    number={card.cardNumber}
                    expiry={card.expiryDate}
                    cvv={card.cvv}
                    name={card.cardholderName}
                    type={card.cardType}
                    network={card.network}
                  />
                ))
              )}
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-12">
               {[
                 { icon: Lock, label: "Freeze Card", desc: "Instantly block usage" },
                 { icon: Globe, label: "Online Usage", desc: "Toggle web payments" },
                 { icon: Settings, label: "Limits", desc: "Adjust spending cap" }
               ].map((action, i) => (
                 <button key={i} className="glass p-6 rounded-3xl text-left hover:bg-white/10 transition-all border border-white/5">
                    <action.icon className="w-6 h-6 text-indigo-400 mb-3" />
                    <p className="text-white font-bold text-sm">{action.label}</p>
                    <p className="text-zinc-500 text-[10px] mt-1">{action.desc}</p>
                 </button>
               ))}
            </div>
          </div>

          {/* Sidebar / Info */}
          <div className="space-y-6">
            <div className="glass p-8 rounded-[2.5rem] border border-indigo-500/20 bg-indigo-500/5">
              <Shield className="w-10 h-10 text-indigo-400 mb-6" />
              <h3 className="text-xl font-black text-white mb-4">Neural Security</h3>
              <p className="text-zinc-400 text-sm leading-relaxed mb-6">
                Your cards are protected by our proprietary AI engine. We monitor transactions in real-time to prevent fraud before it happens.
              </p>
              <ul className="space-y-4">
                <li className="flex items-center gap-3 text-xs font-bold text-zinc-300">
                  <div className="w-1.5 h-1.5 rounded-full bg-indigo-500" />
                  256-bit Encryption
                </li>
                <li className="flex items-center gap-3 text-xs font-bold text-zinc-300">
                  <div className="w-1.5 h-1.5 rounded-full bg-indigo-500" />
                  Biometric Confirmation
                </li>
                <li className="flex items-center gap-3 text-xs font-bold text-zinc-300">
                  <div className="w-1.5 h-1.5 rounded-full bg-indigo-500" />
                  Instant Freeze Support
                </li>
              </ul>
            </div>

            <div className="glass p-8 rounded-[2.5rem] border border-white/5">
               <h3 className="text-lg font-bold text-white mb-4">Card Benefits</h3>
               <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-zinc-500 text-xs font-bold">Cashback</span>
                    <span className="text-green-400 text-xs font-black">2.5%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-zinc-500 text-xs font-bold">FX Fee</span>
                    <span className="text-white text-xs font-black">0.0%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-zinc-500 text-xs font-bold">Lounge Access</span>
                    <span className="text-white text-xs font-black">Global</span>
                  </div>
               </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

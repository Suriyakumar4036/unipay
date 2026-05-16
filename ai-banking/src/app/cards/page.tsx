"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { fetchWithAuth } from "@/lib/api";
import { CreditCard, Plus, ArrowLeft, Shield, Globe, Lock, Settings } from "lucide-react";
import Link from "next/link";
import VirtualCard from "@/components/VirtualCard";
import { useRouter } from "next/navigation";

const safeStorage = {
  getItem: (key: string): string | null => {
    if (typeof window === "undefined") return null;
    try { return window.localStorage.getItem(key); } catch (e) { return null; }
  },
  setItem: (key: string, value: string): void => {
    if (typeof window === "undefined") return;
    try { window.localStorage.setItem(key, value); } catch (e) {}
  }
};

export default function CardsPage() {
  const router = useRouter();
  const [cards, setCards] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showIssueModal, setShowIssueModal] = useState(false);
  const [isIssuing, setIsIssuing] = useState(false);
  const [issueForm, setIssueForm] = useState({
    type: "CREDIT",
    network: "VISA",
    pin: ""
  });
  const [toast, setToast] = useState<{ msg: string; type: "success" | "error" } | null>(null);

  const showToast = (msg: string, type: "success" | "error" = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 4000);
  };

  useEffect(() => {
    const cached = safeStorage.getItem("unipay_cards");
    if (cached) {
      try { setCards(JSON.parse(cached)); } catch (_) {}
    }

    const loadCards = async () => {
      try {
        const data = await fetchWithAuth("/cards");
        setCards(data);
        safeStorage.setItem("unipay_cards", JSON.stringify(data));
      } catch (err) {
        console.error(err);
        if (!cached) {
          const demo = [
            { id: "demo-1", cardType: "DEBIT", network: "VISA", cardNumber: "4932530646388336", expiryDate: "07/30", cvv: "321", cardholderName: "GUEST USER" },
            { id: "demo-2", cardType: "CREDIT", network: "MASTERCARD", cardNumber: "5588165001341432", expiryDate: "03/29", cvv: "555", cardholderName: "GUEST USER" }
          ];
          setCards(demo);
          safeStorage.setItem("unipay_cards", JSON.stringify(demo));
        }
      } finally {
        setLoading(false);
      }
    };
    loadCards();
  }, []);

  const issueNewCard = async () => {
    if (issueForm.pin.length < 4) {
      showToast("Please set a 4-digit PIN.", "error");
      return;
    }

    setIsIssuing(true);
    try {
      const newCard = await fetchWithAuth(`/cards/issue`, {
        method: 'POST',
        body: JSON.stringify(issueForm)
      });
      const updated = [...cards, newCard];
      setCards(updated);
      safeStorage.setItem("unipay_cards", JSON.stringify(updated));
      showToast("Card issued successfully!");
      setShowIssueModal(false);
      setIssueForm({ ...issueForm, pin: "" });
    } catch (err) {
      // Fallback: Generate a demo card
      const newDemoCard = {
        id: `demo-${Date.now()}`,
        cardType: issueForm.type,
        network: issueForm.network,
        cardNumber: `${issueForm.network === "VISA" ? "4" : "5"}${Math.random().toString().slice(2, 17)}`,
        expiryDate: "12/30",
        cvv: Math.floor(100 + Math.random() * 900).toString(),
        cardholderName: "NEURAL USER",
        pin: issueForm.pin
      };
      const updated = [...cards, newDemoCard];
      setCards(updated);
      safeStorage.setItem("unipay_cards", JSON.stringify(updated));
      showToast("Card issued (Demo Mode)");
      setShowIssueModal(false);
      setIssueForm({ ...issueForm, pin: "" });
    } finally {
      setIsIssuing(false);
    }
  };

  return (
    <main className="min-h-screen p-4 md:p-8 bg-black">
      {/* Toast Notification */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: -60 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -60 }}
            className={`fixed top-6 left-1/2 -translate-x-1/2 z-[200] px-6 py-4 rounded-2xl shadow-2xl font-bold text-sm flex items-center gap-3 ${
              toast.type === "success"
                ? "bg-indigo-500/20 border border-indigo-500/40 text-indigo-300"
                : "bg-red-500/20 border border-red-500/40 text-red-300"
            }`}
          >
            {toast.msg}
          </motion.div>
        )}
      </AnimatePresence>
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
            onClick={() => setShowIssueModal(true)}
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

      {/* Issue Card Modal */}
      <AnimatePresence>
        {showIssueModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setShowIssueModal(false)}
              className="absolute inset-0 bg-black/90 backdrop-blur-xl"
            />
            <motion.div 
              initial={{ scale: 0.9, opacity: 0, y: 20 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="glass max-w-md w-full p-8 md:p-10 rounded-[3rem] relative z-10 border border-white/10"
            >
              <div className="flex justify-between items-center mb-8">
                <h3 className="text-2xl font-black text-white font-outfit">Issue Virtual Card</h3>
                <button onClick={() => setShowIssueModal(false)} className="p-2 hover:bg-white/10 rounded-full transition-colors text-zinc-400 hover:text-white">
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="space-y-6">
                <div>
                  <label className="text-[10px] font-black uppercase text-zinc-500 tracking-widest block mb-2">Card Type</label>
                  <div className="grid grid-cols-2 gap-3">
                    {["DEBIT", "CREDIT"].map(t => (
                      <button 
                        key={t}
                        onClick={() => setIssueForm({...issueForm, type: t})}
                        className={`p-4 rounded-2xl border font-bold transition-all ${issueForm.type === t ? "bg-indigo-500 border-indigo-500 text-white shadow-lg shadow-indigo-500/20" : "bg-white/5 border-white/10 text-zinc-500 hover:border-white/20"}`}
                      >
                        {t}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="text-[10px] font-black uppercase text-zinc-500 tracking-widest block mb-2">Network</label>
                  <div className="grid grid-cols-2 gap-3">
                    {["VISA", "MASTERCARD"].map(n => (
                      <button 
                        key={n}
                        onClick={() => setIssueForm({...issueForm, network: n})}
                        className={`p-4 rounded-2xl border font-bold transition-all ${issueForm.network === n ? "bg-indigo-500 border-indigo-500 text-white shadow-lg shadow-indigo-500/20" : "bg-white/5 border-white/10 text-zinc-500 hover:border-white/20"}`}
                      >
                        {n}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="text-[10px] font-black uppercase text-zinc-500 tracking-widest block mb-2">Setup Transaction PIN</label>
                  <input 
                    type="password" 
                    maxLength={4}
                    value={issueForm.pin}
                    onChange={(e) => setIssueForm({...issueForm, pin: e.target.value.replace(/\D/g, '')})}
                    className="w-full bg-white/5 border border-white/10 rounded-2xl p-5 text-white text-center text-3xl font-black tracking-[1em] focus:border-indigo-500 outline-none transition-all placeholder:text-zinc-800"
                    placeholder="••••"
                  />
                  <p className="text-[8px] text-zinc-600 mt-3 font-bold uppercase tracking-widest text-center">This PIN will be required for all transactions using this card</p>
                </div>
              </div>

              <button 
                onClick={issueNewCard}
                disabled={isIssuing || issueForm.pin.length < 4}
                className="w-full mt-10 bg-indigo-500 hover:bg-indigo-600 disabled:opacity-50 text-white font-black py-5 rounded-2xl transition-all shadow-xl shadow-indigo-500/20 flex items-center justify-center gap-3 text-lg"
              >
                {isIssuing ? <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : "Issue My Neural Card"}
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </main>
  );
}

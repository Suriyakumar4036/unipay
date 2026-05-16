"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { fetchWithAuth } from "@/lib/api";
import { Wallet, ArrowUpRight, ArrowDownRight, Activity, X, Calendar, Clock, DollarSign, User as UserIcon, Hash, Send, CreditCard, ArrowLeft, ShieldCheck, Zap, ChevronRight, CheckCircle2 } from "lucide-react";



import { useRouter } from "next/navigation";
import Link from "next/link";


const safeStorage = {
  getItem: (key: string): string | null => {
    if (typeof window === "undefined") return null;
    try { return window.localStorage.getItem(key); } catch (e) { return null; }
  },
  setItem: (key: string, value: string): void => {
    if (typeof window === "undefined") return;
    try { window.localStorage.setItem(key, value); } catch (e) {}
  },
  clear: (): void => {
    if (typeof window === "undefined") return;
    try { window.localStorage.clear(); } catch (e) {}
  }
};

const MiniCard = ({ card, isSelected, onClick }: { card: any; isSelected: boolean; onClick: () => void }) => {
  const isVisa = card.network === "VISA";
  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      className={`relative flex-shrink-0 w-48 h-28 rounded-2xl p-4 overflow-hidden cursor-pointer transition-all border-2 ${
        isSelected ? "border-indigo-500 shadow-[0_0_20px_rgba(99,102,241,0.4)]" : "border-white/10 hover:border-white/20"
      }`}
    >
      <div className={`absolute inset-0 bg-gradient-to-br transition-all duration-500 ${
        card.cardType === "CREDIT" 
        ? "from-zinc-900 via-indigo-950 to-black" 
        : "from-indigo-600 via-indigo-900 to-black"
      }`} />
      
      <motion.div 
        animate={{ x: ['-100%', '100%'] }}
        transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent skew-x-12"
      />

      <div className="relative h-full flex flex-col justify-between">
        <div className="flex justify-between items-start">
          <Zap className={`w-3 h-3 transition-colors ${isSelected ? 'text-indigo-400 fill-indigo-400' : 'text-white/20'}`} />
          {isVisa ? (
            <span className="text-white font-black italic text-xs">VISA</span>
          ) : (
            <div className="flex -space-x-1.5">
              <div className="w-3 h-3 rounded-full bg-rose-500/80" />
              <div className="w-3 h-3 rounded-full bg-amber-500/80" />
            </div>
          )}
        </div>
        <div className="space-y-1">
          <p className="text-xs font-mono text-white tracking-widest truncate">
            •••• {card.cardNumber?.slice(-4)}
          </p>
          <div className="flex justify-between items-end">
            <p className="text-[6px] text-white/50 uppercase tracking-widest truncate">{card.cardType} CARD</p>
            {isSelected && <ShieldCheck className="w-3 h-3 text-green-400" />}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default function Dashboard() {
  useEffect(() => {
    document.title = "UNIPAY | Neural Portfolio";
  }, []);

  const router = useRouter();

  const [wallets, setWallets] = useState<any[]>([]);
  const [transactions, setTransactions] = useState<any[]>([]);
  const [globalId, setGlobalId] = useState("");
  const [selectedTx, setSelectedTx] = useState<any>(null);
  const [showTopUp, setShowTopUp] = useState(false);
  const [topUpAmount, setTopUpAmount] = useState("");
  const [topUpCurrency, setTopUpCurrency] = useState("INR");
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentStep, setPaymentStep] = useState<"amount" | "methods" | "cards" | "success">("amount");
  const [selectedCard, setSelectedCard] = useState<any>(null);
  const [savedCards, setSavedCards] = useState<any[]>([]);
  const [toast, setToast] = useState<{ msg: string; type: "success" | "error" } | null>(null);
  const [isDemoMode, setIsDemoMode] = useState(false);

  const showToast = (msg: string, type: "success" | "error" = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 4000);
  };

  const fetchDashboardData = async () => {
    try {
      const walletsData = await fetchWithAuth("/wallet/balance");
      const localDelta: Record<string, number> = JSON.parse(safeStorage.getItem("unipay_delta") || "{}");
      const merged = walletsData.map((w: any) => ({
        ...w,
        balance: (parseFloat(w.balance) + (localDelta[w.currency] || 0)).toFixed(2)
      }));
      setWallets(merged);
      safeStorage.setItem("unipay_wallets", JSON.stringify(merged));

      const txData = await fetchWithAuth("/transactions");
      setTransactions(txData);

      const cardsData = await fetchWithAuth("/cards");
      setSavedCards(cardsData);
      safeStorage.setItem("unipay_cards", JSON.stringify(cardsData));
      setIsDemoMode(false);
    } catch (err) {
      setIsDemoMode(true);
      const cachedWallets = safeStorage.getItem("unipay_wallets");
      try {
        const parsedWallets = cachedWallets ? JSON.parse(cachedWallets) : [];
        if (parsedWallets.length > 0) {
          setWallets(parsedWallets);
        } else {
          const demo = [
            { currency: "INR", balance: "50000.00" },
            { currency: "USD", balance: "1000.00" },
            { currency: "EUR", balance: "500.00" },
            { currency: "GBP", balance: "400.00" },
          ];
          setWallets(demo);
          safeStorage.setItem("unipay_wallets", JSON.stringify(demo));
        }
      } catch (_) {
         setWallets([{ currency: "INR", balance: "50000.00" }]);
      }

      const cachedCards = safeStorage.getItem("unipay_cards");
      try {
        const parsedCards = cachedCards ? JSON.parse(cachedCards) : [];
        if (parsedCards.length > 0) {
          setSavedCards(parsedCards);
        } else {
          const demoCards = [
            { id: "demo-1", cardType: "DEBIT CARD", network: "VISA", cardNumber: "4932530646388336", expiryDate: "07/30" },
            { id: "demo-2", cardType: "CREDIT CARD", network: "MASTERCARD", cardNumber: "5588165001341432", expiryDate: "03/29" }
          ];
          setSavedCards(demoCards);
          safeStorage.setItem("unipay_cards", JSON.stringify(demoCards));
        }
      } catch (_) {
        setSavedCards([]);
      }
    }
  };

  useEffect(() => {
    const gId = safeStorage.getItem("globalId") || "";
    setGlobalId(gId);
    const cached = safeStorage.getItem("unipay_wallets");
    if (cached) {
      try { setWallets(JSON.parse(cached)); } catch (_) {}
    }
    fetchDashboardData();
  }, [router]);

  const handleFinalPayment = async () => {
    setIsProcessing(true);
    const amount = parseFloat(topUpAmount);

    try {
      if (isDemoMode) {
        await new Promise(resolve => setTimeout(resolve, 1500));
        const delta: Record<string, number> = JSON.parse(safeStorage.getItem("unipay_delta") || "{}");
        delta[topUpCurrency] = (delta[topUpCurrency] || 0) + amount;
        safeStorage.setItem("unipay_delta", JSON.stringify(delta));
        await fetchDashboardData();
      } else {
        await fetchWithAuth("/api/payments/verify-payment", {
          method: 'POST',
          body: JSON.stringify({
            razorpay_order_id: "order_" + Date.now(),
            razorpay_payment_id: "pay_" + Date.now(),
            razorpay_signature: "mock_signature",
            amount: amount.toString(),
            currency: topUpCurrency
          })
        });
        await fetchDashboardData();
      }
      setPaymentStep("success");
    } catch (err) {
      console.error(err);
      showToast("Payment failed. Please try again.", "error");
    } finally {
      setIsProcessing(false);
    }
  };


  return (
    <main className="min-h-screen p-4 md:p-8 bg-black">

      {/* Demo Mode Banner */}
      <AnimatePresence>
        {isDemoMode && (
          <motion.div 
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            className="bg-indigo-500 text-white text-[10px] font-black uppercase tracking-[0.2em] py-2 text-center fixed top-0 left-0 right-0 z-[150] shadow-xl"
          >
            Running in Neural Demo Mode (Backend Offline)
          </motion.div>
        )}
      </AnimatePresence>

      {/* Toast Notification */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: -60 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -60 }}
            className={`fixed top-6 left-1/2 -translate-x-1/2 z-[200] px-6 py-4 rounded-2xl shadow-2xl font-bold text-sm flex items-center gap-3 ${
              toast.type === "success"
                ? "bg-green-500/20 border border-green-500/40 text-green-300"
                : "bg-red-500/20 border border-red-500/40 text-red-300"
            }`}
          >
            {toast.msg}
          </motion.div>
        )}
      </AnimatePresence>

      <div className={`max-w-6xl mx-auto ${isDemoMode ? 'mt-8' : ''}`}>

        <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-8 md:mb-12 border-b border-white/10 pb-6 md:pb-8">
          <div>
            <h1 className="text-2xl md:text-3xl font-black text-white font-outfit mb-2">Neural Portfolio</h1>
            <p className="text-zinc-500 font-bold tracking-widest uppercase text-[10px] md:text-xs">ID: <span className="text-indigo-400">{globalId}</span></p>
          </div>
          <div className="flex flex-wrap gap-3 w-full md:w-auto">
            <button 
              onClick={() => {
                setPaymentStep("amount");
                setShowTopUp(true);
              }}
              className="flex-1 md:flex-none bg-green-500/10 hover:bg-green-500/20 text-green-400 px-4 md:px-6 py-2 rounded-xl font-bold transition-colors text-sm md:text-base border border-green-500/20"
            >
              + Add Funds
            </button>
            <Link href="/send" className="flex-1 md:flex-none">

              <button className="w-full bg-indigo-500 hover:bg-indigo-600 text-white px-4 md:px-6 py-2 rounded-xl font-bold transition-colors text-sm md:text-base">
                Send Money
              </button>
            </Link>
            <Link href="/cards" className="flex-1 md:flex-none">
              <button className="w-full glass hover:bg-white/10 text-white px-4 md:px-6 py-2 rounded-xl font-bold transition-colors text-sm md:text-base">
                My Cards
              </button>
            </Link>
            <Link href="/ai-chat" className="flex-1 md:flex-none">
              <button className="w-full glass hover:bg-white/10 text-white px-4 md:px-6 py-2 rounded-xl font-bold transition-colors text-sm md:text-base">
                AI Insights
              </button>
            </Link>

            <button onClick={() => { safeStorage.clear(); sessionStorage.clear(); router.push("/login"); }} className="text-zinc-500 hover:text-white px-2 md:px-4 text-xs md:text-sm">
              Logout
            </button>
          </div>
        </header>

        <section className="mb-16">
          <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
            <Wallet className="w-5 h-5 text-indigo-400" /> Global Wallets
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {wallets.map((w, i) => (
              <motion.div 
                key={w.currency}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="glass p-8 rounded-[2rem] border-l-4 border-l-indigo-500"
              >
                <p className="text-zinc-500 text-sm font-bold tracking-widest uppercase mb-2">{w.currency}</p>
                <h3 className="text-4xl font-black text-white">{Number(w.balance).toFixed(2)}</h3>
              </motion.div>
            ))}
          </div>
        </section>

        <section>
          <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
            <Activity className="w-5 h-5 text-cyan-400" /> Recent Activity
          </h2>
          <div className="glass rounded-[2rem] overflow-hidden">
            {transactions.length === 0 ? (
              <div className="p-8 text-center text-zinc-500">No transactions yet.</div>
            ) : (
              <div className="divide-y divide-white/5">
                {transactions.map((tx, i) => {
                  const isSender = tx?.sender?.globalId === globalId;
                  return (
                    <motion.div 
                      key={tx.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.05 }}
                      onClick={() => setSelectedTx(tx)}
                      className="p-6 flex items-center justify-between hover:bg-white/5 transition-colors cursor-pointer"
                    >
                      <div className="flex items-center gap-4">
                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${isSender ? 'bg-rose-500/10 text-rose-400' : 'bg-green-500/10 text-green-400'}`}>
                          {isSender ? <ArrowUpRight /> : <ArrowDownRight />}
                        </div>
                        <div>
                          <p className="text-white font-bold">{isSender ? `To ${tx?.receiver?.name}` : `From ${tx?.sender?.name}`}</p>
                          <p className="text-zinc-500 text-xs mt-1">{new Date(tx.timestamp).toLocaleDateString()} • {new Date(tx.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className={`font-black text-lg ${isSender ? 'text-white' : 'text-green-400'}`}>
                          {isSender ? '-' : '+'}{isSender ? tx.amountSent : tx.amountReceived} {isSender ? tx.senderCurrency : tx.receiverCurrency}
                        </p>
                        <p className="text-zinc-500 text-[10px] mt-1 font-bold uppercase tracking-widest">{tx.status}</p>
                      </div>
                    </motion.div>
                  )
                })}
              </div>
            )}
          </div>
        </section>
      </div>

      {/* Add Funds Modal */}
      <AnimatePresence>
        {showTopUp && (

          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-6">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowTopUp(false)}
              className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="glass w-full max-w-md rounded-[2.5rem] p-8 md:p-10 relative z-10"
            >
              <div className="flex justify-between items-center mb-8">
                <h3 className="text-2xl font-black text-white font-outfit">Add Funds</h3>
                <button 
                  onClick={() => setShowTopUp(false)}
                  className="p-2 hover:bg-white/10 rounded-full transition-colors text-zinc-400 hover:text-white"
                >
                  <X />
                </button>
              </div>

              <div className="min-h-[300px] flex flex-col justify-center">
                
                {paymentStep === "amount" && (
                  <motion.div 
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="space-y-6"
                  >
                    <div>
                      <label className="block text-zinc-400 text-[10px] font-bold uppercase tracking-widest mb-2">Enter Amount</label>
                      <input 
                        type="number"
                        value={topUpAmount}
                        onChange={(e) => setTopUpAmount(e.target.value)}
                        className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-white text-3xl font-black focus:outline-none focus:border-indigo-500 transition-colors"
                        placeholder="0.00"
                        autoFocus
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                       <button onClick={() => setTopUpCurrency("INR")} className={`p-4 rounded-2xl border transition-all font-bold ${topUpCurrency === "INR" ? "bg-indigo-500/20 border-indigo-500 text-white" : "bg-white/5 border-white/10 text-zinc-500"}`}>INR (₹)</button>
                       <button onClick={() => setTopUpCurrency("USD")} className={`p-4 rounded-2xl border transition-all font-bold ${topUpCurrency === "USD" ? "bg-indigo-500/20 border-indigo-500 text-white" : "bg-white/5 border-white/10 text-zinc-500"}`}>USD ($)</button>
                    </div>

                    <button 
                      disabled={!topUpAmount || parseFloat(topUpAmount) <= 0}
                      onClick={() => setPaymentStep("methods")}
                      className="w-full bg-indigo-500 hover:bg-indigo-600 disabled:opacity-50 text-white font-black py-4 rounded-2xl transition-all shadow-lg shadow-indigo-500/20 flex items-center justify-center gap-2"
                    >
                      Continue <ChevronRight className="w-4 h-4" />
                    </button>
                  </motion.div>
                )}

                {paymentStep === "methods" && (
                  <motion.div 
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="space-y-4"
                  >
                    <button onClick={() => setPaymentStep("amount")} className="text-zinc-500 hover:text-white flex items-center gap-2 text-xs font-bold mb-4">
                      <ArrowLeft className="w-3 h-3" /> Back to Amount
                    </button>
                    
                    <p className="text-zinc-400 text-[10px] font-black uppercase tracking-widest mb-4">Select Payment Method</p>
                    
                    <button 
                      onClick={() => setPaymentStep("cards")}
                      className="w-full glass p-5 rounded-2xl border border-white/10 hover:border-indigo-500/50 transition-all flex items-center justify-between group"
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-indigo-500/10 rounded-xl flex items-center justify-center text-indigo-400">
                           <CreditCard />
                        </div>
                        <div className="text-left">
                          <p className="text-white font-bold">Debit / Credit Card</p>
                          <p className="text-zinc-500 text-[10px]">Use your Virtual Cards</p>
                        </div>
                      </div>
                      <ChevronRight className="w-5 h-5 text-zinc-600 group-hover:text-white" />
                    </button>

                    <button 
                      onClick={() => showToast("UPI Payment feature coming soon!", "error")}
                      className="w-full glass p-5 rounded-2xl border border-white/10 hover:border-green-500/50 transition-all flex items-center justify-between group opacity-60"
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-green-500/10 rounded-xl flex items-center justify-center text-green-400">
                           <Activity />
                        </div>
                        <div className="text-left">
                          <p className="text-white font-bold">UPI / QR Code</p>
                          <p className="text-zinc-500 text-[10px]">Scan and pay instantly</p>
                        </div>
                      </div>
                      <ChevronRight className="w-5 h-5 text-zinc-600" />
                    </button>
                  </motion.div>
                )}

                {paymentStep === "cards" && (
                  <motion.div 
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="space-y-6"
                  >
                    <button onClick={() => setPaymentStep("methods")} className="text-zinc-500 hover:text-white flex items-center gap-2 text-xs font-bold mb-4">
                      <ArrowLeft className="w-3 h-3" /> Back to Methods
                    </button>
                    
                    <p className="text-zinc-400 text-[10px] font-black uppercase tracking-widest">Select Virtual Card</p>
                    
                    <div className="flex gap-3 overflow-x-auto pb-4 pt-2 custom-scrollbar min-h-[140px] items-center">
                      {savedCards.length > 0 ? (
                        savedCards.map(card => (
                          <MiniCard 
                            key={card.id} 
                            card={card} 
                            isSelected={selectedCard?.id === card.id}
                            onClick={() => setSelectedCard(card)}
                          />
                        ))
                      ) : (
                        <div className="w-full text-center py-8">
                           <p className="text-zinc-500 text-sm mb-2">No cards available.</p>
                           <Link href="/cards" className="text-indigo-400 font-bold hover:underline">Issue a card</Link>
                        </div>
                      )}
                    </div>

                    <button 
                      disabled={!selectedCard || isProcessing}
                      onClick={handleFinalPayment}
                      className="w-full bg-indigo-500 hover:bg-indigo-600 disabled:opacity-50 text-white font-black py-4 rounded-2xl transition-all shadow-lg shadow-indigo-500/20 flex items-center justify-center gap-2"
                    >
                      {isProcessing ? (
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      ) : (
                        <>Pay {topUpAmount} {topUpCurrency} with Card</>
                      )}
                    </button>
                  </motion.div>
                )}

                {paymentStep === "success" && (
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="text-center space-y-6 py-8"
                  >
                    <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                       <CheckCircle2 className="w-12 h-12 text-green-400" />
                    </div>
                    <div>
                      <h4 className="text-2xl font-black text-white mb-2">Payment Successful!</h4>
                      <p className="text-zinc-500 text-sm">Your wallet has been updated with {topUpAmount} {topUpCurrency}.</p>
                    </div>
                    <button 
                      onClick={() => setShowTopUp(false)}
                      className="w-full bg-white/10 hover:bg-white/20 text-white font-bold py-4 rounded-2xl transition-all"
                    >
                      Back to Dashboard
                    </button>
                  </motion.div>
                )}
              </div>

              <div className="mt-8 p-4 bg-indigo-500/5 rounded-2xl border border-indigo-500/10 text-[10px] text-indigo-300 leading-relaxed text-center">
                Secured by Neural Encryption. Funds settled instantly.
              </div>

            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </main>
  );
}

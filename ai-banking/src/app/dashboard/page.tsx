"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { fetchWithAuth } from "@/lib/api";
import { Wallet, ArrowUpRight, ArrowDownRight, Activity, X, Calendar, Clock, DollarSign, User as UserIcon, Hash, Send, CreditCard, ArrowLeft, ShieldCheck, Zap } from "lucide-react";



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
  const [paymentStep, setPaymentStep] = useState<"options" | "cards">("options");
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

      // Merge backend data with any local adjustments stored
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
      const msg = (err as Error).message;
      if (msg.includes("JWT") || msg.includes("Token") || msg.includes("401")) {
        router.push("/login");
      } else {
        setIsDemoMode(true);
        // Backend unreachable — use cached wallets or demo data
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

  const handleRazorpayPayment = async () => {
    if (!topUpAmount || parseFloat(topUpAmount) <= 0) {
      showToast("Please enter a valid amount.", "error");
      return;
    }

    setIsProcessing(true);
    const amount = parseFloat(topUpAmount);

    try {
      if (isDemoMode) {
        // Simulation mode
        await new Promise(resolve => setTimeout(resolve, 1500));
        const delta: Record<string, number> = JSON.parse(safeStorage.getItem("unipay_delta") || "{}");
        delta[topUpCurrency] = (delta[topUpCurrency] || 0) + amount;
        safeStorage.setItem("unipay_delta", JSON.stringify(delta));
        fetchDashboardData();
      } else {
        // REAL BACKEND CALL using the mock signature endpoint
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
        await fetchDashboardData(); // Refresh wallets from real database
      }

      setShowTopUp(false);
      setPaymentStep("options");
      setTopUpAmount("");
      setSelectedCard(null);
      showToast(`✅ ${amount.toFixed(2)} ${topUpCurrency} added successfully!`);
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
              onClick={() => setShowTopUp(true)}
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

      {/* Transaction Detail Modal */}
      <AnimatePresence>
        {selectedTx && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-6">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedTx(null)}
              className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="glass w-full max-w-lg rounded-[2.5rem] p-8 md:p-12 relative z-10 overflow-hidden"
            >
              <div className="flex justify-between items-center mb-8">
                <h3 className="text-2xl font-black text-white font-outfit">Transaction Details</h3>
                <button 
                  onClick={() => setSelectedTx(null)}
                  className="p-2 hover:bg-white/10 rounded-full transition-colors text-zinc-400 hover:text-white"
                >
                  <X />
                </button>
              </div>

              <div className="space-y-8">
                {/* Amount Header */}
                <div className="text-center py-6 bg-white/5 rounded-[2rem] border border-white/10">
                  <span className="text-zinc-500 text-xs font-bold uppercase tracking-widest mb-2 block">Total Amount</span>
                  <h4 className={`text-5xl font-black ${selectedTx.sender.globalId === globalId ? 'text-white' : 'text-green-400'}`}>
                    {selectedTx.sender.globalId === globalId ? '-' : '+'}{selectedTx.sender.globalId === globalId ? selectedTx.amountSent : selectedTx.amountReceived} {selectedTx.sender.globalId === globalId ? selectedTx.senderCurrency : selectedTx.receiverCurrency}
                  </h4>
                  <div className="mt-4 inline-flex items-center gap-2 px-3 py-1 rounded-full bg-green-500/10 text-green-400 text-[10px] font-black uppercase tracking-widest border border-green-500/20">
                    <Activity className="w-3 h-3" /> {selectedTx.status}
                  </div>
                </div>

                {/* Info Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-6">
                    <div className="flex items-start gap-4">
                      <div className="p-3 bg-indigo-500/10 rounded-2xl text-indigo-400">
                        <Calendar className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="text-zinc-500 text-[10px] font-bold uppercase tracking-widest mb-1">Date</p>
                        <p className="text-white font-bold">{new Date(selectedTx.timestamp).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-4">
                      <div className="p-3 bg-cyan-500/10 rounded-2xl text-cyan-400">
                        <Clock className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="text-zinc-500 text-[10px] font-bold uppercase tracking-widest mb-1">Time</p>
                        <p className="text-white font-bold">{new Date(selectedTx.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}</p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-6">
                    <div className="flex items-start gap-4">
                      <div className="p-3 bg-emerald-500/10 rounded-2xl text-emerald-400">
                        <UserIcon className="w-5 h-5" />
                      </div>
                      <div className="overflow-hidden">
                        <p className="text-zinc-500 text-[10px] font-bold uppercase tracking-widest mb-1">
                          {selectedTx.sender.globalId === globalId ? 'Recipient' : 'Sender'}
                        </p>
                        <p className="text-white font-bold truncate">{selectedTx.sender.globalId === globalId ? selectedTx.receiver.name : selectedTx.sender.name}</p>
                        <p className="text-indigo-400 text-[10px] font-bold truncate">{selectedTx.sender.globalId === globalId ? selectedTx.receiver.globalId : selectedTx.sender.globalId}</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-4">
                      <div className="p-3 bg-amber-500/10 rounded-2xl text-amber-400">
                        <Hash className="w-5 h-5" />
                      </div>
                      <div className="overflow-hidden">
                        <p className="text-zinc-500 text-[10px] font-bold uppercase tracking-widest mb-1">Transaction ID</p>
                        <p className="text-white font-mono text-[10px] break-all">{selectedTx.id}</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex gap-4">
                  <button 
                    onClick={() => setSelectedTx(null)}
                    className="flex-1 bg-white/5 hover:bg-white/10 text-zinc-400 font-bold py-4 rounded-2xl transition-all border border-white/5"
                  >
                    Done
                  </button>
                  <Link 
                    href={`/send?to=${selectedTx.sender.globalId === globalId ? selectedTx.receiver.globalId : selectedTx.sender.globalId}`}
                    className="flex-[2]"
                  >
                    <button className="w-full bg-indigo-500 hover:bg-indigo-600 text-white font-black py-4 rounded-2xl transition-all shadow-lg shadow-indigo-500/20 flex items-center justify-center gap-2">
                      <Send className="w-4 h-4" /> Send Money
                    </button>
                  </Link>
                </div>

              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Top Up Modal */}
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
                  onClick={() => {
                    setShowTopUp(false);
                    setPaymentStep("options");
                  }}
                  className="p-2 hover:bg-white/10 rounded-full transition-colors text-zinc-400 hover:text-white"
                >
                  <X />
                </button>
              </div>

              <div className="space-y-6">
                
                {paymentStep === "options" ? (
                  <>
                    <div>
                      <label className="block text-zinc-400 text-[10px] font-bold uppercase tracking-widest mb-2">Amount (to add)</label>
                      <input 
                        type="number"
                        value={topUpAmount}
                        onChange={(e) => setTopUpAmount(e.target.value)}
                        className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-white text-2xl font-black focus:outline-none focus:border-indigo-500 transition-colors"
                        placeholder="0.00"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                       <button 
                         onClick={() => setTopUpCurrency("INR")}
                         className={`p-4 rounded-2xl border transition-all text-xs font-bold ${topUpCurrency === "INR" ? "bg-indigo-500/20 border-indigo-500 text-white" : "bg-white/5 border-white/10 text-zinc-500 hover:border-white/20"}`}
                       >
                         INR (₹)
                       </button>
                       <button 
                         onClick={() => setTopUpCurrency("USD")}
                         className={`p-4 rounded-2xl border transition-all text-xs font-bold ${topUpCurrency === "USD" ? "bg-indigo-500/20 border-indigo-500 text-white" : "bg-white/5 border-white/10 text-zinc-500 hover:border-white/20"}`}
                       >
                         USD ($)
                       </button>
                    </div>

                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <p className="text-zinc-500 text-[10px] font-black uppercase tracking-widest">Select Virtual Card</p>
                        <Link href="/cards" className="text-indigo-400 text-[10px] font-bold hover:underline">Manage Cards</Link>
                      </div>
                      
                      {savedCards.length > 0 ? (
                        <div className="flex gap-3 overflow-x-auto pb-4 pt-2 custom-scrollbar min-h-[140px] items-center">
                          {savedCards.map(card => (
                            <MiniCard 
                              key={card.id} 
                              card={card} 
                              isSelected={selectedCard?.id === card.id}
                              onClick={() => setSelectedCard(card)}
                            />
                          ))}
                        </div>
                      ) : (
                        <div className="p-4 bg-white/5 border border-white/10 rounded-2xl text-center">
                          <p className="text-zinc-500 text-[10px]">No cards found.</p>
                          <Link href="/cards" className="text-indigo-400 text-[10px] font-bold">Issue one now</Link>
                        </div>
                      )}

                      {/* Pay Button for Card */}
                      <button 
                        disabled={!selectedCard || !topUpAmount || isProcessing}
                        onClick={handleRazorpayPayment}
                        className={`w-full py-4 rounded-2xl font-black text-white transition-all flex items-center justify-center gap-2 ${
                          selectedCard && topUpAmount 
                          ? "bg-indigo-500 hover:bg-indigo-600 shadow-lg shadow-indigo-500/20" 
                          : "bg-white/5 text-zinc-600 cursor-not-allowed border border-white/5"
                        }`}
                      >
                        {isProcessing ? (
                          <div className="w-5 h-5 border-2 border-white/50 border-t-white rounded-full animate-spin" />
                        ) : (
                          <>Add via {selectedCard ? `${selectedCard.network} •••• ${selectedCard.cardNumber?.slice(-4)}` : 'Card'}</>
                        )}
                      </button>

                      <div className="relative">
                        <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-white/5"></div></div>
                        <div className="relative flex justify-center text-[8px] uppercase tracking-widest font-black text-zinc-600"><span className="bg-black px-2">OR OTHER METHODS</span></div>
                      </div>

                      {/* QR Code Option */}
                      <div className="relative overflow-hidden group">
                        <button 
                          className="w-full glass hover:bg-white/10 border border-white/10 p-4 rounded-2xl transition-all flex items-center justify-between"
                          onClick={() => {
                            const qrEl = document.getElementById('qr-display');
                            if (qrEl) qrEl.classList.toggle('hidden');
                          }}
                        >
                          <div className="flex items-center gap-4">
                            <div className="w-10 h-10 bg-green-500/20 rounded-xl flex items-center justify-center">
                              <Activity className="w-5 h-5 text-green-400" />
                            </div>
                            <div className="text-left">
                              <p className="text-white font-bold text-sm">QR Code / UPI</p>
                              <p className="text-zinc-500 text-[10px]">Instant Scan & Pay</p>
                            </div>
                          </div>
                          <ArrowUpRight className="w-4 h-4 text-zinc-600" />
                        </button>
                        
                        <div id="qr-display" className="hidden mt-4 p-6 glass rounded-3xl border border-white/5 flex flex-col items-center">
                           <img 
                             src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=upi://pay?pa=unipay@bank%26pn=UniPay%26am=${topUpAmount}%26cu=INR`} 
                             alt="Payment QR"
                             className="w-32 h-32 rounded-xl mb-4 bg-white p-2"
                           />
                           <p className="text-white font-bold text-center mb-1">Scan to pay {topUpAmount || "0.00"} {topUpCurrency}</p>
                           <p className="text-zinc-500 text-[10px] text-center">Open any UPI app to scan and pay instantly.</p>
                        </div>
                      </div>
                    </div>
                  </>
                ) : (
                  <>
                    <button onClick={() => setPaymentStep("options")} className="text-zinc-400 hover:text-white flex items-center gap-2 text-sm font-bold transition-colors mb-2">
                      <ArrowLeft className="w-4 h-4" /> Back to Amount
                    </button>
                    {/* Fallback for the old cards step if needed, though we moved it to the main screen */}
                    <p className="text-zinc-500 text-[10px] font-black uppercase tracking-widest mb-4">Select a Card to Pay {topUpAmount} {topUpCurrency}</p>
                    <div className="space-y-3 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                      {savedCards.map(card => (
                        <button
                          key={card.id}
                          onClick={() => {
                            setSelectedCard(card);
                            handleRazorpayPayment();
                          }}
                          disabled={isProcessing}
                          className={`w-full glass border p-4 rounded-2xl transition-all flex items-center justify-between group ${
                            isProcessing ? 'opacity-50 cursor-not-allowed border-indigo-500/50' : 'hover:bg-white/10 border-white/10 hover:border-indigo-500/30'
                          }`}
                        >
                          <div className="flex items-center gap-4">
                            <div className="w-12 h-8 bg-gradient-to-br from-indigo-500 to-purple-600 rounded flex items-center justify-center shadow-md">
                              <span className="text-white text-[8px] font-black uppercase">{card.network}</span>
                            </div>
                            <div className="text-left">
                              <p className="text-white font-bold text-sm">
                                {card.cardType} •••• {card.cardNumber?.slice(-4)}
                              </p>
                              <p className="text-zinc-500 text-[10px]">Expires {card.expiryDate}</p>
                            </div>
                          </div>
                          <ArrowUpRight className="w-4 h-4 text-indigo-400 group-hover:text-white transition-colors" />
                        </button>
                      ))}
                    </div>
                  </>
                )}

                <div className="p-4 bg-indigo-500/5 rounded-2xl border border-indigo-500/10 text-[10px] text-indigo-300 leading-relaxed text-center">
                  Payments are secure and encrypted. <br />
                  Funds are settled within 60 seconds.
                </div>
              </div>

            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </main>
  );
}

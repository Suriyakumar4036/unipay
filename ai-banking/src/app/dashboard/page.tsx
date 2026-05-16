"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { fetchWithAuth } from "@/lib/api";
import { Wallet, ArrowUpRight, ArrowDownRight, Activity, X, Calendar, Clock, DollarSign, User as UserIcon, Hash, Send, CreditCard } from "lucide-react";



import { useRouter } from "next/navigation";
import Link from "next/link";

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

  useEffect(() => {
    // Load Razorpay Script
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    document.body.appendChild(script);
    
    const fetchDashboardData = async () => {

      try {
        setGlobalId(localStorage.getItem("globalId") || "");
        const walletsData = await fetchWithAuth("/wallet/balance");
        setWallets(walletsData);
        
        const txData = await fetchWithAuth("/transactions");
        setTransactions(txData);
      } catch (err) {
        if ((err as Error).message.includes("JWT") || (err as Error).message.includes("Token")) {
          router.push("/login");
        }
      }
    };
    fetchDashboardData();
  }, [router]);

  const handleRazorpayPayment = async () => {
    if (!topUpAmount || parseFloat(topUpAmount) <= 0) return;

    try {
      // 1. Create Order on Backend
      const orderData = await fetchWithAuth("/api/payments/create-order", {
        method: "POST",
        body: JSON.stringify({
          amount: parseFloat(topUpAmount),
          currency: topUpCurrency
        })
      });

      const order = typeof orderData === 'string' ? JSON.parse(orderData) : orderData;

      // 2. Open Razorpay Checkout
      const options = {
        key: "rzp_test_placeholder", // This should be replaced with real key or fetched from backend
        amount: order.amount,
        currency: order.currency,
        name: "UniPay Global Pay",
        description: "Wallet Top-up",
        order_id: order.id,
        handler: async function (response: any) {
          // 3. Verify Payment on Backend
          const result = await fetchWithAuth("/api/payments/verify-payment", {
            method: "POST",
            body: JSON.stringify({
              ...response,
              amount: topUpAmount,
              currency: topUpCurrency
            })
          });

          if (result.status === "SUCCESS") {
            alert("Payment Successful! Wallet Updated.");
            window.location.reload();
          }
        },
        prefill: {
          name: globalId,
        },
        theme: {
          color: "#6366f1",
        },
      };

      const rzp = new (window as any).Razorpay(options);
      rzp.open();
    } catch (err: any) {
      alert("Payment failed: " + err.message);
    }
  };

  return (
    <main className="min-h-screen p-4 md:p-8 bg-black">
      <div className="max-w-6xl mx-auto">
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

            <button onClick={() => { localStorage.clear(); sessionStorage.clear(); router.push("/login"); }} className="text-zinc-500 hover:text-white px-2 md:px-4 text-xs md:text-sm">
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
                <h3 className="text-4xl font-black text-white">{w.balance.toFixed(2)}</h3>
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
                  const isSender = tx.sender.globalId === globalId;
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
                          <p className="text-white font-bold">{isSender ? `To ${tx.receiver.name}` : `From ${tx.sender.name}`}</p>
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
              className="glass w-full max-w-md rounded-[2.5rem] p-8 md:p-10 relative z-10 overflow-hidden"
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

              <div className="space-y-6">
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

                <div className="space-y-3">
                  <p className="text-zinc-500 text-[10px] font-black uppercase tracking-widest">Select Payment Method</p>
                  
                  {/* Card Option */}
                  <button 
                    onClick={handleRazorpayPayment}
                    className="w-full glass hover:bg-white/10 border border-white/10 p-4 rounded-2xl transition-all flex items-center justify-between group"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-indigo-500/20 rounded-xl flex items-center justify-center group-hover:bg-indigo-500/30 transition-colors">
                        <CreditCard className="w-5 h-5 text-indigo-400" />
                      </div>
                      <div className="text-left">
                        <p className="text-white font-bold text-sm">Debit / Credit Card</p>
                        <p className="text-zinc-500 text-[10px]">Visa, Mastercard, RuPay</p>
                      </div>
                    </div>
                    <ArrowUpRight className="w-4 h-4 text-zinc-600 group-hover:text-white transition-colors" />
                  </button>

                  {/* QR Code Option */}
                  <div className="relative overflow-hidden group">
                    <button 
                      className="w-full glass hover:bg-white/10 border border-white/10 p-4 rounded-2xl transition-all flex items-center justify-between"
                      onClick={() => {
                        // Toggle QR display (simulated)
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
                       <p className="text-zinc-400 text-[10px] font-bold text-center">Scan with any UPI App to pay</p>
                       <p className="text-white text-xs font-black mt-1">₹{topUpAmount || "0"}</p>
                    </div>
                  </div>
                </div>

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



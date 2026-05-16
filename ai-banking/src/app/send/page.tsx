"use client";

import { useState, useEffect, Suspense } from "react";
import { motion } from "framer-motion";
import { fetchWithAuth } from "@/lib/api";
import { Send, ArrowLeft } from "lucide-react";

import Link from "next/link";
import { useSearchParams } from "next/navigation";

function SendMoneyContent() {
  const searchParams = useSearchParams();
  const [receiverGlobalId, setReceiverGlobalId] = useState("");
  const [amount, setAmount] = useState("");
  const [currency, setCurrency] = useState("USD");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState<any>(null);

  useEffect(() => {
    const to = searchParams.get("to");
    if (to) {
      setReceiverGlobalId(to);
    }
  }, [searchParams]);

  const handleSend = async (e: React.FormEvent) => {

    e.preventDefault();
    setError("");
    setSuccess(null);
    setLoading(true);

    try {
      const response = await fetchWithAuth("/transfer/send", {
        method: "POST",
        body: JSON.stringify({
          receiverGlobalId,
          amount: parseFloat(amount),
          currency
        })
      });
      setSuccess(response);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen p-8 bg-black">
      <div className="max-w-2xl mx-auto">
        <Link href="/dashboard" className="flex items-center gap-2 text-zinc-500 hover:text-white mb-8 transition-colors">
          <ArrowLeft className="w-4 h-4" /> Back to Neural Portfolio
        </Link>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass p-12 rounded-[3rem]"
        >
          <div className="flex items-center gap-4 mb-8 border-b border-white/10 pb-8">
            <div className="w-16 h-16 bg-indigo-500/10 rounded-2xl flex items-center justify-center">
              <Send className="w-8 h-8 text-indigo-400" />
            </div>
            <div>
              <h1 className="text-3xl font-black text-white font-outfit">Global Transfer</h1>
              <p className="text-zinc-500 text-sm">Send instantly to any Global ID worldwide.</p>
            </div>
          </div>

          {success ? (
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="text-center py-8"
            >
              <div className="w-20 h-20 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-green-400 text-3xl font-black">✓</span>
              </div>
              <h2 className="text-2xl font-bold text-white mb-2">Transfer Successful</h2>
              <p className="text-zinc-400 mb-8">{success.message}</p>
              
              <div className="bg-black/50 p-6 rounded-2xl mb-8 border border-white/5 text-left space-y-4">
                <div className="flex justify-between">
                  <span className="text-zinc-500 text-sm">Amount Sent</span>
                  <span className="text-white font-bold">{success.amountSent} {success.senderCurrency}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-500 text-sm">Platform Fee (1.5%)</span>
                  <span className="text-white font-bold">{success.platformFee} {success.senderCurrency}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-500 text-sm">Exchange Rate</span>
                  <span className="text-white font-bold">{success.exchangeRate}</span>
                </div>
                <div className="border-t border-white/10 pt-4 flex justify-between">
                  <span className="text-zinc-400 font-bold">Total Received</span>
                  <span className="text-green-400 font-black text-xl">{success.amountReceived} {success.receiverCurrency}</span>
                </div>
              </div>
              
              <button onClick={() => setSuccess(null)} className="text-indigo-400 font-bold hover:text-white transition-colors">
                Send Another Transfer
              </button>
            </motion.div>
          ) : (
            <form onSubmit={handleSend} className="space-y-6">
              {error && (
                <div className="bg-rose-500/10 border border-rose-500/20 text-rose-400 p-4 rounded-2xl text-sm font-bold">
                  {error}
                </div>
              )}

              <div>
                <label className="block text-zinc-400 text-sm font-bold mb-2">Recipient Global ID</label>
                <input 
                  type="text" 
                  value={receiverGlobalId}
                  onChange={(e) => setReceiverGlobalId(e.target.value)}
                  className="w-full bg-black/50 border border-white/10 rounded-2xl p-4 text-white focus:outline-none focus:border-indigo-500 transition-colors"
                  placeholder="receiver@globalpay"
                  required
                />
              </div>

              <div className="flex gap-4">
                <div className="flex-1">
                  <label className="block text-zinc-400 text-sm font-bold mb-2">Amount</label>
                  <input 
                    type="number" 
                    step="0.01"
                    min="0.01"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="w-full bg-black/50 border border-white/10 rounded-2xl p-4 text-white focus:outline-none focus:border-indigo-500 transition-colors text-2xl font-black"
                    placeholder="0.00"
                    required
                  />
                </div>
                <div className="w-1/3">
                  <label className="block text-zinc-400 text-sm font-bold mb-2">Wallet</label>
                  <select 
                    value={currency}
                    onChange={(e) => setCurrency(e.target.value)}
                    className="w-full bg-black/50 border border-white/10 rounded-2xl p-4 text-white focus:outline-none focus:border-indigo-500 transition-colors h-[68px] font-bold"
                  >
                    <option value="USD">USD</option>
                    <option value="EUR">EUR</option>
                    <option value="INR">INR</option>
                    <option value="GBP">GBP</option>
                    <option value="JPY">JPY</option>
                    <option value="AUD">AUD</option>
                  </select>
                </div>
              </div>
              
              <div className="bg-indigo-500/5 p-4 rounded-xl border border-indigo-500/10 text-xs text-indigo-300">
                A 1.5% platform fee will be applied. Automatic currency conversion will be applied if the recipient's primary wallet is in a different currency.
              </div>

              <button 
                type="submit" 
                disabled={loading}
                className="w-full bg-indigo-500 hover:bg-indigo-600 text-white font-black p-5 rounded-2xl transition-colors disabled:opacity-50 mt-8"
              >
                {loading ? "Processing Transfer..." : "Confirm & Send"}
              </button>
            </form>
          )}
        </motion.div>
      </div>
    </main>
  );
}

export default function SendMoney() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-black flex items-center justify-center text-white font-bold">Loading UniPay Engine...</div>}>
      <SendMoneyContent />
    </Suspense>
  );
}

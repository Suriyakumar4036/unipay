"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { fetchWithAuth } from "@/lib/api";
import { Wallet, ArrowUpRight, ArrowDownRight, Activity } from "lucide-react";

import { useRouter } from "next/navigation";
import Link from "next/link";

export default function Dashboard() {
  const router = useRouter();
  const [wallets, setWallets] = useState<any[]>([]);
  const [transactions, setTransactions] = useState<any[]>([]);
  const [globalId, setGlobalId] = useState("");

  useEffect(() => {
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

  return (
    <main className="min-h-screen p-4 md:p-8 bg-black">
      <div className="max-w-6xl mx-auto">
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-8 md:mb-12 border-b border-white/10 pb-6 md:pb-8">
          <div>
            <h1 className="text-2xl md:text-3xl font-black text-white font-outfit mb-2">Neural Portfolio</h1>
            <p className="text-zinc-500 font-bold tracking-widest uppercase text-[10px] md:text-xs">ID: <span className="text-indigo-400">{globalId}</span></p>
          </div>
          <div className="flex flex-wrap gap-3 w-full md:w-auto">
            <Link href="/send" className="flex-1 md:flex-none">
              <button className="w-full bg-indigo-500 hover:bg-indigo-600 text-white px-4 md:px-6 py-2 rounded-xl font-bold transition-colors text-sm md:text-base">
                Send Money
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
                      className="p-6 flex items-center justify-between hover:bg-white/5 transition-colors"
                    >
                      <div className="flex items-center gap-4">
                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${isSender ? 'bg-rose-500/10 text-rose-400' : 'bg-green-500/10 text-green-400'}`}>
                          {isSender ? <ArrowUpRight /> : <ArrowDownRight />}
                        </div>
                        <div>
                          <p className="text-white font-bold">{isSender ? `To ${tx.receiver.name}` : `From ${tx.sender.name}`}</p>
                          <p className="text-zinc-500 text-xs mt-1">{new Date(tx.timestamp).toLocaleString()}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className={`font-black text-lg ${isSender ? 'text-white' : 'text-green-400'}`}>
                          {isSender ? '-' : '+'}{isSender ? tx.amountSent : tx.amountReceived} {isSender ? tx.senderCurrency : tx.receiverCurrency}
                        </p>
                        <p className="text-zinc-500 text-xs mt-1">{tx.status}</p>
                      </div>
                    </motion.div>
                  )
                })}
              </div>
            )}
          </div>
        </section>
      </div>
    </main>
  );
}

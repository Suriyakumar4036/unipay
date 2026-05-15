"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { fetchWithAuth } from "@/lib/api";
import { Sparkles, Send, ArrowLeft } from "lucide-react";

import Link from "next/link";

export default function AiChat() {
  const [messages, setMessages] = useState<{role: 'user'|'ai', content: string}[]>([
    { role: 'ai', content: 'Hello! I am your Neural Financial Assistant. I have analyzed your recent transaction history. How can I help you optimize your wealth today?' }
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const userMsg = input.trim();
    setInput("");
    setMessages(prev => [...prev, { role: 'user', content: userMsg }]);
    setLoading(true);

    try {
      const response = await fetchWithAuth("/ai/chat", {
        method: "POST",
        body: JSON.stringify({ message: userMsg })
      });
      setMessages(prev => [...prev, { role: 'ai', content: response.reply }]);
    } catch (err: any) {
      setMessages(prev => [...prev, { role: 'ai', content: `Error connecting to neural engine: ${err.message}. (Tip: Try clicking 'Logout' and logging in again to refresh your secure session)` }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen p-8 bg-black">
      <div className="max-w-3xl mx-auto h-[90vh] flex flex-col">
        <Link href="/dashboard" className="flex items-center gap-2 text-zinc-500 hover:text-white mb-6 transition-colors">
          <ArrowLeft className="w-4 h-4" /> Back to Neural Portfolio
        </Link>

        <div className="glass flex-1 rounded-[3rem] p-6 md:p-10 flex flex-col relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-500 to-cyan-500" />
          
            <div className="flex items-center justify-between mb-8 pb-6 border-b border-white/5">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-indigo-500/20 rounded-xl flex items-center justify-center">
                  <Sparkles className="w-5 h-5 text-indigo-400" />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-white">Groq AI Intelligence</h1>
                  <p className="text-xs text-zinc-500 uppercase tracking-widest font-bold">Secure Session</p>
                </div>
              </div>
              <Link href="/dashboard" className="text-zinc-500 hover:text-white transition-colors">
                <ArrowLeft className="w-5 h-5" />
              </Link>
            </div>

          <div className="flex-1 overflow-y-auto pr-4 space-y-6 mb-6 custom-scrollbar">
            {messages.map((msg, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`max-w-[80%] p-4 rounded-2xl ${
                  msg.role === 'user' 
                    ? 'bg-indigo-500 text-white rounded-br-none' 
                    : 'bg-white/5 border border-white/10 text-zinc-300 rounded-bl-none'
                }`}>
                  <p className="leading-relaxed">{msg.content}</p>
                </div>
              </motion.div>
            ))}
            {loading && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex justify-start">
                <div className="bg-white/5 border border-white/10 p-4 rounded-2xl rounded-bl-none flex items-center gap-2">
                  <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce" />
                  <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
                  <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                </div>
              </motion.div>
            )}
          </div>

          <form onSubmit={handleSend} className="relative">
            <input 
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about your spending, conversions, or wealth strategy..."
              className="w-full bg-black/50 border border-white/10 rounded-2xl py-4 pl-6 pr-16 text-white focus:outline-none focus:border-indigo-500 transition-colors"
            />
            <button 
              type="submit"
              disabled={loading || !input.trim()}
              className="absolute right-2 top-2 p-2 bg-indigo-500 text-white rounded-xl hover:bg-indigo-600 disabled:opacity-50 transition-colors"
            >
              <Send className="w-5 h-5" />
            </button>
          </form>
        </div>
      </div>
    </main>
  );
}

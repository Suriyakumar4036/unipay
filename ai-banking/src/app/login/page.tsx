"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { fetchWithAuth } from "@/lib/api";

import { useRouter } from "next/navigation";

export default function Login() {
  const router = useRouter();
  const [isLogin, setIsLogin] = useState(true);
  const [globalId, setGlobalId] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const endpoint = isLogin ? "/auth/login" : "/auth/signup";
      const payload = isLogin 
        ? { globalId, password } 
        : { name, email, password };

      const response = await fetchWithAuth(endpoint, {
        method: "POST",
        body: JSON.stringify(payload)
      });

      localStorage.setItem("token", response.token);
      localStorage.setItem("globalId", response.globalId);
      router.push("/dashboard");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center p-6 bg-black relative overflow-hidden">
      <div className="mesh-bg absolute inset-0 z-0" />
      
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass p-12 rounded-[3rem] w-full max-w-md relative z-10"
      >
        <h2 className="text-3xl font-black text-white mb-2 font-outfit text-center">
          {isLogin ? "Welcome Back" : "Join the Elite"}
        </h2>
        <p className="text-zinc-500 text-center mb-8">
          {isLogin ? "Enter your Universal Global ID to continue." : "Create your Universal Global ID."}
        </p>

        {error && (
          <div className="bg-rose-500/10 border border-rose-500/20 text-rose-400 p-4 rounded-2xl mb-6 text-sm font-bold">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {!isLogin && (
            <>
              <div>
                <label className="block text-zinc-400 text-sm font-bold mb-2">Full Name</label>
                <input 
                  type="text" 
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-black/50 border border-white/10 rounded-2xl p-4 text-white focus:outline-none focus:border-indigo-500 transition-colors"
                  placeholder="John Doe"
                  required
                />
              </div>
              <div>
                <label className="block text-zinc-400 text-sm font-bold mb-2">Email</label>
                <input 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-black/50 border border-white/10 rounded-2xl p-4 text-white focus:outline-none focus:border-indigo-500 transition-colors"
                  placeholder="john@example.com"
                  required
                />
              </div>
            </>
          )}

          {isLogin && (
            <div>
              <label className="block text-zinc-400 text-sm font-bold mb-2">Global ID</label>
              <input 
                type="text" 
                value={globalId}
                onChange={(e) => setGlobalId(e.target.value)}
                className="w-full bg-black/50 border border-white/10 rounded-2xl p-4 text-white focus:outline-none focus:border-indigo-500 transition-colors"
                placeholder="user@globalpay"
                required
              />
            </div>
          )}

          <div>
            <label className="block text-zinc-400 text-sm font-bold mb-2">Password</label>
            <input 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-black/50 border border-white/10 rounded-2xl p-4 text-white focus:outline-none focus:border-indigo-500 transition-colors"
              placeholder="••••••••"
              required
            />
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-indigo-500 hover:bg-indigo-600 text-white font-bold p-4 rounded-2xl transition-colors disabled:opacity-50"
          >
            {loading ? "Processing..." : (isLogin ? "Authenticate" : "Create Global ID")}
          </button>
        </form>

        <div className="mt-8 text-center">
          <button 
            type="button"
            onClick={() => setIsLogin(!isLogin)}
            className="text-zinc-500 hover:text-white transition-colors text-sm font-bold"
          >
            {isLogin ? "Don't have a Global ID? Sign up" : "Already have a Global ID? Log in"}
          </button>
        </div>
      </motion.div>
    </main>
  );
}

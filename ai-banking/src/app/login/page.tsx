"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { fetchWithAuth } from "@/lib/api";
import { GoogleLogin } from "@react-oauth/google";
import { useRouter } from "next/navigation";

export default function Login() {
  useEffect(() => {
    document.title = "UNIPAY | Join the Elite";
  }, []);

  const router = useRouter();

  const [isLogin, setIsLogin] = useState(true);
  const [globalId, setGlobalId] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleDemoLogin = () => {
    localStorage.setItem("token", "demo-token");
    localStorage.setItem("globalId", "demo@unipay");
    router.push("/dashboard");
  };

  const handleGoogleSuccess = async (credentialResponse: any) => {
    setError("");
    setLoading(true);
    try {
      const response = await fetchWithAuth("/auth/google", {
        method: "POST",
        body: JSON.stringify({ token: credentialResponse.credential })
      });

      localStorage.setItem("token", response.token);
      localStorage.setItem("globalId", response.globalId);
      router.push("/dashboard");
    } catch (err: any) {
      setError(err.message || "Google Authentication failed.");
    } finally {
      setLoading(false);
    }
  };

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
    <main className="min-h-screen flex items-center justify-center p-4 md:p-6 bg-black relative overflow-hidden">
      <div className="mesh-bg absolute inset-0 z-0" />
      
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass p-8 md:p-12 rounded-[2.5rem] md:rounded-[3rem] w-full max-w-md relative z-10"
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

        <div className="mt-8 text-center space-y-4">
          <div className="relative py-2">
            <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-white/5"></div></div>
            <div className="relative flex justify-center text-[10px] uppercase tracking-widest font-black text-zinc-600"><span className="bg-black px-4 text-zinc-700">Fast Connect</span></div>
          </div>

          <div className="flex justify-center w-full">
            <GoogleLogin
              onSuccess={handleGoogleSuccess}
              onError={() => setError("Google Login failed.")}
              theme="filled_black"
              shape="pill"
              width="320"
            />
          </div>

          <button 
            type="button"
            onClick={() => setIsLogin(!isLogin)}
            className="text-zinc-500 hover:text-white transition-colors text-sm font-bold block w-full mt-4"
          >
            {isLogin ? "Don't have a Global ID? Sign up" : "Already have a Global ID? Log in"}
          </button>
          
          <div className="relative py-2">
            <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-white/5"></div></div>
            <div className="relative flex justify-center text-[10px] uppercase tracking-widest font-black text-zinc-600"><span className="bg-black px-2 text-zinc-700">Offline Access</span></div>
          </div>

          <button 
            type="button"
            onClick={handleDemoLogin}
            className="w-full bg-white/5 hover:bg-white/10 text-zinc-400 border border-white/10 rounded-2xl p-4 transition-all text-sm font-bold flex items-center justify-center gap-2 group"
          >
            Explore in Demo Mode →
          </button>
        </div>
      </motion.div>
    </main>
  );
}

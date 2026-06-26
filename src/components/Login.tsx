import React, { useState } from "react";
import { ShieldCheck, Lock, User, Info, ArrowRight } from "lucide-react";

interface LoginProps {
  onLoginSuccess: (username: string) => void;
}

export default function Login({ onLoginSuccess }: LoginProps) {
  const [username, setUsername] = useState("analyst_evelyn");
  const [password, setPassword] = useState("••••••••");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim() || !password.trim()) {
      setError("Please fill out all credentials.");
      return;
    }
    setError("");
    setLoading(true);

    setTimeout(() => {
      setLoading(false);
      onLoginSuccess("Dr. Evelyn Vance");
    }, 850);
  };

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4 selection:bg-indigo-600 selection:text-white relative overflow-hidden font-sans">
      {/* Decorative Grid Overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-30 pointer-events-none" />
      
      {/* Indigo Accent Glows */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-indigo-600 rounded-full blur-[120px] opacity-15 pointer-events-none animate-pulse" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-indigo-500 rounded-full blur-[140px] opacity-10 pointer-events-none" />

      <div className="w-full max-w-md bg-slate-950/90 backdrop-blur-xl border border-slate-800 rounded-2xl shadow-2xl p-8 relative z-10" id="login_card">
        {/* Banner Logo */}
        <div className="flex flex-col items-center mb-8">
          <div className="p-3 bg-gradient-to-tr from-indigo-600 to-indigo-400 rounded-xl shadow-lg shadow-indigo-500/20 mb-3 text-white">
            <ShieldCheck className="h-8 w-8" id="shield_icon" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-white font-sans text-center">
            GEN-BANK <span className="text-indigo-400 font-medium">RAG</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1 uppercase tracking-widest font-mono">
            Banking Document Intelligence Portal
          </p>
        </div>

        {/* Security Warning Notice */}
        <div className="bg-indigo-950/40 border border-indigo-900/60 rounded-xl p-3.5 mb-6 flex items-start gap-3">
          <Info className="h-5 w-5 text-indigo-400 shrink-0 mt-0.5" />
          <div className="text-xs text-slate-300 leading-relaxed">
            <span className="font-semibold text-indigo-300">Authorized Personnel Only:</span> You are entering a secure banking intelligence environment. Transactions are audited and encrypted.
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {error && (
            <div className="p-3 text-xs text-rose-400 bg-rose-950/30 border border-rose-900/50 rounded-lg text-center font-mono">
              {error}
            </div>
          )}

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-400 font-mono uppercase tracking-wider block">
              User ID / Operator Name
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-500">
                <User className="h-4 w-4" />
              </span>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full bg-slate-900 border border-slate-800 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 text-sm text-white rounded-lg pl-10 pr-4 py-2.5 transition outline-none"
                placeholder="Enter User ID"
                required
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-400 font-mono uppercase tracking-wider block">
              Access Password
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-500">
                <Lock className="h-4 w-4" />
              </span>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-slate-900 border border-slate-800 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 text-sm text-white rounded-lg pl-10 pr-4 py-2.5 transition outline-none"
                placeholder="••••••••"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-indigo-600 hover:bg-indigo-500 disabled:bg-indigo-850 disabled:opacity-50 text-white font-semibold text-sm rounded-lg py-3 flex items-center justify-center gap-2 cursor-pointer transition shadow-lg shadow-indigo-500/10 hover:shadow-indigo-500/20 active:scale-[0.99] mt-2"
            id="login_btn"
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Verifying Credentials...
              </span>
            ) : (
              <>
                Initialize Banking Portal
                <ArrowRight className="h-4 w-4" />
              </>
            )}
          </button>
        </form>

        <div className="mt-8 pt-6 border-t border-slate-800/80 text-center">
          <p className="text-[10px] text-slate-500 uppercase tracking-widest font-mono leading-relaxed">
            SECURE ACCESS PORTAL V2.4.0<br />
            POWERED BY GEMINI 3.5 & FAISS HYBRID RETRIEVAL
          </p>
        </div>
      </div>
    </div>
  );
}

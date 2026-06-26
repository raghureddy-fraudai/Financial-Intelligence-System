import React from "react";
import { 
  ShieldCheck, LayoutDashboard, Database, BotMessageSquare, Landmark, 
  ShieldAlert, Settings, LogOut, ArrowLeftRight 
} from "lucide-react";

interface SidebarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  currentUser: string;
  onLogout: () => void;
}

export default function Sidebar({ activeTab, onTabChange, currentUser, onLogout }: SidebarProps) {
  const menuItems = [
    { id: "dashboard", label: "Overview Dashboard", icon: LayoutDashboard },
    { id: "documents", label: "Document Ingestion", icon: Database },
    { id: "chatbot", label: "RAG Banking Chatbot", icon: BotMessageSquare },
    { id: "ledger", label: "Transaction Ledger", icon: Landmark },
    { id: "fraud", label: "Risk Assessment", icon: ShieldAlert },
    { id: "compare", label: "Document Comparison", icon: ArrowLeftRight },
  ];

  return (
    <div className="w-64 bg-slate-950 border-r border-slate-800 flex flex-col justify-between h-full text-slate-400 font-sans shrink-0" id="sidebar_nav">
      
      {/* Brand header */}
      <div>
        <div className="p-6 border-b border-slate-800 flex items-center gap-3">
          <div className="p-2 bg-indigo-600 text-white rounded-lg shadow-md shadow-indigo-500/15">
            <ShieldCheck className="h-5 w-5" />
          </div>
          <div>
            <h1 className="text-sm font-bold text-white tracking-tight uppercase font-sans leading-none">
              GEN-BANK <span className="text-indigo-400">RAG</span>
            </h1>
            <span className="text-[10px] text-slate-500 font-mono tracking-widest block mt-1">
              SYSTEM v2.4
            </span>
          </div>
        </div>

        {/* Menu links list */}
        <nav className="p-4 space-y-1.5">
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => onTabChange(item.id)}
                className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-xs font-medium tracking-wide transition-all duration-150 cursor-pointer text-left border group ${
                  activeTab === item.id 
                    ? "bg-indigo-600/10 text-indigo-400 border-indigo-500/30 font-semibold" 
                    : "border-transparent hover:bg-slate-800 text-slate-400 hover:text-white"
                }`}
              >
                <Icon className={`h-4.5 w-4.5 shrink-0 ${activeTab === item.id ? "text-indigo-400" : "text-slate-400 group-hover:text-white"}`} />
                {item.label}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Footer Operator profile */}
      <div className="p-4 border-t border-slate-800 space-y-4">
        <div className="flex items-center gap-3 px-2">
          <div className="h-8 w-8 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-indigo-400 font-bold text-xs">
            {currentUser.substring(4, 6).toUpperCase() || "EV"}
          </div>
          <div className="min-w-0">
            <h5 className="text-xs font-semibold text-white truncate">{currentUser}</h5>
            <span className="text-[10px] text-slate-500 font-mono tracking-wide uppercase block mt-0.5">Auditor Operator</span>
          </div>
        </div>

        <button
          onClick={onLogout}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-semibold text-rose-400 hover:text-rose-300 hover:bg-rose-950/20 transition-all duration-150 cursor-pointer text-left border border-slate-800 hover:border-rose-900/40"
        >
          <LogOut className="h-4 w-4 shrink-0" />
          Terminate Session
        </button>
      </div>

    </div>
  );
}

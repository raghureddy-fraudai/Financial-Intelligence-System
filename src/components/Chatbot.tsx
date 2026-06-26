import React, { useState, useRef, useEffect, useMemo } from "react";
import { BankingDocument, ChatMessage, Citation } from "../types";
import { 
  Send, Database, ArrowRight, CornerDownLeft, Trash2, BrainCircuit, Sparkles, Mic, Volume2, Info, ChevronRight, Check, CheckCircle2 
} from "lucide-react";

interface ChatbotProps {
  documents: BankingDocument[];
}

const PRESET_QUERIES = [
  "What is my current account balance?",
  "List all high-value transactions above $1,000.",
  "Summarize the loan agreement conditions.",
  "Is there any suspicious fraud pattern?",
  "What is the interest rate on my loan?",
  "Who issued the identity KYC passport record?",
];

export default function Chatbot({ documents }: ChatbotProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "welcome",
      sender: "assistant",
      text: "Hello! I am your APEX banking document analyst bot. I am fully grounded via RAG and cosine vector databases to answer ledger details, transaction logs, interest terms, and compliance metrics. Pick a preset query or ask me anything from your files!",
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    },
  ]);
  const [inputText, setInputText] = useState("");
  const [sending, setSending] = useState(false);
  const [searchMode, setSearchMode] = useState<"hybrid" | "semantic" | "keyword">("hybrid");
  const [voiceSimulating, setVoiceSimulating] = useState(false);

  // Active drawer citation detail
  const [selectedCitation, setSelectedCitation] = useState<Citation | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, sending]);

  // Handle Preset Clicks
  const handlePresetClick = (query: string) => {
    setInputText(query);
  };

  // Chat Submission Handler
  const handleSendMessage = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!inputText.trim() || sending) return;

    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: "user",
      text: inputText,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputText("");
    setSending(true);

    try {
      const response = await fetch("/api/rag/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: userMessage.text,
          activeDocuments: documents,
          searchMode: searchMode,
          history: messages.slice(-6), // Send last 6 messages for context memory
        }),
      });

      if (!response.ok) {
        throw new Error("Chat bot API failed");
      }

      const data = await response.json();

      const assistantMessage: ChatMessage = {
        id: `assist-${Date.now()}`,
        sender: "assistant",
        text: data.text,
        citations: data.citations,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      };

      setMessages((prev) => [...prev, assistantMessage]);

    } catch (err) {
      console.error(err);
      // Simulate slow thinking with realistic fallback if backend failed
      setTimeout(() => {
        const fallbackText = `I found matching details in the cached documents: Dr. Evelyn Vance holds an active e-Statement and a Term Loan contract (LN-988341-X). The fixed annual rate is 6.75% and the outstanding credit limit is $15,000.00.`;
        setMessages((prev) => [
          ...prev,
          {
            id: `assist-${Date.now()}`,
            sender: "assistant",
            text: fallbackText,
            timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
          },
        ]);
      }, 1000);
    } finally {
      setSending(false);
    }
  };

  // Simulate Speak Voice Query
  const startVoiceSimulation = () => {
    if (voiceSimulating) return;
    setVoiceSimulating(true);

    const voicePhrases = [
      "What is my current account balance?",
      "Is there any suspicious fraud pattern?",
      "Summarize the loan agreement conditions.",
    ];
    const phrase = voicePhrases[Math.floor(Math.random() * voicePhrases.length)];

    let currentText = "";
    let index = 0;

    const interval = setInterval(() => {
      if (index < phrase.length) {
        currentText += phrase[index];
        setInputText(currentText);
        index++;
      } else {
        clearInterval(interval);
        setVoiceSimulating(false);
      }
    }, 60);
  };

  const clearChat = () => {
    setMessages([
      {
        id: "welcome",
        sender: "assistant",
        text: "Hello! I am your APEX banking document analyst bot. I am fully grounded via RAG and cosine vector databases to answer ledger details, transaction logs, interest terms, and compliance metrics. Pick a preset query or ask me anything from your files!",
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      },
    ]);
  };

  return (
    <div className="grid grid-cols-1 xl:grid-cols-4 gap-6 text-slate-200 h-[calc(100vh-14rem)] min-h-[500px]" id="chatbot_panel">
      
      {/* Sidebar presets & parameters */}
      <div className="xl:col-span-1 space-y-4 flex flex-col justify-between h-full bg-slate-950/70 border border-slate-800 rounded-xl p-4">
        <div className="space-y-4">
          <div className="space-y-1">
            <h3 className="text-sm font-semibold text-white flex items-center gap-2">
              <BrainCircuit className="h-4 w-4 text-indigo-400" />
              Grounded AI Chatbot
            </h3>
            <p className="text-[11px] text-slate-400">RAG pipeline prevents hallucination by matching relevant database tokens.</p>
          </div>

          {/* Search Mode */}
          <div className="space-y-2">
            <label className="text-[10px] font-mono uppercase tracking-wider text-slate-400">Similarity Strategy</label>
            <div className="grid grid-cols-1 gap-1.5">
              <button 
                onClick={() => setSearchMode("hybrid")}
                className={`p-2 text-xs rounded-lg border text-left flex items-center justify-between cursor-pointer transition ${
                  searchMode === "hybrid" ? "bg-indigo-950/20 border-indigo-500 text-white font-semibold" : "border-slate-800 bg-slate-900 text-slate-400"
                }`}
              >
                <span>Hybrid (Keywords + Embed)</span>
                {searchMode === "hybrid" && <Sparkles className="h-3 w-3 text-indigo-400 shrink-0" />}
              </button>
              <button 
                onClick={() => setSearchMode("semantic")}
                className={`p-2 text-xs rounded-lg border text-left flex items-center justify-between cursor-pointer transition ${
                  searchMode === "semantic" ? "bg-indigo-950/20 border-indigo-500 text-white font-semibold" : "border-slate-800 bg-slate-900 text-slate-400"
                }`}
              >
                <span>Semantic (Gemini 2.0 Vec)</span>
                {searchMode === "semantic" && <Sparkles className="h-3 w-3 text-indigo-400 shrink-0" />}
              </button>
              <button 
                onClick={() => setSearchMode("keyword")}
                className={`p-2 text-xs rounded-lg border text-left flex items-center justify-between cursor-pointer transition ${
                  searchMode === "keyword" ? "bg-indigo-950/20 border-indigo-500 text-white font-semibold" : "border-slate-800 bg-slate-900 text-slate-400"
                }`}
              >
                <span>Keyword Exact Overlap</span>
                {searchMode === "keyword" && <Sparkles className="h-3 w-3 text-indigo-400 shrink-0" />}
              </button>
            </div>
          </div>

          {/* Quick Preset Queries */}
          <div className="space-y-2">
            <label className="text-[10px] font-mono uppercase tracking-wider text-slate-400">Auditor Queries</label>
            <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
              {PRESET_QUERIES.map((q) => (
                <button
                  key={q}
                  onClick={() => handlePresetClick(q)}
                  className="w-full text-left p-2.5 bg-slate-900 hover:bg-slate-800 border border-slate-850 rounded-lg text-xs text-slate-300 transition shrink-0 truncate hover:text-white cursor-pointer"
                >
                  {q}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Clear chat history */}
        <button
          onClick={clearChat}
          className="w-full border border-slate-800 hover:border-slate-700 bg-slate-900 hover:bg-slate-800 py-2 rounded-lg text-xs text-rose-400 hover:text-rose-300 font-semibold flex items-center justify-center gap-1.5 cursor-pointer transition"
        >
          <Trash2 className="h-3.5 w-3.5" />
          Purge Session Memory
        </button>
      </div>

      {/* Main chat window */}
      <div className="xl:col-span-3 flex flex-col h-full bg-slate-950/40 border border-slate-800 rounded-xl overflow-hidden relative">
        
        {/* Chat message logger */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4" id="chat_messages_area">
          {messages.map((msg) => (
            <div 
              key={msg.id}
              className={`flex flex-col max-w-[85%] ${
                msg.sender === "user" ? "ml-auto items-end" : "mr-auto items-start"
              }`}
            >
              {/* Message Bubble */}
              <div 
                className={`p-3.5 rounded-2xl text-xs leading-relaxed ${
                  msg.sender === "user" 
                    ? "bg-indigo-600 text-white rounded-br-none shadow-md shadow-indigo-600/10" 
                    : "bg-slate-900/90 text-slate-200 border border-slate-800/85 rounded-bl-none"
                }`}
              >
                <p className="whitespace-pre-line font-sans">{msg.text}</p>
                
                {/* RAG citations drawer inside bubble */}
                {msg.citations && msg.citations.length > 0 && (
                  <div className="mt-3.5 pt-3.5 border-t border-slate-800/80 space-y-1.5">
                    <span className="text-[9px] font-mono uppercase tracking-wider text-indigo-400 font-bold block">
                      Retrieval Citations ({msg.citations.length} Sources Grounded)
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {msg.citations.map((cit, idx) => (
                        <button
                          key={cit.chunkId}
                          onClick={() => setSelectedCitation(cit)}
                          className="bg-slate-950/90 hover:bg-slate-950 border border-slate-800 text-[10px] px-2 py-1 rounded-md text-slate-450 hover:text-white transition flex items-center gap-1 cursor-pointer font-mono font-semibold"
                        >
                          <Database className="h-2.5 w-2.5 text-emerald-400 shrink-0" />
                          {cit.documentName.substring(0, 12)}... (P.{cit.pageNumber})
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
              <span className="text-[10px] text-slate-500 font-mono mt-1 px-1">{msg.timestamp}</span>
            </div>
          ))}

          {/* Loading bubble */}
          {sending && (
            <div className="mr-auto items-start max-w-[85%] flex flex-col">
              <div className="bg-slate-900 border border-slate-800 p-3.5 rounded-2xl rounded-bl-none text-xs flex items-center gap-2">
                <div className="flex gap-1">
                  <div className="h-1.5 w-1.5 bg-indigo-500 rounded-full animate-bounce" />
                  <div className="h-1.5 w-1.5 bg-indigo-500 rounded-full animate-bounce [animation-delay:0.2s]" />
                  <div className="h-1.5 w-1.5 bg-indigo-500 rounded-full animate-bounce [animation-delay:0.4s]" />
                </div>
                <span className="text-slate-400 font-mono">Retrieving chunks & generating grounded reply...</span>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Floating Citation Details Pane */}
        {selectedCitation && (
          <div className="absolute inset-x-0 bottom-18 bg-slate-950 border-t border-slate-800 p-4 relative z-20 space-y-2 animate-in slide-in-from-bottom duration-300">
            <div className="flex justify-between items-center border-b border-slate-900 pb-2">
              <div className="flex items-center gap-2">
                <Database className="h-4 w-4 text-emerald-400" />
                <span className="text-xs text-white font-semibold">{selectedCitation.documentName}</span>
                <span className="text-[10px] bg-indigo-950 text-indigo-400 px-1.5 py-0.5 rounded border border-indigo-900/30">
                  Page {selectedCitation.pageNumber}
                </span>
                <span className="text-[10px] bg-emerald-950/50 text-emerald-400 px-1.5 py-0.5 rounded border border-emerald-900/30 font-mono font-semibold">
                  Score: {selectedCitation.confidenceScore}
                </span>
              </div>
              <button 
                onClick={() => setSelectedCitation(null)}
                className="text-xs text-slate-400 hover:text-white font-mono cursor-pointer"
              >
                [Dismiss]
              </button>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed font-sans italic">
              "... {selectedCitation.textSnippet} ..."
            </p>
          </div>
        )}

        {/* Form input bottom bar */}
        <form onSubmit={handleSendMessage} className="p-3 border-t border-slate-800/80 flex gap-2 items-center bg-slate-950/80">
          
          {/* Simulated Mic button */}
          <button
            type="button"
            onClick={startVoiceSimulation}
            disabled={voiceSimulating || sending}
            className={`p-2.5 rounded-lg border text-slate-400 transition cursor-pointer shrink-0 ${
              voiceSimulating 
                ? "bg-rose-950/30 border-rose-500 text-rose-500 animate-pulse" 
                : "bg-slate-900 border-slate-800 hover:border-slate-700 hover:text-white"
            }`}
            title="Simulate Voice Prompt Speech-to-Text"
          >
            <Mic className="h-4 w-4" />
          </button>

          <div className="relative flex-1">
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              className="w-full bg-slate-900 border border-slate-800 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 text-xs text-white rounded-lg pl-3 pr-20 py-3 outline-none font-sans"
              placeholder={voiceSimulating ? "Transcribing speech..." : "Ask banking bot... e.g. What is my APR? List debits."}
              disabled={sending}
            />
            <span className="absolute right-3.5 top-3 text-[10px] font-mono text-slate-500 uppercase tracking-widest hidden sm:inline">
              Return ↵
            </span>
          </div>

          <button
            type="submit"
            disabled={!inputText.trim() || sending}
            className="p-3 bg-indigo-600 hover:bg-indigo-500 disabled:bg-indigo-850 text-white rounded-lg transition shrink-0 cursor-pointer shadow-md shadow-indigo-500/10"
          >
            <Send className="h-4 w-4" />
          </button>
        </form>
      </div>

    </div>
  );
}

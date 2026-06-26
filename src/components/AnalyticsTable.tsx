import React, { useState, useMemo } from "react";
import { BankingDocument, Transaction } from "../types";
import { Search, Filter, Download, ArrowUpRight, ArrowDownRight, RefreshCw, FileText, CheckCircle2 } from "lucide-react";

interface AnalyticsTableProps {
  documents: BankingDocument[];
}

export default function AnalyticsTable({ documents }: AnalyticsTableProps) {
  const [selectedDocId, setSelectedDocId] = useState<string>("all");
  const [filterType, setFilterType] = useState<"all" | "debit" | "credit">("all");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [merchantQuery, setMerchantQuery] = useState("");
  const [minAmount, setMinAmount] = useState<string>("");
  const [maxAmount, setMaxAmount] = useState<string>("");

  // Gather all transactions across filtered files
  const allTransactions = useMemo(() => {
    let txs: Transaction[] = [];
    documents.forEach((doc) => {
      if (selectedDocId === "all" || doc.id === selectedDocId) {
        doc.transactions.forEach((tx) => {
          txs.push({
            ...tx,
            docName: doc.name,
          });
        });
      }
    });

    // Sort by Date descending
    return txs.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [documents, selectedDocId]);

  // Unique lists for category filters
  const categories = useMemo(() => {
    const list = new Set<string>();
    documents.forEach((doc) => {
      doc.transactions.forEach((tx) => {
        list.add(tx.category);
      });
    });
    return Array.from(list);
  }, [documents]);

  // Filter Transactions
  const filteredTransactions = useMemo(() => {
    return allTransactions.filter((tx) => {
      // 1. Type
      if (filterType !== "all" && tx.type !== filterType) return false;

      // 2. Category
      if (selectedCategory !== "all" && tx.category !== selectedCategory) return false;

      // 3. Merchant
      if (merchantQuery.trim() && !tx.merchant.toLowerCase().includes(merchantQuery.toLowerCase()) && !tx.description.toLowerCase().includes(merchantQuery.toLowerCase())) {
        return false;
      }

      // 4. Min Amount
      if (minAmount && tx.amount < parseFloat(minAmount)) return false;

      // 5. Max Amount
      if (maxAmount && tx.amount > parseFloat(maxAmount)) return false;

      return true;
    });
  }, [allTransactions, filterType, selectedCategory, merchantQuery, minAmount, maxAmount]);

  // Export CSV
  const handleExportCSV = () => {
    if (filteredTransactions.length === 0) return;
    
    const headers = ["Date", "Document", "Description", "Category", "Amount", "Type", "Merchant"];
    const rows = filteredTransactions.map((tx) => [
      tx.date,
      tx.docName,
      `"${tx.description.replace(/"/g, '""')}"`,
      tx.category,
      tx.amount,
      tx.type,
      tx.merchant,
    ]);

    const csvContent = "data:text/csv;charset=utf-8," 
      + [headers.join(","), ...rows.map((e) => e.join(","))].join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `Apex_Transactions_Audit_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Export JSON
  const handleExportJSON = () => {
    if (filteredTransactions.length === 0) return;

    const jsonStr = JSON.stringify(filteredTransactions, null, 2);
    const blob = new Blob([jsonStr], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `Apex_Transactions_Audit_${Date.now()}.json`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  // Export Custom printable Audit PDF Report simulation
  const handleExportPDF = () => {
    window.print();
  };

  const resetFilters = () => {
    setSelectedDocId("all");
    setFilterType("all");
    setSelectedCategory("all");
    setMerchantQuery("");
    setMinAmount("");
    setMaxAmount("");
  };

  return (
    <div className="space-y-6 text-slate-200" id="transactions_panel">
      
      {/* Header Panel */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-slate-800 pb-5">
        <div>
          <h1 className="text-2xl font-semibold text-white tracking-tight">Extracted Transaction Ledger</h1>
          <p className="text-xs text-slate-400 mt-1">Audit, search, filter, and export cash ledger entries extracted from your files.</p>
        </div>
        
        {/* Export triggers */}
        <div className="flex items-center gap-2">
          <button 
            onClick={handleExportCSV}
            disabled={filteredTransactions.length === 0}
            className="bg-slate-900 border border-slate-800 text-xs px-3 py-2 rounded-lg text-slate-300 hover:text-white hover:border-slate-700 transition flex items-center gap-1.5 cursor-pointer disabled:opacity-40"
          >
            <Download className="h-3.5 w-3.5" />
            CSV
          </button>
          <button 
            onClick={handleExportJSON}
            disabled={filteredTransactions.length === 0}
            className="bg-slate-900 border border-slate-800 text-xs px-3 py-2 rounded-lg text-slate-300 hover:text-white hover:border-slate-700 transition flex items-center gap-1.5 cursor-pointer disabled:opacity-40"
          >
            <Download className="h-3.5 w-3.5" />
            JSON
          </button>
          <button 
            onClick={handleExportPDF}
            disabled={filteredTransactions.length === 0}
            className="bg-indigo-600 hover:bg-indigo-500 text-xs px-4 py-2 rounded-lg text-white font-semibold transition flex items-center gap-1.5 cursor-pointer disabled:opacity-40 shadow-md shadow-indigo-500/10 hover:shadow-indigo-500/20"
          >
            <FileText className="h-3.5 w-3.5" />
            Print PDF Report
          </button>
        </div>
      </div>

      {/* Filters Form Container */}
      <div className="bg-slate-950/70 border border-slate-800 rounded-xl p-5" id="ledger_filters">
        <div className="flex justify-between items-center mb-4 pb-2 border-b border-slate-850">
          <span className="text-xs font-semibold text-white flex items-center gap-1.5 font-mono uppercase tracking-wider">
            <Filter className="h-3.5 w-3.5 text-indigo-400" />
            Filter parameters
          </span>
          <button 
            onClick={resetFilters}
            className="text-[11px] font-mono text-slate-400 hover:text-white transition flex items-center gap-1 cursor-pointer"
          >
            <RefreshCw className="h-3 w-3" />
            Reset Filters
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 text-xs font-sans">
          
          {/* Doc source */}
          <div className="space-y-1.5">
            <label className="text-slate-400 font-medium">Document Origin</label>
            <select
              value={selectedDocId}
              onChange={(e) => setSelectedDocId(e.target.value)}
              className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2.5 outline-none focus:border-indigo-500 text-white cursor-pointer"
            >
              <option value="all">All Documents</option>
              {documents.map((d) => (
                <option key={d.id} value={d.id}>{d.name}</option>
              ))}
            </select>
          </div>

          {/* Type credit/debit */}
          <div className="space-y-1.5">
            <label className="text-slate-400 font-medium">Transaction Flow</label>
            <select
              value={filterType}
              onChange={(e: any) => setFilterType(e.target.value)}
              className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2.5 outline-none focus:border-indigo-500 text-white cursor-pointer"
            >
              <option value="all">All Flows</option>
              <option value="credit">Credits (Inflows)</option>
              <option value="debit">Debits (Outflows)</option>
            </select>
          </div>

          {/* Category */}
          <div className="space-y-1.5">
            <label className="text-slate-400 font-medium">Category</label>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2.5 outline-none focus:border-indigo-500 text-white cursor-pointer"
            >
              <option value="all">All Categories</option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          {/* Merchant search */}
          <div className="space-y-1.5">
            <label className="text-slate-400 font-medium">Merchant / Desc</label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-500">
                <Search className="h-3.5 w-3.5" />
              </span>
              <input
                type="text"
                value={merchantQuery}
                onChange={(e) => setMerchantQuery(e.target.value)}
                className="w-full bg-slate-900 border border-slate-800 rounded-lg pl-8 pr-3 py-2 outline-none focus:border-indigo-500 text-white"
                placeholder="Search vendor"
              />
            </div>
          </div>

          {/* Min price */}
          <div className="space-y-1.5">
            <label className="text-slate-400 font-medium">Min Amount ($)</label>
            <input
              type="number"
              value={minAmount}
              onChange={(e) => setMinAmount(e.target.value)}
              className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2 outline-none focus:border-indigo-500 text-white font-mono"
              placeholder="0.00"
            />
          </div>

          {/* Max price */}
          <div className="space-y-1.5">
            <label className="text-slate-400 font-medium">Max Amount ($)</label>
            <input
              type="number"
              value={maxAmount}
              onChange={(e) => setMaxAmount(e.target.value)}
              className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2 outline-none focus:border-indigo-500 text-white font-mono"
              placeholder="10,000"
            />
          </div>

        </div>
      </div>

      {/* Transactions Data Table */}
      <div className="bg-slate-950/40 border border-slate-800 rounded-xl overflow-hidden shadow-md">
        <div className="p-4 border-b border-slate-800 bg-slate-950/20 flex justify-between items-center">
          <span className="text-xs font-semibold text-white">Extracted Ledger Transactions ({filteredTransactions.length} records matched)</span>
          <span className="text-[11px] font-mono text-slate-400">Chronological list</span>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse font-sans">
            <thead className="bg-slate-900/80 border-b border-slate-800 text-slate-400 uppercase tracking-wider font-mono text-[10px]">
              <tr>
                <th className="p-4 font-semibold">Date</th>
                <th className="p-4 font-semibold">Doc Origin</th>
                <th className="p-4 font-semibold">Description</th>
                <th className="p-4 font-semibold">Category</th>
                <th className="p-4 font-semibold">Merchant</th>
                <th className="p-4 font-semibold text-right">Amount</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-sans">
              {filteredTransactions.length > 0 ? (
                filteredTransactions.map((tx) => (
                  <tr key={tx.id} className="hover:bg-slate-900/40 transition">
                    <td className="p-4 font-mono font-medium text-slate-300 whitespace-nowrap">{tx.date}</td>
                    <td className="p-4 text-slate-400 whitespace-nowrap truncate max-w-[140px]">{tx.docName}</td>
                    <td className="p-4 font-medium text-white max-w-xs truncate">{tx.description}</td>
                    <td className="p-4">
                      <span className="inline-block bg-slate-950 border border-slate-800 text-[10px] text-slate-400 font-mono px-2 py-0.5 rounded-full uppercase">
                        {tx.category}
                      </span>
                    </td>
                    <td className="p-4 text-slate-300 font-medium whitespace-nowrap">{tx.merchant || "N/A"}</td>
                    <td className="p-4 text-right">
                      <span className={`font-mono font-bold text-sm ${
                        tx.type === "credit" ? "text-emerald-400" : "text-rose-400"
                      }`}>
                        {tx.type === "credit" ? "+" : "-"}${tx.amount.toLocaleString("en-US", { minimumFractionDigits: 2 })}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-slate-500 font-medium">
                    No transactions matching the active search/filters. Adjust parameters above.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}

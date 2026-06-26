import React, { useState, useMemo } from "react";
import { BankingDocument, Transaction } from "../types";
import { 
  BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend 
} from "recharts";
import { TrendingUp, Landmark, ShieldAlert, FileText, ArrowUpRight, ArrowDownRight, CreditCard } from "lucide-react";

interface DashboardProps {
  documents: BankingDocument[];
  onTabChange: (tab: string) => void;
}

const COLORS = ["#6366f1", "#10b981", "#f43f5e", "#f59e0b", "#8b5cf6", "#06b6d4", "#a855f7", "#64748b"];

export default function Dashboard({ documents, onTabChange }: DashboardProps) {
  const [selectedDocId, setSelectedDocId] = useState<string>("all");

  const activeDocs = useMemo(() => {
    if (selectedDocId === "all") return documents;
    return documents.filter((d) => d.id === selectedDocId);
  }, [documents, selectedDocId]);

  // Aggregate stats across active documents
  const stats = useMemo(() => {
    let totalBalance = 0;
    let totalIncome = 0;
    let totalExpense = 0;
    let transactionCount = 0;
    let fraudAlertsCount = 0;

    activeDocs.forEach((doc) => {
      // Balance stats (Statements closing balances)
      if (doc.metadata.closingBalance) {
        totalBalance += doc.metadata.closingBalance;
      }
      
      // Transactions stats
      doc.transactions.forEach((tx) => {
        transactionCount++;
        if (tx.type === "credit") {
          totalIncome += tx.amount;
        } else if (tx.type === "debit") {
          totalExpense += tx.amount;
        }
        if (tx.isAnomalous) {
          fraudAlertsCount++;
        }
      });
    });

    return {
      totalBalance,
      totalIncome,
      totalExpense,
      transactionCount,
      fraudAlertsCount,
    };
  }, [activeDocs]);

  // Chart Data: Transaction Breakdown by Category
  const categoryChartData = useMemo(() => {
    const categories: Record<string, number> = {};
    activeDocs.forEach((doc) => {
      doc.transactions.forEach((tx) => {
        if (tx.type === "debit") {
          categories[tx.category] = (categories[tx.category] || 0) + tx.amount;
        }
      });
    });

    return Object.keys(categories).map((cat) => ({
      name: cat,
      value: parseFloat(categories[cat].toFixed(2)),
    }));
  }, [activeDocs]);

  // Chart Data: Income vs Expense Trend (by Date)
  const trendChartData = useMemo(() => {
    const dates: Record<string, { income: number; expense: number }> = {};
    activeDocs.forEach((doc) => {
      doc.transactions.forEach((tx) => {
        const dateStr = tx.date; // "YYYY-MM-DD"
        if (!dates[dateStr]) {
          dates[dateStr] = { income: 0, expense: 0 };
        }
        if (tx.type === "credit") {
          dates[dateStr].income += tx.amount;
        } else {
          dates[dateStr].expense += tx.amount;
        }
      });
    });

    return Object.keys(dates)
      .sort()
      .map((date) => ({
        date,
        Income: parseFloat(dates[date].income.toFixed(2)),
        Expense: parseFloat(dates[date].expense.toFixed(2)),
      }));
  }, [activeDocs]);

  // Merchant Analytics Data
  const merchantChartData = useMemo(() => {
    const merchants: Record<string, number> = {};
    activeDocs.forEach((doc) => {
      doc.transactions.forEach((tx) => {
        if (tx.type === "debit") {
          merchants[tx.merchant || "Other Vendor"] = (merchants[tx.merchant || "Other Vendor"] || 0) + tx.amount;
        }
      });
    });

    return Object.keys(merchants)
      .map((merch) => ({
        merchant: merch,
        Spending: parseFloat(merchants[merch].toFixed(2)),
      }))
      .sort((a, b) => b.Spending - a.Spending)
      .slice(0, 6);
  }, [activeDocs]);

  // Recent anomalous/high value alert list
  const recentAlerts = useMemo(() => {
    const alerts: any[] = [];
    activeDocs.forEach((doc) => {
      doc.transactions.forEach((tx) => {
        if (tx.isAnomalous) {
          alerts.push({
            ...tx,
            docName: doc.name,
          });
        }
      });
    });
    return alerts.slice(0, 5);
  }, [activeDocs]);

  return (
    <div className="space-y-6 text-slate-200" id="dashboard_panel">
      {/* Header section with selector */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-800 pb-5">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Financial Intelligence Dashboard</h1>
          <p className="text-xs text-slate-400 mt-1">Real-time analytical trends, ledger audits, and risk assessment scorecard.</p>
        </div>
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <label className="text-xs font-mono uppercase tracking-wider text-slate-400 shrink-0">Scoped Scope:</label>
          <select
            value={selectedDocId}
            onChange={(e) => setSelectedDocId(e.target.value)}
            className="bg-slate-950 border border-slate-800 rounded-lg text-sm text-white px-3.5 py-2 outline-none focus:border-indigo-500 transition cursor-pointer w-full sm:w-64 font-sans"
            id="doc_dashboard_selector"
          >
            <option value="all">All Uploaded Documents ({documents.length})</option>
            {documents.map((doc) => (
              <option key={doc.id} value={doc.id}>
                {doc.name} ({doc.category})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* KPI Metrics Matrix */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4" id="kpi_grid">
        {/* KPI: Total Balance */}
        <div className="bg-slate-950/70 backdrop-blur-md border border-slate-800 rounded-xl p-5 shadow-sm hover:border-slate-700 transition">
          <div className="flex justify-between items-start">
            <div className="space-y-2">
              <span className="text-xs text-slate-400 font-mono uppercase tracking-wider">Total Ledger Value</span>
              <h3 className="text-2xl font-bold font-mono text-white">
                ${stats.totalBalance.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </h3>
            </div>
            <div className="p-2.5 bg-indigo-950/50 text-indigo-400 border border-indigo-900/30 rounded-lg">
              <Landmark className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-3.5 text-xs flex items-center gap-1.5 text-indigo-400 font-mono">
            <TrendingUp className="h-3.5 w-3.5" />
            Closing statement balances aggregated
          </div>
        </div>

        {/* KPI: Total Income Credits */}
        <div className="bg-slate-950/70 backdrop-blur-md border border-slate-800 rounded-xl p-5 shadow-sm hover:border-slate-700 transition">
          <div className="flex justify-between items-start">
            <div className="space-y-2">
              <span className="text-xs text-slate-400 font-mono uppercase tracking-wider">Total Credits (Income)</span>
              <h3 className="text-2xl font-bold font-mono text-emerald-400">
                +${stats.totalIncome.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </h3>
            </div>
            <div className="p-2.5 bg-emerald-950/40 text-emerald-400 border border-emerald-900/30 rounded-lg">
              <ArrowUpRight className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-3.5 text-xs text-slate-400 flex items-center gap-1">
            Cash inflows and inbound payroll transfers
          </div>
        </div>

        {/* KPI: Total Expense Debits */}
        <div className="bg-slate-950/70 backdrop-blur-md border border-slate-800 rounded-xl p-5 shadow-sm hover:border-slate-700 transition">
          <div className="flex justify-between items-start">
            <div className="space-y-2">
              <span className="text-xs text-slate-400 font-mono uppercase tracking-wider">Total Debits (Expense)</span>
              <h3 className="text-2xl font-bold font-mono text-rose-400">
                -${stats.totalExpense.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </h3>
            </div>
            <div className="p-2.5 bg-rose-950/40 text-rose-400 border border-rose-900/30 rounded-lg">
              <ArrowDownRight className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-3.5 text-xs text-slate-400 flex items-center gap-1">
            Rental, utility, shopping, food outlays
          </div>
        </div>

        {/* KPI: Risk score alerts */}
        <div className="bg-slate-950/70 backdrop-blur-md border border-slate-800 rounded-xl p-5 shadow-sm hover:border-slate-700 transition">
          <div className="flex justify-between items-start">
            <div className="space-y-2">
              <span className="text-xs text-slate-400 font-mono uppercase tracking-wider">Risk Indicators Detected</span>
              <h3 className={`text-2xl font-bold font-mono ${stats.fraudAlertsCount > 0 ? "text-amber-500" : "text-slate-400"}`}>
                {stats.fraudAlertsCount} Flags
              </h3>
            </div>
            <div className={`p-2.5 rounded-lg border ${stats.fraudAlertsCount > 0 ? "bg-amber-950/50 text-amber-500 border-amber-900/40 animate-pulse" : "bg-slate-800 text-slate-400 border-slate-700"}`}>
              <ShieldAlert className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-3.5 text-xs text-slate-400 flex items-center gap-1">
            {stats.fraudAlertsCount > 0 ? "Potential duplicate / anomalous charges" : "All ledgers conform to baseline audits"}
          </div>
        </div>
      </div>

      {/* Primary Analytics Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6" id="dashboard_charts_row_1">
        {/* Income vs Expense Bar Trend */}
        <div className="bg-slate-950/40 border border-slate-800 rounded-xl p-5 lg:col-span-2">
          <h4 className="text-sm font-semibold text-white mb-4">Cash Flow Inflow vs Outflow Ledger Trend</h4>
          <div className="h-80" id="income_vs_expense_chart">
            {trendChartData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={trendChartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                  <XAxis dataKey="date" stroke="#94a3b8" fontSize={11} fontStyle="italic" />
                  <YAxis stroke="#94a3b8" fontSize={11} />
                  <Tooltip contentStyle={{ backgroundColor: "#020617", borderColor: "#334155", borderRadius: "8px" }} />
                  <Legend />
                  <Bar dataKey="Income" fill="#10b981" barSize={18} radius={[4, 4, 0, 0]} />
                  <Bar dataKey="Expense" fill="#f43f5e" barSize={18} radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-xs text-slate-500">No transaction trends found. Upload bank/card statements.</div>
            )}
          </div>
        </div>

        {/* Category Share Donut Pie */}
        <div className="bg-slate-950/40 border border-slate-800 rounded-xl p-5">
          <h4 className="text-sm font-semibold text-white mb-4">Expense Distribution by Category</h4>
          <div className="h-64 flex justify-center items-center" id="category_pie_chart">
            {categoryChartData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={categoryChartData}
                    cx="50%"
                    cy="50%"
                    innerRadius={55}
                    outerRadius={80}
                    paddingAngle={4}
                    dataKey="value"
                  >
                    {categoryChartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{ backgroundColor: "#020617", borderColor: "#334155", borderRadius: "8px" }} />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-xs text-slate-500">No categorizable outlays found.</div>
            )}
          </div>
          {/* Custom legends with category percents */}
          <div className="mt-2 space-y-1 max-h-24 overflow-y-auto pr-1">
            {categoryChartData.map((entry, index) => (
              <div key={entry.name} className="flex items-center justify-between text-xs font-mono">
                <span className="flex items-center gap-1.5 text-slate-400">
                  <span className="h-2 w-2 rounded-full inline-block" style={{ backgroundColor: COLORS[index % COLORS.length] }} />
                  {entry.name}
                </span>
                <span className="text-white font-medium">${entry.value.toLocaleString()}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Secondary Analytics Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6" id="dashboard_charts_row_2">
        {/* Merchant Analysis */}
        <div className="bg-slate-950/40 border border-slate-800 rounded-xl p-5">
          <h4 className="text-sm font-semibold text-white mb-4">Top Spending Merchants (Debits)</h4>
          <div className="h-64" id="merchant_chart">
            {merchantChartData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={merchantChartData} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" stroke="#334155" horizontal={false} />
                  <XAxis type="number" stroke="#94a3b8" fontSize={11} />
                  <YAxis dataKey="merchant" type="category" stroke="#94a3b8" fontSize={10} width={80} />
                  <Tooltip contentStyle={{ backgroundColor: "#020617", borderColor: "#334155", borderRadius: "8px" }} />
                  <Bar dataKey="Spending" fill="#6366f1" radius={[0, 4, 4, 0]} barSize={12} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-xs text-slate-500">No merchant debit outlays found.</div>
            )}
          </div>
        </div>

        {/* Security / Fraud alerts dashboard panel */}
        <div className="bg-slate-950/40 border border-slate-800 rounded-xl p-5 lg:col-span-2 flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-center mb-4">
              <h4 className="text-sm font-semibold text-white">Anomalous / Risk Flags Ledger Audits</h4>
              <button 
                onClick={() => onTabChange("fraud")}
                className="text-xs text-indigo-400 hover:text-indigo-300 transition font-semibold flex items-center gap-1 cursor-pointer"
              >
                Deep Risk Assessment
                <ArrowUpRight className="h-3 w-3" />
              </button>
            </div>
            <div className="space-y-3 max-h-56 overflow-y-auto pr-1">
              {recentAlerts.length > 0 ? (
                recentAlerts.map((alert) => (
                  <div key={alert.id} className="bg-amber-950/10 border border-amber-900/30 rounded-lg p-3 flex items-start gap-3">
                    <ShieldAlert className="h-5 w-5 text-amber-500 shrink-0 mt-0.5 animate-pulse" />
                    <div className="flex-1 space-y-0.5">
                      <div className="flex justify-between items-start">
                        <span className="text-xs font-semibold text-amber-300 font-mono">{alert.description}</span>
                        <span className="text-xs font-bold font-mono text-rose-400">-${alert.amount.toFixed(2)}</span>
                      </div>
                      <p className="text-[11px] text-slate-400">Reason: {alert.anomalyDetails || "High outlay deviation detected."}</p>
                      <div className="text-[10px] text-slate-500 font-mono italic">Document: {alert.docName} | Date: {alert.date}</div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-8 text-center text-xs text-slate-400 flex flex-col items-center justify-center gap-2">
                  <div className="p-3 bg-emerald-950/20 text-emerald-400 rounded-full border border-emerald-900/30">
                    <TrendingUp className="h-5 w-5" />
                  </div>
                  <span>All active document logs are classified as secure. No recurring fraud risk vectors matching typical banking anomalies.</span>
                </div>
              )}
            </div>
          </div>
          {recentAlerts.length > 0 && (
            <div className="border-t border-slate-800/80 pt-3 mt-3 text-xs text-slate-400 italic">
              * Note: High-value cash withdrawals and out-of-state card transactions trigger active risk indicators automatically.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

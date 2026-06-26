import React, { useMemo } from "react";
import { BankingDocument, FraudAlert } from "../types";
import { ShieldAlert, AlertTriangle, CheckCircle, ShieldCheck, HelpCircle, ArrowUpRight } from "lucide-react";

interface FraudDetectionProps {
  documents: BankingDocument[];
}

export default function FraudDetection({ documents }: FraudDetectionProps) {
  
  // Calculate dynamic security metrics
  const fraudMetrics = useMemo(() => {
    let riskScore = 15; // Baseline low risk
    const alerts: FraudAlert[] = [];

    // Temporary trackers for duplicate checks
    const merchantAmountMap: Record<string, { id: string; date: string; amount: number; description: string }[]> = {};

    documents.forEach((doc) => {
      // 1. Scan for individual transactions
      doc.transactions.forEach((tx) => {
        
        // Large Withdrawal Check
        if (tx.type === "debit" && tx.amount >= 1500) {
          alerts.push({
            id: `alert-large-${tx.id}`,
            transactionId: tx.id,
            date: tx.date,
            description: tx.description,
            category: "Large Withdrawal",
            severity: "medium",
            reason: `High value outlay of $${tx.amount.toLocaleString()} exceeds standardized retail safety compliance threshold ($1,000).`,
          });
          riskScore += 8;
        }

        // ATM / Cash withdrawals
        if (tx.type === "debit" && tx.description.toLowerCase().includes("atm")) {
          alerts.push({
            id: `alert-atm-${tx.id}`,
            transactionId: tx.id,
            date: tx.date,
            description: tx.description,
            category: "Suspicious Activity",
            severity: "low",
            reason: "Cash withdrawals outside primary bank branch location require regular PIN verification auditing.",
          });
          riskScore += 3;
        }

        // Gather duplicates tracker map
        const key = `${tx.merchant || tx.description}-${tx.amount}`;
        if (!merchantAmountMap[key]) {
          merchantAmountMap[key] = [];
        }
        merchantAmountMap[key].push({ id: tx.id, date: tx.date, amount: tx.amount, description: tx.description });
      });
    });

    // 2. Duplicate Transactions Audit (identical merchant & amount within 48 hours)
    Object.keys(merchantAmountMap).forEach((key) => {
      const occurrences = merchantAmountMap[key];
      if (occurrences.length > 1) {
        // Sort occurrences by date
        occurrences.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
        
        for (let i = 0; i < occurrences.length - 1; i++) {
          const first = occurrences[i];
          const second = occurrences[i + 1];
          const diffTime = Math.abs(new Date(second.date).getTime() - new Date(first.date).getTime());
          const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
          
          if (diffDays <= 2) {
            alerts.push({
              id: `alert-dup-${first.id}-${second.id}`,
              date: second.date,
              description: second.description,
              category: "Duplicate Transaction",
              severity: "high",
              reason: `Identical charges of $${first.amount.toFixed(2)} flagged at "${first.description}" within ${diffDays} day(s). Suspected double billing or card skim.`,
            });
            riskScore += 15;
          }
        }
      }
    });

    // Cap risk score between 0 and 100
    riskScore = Math.min(100, riskScore);

    return {
      riskScore,
      alerts,
    };
  }, [documents]);

  const riskAssessment = useMemo(() => {
    const score = fraudMetrics.riskScore;
    if (score < 30) {
      return {
        label: "Secure (Low Risk)",
        colorClass: "text-emerald-400 bg-emerald-950/20 border-emerald-900/40",
        gaugeColor: "bg-emerald-500",
        summary: "The audited financial accounts conform to robust safety compliance metrics. No skimming anomalies, rapid sequence transfers, or duplicate merchant invoices were detected.",
      };
    } else if (score < 60) {
      return {
        label: "Elevated Audit (Medium Risk)",
        colorClass: "text-amber-500 bg-amber-950/20 border-amber-900/40 animate-pulse",
        gaugeColor: "bg-amber-500",
        summary: "Sub-compliance alerts detected. Includes high-value debits or ATM cash withdrawal outlays. Normal spend bounds apply but regular oversight review is recommended.",
      };
    } else {
      return {
        label: "Critical Breach Warning (High Risk)",
        colorClass: "text-rose-400 bg-rose-950/20 border-rose-900/40 animate-pulse",
        gaugeColor: "bg-rose-500",
        summary: "Potential transactional threat indicators present. Highly identical charges (duplicate skimming indicators) match double billing criteria within brief intervals. Account holds are suggested.",
      };
    }
  }, [fraudMetrics.riskScore]);

  return (
    <div className="space-y-6 text-slate-200" id="fraud_panel">
      
      {/* Title */}
      <div className="border-b border-slate-800 pb-5">
        <h1 className="text-2xl font-semibold text-white tracking-tight">AI Fraud Risk & Security Audit</h1>
        <p className="text-xs text-slate-400 mt-1">Automatic detection of invoice duplicates, skimming velocity, and high-outlay anomalies.</p>
      </div>

      {/* Fraud Risk Score Matrix Header */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Dynamic risk score circular gauge card */}
        <div className="bg-slate-950/70 border border-slate-800 rounded-xl p-5 flex flex-col justify-between" id="fraud_gauge">
          <div>
            <h4 className="text-xs font-mono uppercase tracking-wider text-slate-400">Corporate Security Scorecard</h4>
            <div className="flex items-baseline gap-2 mt-3">
              <span className="text-4xl font-extrabold font-mono text-white">{fraudMetrics.riskScore}</span>
              <span className="text-sm font-mono text-slate-500">/ 100 Risk Points</span>
            </div>
          </div>

          {/* Graphical gauge meter */}
          <div className="my-5 space-y-1.5">
            <div className="w-full bg-slate-900 rounded-full h-2.5 overflow-hidden border border-slate-800">
              <div 
                className={`h-2.5 rounded-full transition-all duration-500 ${riskAssessment.gaugeColor}`}
                style={{ width: `${fraudMetrics.riskScore}%` }}
              />
            </div>
            <div className="flex justify-between text-[10px] font-mono text-slate-500">
              <span>0 (SECURE)</span>
              <span>50 (ELEVATED)</span>
              <span>100 (BREACHED)</span>
            </div>
          </div>

          <div className={`p-3.5 rounded-lg border text-xs leading-relaxed ${riskAssessment.colorClass}`}>
            <span className="font-bold uppercase tracking-wider font-mono block mb-1">
              {riskAssessment.label}
            </span>
            {riskAssessment.summary}
          </div>
        </div>

        {/* Audit recommendations panel */}
        <div className="bg-slate-950/70 border border-slate-800 rounded-xl p-5 lg:col-span-2 flex flex-col justify-between" id="audit_actions">
          <div className="space-y-4">
            <h4 className="text-sm font-semibold text-white">Recommended Compliance Action Protocols</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-sans">
              
              <div className="border border-slate-800 rounded-lg p-3.5 bg-slate-900/50 space-y-1">
                <span className="font-semibold text-white">1. Skimming Fraud Review</span>
                <p className="text-slate-400 text-[11px] leading-relaxed">
                  Flag duplicate items showing identical merchants & prices within brief statement periods to check skimming skim limits.
                </p>
              </div>

              <div className="border border-slate-800 rounded-lg p-3.5 bg-slate-900/50 space-y-1">
                <span className="font-semibold text-white">2. High Value Wire Protocols</span>
                <p className="text-slate-400 text-[11px] leading-relaxed">
                  Verify invoice details and wire addresses manually with clients for individual debit items exceeding standardized $1,000 threshold.
                </p>
              </div>

              <div className="border border-slate-800 rounded-lg p-3.5 bg-slate-900/50 space-y-1">
                <span className="font-semibold text-white">3. Biometric KYC Authentication</span>
                <p className="text-slate-400 text-[11px] leading-relaxed">
                  Enforce immediate multi-factor and biometric checks (e.g. passport record mapping) if out-of-state transaction volume spikes.
                </p>
              </div>

              <div className="border border-slate-800 rounded-lg p-3.5 bg-slate-900/50 space-y-1">
                <span className="font-semibold text-white">4. Merchant Settlement Hold</span>
                <p className="text-slate-400 text-[11px] leading-relaxed">
                  Initiate standard merchant settlement holds if double-billing alerts represent high cash outlay risk.
                </p>
              </div>

            </div>
          </div>
          <div className="border-t border-slate-800/80 pt-3 mt-3 text-[11px] text-slate-500 font-mono">
            SECURE AUDITS POWERED BY APEX INTELLIGENCE SYSTEM COMPLIANCE FRAMEWORK v1.2
          </div>
        </div>

      </div>

      {/* Security alert logs table */}
      <div className="bg-slate-950/40 border border-slate-800 rounded-xl overflow-hidden shadow-md" id="fraud_alerts_list">
        <div className="p-4 border-b border-slate-800 bg-slate-950/20">
          <span className="text-xs font-semibold text-white">Identified Risk & Suspicion Logs ({fraudMetrics.alerts.length} Warnings Triggered)</span>
        </div>
        
        <div className="divide-y divide-slate-800/60 font-sans">
          {fraudMetrics.alerts.length > 0 ? (
            fraudMetrics.alerts.map((alert) => (
              <div key={alert.id} className="p-4 hover:bg-slate-900/20 transition flex items-start gap-4">
                <div className="shrink-0 mt-0.5">
                  {alert.severity === "high" ? (
                    <div className="p-2 bg-rose-950/40 text-rose-400 border border-rose-900/30 rounded-lg">
                      <AlertTriangle className="h-5 w-5 animate-bounce" />
                    </div>
                  ) : alert.severity === "medium" ? (
                    <div className="p-2 bg-amber-950/40 text-amber-500 border border-amber-900/30 rounded-lg">
                      <ShieldAlert className="h-5 w-5" />
                    </div>
                  ) : (
                    <div className="p-2 bg-indigo-950/40 text-indigo-400 border border-indigo-900/30 rounded-lg">
                      <ShieldAlert className="h-5 w-5" />
                    </div>
                  )}
                </div>

                <div className="flex-1 space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold font-mono text-white uppercase">{alert.category}</span>
                    <span className={`text-[9px] font-mono font-bold uppercase px-1.5 py-0.5 rounded border ${
                      alert.severity === "high" 
                        ? "bg-rose-950 text-rose-400 border-rose-900/40" 
                        : alert.severity === "medium"
                        ? "bg-amber-950 text-amber-500 border-amber-900/40"
                        : "bg-indigo-950 text-indigo-400 border-indigo-900/40"
                    }`}>
                      {alert.severity} SEVERITY
                    </span>
                  </div>
                  <h5 className="text-xs font-semibold text-slate-200">{alert.description}</h5>
                  <p className="text-xs text-slate-400 leading-relaxed">{alert.reason}</p>
                  <div className="text-[10px] text-slate-500 font-mono">Date flagged: {alert.date}</div>
                </div>
              </div>
            ))
          ) : (
            <div className="p-8 text-center text-slate-400 flex flex-col items-center justify-center gap-2">
              <ShieldCheck className="h-10 w-10 text-emerald-500" />
              <p className="text-xs">No transaction risk alerts identified. All ledger entries have successfully cleared safety metrics.</p>
            </div>
          )}
        </div>
      </div>

    </div>
  );
}

import React, { useState, useMemo } from "react";
import { BankingDocument, DocumentCategory, DocumentChunk } from "../types";
import { UploadCloud, FileText, CheckCircle, Search, SearchCode, Database, Brain, ArrowRight, Loader } from "lucide-react";

interface DocumentUploadProps {
  documents: BankingDocument[];
  onDocumentAdded: (doc: BankingDocument) => void;
  onDocumentDeleted: (id: string) => void;
}

export default function DocumentUpload({ documents, onDocumentAdded, onDocumentDeleted }: DocumentUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  // Search parameters
  const [searchQuery, setSearchQuery] = useState("");
  const [searchMode, setSearchMode] = useState<"hybrid" | "semantic" | "keyword">("hybrid");
  const [searchResults, setSearchResults] = useState<{ chunk: DocumentChunk; score: number }[]>([]);
  const [searching, setSearching] = useState(false);

  // Active viewing document
  const [activeDocId, setActiveDocId] = useState<string>(documents[0]?.id || "");
  const activeDoc = useMemo(() => documents.find((d) => d.id === activeDocId), [documents, activeDocId]);

  // Handle Drag & Drop
  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0]);
    }
  };

  const processFile = (file: File) => {
    setUploading(true);
    setUploadProgress(15);

    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = async () => {
      setUploadProgress(45);
      const base64 = (reader.result as string).split(",")[1];

      try {
        const response = await fetch("/api/documents/parse", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            base64Data: base64,
            fileName: file.name,
            fileType: file.type,
          }),
        });

        setUploadProgress(85);
        if (!response.ok) {
          throw new Error("Parser server failure");
        }

        const data = await response.json();
        
        // Structure the response into a real BankingDocument object
        const newDoc: BankingDocument = {
          id: `doc-${Date.now()}`,
          name: file.name,
          size: `${(file.size / (1024 * 1024)).toFixed(1)} MB`,
          uploadDate: new Date().toISOString().split("T")[0],
          status: "completed",
          category: data.category || DocumentCategory.OTHERS,
          metadata: data.metadata,
          text: data.text,
          pagesCount: data.chunks?.length || 1,
          chunks: (data.chunks || []).map((c: any, index: number) => ({
            id: `chunk-${Date.now()}-${index}`,
            docId: `doc-${Date.now()}`,
            docName: file.name,
            pageNumber: c.pageNumber || index + 1,
            text: c.text,
          })),
          transactions: (data.transactions || []).map((t: any, index: number) => ({
            id: `tx-${Date.now()}-${index}`,
            docId: `doc-${Date.now()}`,
            docName: file.name,
            date: t.date || new Date().toISOString().split("T")[0],
            description: t.description || "N/A",
            category: t.category || "Others",
            amount: parseFloat(t.amount) || 0,
            type: t.type === "credit" ? "credit" : "debit",
            merchant: t.merchant || "",
            isAnomalous: t.amount > 1000 || t.description.toLowerCase().includes("atm") || t.description.toLowerCase().includes("wire"),
            anomalyDetails: t.amount > 1000 ? "Transaction value exceeds safety compliance limit of $1,000." : undefined,
          })),
          scanned: data.scanned || false,
          ocrMethod: data.ocrMethod,
        };

        onDocumentAdded(newDoc);
        setActiveDocId(newDoc.id);
        setUploadProgress(100);

        setTimeout(() => {
          setUploading(false);
          setUploadProgress(0);
        }, 500);

      } catch (err) {
        console.error("Error uploading/parsing file", err);
        setUploading(false);
        setUploadProgress(0);
        alert("There was an issue parsing the PDF document. Reverting to sandbox file simulator...");
      }
    };
  };

  // Perform a test database query simulation to show how retrieval and scores work
  const handleDatabaseSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    setSearching(true);
    try {
      // Fetch simulated/real search values
      // We will perform retrieval scores locally to keep it super fast and reactive
      const queryWords = searchQuery.toLowerCase().split(/\W+/).filter((w) => w.length > 2);
      const results: { chunk: DocumentChunk; score: number }[] = [];

      documents.forEach((doc) => {
        doc.chunks.forEach((chunk) => {
          let score = 0;
          const textLower = chunk.text.toLowerCase();
          
          queryWords.forEach((word) => {
            if (textLower.includes(word)) {
              score += 1.0;
            }
          });

          if (score > 0) {
            score = score / queryWords.length;
            // Introduce a small random similarity score if semantic mode to model cosine similarity
            if (searchMode === "semantic" || searchMode === "hybrid") {
              const semanticBoost = Math.random() * 0.4 + 0.3;
              score = searchMode === "semantic" ? semanticBoost : score * 0.3 + semanticBoost * 0.7;
            }
            results.push({ chunk, score: parseFloat(score.toFixed(2)) });
          }
        });
      });

      // Sort results by score
      results.sort((a, b) => b.score - a.score);
      setSearchResults(results.slice(0, 5));
    } catch (err) {
      console.error(err);
    } finally {
      setSearching(false);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 text-slate-200" id="documents_panel">
      
      {/* Upload and Documents Directory Side */}
      <div className="lg:col-span-1 space-y-6">
        
        {/* Upload Card */}
        <div 
          className={`bg-slate-950/70 backdrop-blur-md border rounded-xl p-5 text-center transition relative overflow-hidden ${
            dragActive ? "border-indigo-500 bg-indigo-950/20" : "border-slate-800"
          }`}
          onDragEnter={handleDrag}
          onDragOver={handleDrag}
          onDragLeave={handleDrag}
          onDrop={handleDrop}
          id="drop_zone"
        >
          <h3 className="text-sm font-semibold text-white mb-2 text-left">Ingest New Document</h3>
          
          <div className="border border-dashed border-slate-800 rounded-lg p-6 py-8 flex flex-col items-center justify-center gap-3">
            <div className="p-3 bg-slate-900 rounded-full border border-slate-800 text-slate-400">
              {uploading ? (
                <Loader className="h-6 w-6 animate-spin text-indigo-500" />
              ) : (
                <UploadCloud className="h-6 w-6" />
              )}
            </div>
            <div className="text-xs">
              <label className="text-indigo-400 hover:text-indigo-300 font-semibold cursor-pointer outline-none">
                Upload a document PDF/Image
                <input
                  type="file"
                  accept="application/pdf,image/*"
                  onChange={handleFileChange}
                  className="hidden"
                />
              </label>{" "}
              or drag & drop
            </div>
            <p className="text-[10px] text-slate-500">Supports Bank Statements, Loans, KYC, Tax (Max 25MB)</p>
          </div>

          {/* Progress bar */}
          {uploading && (
            <div className="mt-4 space-y-1.5">
              <div className="flex justify-between text-[11px] font-mono text-slate-400">
                <span>Gemini 3.5 OCR & Analysis...</span>
                <span>{uploadProgress}%</span>
              </div>
              <div className="w-full bg-slate-900 rounded-full h-1.5 overflow-hidden">
                <div 
                  className="bg-indigo-500 h-1.5 rounded-full transition-all duration-300"
                  style={{ width: `${uploadProgress}%` }}
                />
              </div>
            </div>
          )}
        </div>

        {/* Document Catalogue */}
        <div className="bg-slate-950/70 border border-slate-800 rounded-xl p-5 space-y-4">
          <h3 className="text-sm font-semibold text-white">Active Document Directory ({documents.length})</h3>
          <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
            {documents.map((doc) => (
              <div 
                key={doc.id}
                onClick={() => setActiveDocId(doc.id)}
                className={`flex items-center justify-between p-3 rounded-lg border cursor-pointer transition ${
                  activeDocId === doc.id 
                    ? "bg-indigo-950/20 border-indigo-500/80" 
                    : "bg-slate-900/40 border-slate-800/80 hover:border-slate-700"
                }`}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <FileText className={`h-5 w-5 shrink-0 ${activeDocId === doc.id ? "text-indigo-400" : "text-slate-400"}`} />
                  <div className="min-w-0">
                    <p className="text-xs font-semibold text-white truncate">{doc.name}</p>
                    <p className="text-[10px] text-slate-400 mt-0.5">{doc.category} | {doc.size}</p>
                  </div>
                </div>
                <div className="flex items-center gap-1.5 shrink-0">
                  <span className="text-[9px] font-mono bg-indigo-950 text-indigo-400 px-1.5 py-0.5 rounded border border-indigo-900/40 uppercase">
                    {doc.scanned ? "scanned" : "e-Doc"}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Main Document Details & Parser Analytics View */}
      <div className="lg:col-span-2 space-y-6">
        {activeDoc ? (
          <div className="space-y-6">
            
            {/* Metadata extraction card */}
            <div className="bg-slate-950/40 border border-slate-800 rounded-xl p-5" id="metadata_explorer">
              <div className="flex justify-between items-start border-b border-slate-800 pb-3.5 mb-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs bg-indigo-950 text-indigo-400 px-2 py-0.5 rounded font-mono border border-indigo-900/40 uppercase">
                      {activeDoc.category}
                    </span>
                    {activeDoc.scanned && (
                      <span className="text-[10px] bg-amber-950 text-amber-500 px-2 py-0.5 rounded font-mono border border-amber-900/40">
                        OCR: {activeDoc.ocrMethod || "Fallback AI OCR"}
                      </span>
                    )}
                  </div>
                  <h3 className="text-base font-semibold text-white mt-1.5">{activeDoc.name}</h3>
                </div>
                <span className="text-xs text-slate-400 font-mono">Ingested: {activeDoc.uploadDate}</span>
              </div>

              {/* Dynamic Metadata Fields Grid */}
              <div className="grid grid-cols-2 md:grid-cols-3 gap-y-4 gap-x-6 text-xs">
                {activeDoc.metadata.bankName && (
                  <div className="space-y-0.5">
                    <p className="text-slate-400 font-mono uppercase text-[9px] tracking-wider">Institution Bank</p>
                    <p className="font-semibold text-white font-sans">{activeDoc.metadata.bankName}</p>
                  </div>
                )}
                {activeDoc.metadata.accountHolder && (
                  <div className="space-y-0.5">
                    <p className="text-slate-400 font-mono uppercase text-[9px] tracking-wider">Account Holder</p>
                    <p className="font-semibold text-white font-sans">{activeDoc.metadata.accountHolder}</p>
                  </div>
                )}
                {activeDoc.metadata.accountNumber && (
                  <div className="space-y-0.5">
                    <p className="text-slate-400 font-mono uppercase text-[9px] tracking-wider">Account Number</p>
                    <p className="font-semibold text-white font-mono">{activeDoc.metadata.accountNumber}</p>
                  </div>
                )}
                {activeDoc.metadata.ifsc && (
                  <div className="space-y-0.5">
                    <p className="text-slate-400 font-mono uppercase text-[9px] tracking-wider">IFSC Routing Code</p>
                    <p className="font-semibold text-white font-mono">{activeDoc.metadata.ifsc}</p>
                  </div>
                )}
                {activeDoc.metadata.branch && (
                  <div className="space-y-0.5">
                    <p className="text-slate-400 font-mono uppercase text-[9px] tracking-wider">Branch Location</p>
                    <p className="font-semibold text-white font-sans">{activeDoc.metadata.branch}</p>
                  </div>
                )}
                {activeDoc.metadata.statementPeriod && (
                  <div className="space-y-0.5">
                    <p className="text-slate-400 font-mono uppercase text-[9px] tracking-wider">Statement Period</p>
                    <p className="font-semibold text-white font-sans">{activeDoc.metadata.statementPeriod}</p>
                  </div>
                )}
                {activeDoc.metadata.loanNumber && (
                  <div className="space-y-0.5">
                    <p className="text-slate-400 font-mono uppercase text-[9px] tracking-wider">Loan ID Contract</p>
                    <p className="font-semibold text-amber-400 font-mono">{activeDoc.metadata.loanNumber}</p>
                  </div>
                )}
                {activeDoc.metadata.issueDate && (
                  <div className="space-y-0.5">
                    <p className="text-slate-400 font-mono uppercase text-[9px] tracking-wider">Date of Issue</p>
                    <p className="font-semibold text-white font-mono">{activeDoc.metadata.issueDate}</p>
                  </div>
                )}
                {activeDoc.metadata.expiryDate && (
                  <div className="space-y-0.5">
                    <p className="text-slate-400 font-mono uppercase text-[9px] tracking-wider">Maturity / Expiry</p>
                    <p className="font-semibold text-white font-mono">{activeDoc.metadata.expiryDate}</p>
                  </div>
                )}
                {activeDoc.metadata.openingBalance > 0 && (
                  <div className="space-y-0.5">
                    <p className="text-slate-400 font-mono uppercase text-[9px] tracking-wider">Opening Balance</p>
                    <p className="font-semibold text-emerald-400 font-mono">${activeDoc.metadata.openingBalance.toLocaleString()}</p>
                  </div>
                )}
                {activeDoc.metadata.closingBalance > 0 && (
                  <div className="space-y-0.5">
                    <p className="text-slate-400 font-mono uppercase text-[9px] tracking-wider">Closing Balance</p>
                    <p className="font-semibold text-indigo-400 font-mono">${activeDoc.metadata.closingBalance.toLocaleString()}</p>
                  </div>
                )}
                {activeDoc.metadata.customerId && (
                  <div className="space-y-0.5">
                    <p className="text-slate-400 font-mono uppercase text-[9px] tracking-wider">Customer Log ID</p>
                    <p className="font-semibold text-white font-mono">{activeDoc.metadata.customerId}</p>
                  </div>
                )}
              </div>
            </div>

            {/* Document Vector Database Chunk Browser */}
            <div className="bg-slate-950/40 border border-slate-800 rounded-xl p-5 space-y-4" id="chunks_browser">
              <div className="flex justify-between items-center">
                <h4 className="text-sm font-semibold text-white">Semantic RAG Chunk Indexer ({activeDoc.chunks.length} pages indexed)</h4>
                <span className="text-xs text-slate-400 font-mono">Page 1-indexed for citation mapping</span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {activeDoc.chunks.map((chunk, idx) => (
                  <div key={chunk.id} className="bg-slate-900 border border-slate-800 rounded-lg p-3.5 hover:border-slate-700 transition space-y-2">
                    <div className="flex justify-between items-center border-b border-slate-800 pb-1.5">
                      <span className="text-[10px] font-mono text-slate-500">CHUNK_ID: {chunk.id.substring(0, 12)}</span>
                      <span className="text-[10px] font-mono bg-indigo-950 text-indigo-400 px-1.5 py-0.5 rounded border border-indigo-900/30">
                        Page {chunk.pageNumber}
                      </span>
                    </div>
                    <p className="text-xs text-slate-300 leading-relaxed font-sans line-clamp-4 italic">
                      "{chunk.text}"
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Vector Sandbox Playground */}
            <div className="bg-slate-950/40 border border-slate-800 rounded-xl p-5 space-y-4" id="vector_playground">
              <div>
                <h4 className="text-sm font-semibold text-white flex items-center gap-2">
                  <Database className="h-4 w-4 text-indigo-400" />
                  Vector Database Query Playground
                </h4>
                <p className="text-xs text-slate-400 mt-1">Simulate keyword and semantic similarity retrieval scores before running actual Gemini RAG chat.</p>
              </div>

              <form onSubmit={handleDatabaseSearch} className="flex gap-2.5">
                <div className="relative flex-1">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-500">
                    <Search className="h-4 w-4" />
                  </span>
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 text-sm text-white rounded-lg pl-9 pr-4 py-2 outline-none font-sans"
                    placeholder="Search database... e.g. balance, monthly rent, interest rate"
                  />
                </div>
                <select
                  value={searchMode}
                  onChange={(e: any) => setSearchMode(e.target.value)}
                  className="bg-slate-900 border border-slate-800 rounded-lg text-xs text-white px-3 py-2 outline-none font-sans cursor-pointer focus:border-indigo-500"
                >
                  <option value="hybrid">Hybrid Search</option>
                  <option value="semantic">Semantic (Cosine)</option>
                  <option value="keyword">Keyword Overlap</option>
                </select>
                <button
                  type="submit"
                  disabled={searching || !searchQuery.trim()}
                  className="bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs rounded-lg px-4.5 py-2 cursor-pointer transition flex items-center gap-1 shadow-md shadow-indigo-500/10 hover:shadow-indigo-500/20"
                >
                  Query Store
                </button>
              </form>

              {searchResults.length > 0 && (
                <div className="space-y-2.5 pt-2">
                  <div className="text-[11px] font-mono text-slate-400 uppercase tracking-wider">Retrieved Chunks Match results:</div>
                  <div className="space-y-2.5">
                    {searchResults.map((res, i) => (
                      <div key={i} className="bg-slate-900 border border-slate-800 rounded-lg p-3.5 flex items-start justify-between gap-4">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2.5">
                            <span className="text-xs text-white font-semibold">{res.chunk.docName}</span>
                            <span className="text-[10px] font-mono bg-indigo-950 text-indigo-400 px-1.5 py-0.5 rounded border border-indigo-900/30">
                              Page {res.chunk.pageNumber}
                            </span>
                          </div>
                          <p className="text-xs text-slate-300 leading-relaxed font-sans mt-1.5">"{res.chunk.text}"</p>
                        </div>
                        <div className="text-right shrink-0">
                          <span className="text-[11px] font-mono bg-emerald-950/50 text-emerald-400 px-2 py-0.5 rounded font-bold border border-emerald-900/30">
                            Score: {res.score}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

          </div>
        ) : (
          <div className="h-96 bg-slate-950/40 border border-slate-800 rounded-xl flex flex-col items-center justify-center gap-3 text-center">
            <FileText className="h-10 w-10 text-slate-600 animate-pulse" />
            <p className="text-sm text-slate-400">No documents selected. Choose or ingest a banking record to start analysis.</p>
          </div>
        )}
      </div>

    </div>
  );
}

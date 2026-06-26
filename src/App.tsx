import React, { useState, useEffect } from "react";
import { BankingDocument } from "./types";
import { PRELOADED_DOCUMENTS } from "./components/MockData";
import Sidebar from "./components/Sidebar";
import Dashboard from "./components/Dashboard";
import DocumentUpload from "./components/DocumentUpload";
import Chatbot from "./components/Chatbot";
import AnalyticsTable from "./components/AnalyticsTable";
import FraudDetection from "./components/FraudDetection";
import DocComparison from "./components/DocComparison";
import Login from "./components/Login";

export default function App() {
  const [currentUser, setCurrentUser] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<string>("dashboard");
  const [documents, setDocuments] = useState<BankingDocument[]>([]);

  // Authenticate user check
  useEffect(() => {
    const savedUser = sessionStorage.getItem("apex_user");
    if (savedUser) {
      setCurrentUser(savedUser);
    }
    // Set initial preloaded documents to allow instant playground visualization
    setDocuments(PRELOADED_DOCUMENTS);
  }, []);

  const handleLoginSuccess = (user: string) => {
    sessionStorage.setItem("apex_user", user);
    setCurrentUser(user);
    setActiveTab("dashboard");
  };

  const handleLogout = () => {
    sessionStorage.removeItem("apex_user");
    setCurrentUser(null);
  };

  // Add parsed custom uploaded document
  const handleDocumentAdded = (newDoc: BankingDocument) => {
    setDocuments((prev) => [newDoc, ...prev]);
  };

  const handleDocumentDeleted = (id: string) => {
    setDocuments((prev) => prev.filter((d) => d.id !== id));
  };

  if (!currentUser) {
    return <Login onLoginSuccess={handleLoginSuccess} />;
  }

  return (
    <div className="flex h-screen w-screen bg-slate-950 overflow-hidden text-slate-200 select-none font-sans relative">
      
      {/* Sidebar Nav */}
      <Sidebar 
        activeTab={activeTab} 
        onTabChange={setActiveTab} 
        currentUser={currentUser} 
        onLogout={handleLogout} 
      />

      {/* Main Viewport Container */}
      <main className="flex-1 overflow-y-auto bg-slate-900 relative" id="main_content_viewport">
        {/* Background Grid Accent */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:5rem_5rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-35 pointer-events-none" />
        
        {/* Viewport Content */}
        <div className="max-w-7xl mx-auto p-6 md:p-8 relative z-10 h-full">
          {activeTab === "dashboard" && (
            <Dashboard 
              documents={documents} 
              onTabChange={setActiveTab} 
            />
          )}

          {activeTab === "documents" && (
            <DocumentUpload 
              documents={documents} 
              onDocumentAdded={handleDocumentAdded} 
              onDocumentDeleted={handleDocumentDeleted} 
            />
          )}

          {activeTab === "chatbot" && (
            <Chatbot 
              documents={documents} 
            />
          )}

          {activeTab === "ledger" && (
            <AnalyticsTable 
              documents={documents} 
            />
          )}

          {activeTab === "fraud" && (
            <FraudDetection 
              documents={documents} 
            />
          )}

          {activeTab === "compare" && (
            <DocComparison 
              documents={documents} 
            />
          )}
        </div>
      </main>

    </div>
  );
}

export enum DocumentCategory {
  BANK_STATEMENT = "Bank Statement",
  LOAN_DOCUMENT = "Loan Document",
  CREDIT_CARD_STATEMENT = "Credit Card Statement",
  KYC = "KYC Document",
  PASSBOOK = "Passbook",
  FIXED_DEPOSIT = "Fixed Deposit Receipt",
  INSURANCE = "Insurance Document",
  ACCOUNT_OPENING = "Account Opening Form",
  TAX = "Tax Document",
  FINANCIAL_REPORT = "Financial Report",
  OTHERS = "Others"
}

export interface DocumentMetadata {
  bankName: string;
  accountHolder: string;
  accountNumber: string;
  ifsc: string;
  branch: string;
  statementPeriod: string;
  openingBalance: number;
  closingBalance: number;
  loanNumber: string;
  customerId: string;
  issueDate: string;
  expiryDate: string;
  documentType: string;
  currency: string;
}

export interface Transaction {
  id: string;
  docId: string;
  docName: string;
  date: string;
  description: string;
  category: "Income" | "Housing" | "Utilities" | "Food & Dining" | "Shopping" | "Entertainment" | "Transfer" | "Investment" | "Others";
  amount: number;
  type: "debit" | "credit";
  merchant: string;
  isAnomalous: boolean;
  anomalyDetails?: string;
}

export interface DocumentChunk {
  id: string;
  docId: string;
  docName: string;
  pageNumber: number;
  text: string;
}

export interface BankingDocument {
  id: string;
  name: string;
  size: string;
  uploadDate: string;
  status: "processing" | "completed" | "failed";
  category: DocumentCategory;
  metadata: DocumentMetadata;
  text: string;
  pagesCount: number;
  chunks: DocumentChunk[];
  transactions: Transaction[];
  scanned: boolean;
  ocrMethod?: string;
}

export interface Citation {
  documentName: string;
  pageNumber: number;
  chunkId: string;
  confidenceScore: number;
  textSnippet: string;
}

export interface ChatMessage {
  id: string;
  sender: "user" | "assistant";
  text: string;
  timestamp: string;
  citations?: Citation[];
}

export interface FraudAlert {
  id: string;
  transactionId?: string;
  date: string;
  description: string;
  category: "Large Withdrawal" | "Rapid Transfer" | "Duplicate Transaction" | "Unusual Category" | "Suspicious Activity";
  severity: "low" | "medium" | "high";
  reason: string;
}

export interface FraudAnalysis {
  riskScore: number; // 0-100
  alerts: FraudAlert[];
}

export interface DocComparisonResult {
  doc1Id: string;
  doc2Id: string;
  doc1Name: string;
  doc2Name: string;
  balanceChange: number;
  incomeChange: number;
  expenseChange: number;
  highestTransactions: Transaction[];
  categoryDiff: { category: string; doc1: number; doc2: number }[];
  summary: string;
}

import { BankingDocument, DocumentCategory } from "../types";

export const PRELOADED_DOCUMENTS: BankingDocument[] = [
  {
    id: "doc-apex-statement-june",
    name: "Apex_Bank_Statement_June_2026.pdf",
    size: "1.4 MB",
    uploadDate: "2026-06-25",
    status: "completed",
    category: DocumentCategory.BANK_STATEMENT,
    scanned: false,
    pagesCount: 3,
    metadata: {
      bankName: "Apex Global Trust Bank",
      accountHolder: "Dr. Evelyn Vance",
      accountNumber: "88402-9910-384",
      ifsc: "APEXIN9901X",
      branch: "Financial District Manhattan",
      statementPeriod: "June 01, 2026 - June 20, 2026",
      openingBalance: 12450.75,
      closingBalance: 14890.30,
      loanNumber: "",
      customerId: "CUST-99214-E",
      issueDate: "2026-06-20",
      expiryDate: "",
      documentType: "e-Statement",
      currency: "USD",
    },
    text: `APEX GLOBAL TRUST BANK e-Statement
==================================
Statement Period: June 01, 2026 - June 20, 2026
Account Holder: Dr. Evelyn Vance
Account Number: 88402-9910-384
IFSC: APEXIN9901X | Branch: Financial District Manhattan
Customer ID: CUST-99214-E

Opening Balance: $12,450.75
Closing Balance: $14,890.30

TRANSACTION LEDGER DETAIL:
--------------------------
2026-06-02 | DIRECT DEB PAYROLL / TECH CORP | Credit: $4,850.00 | Balance: $17,300.75
2026-06-03 | APARTMENT MGMT RENT ACH | Debit: $1,800.00 | Balance: $15,500.75
2026-06-04 | CON EDISON UTILITY BILL WIRE | Debit: $145.20 | Balance: $15,355.55
2026-06-06 | WHOLE FOODS MARKET SOHO NYC | Debit: $234.50 | Balance: $15,121.05
2026-06-08 | AMAZON.COM RECURRING ORDER | Debit: $89.90 | Balance: $15,031.15
2026-06-10 | UBER TRIP CAR SERVICES MANHATTAN | Debit: $42.50 | Balance: $14,988.65
2026-06-12 | STARBUCKS COFFEE BROADWAY | Debit: $18.75 | Balance: $14,969.90
2026-06-14 | TRANSFER TO SAVINGS A/C 9901 | Debit: $500.00 | Balance: $14,469.90
2026-06-15 | ROBINHOOD FUNDING INVEST | Debit: $300.00 | Balance: $14,169.90
2026-06-18 | CVS PHARMACY RX BROADWAY | Debit: $65.40 | Balance: $14,104.50
2026-06-19 | ATM CASH WITHDRAWAL APEX BRANCH | Debit: $200.00 | Balance: $13,904.50
2026-06-20 | RECURRING DIVIDEND APEX CAP | Credit: $1,185.80 | Balance: $14,890.30

End of audited e-Statement record.`,
    chunks: [
      {
        id: "chunk-statement-1",
        docId: "doc-apex-statement-june",
        docName: "Apex_Bank_Statement_June_2026.pdf",
        pageNumber: 1,
        text: "APEX GLOBAL TRUST BANK e-Statement. Statement Period: June 01, 2026 - June 20, 2026. Account Holder: Dr. Evelyn Vance. Account Number: 88402-9910-384. IFSC: APEXIN9901X. Branch: Financial District Manhattan. Customer ID: CUST-99214-E. Opening Balance: $12,450.75. Closing Balance: $14,890.30.",
      },
      {
        id: "chunk-statement-2",
        docId: "doc-apex-statement-june",
        docName: "Apex_Bank_Statement_June_2026.pdf",
        pageNumber: 2,
        text: "TRANSACTION LEDGER DETAILS:\n- 2026-06-02: DIRECT DEB PAYROLL / TECH CORP. Credit: $4,850.00 (Balance: $17,300.75)\n- 2026-06-03: APARTMENT MGMT RENT ACH. Debit: $1,800.00 (Balance: $15,500.75)\n- 2026-06-04: CON EDISON UTILITY BILL WIRE. Debit: $145.20 (Balance: $15,355.55)\n- 2026-06-06: WHOLE FOODS MARKET SOHO NYC. Debit: $234.50 (Balance: $15,121.05)\n- 2026-06-08: AMAZON.COM RECURRING ORDER. Debit: $89.90 (Balance: $15,031.15)\n- 2026-06-10: UBER TRIP CAR SERVICES MANHATTAN. Debit: $42.50 (Balance: $14,988.65).",
      },
      {
        id: "chunk-statement-3",
        docId: "doc-apex-statement-june",
        docName: "Apex_Bank_Statement_June_2026.pdf",
        pageNumber: 3,
        text: "TRANSACTION LEDGER DETAILS (CONTINUED):\n- 2026-06-12: STARBUCKS COFFEE BROADWAY. Debit: $18.75 (Balance: $14,969.90)\n- 2026-06-14: TRANSFER TO SAVINGS A/C 9901. Debit: $500.00 (Balance: $14,469.90)\n- 2026-06-15: ROBINHOOD FUNDING INVEST. Debit: $300.00 (Balance: $14,169.90)\n- 2026-06-18: CVS PHARMACY RX BROADWAY. Debit: $65.40 (Balance: $14,104.50)\n- 2026-06-19: ATM CASH WITHDRAWAL APEX BRANCH. Debit: $200.00 (Balance: $13,904.50)\n- 2026-06-20: RECURRING DIVIDEND APEX CAP. Credit: $1,185.80 (Balance: $14,890.30).",
      },
    ],
    transactions: [
      { id: "tx-1", docId: "doc-apex-statement-june", docName: "Apex_Bank_Statement_June_2026.pdf", date: "2026-06-02", description: "DIRECT DEB PAYROLL / TECH CORP", category: "Income", amount: 4850.00, type: "credit", merchant: "Tech Corp", isAnomalous: false },
      { id: "tx-2", docId: "doc-apex-statement-june", docName: "Apex_Bank_Statement_June_2026.pdf", date: "2026-06-03", description: "APARTMENT MGMT RENT ACH", category: "Housing", amount: 1800.00, type: "debit", merchant: "Apartment Management", isAnomalous: false },
      { id: "tx-3", docId: "doc-apex-statement-june", docName: "Apex_Bank_Statement_June_2026.pdf", date: "2026-06-04", description: "CON EDISON UTILITY BILL WIRE", category: "Utilities", amount: 145.20, type: "debit", merchant: "Con Edison", isAnomalous: false },
      { id: "tx-4", docId: "doc-apex-statement-june", docName: "Apex_Bank_Statement_June_2026.pdf", date: "2026-06-06", description: "WHOLE FOODS MARKET SOHO NYC", category: "Food & Dining", amount: 234.50, type: "debit", merchant: "Whole Foods", isAnomalous: false },
      { id: "tx-5", docId: "doc-apex-statement-june", docName: "Apex_Bank_Statement_June_2026.pdf", date: "2026-06-08", description: "AMAZON.COM RECURRING ORDER", category: "Shopping", amount: 89.90, type: "debit", merchant: "Amazon", isAnomalous: false },
      { id: "tx-6", docId: "doc-apex-statement-june", docName: "Apex_Bank_Statement_June_2026.pdf", date: "2026-06-10", description: "UBER TRIP CAR SERVICES MANHATTAN", category: "Entertainment", amount: 42.50, type: "debit", merchant: "Uber", isAnomalous: false },
      { id: "tx-7", docId: "doc-apex-statement-june", docName: "Apex_Bank_Statement_June_2026.pdf", date: "2026-06-12", description: "STARBUCKS COFFEE BROADWAY", category: "Food & Dining", amount: 18.75, type: "debit", merchant: "Starbucks", isAnomalous: false },
      { id: "tx-8", docId: "doc-apex-statement-june", docName: "Apex_Bank_Statement_June_2026.pdf", date: "2026-06-14", description: "TRANSFER TO SAVINGS A/C 9901", category: "Transfer", amount: 500.00, type: "debit", merchant: "Self Transfer", isAnomalous: false },
      { id: "tx-9", docId: "doc-apex-statement-june", docName: "Apex_Bank_Statement_June_2026.pdf", date: "2026-06-15", description: "ROBINHOOD FUNDING INVEST", category: "Investment", amount: 300.00, type: "debit", merchant: "Robinhood", isAnomalous: false },
      { id: "tx-10", docId: "doc-apex-statement-june", docName: "Apex_Bank_Statement_June_2026.pdf", date: "2026-06-18", description: "CVS PHARMACY RX BROADWAY", category: "Shopping", amount: 65.40, type: "debit", merchant: "CVS", isAnomalous: false },
      { id: "tx-11", docId: "doc-apex-statement-june", docName: "Apex_Bank_Statement_June_2026.pdf", date: "2026-06-19", description: "ATM CASH WITHDRAWAL APEX BRANCH", category: "Others", amount: 200.00, type: "debit", merchant: "ATM", isAnomalous: true, anomalyDetails: "Manual ATM withdrawals above standard weekly pattern alerts security" },
      { id: "tx-12", docId: "doc-apex-statement-june", docName: "Apex_Bank_Statement_June_2026.pdf", date: "2026-06-20", description: "RECURRING DIVIDEND APEX CAP", category: "Income", amount: 1185.80, type: "credit", merchant: "Apex Capital", isAnomalous: false },
    ],
  },
  {
    id: "doc-meridian-loan",
    name: "Meridian_Term_Loan_Agreement.pdf",
    size: "2.1 MB",
    uploadDate: "2026-06-24",
    status: "completed",
    category: DocumentCategory.LOAN_DOCUMENT,
    scanned: true,
    ocrMethod: "OmniPage Cloud OCR",
    pagesCount: 2,
    metadata: {
      bankName: "Meridian Financial Services",
      accountHolder: "Dr. Evelyn Vance",
      accountNumber: "",
      ifsc: "",
      branch: "Corporate secured lending unit NY",
      statementPeriod: "",
      openingBalance: 0,
      closingBalance: 75000.00,
      loanNumber: "LN-988341-X",
      customerId: "CUST-99214-E",
      issueDate: "2026-01-15",
      expiryDate: "2031-01-15",
      documentType: "Term Loan Agreement",
      currency: "USD",
    },
    text: `MERIDIAN SECURED TERM LOAN AGREEMENT
====================================
This secured term loan contract is enacted between Meridian Financial Services and Dr. Evelyn Vance (Borrower), logged under Customer ID CUST-99214-E.

PRINCIPAL VALUE: $75,000.00
LOAN CONTRACT NUMBER: LN-988341-X
AGREEMENT DATE: January 15, 2026
MATURITY DATE: January 15, 2031 (60 Month Tenor)

INTEREST RATE: 6.75% Fixed Annual Percentage Rate (APR).
COLLATERAL: Primary residential property lien on 742 Evergreen Terrace.
MONTHLY EQUATED INSTALLMENT (EMI): $1,476.32, payable on the 15th of each calendar month starting February 15, 2026.

REPAYMENT AND SECURITY ASSURANCE:
- Prepayment penalty: 1.5% of remaining principal if closed within 24 months.
- Late payment fee: $75.00 flat fee or 5.0% of interest installment if unpaid past 10 days grace period.
- Late payment EMI defaults automatically report to standard Credit bureaus after 30 days.

This contract holds legal compliance under the State of New York Commercial Lending Acts.`,
    chunks: [
      {
        id: "chunk-loan-1",
        docId: "doc-meridian-loan",
        docName: "Meridian_Term_Loan_Agreement.pdf",
        pageNumber: 1,
        text: "MERIDIAN SECURED TERM LOAN AGREEMENT. Principal Value: $75,000.00. Loan Contract Number: LN-988341-X. Enacted between Meridian Financial Services and Dr. Evelyn Vance, Customer ID: CUST-99214-E. Date: January 15, 2026. Maturity: January 15, 2031. Interest Rate: 6.75% Fixed Annual Percentage Rate (APR).",
      },
      {
        id: "chunk-loan-2",
        docId: "doc-meridian-loan",
        docName: "Meridian_Term_Loan_Agreement.pdf",
        pageNumber: 2,
        text: "Collateral details: Primary residential property lien on 742 Evergreen Terrace. EMI: $1,476.32 payable on the 15th of each month starting Feb 15, 2026. Late fee: $75 or 5% of interest installment. Prepayment penalty: 1.5% if closed within 24 months. Compliance NY commercial lending laws.",
      },
    ],
    transactions: [],
  },
  {
    id: "doc-kyc-passport",
    name: "Evelyn_Vance_Passport_KYC.pdf",
    size: "820 KB",
    uploadDate: "2026-06-23",
    status: "completed",
    category: DocumentCategory.KYC,
    scanned: true,
    ocrMethod: "Tesseract OCR Native",
    pagesCount: 1,
    metadata: {
      bankName: "Federal Passport Authority",
      accountHolder: "Dr. Evelyn Vance",
      accountNumber: "",
      ifsc: "",
      branch: "Manhattan Verification Desk",
      statementPeriod: "",
      openingBalance: 0,
      closingBalance: 0,
      loanNumber: "",
      customerId: "CUST-99214-E",
      issueDate: "2021-08-10",
      expiryDate: "2031-08-10",
      documentType: "Passport Verification Record",
      currency: "",
    },
    text: `FEDERAL IDENTITY AUTHORITY PASSPORT PASSPORT RECORD
===================================================
Document Type: Passport Identification Ledger
Holder Full Name: Evelyn Vance (Dr.)
Gender: Female
Date of Birth: 1988-04-12
Nationality: United States (US Citizen)

Passport Number: US-E9812403-F
Date of Issue: 2021-08-10
Date of Expiry: 2031-08-10
Issuing Authority: United States Department of State (Manhattan Branch Bureau)

IDENTITY AUDIT AND KYC METRIC VERIFICATION:
This document is officially linked to banking records of Apex Trust Bank under customer log ID CUST-99214-E. Biometric verification matches. Electronic chip scan results: Verified. Biometric photo signature: Authenticated. Verified current address matches: 742 Evergreen Terrace, NY. Status: active, validated.`,
    chunks: [
      {
        id: "chunk-kyc-1",
        docId: "doc-kyc-passport",
        docName: "Evelyn_Vance_Passport_KYC.pdf",
        pageNumber: 1,
        text: "FEDERAL IDENTITY AUTHORITY PASSPORT RECORD. Holder Name: Dr. Evelyn Vance. Passport: US-E9812403-F. Issued: 2021-08-10. Expiry: 2031-08-10. Issuing Authority: United States Department of State. Linked customer ID: CUST-99214-E. Biometric Verification: chip scan verified, Current address verified: 742 Evergreen Terrace, NY. Status: Active.",
      },
    ],
    transactions: [],
  },
  {
    id: "doc-apex-credit-card",
    name: "Apex_Elite_Credit_Card_May_June.pdf",
    size: "1.1 MB",
    uploadDate: "2026-06-22",
    status: "completed",
    category: DocumentCategory.CREDIT_CARD_STATEMENT,
    scanned: false,
    pagesCount: 2,
    metadata: {
      bankName: "Apex Elite Credit Cards",
      accountHolder: "Dr. Evelyn Vance",
      accountNumber: "4532-8802-1140-9901",
      ifsc: "",
      branch: "Card Rewards Center Delaware",
      statementPeriod: "May 20, 2026 - June 20, 2026",
      openingBalance: 450.20,
      closingBalance: 1245.90,
      loanNumber: "",
      customerId: "CUST-99214-E",
      issueDate: "2026-06-20",
      expiryDate: "",
      documentType: "Credit Card Billing Statement",
      currency: "USD",
    },
    text: `APEX ELITE CREDIT CARD STATEMENT
================================
Billing Cycle: May 20, 2026 - June 20, 2026
Cardholder: Dr. Evelyn Vance
Account Number: 4532-8802-1140-9901 (Visa Gold Signature)
Credit Limit: $15,000.00 | Available Credit: $13,754.10

Previous Balance: $450.20
Payments Received: $450.20 (Fully paid)
New Purchases/Debits: $1,245.90
Interest Charged: $0.00
Outstanding Ending Balance: $1,245.90
Payment Due Date: July 15, 2026

CARD TRANSACTIONS HISTORY:
--------------------------
2026-05-22 | APPLE ONLINE STORE NEW YORK | Debit: $799.00 | Category: Shopping | Merchant: Apple Store
2026-05-25 | NETFLIX RECURRING MEMBERSHIP | Debit: $19.99 | Category: Entertainment | Merchant: Netflix
2026-05-28 | TAO DOWNTOWN NYC DINING | Debit: $245.50 | Category: Food & Dining | Merchant: Tao Restaurant
2026-06-01 | CARD PAYMENT RECEIVED ACH | Credit: $450.20 | Category: Income | Merchant: Apex Bank Transfer
2026-06-05 | UBER TRIP PREMIUM | Debit: $35.40 | Category: Entertainment | Merchant: Uber
2026-06-12 | AIRBNB BOOKING BOSTON | Debit: $412.00 | Category: Housing | Merchant: Airbnb (Anomalous High Expense)
2026-06-15 | REI COOP OUTDOOR GEAR | Debit: $179.21 | Category: Shopping | Merchant: REI

End of billing ledger. All cashbacks processed.`,
    chunks: [
      {
        id: "chunk-cc-1",
        docId: "doc-apex-credit-card",
        docName: "Apex_Elite_Credit_Card_May_June.pdf",
        pageNumber: 1,
        text: "APEX ELITE CREDIT CARD STATEMENT. Billing Cycle: May 20, 2026 - June 20, 2026. Cardholder: Dr. Evelyn Vance. Account: 4532-8802-1140-9901. Visa Gold Signature. Previous Balance: $450.20. Payments Received: $450.20. New Purchases/Debits: $1,245.90. Outstanding Ending Balance: $1,245.90. Credit Limit: $15,000.00. Available: $13,754.10. Due Date: July 15, 2026.",
      },
      {
        id: "chunk-cc-2",
        docId: "doc-apex-credit-card",
        docName: "Apex_Elite_Credit_Card_May_June.pdf",
        pageNumber: 2,
        text: "CARD TRANSACTIONS HISTORY:\n- 2026-05-22: APPLE ONLINE STORE NEW YORK. Debit: $799.00\n- 2026-05-25: NETFLIX RECURRING MEMBERSHIP. Debit: $19.99\n- 2026-05-28: TAO DOWNTOWN NYC DINING. Debit: $245.50\n- 2026-06-01: CARD PAYMENT RECEIVED ACH. Credit: $450.20\n- 2026-06-05: UBER TRIP PREMIUM. Debit: $35.40\n- 2026-06-12: AIRBNB BOOKING BOSTON. Debit: $412.00\n- 2026-06-15: REI COOP OUTDOOR GEAR. Debit: $179.21.",
      },
    ],
    transactions: [
      { id: "tx-cc-1", docId: "doc-apex-credit-card", docName: "Apex_Elite_Credit_Card_May_June.pdf", date: "2026-05-22", description: "APPLE ONLINE STORE NEW YORK", category: "Shopping", amount: 799.00, type: "debit", merchant: "Apple Store", isAnomalous: false },
      { id: "tx-cc-2", docId: "doc-apex-credit-card", docName: "Apex_Elite_Credit_Card_May_June.pdf", date: "2026-05-25", description: "NETFLIX RECURRING MEMBERSHIP", category: "Entertainment", amount: 19.99, type: "debit", merchant: "Netflix", isAnomalous: false },
      { id: "tx-cc-3", docId: "doc-apex-credit-card", docName: "Apex_Elite_Credit_Card_May_June.pdf", date: "2026-05-28", description: "TAO DOWNTOWN NYC DINING", category: "Food & Dining", amount: 245.50, type: "debit", merchant: "Tao Restaurant", isAnomalous: false },
      { id: "tx-cc-4", docId: "doc-apex-credit-card", docName: "Apex_Elite_Credit_Card_May_June.pdf", date: "2026-06-01", description: "CARD PAYMENT RECEIVED ACH", category: "Income", amount: 450.20, type: "credit", merchant: "Apex Bank Transfer", isAnomalous: false },
      { id: "tx-cc-5", docId: "doc-apex-credit-card", docName: "Apex_Elite_Credit_Card_May_June.pdf", date: "2026-06-05", description: "UBER TRIP PREMIUM", category: "Entertainment", amount: 35.40, type: "debit", merchant: "Uber", isAnomalous: false },
      { id: "tx-cc-6", docId: "doc-apex-credit-card", docName: "Apex_Elite_Credit_Card_May_June.pdf", date: "2026-06-12", description: "AIRBNB BOOKING BOSTON", category: "Housing", amount: 412.00, type: "debit", merchant: "Airbnb", isAnomalous: true, anomalyDetails: "Lodging transaction outside regular residential state limits." },
      { id: "tx-cc-7", docId: "doc-apex-credit-card", docName: "Apex_Elite_Credit_Card_May_June.pdf", date: "2026-06-15", description: "REI COOP OUTDOOR GEAR", category: "Shopping", amount: 179.21, type: "debit", merchant: "REI", isAnomalous: false },
    ],
  },
];

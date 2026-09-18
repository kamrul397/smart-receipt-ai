# 🧾 SmartReceipt AI — Multimodal Financial Document Parser & Expense Auditor

![Next.js 16](https://img.shields.io/badge/Next.js-16-black?style=for-the-badge&logo=next.js)
![React 19](https://img.shields.io/badge/React-19-blue?style=for-the-badge&logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-3178C6?style=for-the-badge&logo=typescript)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Neon-336791?style=for-the-badge&logo=postgresql)
![Prisma](https://img.shields.io/badge/Prisma-7.0-2D3748?style=for-the-badge&logo=prisma)
![Gemini AI](https://img.shields.io/badge/Google_Gemini-Vision-4285F4?style=for-the-badge&logo=google)
![Zod](https://img.shields.io/badge/Zod-Type_Safety-3E67B1?style=for-the-badge&logo=zod)

An enterprise-grade, full-stack financial document extraction and auditing platform. **SmartReceipt AI** converts unstructured paper receipts and PDF invoices into 100% type-safe, database-persisted expense records using **Google Gemini Vision**, runtime **Zod** schema enforcement, and a **Human-in-the-Loop split-screen reconciliation** interface.

---

## 🌟 Key Features

* **👁️ Multimodal Visual Extraction:** Reads pixels directly from JPG, PNG, and PDF receipts to extract store name, purchase date, line items, taxes, currency, and categorized spending without brittle regex OCR.
* **🛡️ Strict Runtime Type Safety (Zod):** Implements bidirectional TypeScript validation via Zod schemas to guarantee numbers are floats, dates follow ISO formats, and categories map to standardized enums.
* **⚡ Graceful Model Fallback:** Built with production resilience against 503 traffic spikes using an automated multi-model fallback strategy (`gemini-flash-latest` → `gemini-3.6-flash` → `gemini-3.5-flash`).
* **⚖️ Human-in-the-Loop Reconciliation:** Split-screen UI displaying the original receipt on the left and an interactive form on the right. Users can add, edit, or remove line items with real-time grand total recalculation before saving.
* **🗄️ Normalized PostgreSQL Schema (Prisma ORM):** Clean 1-to-many relationship (`Expense` → `ExpenseItem`) with cascading deletes (`onDelete: Cascade`), CUID identifiers, and B-Tree indexes on `date` and `category`.
* **📊 Live Analytics Dashboard:** Interactive Recharts category spending donut chart, summary financial metrics, and a searchable, filterable expense history table.

---

## 🏗️ System Architecture

```
[User Uploads Receipt / Invoice]
             │ (Drag & drop PNG/JPG/PDF)
             ▼
[Frontend: Base64 Encoding]
             │ (FileReader API)
             ▼
[API Gateway: POST /api/scan-receipt]
             │
             ├──► [Google Gemini Vision API] (Multimodal Prompting)
             │         │ (responseMimeType: application/json)
             │         ▼
             ├──► [Zod Schema Validation] (ReceiptSchema.parse)
             │         │
             ▼         ▼
[Split-Screen Reconciliation Screen]
   ├── Left:  Original Document Image Preview
   └── Right: Editable Form (Live Total Recalculation)
             │
             ▼ (User clicks "Confirm & Save")
[API Gateway: POST /api/expenses]
             │
             ▼
[PostgreSQL Database (Neon)] ◄── Prisma ORM
   ├── Expense (Header, Date, Tax, Total, Category)
   └── ExpenseItem (1-to-many Line Items with Cascade)
             │
             ▼
[Analytics Dashboard]
   ├── Summary Cards (Total Spent, Receipts Audited)
   ├── Category Spending Donut Chart (Recharts)
   └── Searchable & Filterable History Table
```

---

## 🛠️ Tech Stack

* **Frontend:** Next.js 16 (App Router, Server & Client Components), React 19, Tailwind CSS v4, Lucide Icons, Recharts.
* **Backend:** Next.js Route Handlers, Node.js.
* **AI & Validation:** `@google/generative-ai` (Gemini 1.5/3.6 Flash), `zod`.
* **Database & ORM:** PostgreSQL (Neon Serverless), Prisma ORM 7 (`@prisma/adapter-pg`, `pg`).

---

## 🚀 Getting Started Locally

### 1. Clone the repository
```bash
git clone https://github.com/kamrul397/smart-receipt-ai.git
cd smart-receipt-ai
```

### 2. Install dependencies
```bash
npm install
```

### 3. Configure Environment Variables
Create a `.env` file in the root folder:
```env
DATABASE_URL="your_postgresql_connection_string"
GEMINI_API_KEY="your_google_ai_studio_api_key"
```

### 4. Run Prisma Migrations
```bash
npx prisma migrate dev
```

### 5. Start the Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) to view the application.

---

## 📄 License
This project is open-source and available under the [MIT License](LICENSE).

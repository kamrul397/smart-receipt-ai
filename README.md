# SmartReceipt AI

> Scan paper receipts or digital invoices into structured data with AI, review line items side-by-side, and track expenses without manual entry.

**Live Demo:** [smart-receipt-ai.vercel.app](https://smart-receipt-ai.vercel.app)

---

## What It Does

SmartReceipt AI takes photos or PDFs of receipts and uses Google Gemini Vision to extract the store name, date, line items, taxes, and total amount.

* **No account required to scan:** Anyone can drop a receipt, get instant extracted data, and download or print a PDF voucher right away.
* **Member accounts:** Sign up to save receipts to your personal dashboard, track category spending charts, and export monthly CSV or consolidated PDF reports.
* **Document guardrails:** Automatically checks if an uploaded image is actually a receipt and warns you if it isn't.
* **Manual entry:** Option to log cash transactions or lost receipts by hand.
* **Split-screen review:** View the original receipt alongside the extracted items to fix or edit any numbers before saving.

---

## Tech Stack

* **Framework:** Next.js 16 (App Router), React 19
* **Styling:** Tailwind CSS v4, Lucide Icons
* **AI:** Google Gemini Flash API (`@google/generative-ai`)
* **Database & ORM:** PostgreSQL (Neon serverless), Prisma 7
* **Validation & Auth:** Zod, custom JWT with HTTP-only cookies & Bcrypt

---

## Local Setup

### 1. Clone & install dependencies
```bash
git clone https://github.com/kamrul397/smart-receipt-ai.git
cd smart-receipt-ai
npm install
```

### 2. Environment variables
Create a `.env` file in the root directory:
```env
DATABASE_URL="your_postgresql_connection_string"
GEMINI_API_KEY="your_gemini_api_key"
JWT_SECRET="your_random_secret_key"
```

### 3. Sync database & run dev server
```bash
npx prisma db push
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## License

MIT

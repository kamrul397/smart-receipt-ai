import Link from "next/link";
import {
  ScanLine,
  LayoutDashboard,
  CheckCircle2,
  UploadCloud,
  FileCheck,
  TrendingUp,
  AlertTriangle,
  ArrowRight,
  Lock,
  Cpu,
  Sparkles,
  Printer,
  FileText,
  UserCheck,
  Zap,
  Coffee,
  Check,
  X
} from "lucide-react";

export default function HomePage() {
  return (
    <div className="min-h-[calc(100vh-64px)] bg-slate-50/60 flex flex-col py-6 sm:py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto w-full space-y-12 sm:space-y-14">
        
        {/* ===================== HERO SECTION ===================== */}
        <section className="text-center pt-1 sm:pt-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs font-bold mb-4 shadow-xs">
            <Sparkles className="w-3.5 h-3.5" /> AI-Powered Expense & Receipt Assistant
          </div>

          <h1 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight leading-[1.15] mb-3.5">
            Turn Messy Paper Receipts Into <br className="hidden sm:inline" />
            <span className="text-blue-600">Clean Data & PDF Reports</span>
          </h1>

          <p className="text-sm sm:text-base text-slate-600 max-w-2xl mx-auto mb-6 leading-relaxed">
            Stop typing receipt numbers into spreadsheets by hand. Drop any receipt photo, let AI read every item in 3 seconds, and download a ready-to-use PDF audit slip.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-8">
            <Link
              href="/scan"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs sm:text-sm px-6 py-3 rounded-xl shadow-md hover:shadow-lg transition-all"
            >
              <ScanLine className="w-4 h-4" /> Try Scanner Free (No Login Needed)
            </Link>
            <Link
              href="/dashboard"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-white hover:bg-slate-100 text-slate-700 border border-slate-300 font-bold text-xs sm:text-sm px-5 py-3 rounded-xl shadow-xs transition-all"
            >
              <LayoutDashboard className="w-4 h-4" /> Go to Dashboard
            </Link>
          </div>

          {/* TWO WAYS TO USE CALLOUT */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-3xl mx-auto text-left">
            {/* Guest Card */}
            <div className="bg-white p-5 rounded-2xl border border-blue-200/80 shadow-xs flex items-start gap-4">
              <div className="p-3 bg-blue-50 text-blue-600 rounded-xl shrink-0 mt-0.5">
                <Zap className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="font-extrabold text-sm text-slate-900">Guest Mode (Instant)</h3>
                  <span className="text-[10px] bg-blue-100 text-blue-700 font-bold px-2 py-0.5 rounded-full">No Sign-Up</span>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Upload any receipt photo right now. AI extracts all items, and you can download an instant, clean PDF slip for company reimbursement.
                </p>
              </div>
            </div>

            {/* Member Card */}
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex items-start gap-4">
              <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl shrink-0 mt-0.5">
                <UserCheck className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="font-extrabold text-sm text-slate-900">Free Member Account</h3>
                  <span className="text-[10px] bg-emerald-100 text-emerald-700 font-bold px-2 py-0.5 rounded-full">Full History</span>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Save all receipts permanently to your cloud dashboard. View automatic monthly spending charts, search past receipts, and export CSV files.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ===================== HOW IT WORKS (SIMPLE 4 STEPS) ===================== */}
        <section id="how-it-works" className="scroll-mt-16">
          <div className="text-center mb-12">
            <span className="text-blue-600 text-xs font-bold uppercase tracking-wider">Simple Process</span>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 mt-1">
              How SmartReceipt AI Works in 4 Steps
            </h2>
            <p className="text-sm text-slate-500 max-w-xl mx-auto mt-2">
              From a crumpled paper receipt to an organized financial report in under 10 seconds.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {/* Step 1 */}
            <div className="bg-white rounded-2xl border border-slate-200 p-6 flex flex-col justify-between shadow-xs hover:border-blue-300 transition">
              <div>
                <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-black text-sm mb-4">
                  1
                </div>
                <h3 className="font-bold text-slate-900 text-base mb-1.5">Take a Photo</h3>
                <p className="text-xs text-slate-600 leading-relaxed mb-4">
                  Snap a picture with your phone or drop an image file (PNG, JPG, WebP) of any receipt, restaurant bill, or grocery ticket.
                </p>
              </div>
              {/* Visual preview pill */}
              <div className="bg-slate-50 border border-slate-200/80 rounded-xl p-3 text-center">
                <span className="text-xs text-slate-500 font-medium inline-flex items-center gap-1.5">
                  <UploadCloud className="w-3.5 h-3.5 text-blue-600" /> Drop photo here
                </span>
              </div>
            </div>

            {/* Step 2 */}
            <div className="bg-white rounded-2xl border border-slate-200 p-6 flex flex-col justify-between shadow-xs hover:border-purple-300 transition">
              <div>
                <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center font-black text-sm mb-4">
                  2
                </div>
                <h3 className="font-bold text-slate-900 text-base mb-1.5">AI Reads the Items</h3>
                <p className="text-xs text-slate-600 leading-relaxed mb-4">
                  Google Gemini Vision scans the photo and extracts the store name, date, each individual item, prices, taxes, and total.
                </p>
              </div>
              {/* Visual preview pill */}
              <div className="bg-purple-50/50 border border-purple-200/80 rounded-xl p-2.5 space-y-1 text-left font-mono text-[10px] text-purple-900">
                <div className="flex justify-between"><span>Starbucks</span><span>$4.50</span></div>
                <div className="flex justify-between"><span>Tax (8%)</span><span>$0.36</span></div>
              </div>
            </div>

            {/* Step 3 */}
            <div className="bg-white rounded-2xl border border-slate-200 p-6 flex flex-col justify-between shadow-xs hover:border-emerald-300 transition">
              <div>
                <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-black text-sm mb-4">
                  3
                </div>
                <h3 className="font-bold text-slate-900 text-base mb-1.5">Check & Adjust</h3>
                <p className="text-xs text-slate-600 leading-relaxed mb-4">
                  You stay in control! View the original photo on the left and the editable table on the right. Fix any typos with instant recalculations.
                </p>
              </div>
              {/* Visual preview pill */}
              <div className="bg-emerald-50/60 border border-emerald-200/80 rounded-xl p-2.5 text-center">
                <span className="text-[11px] text-emerald-800 font-bold inline-flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Side-by-side verification
                </span>
              </div>
            </div>

            {/* Step 4 */}
            <div className="bg-white rounded-2xl border border-slate-200 p-6 flex flex-col justify-between shadow-xs hover:border-amber-300 transition">
              <div>
                <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center font-black text-sm mb-4">
                  4
                </div>
                <h3 className="font-bold text-slate-900 text-base mb-1.5">Download or Save</h3>
                <p className="text-xs text-slate-600 leading-relaxed mb-4">
                  Download a print-ready PDF audit slip immediately, or save to your account to track monthly categories and export to CSV.
                </p>
              </div>
              {/* Visual preview pill */}
              <div className="bg-amber-50/60 border border-amber-200/80 rounded-xl p-2.5 text-center">
                <span className="text-[11px] text-amber-800 font-bold inline-flex items-center gap-1">
                  <Printer className="w-3.5 h-3.5" /> Instant PDF or Save
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* ===================== THE PROBLEM & THE SOLUTION (EASY TO READ) ===================== */}
        <section className="bg-gradient-to-br from-slate-900 to-slate-800 text-white rounded-3xl p-8 sm:p-12 shadow-xl">
          <div className="max-w-2xl mb-8">
            <span className="text-blue-400 text-xs font-bold uppercase tracking-wider">Why We Made This</span>
            <h2 className="text-2xl sm:text-3xl font-black mt-1 mb-3">
              Why Does This Project Exist?
            </h2>
            <p className="text-slate-300 text-sm leading-relaxed">
              Every freelancer, employee, and business owner loses hours every month typing receipt details by hand for tax time or company reimbursement.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* The Old Way */}
            <div className="bg-white/5 border border-red-500/20 rounded-2xl p-6">
              <div className="flex items-center gap-2 text-red-400 font-bold text-sm mb-3">
                <X className="w-4 h-4 shrink-0" />
                <span>The Old Way (Manual & Frustrating)</span>
              </div>
              <ul className="space-y-3 text-xs text-slate-300 leading-relaxed">
                <li className="flex items-start gap-2">
                  <span className="text-red-400 font-bold">•</span>
                  <span>Crumpled paper receipts piling up in your wallet or shoebox.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-red-400 font-bold">•</span>
                  <span>Typing every coffee, lunch, and taxi into Excel one by one.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-red-400 font-bold">•</span>
                  <span>Accidental typos in amounts cause reimbursement rejections.</span>
                </li>
              </ul>
            </div>

            {/* The SmartReceipt AI Way */}
            <div className="bg-white/5 border border-emerald-500/20 rounded-2xl p-6">
              <div className="flex items-center gap-2 text-emerald-400 font-bold text-sm mb-3">
                <Check className="w-4 h-4 shrink-0" />
                <span>The SmartReceipt AI Way (Fast & Automated)</span>
              </div>
              <ul className="space-y-3 text-xs text-slate-300 leading-relaxed">
                <li className="flex items-start gap-2">
                  <span className="text-emerald-400 font-bold">•</span>
                  <span>Drop the photo $\rightarrow$ AI extracts every item and total in 3 seconds.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-emerald-400 font-bold">•</span>
                  <span>Download a clean single-page PDF receipt slip with one click.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-emerald-400 font-bold">•</span>
                  <span>Members get visual spending charts and full CSV spreadsheet exports.</span>
                </li>
              </ul>
            </div>
          </div>
        </section>

        {/* ===================== FEATURE COMPARISON TABLE (GUEST VS MEMBER) ===================== */}
        <section>
          <div className="text-center mb-10">
            <span className="text-blue-600 text-xs font-bold uppercase tracking-wider">Plan Details</span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-1">
              Guest Mode vs Free Member Account
            </h2>
            <p className="text-sm text-slate-500 max-w-xl mx-auto mt-2">
              Choose the option that fits your needs today. Both are completely free to use.
            </p>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
            <table className="w-full text-left text-xs sm:text-sm border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-700 font-bold text-xs uppercase tracking-wider">
                  <th className="p-4 sm:p-5 w-1/2">Feature</th>
                  <th className="p-4 sm:p-5 w-1/4 text-center">Guest (No Login)</th>
                  <th className="p-4 sm:p-5 w-1/4 text-center bg-blue-50/60 text-blue-700">Free Member Account</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-600">
                <tr>
                  <td className="p-4 sm:p-5 font-semibold text-slate-800">AI Receipt Photo Scanning</td>
                  <td className="p-4 sm:p-5 text-center text-emerald-600 font-bold">✓ Included</td>
                  <td className="p-4 sm:p-5 text-center text-emerald-600 font-bold bg-blue-50/20">✓ Included</td>
                </tr>
                <tr>
                  <td className="p-4 sm:p-5 font-semibold text-slate-800">Split-Screen Line Item Verification</td>
                  <td className="p-4 sm:p-5 text-center text-emerald-600 font-bold">✓ Included</td>
                  <td className="p-4 sm:p-5 text-center text-emerald-600 font-bold bg-blue-50/20">✓ Included</td>
                </tr>
                <tr>
                  <td className="p-4 sm:p-5 font-semibold text-slate-800">Instant PDF Receipt Slip Download</td>
                  <td className="p-4 sm:p-5 text-center text-emerald-600 font-bold">✓ Included</td>
                  <td className="p-4 sm:p-5 text-center text-emerald-600 font-bold bg-blue-50/20">✓ Included</td>
                </tr>
                <tr>
                  <td className="p-4 sm:p-5 font-semibold text-slate-800">Cloud Storage & Saved History</td>
                  <td className="p-4 sm:p-5 text-center text-slate-400 font-semibold">—</td>
                  <td className="p-4 sm:p-5 text-center text-emerald-600 font-bold bg-blue-50/20">✓ Unlimited in PostgreSQL</td>
                </tr>
                <tr>
                  <td className="p-4 sm:p-5 font-semibold text-slate-800">Monthly Spending Charts & Breakdown</td>
                  <td className="p-4 sm:p-5 text-center text-slate-400 font-semibold">—</td>
                  <td className="p-4 sm:p-5 text-center text-emerald-600 font-bold bg-blue-50/20">✓ Included</td>
                </tr>
                <tr>
                  <td className="p-4 sm:p-5 font-semibold text-slate-800">Export All Expenses to Excel CSV</td>
                  <td className="p-4 sm:p-5 text-center text-slate-400 font-semibold">—</td>
                  <td className="p-4 sm:p-5 text-center text-emerald-600 font-bold bg-blue-50/20">✓ Included</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        {/* ===================== CALL TO ACTION ===================== */}
        <section className="text-center pb-8">
          <div className="bg-blue-600 rounded-3xl p-8 sm:p-12 text-white shadow-lg">
            <h3 className="text-2xl sm:text-4xl font-black mb-3">Ready to scan your first receipt?</h3>
            <p className="text-blue-100 text-sm sm:text-base max-w-xl mx-auto mb-8">
              Try it right now with any grocery or restaurant receipt. No account required to get started.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5">
              <Link
                href="/scan"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-white text-blue-600 hover:bg-blue-50 font-bold text-sm px-7 py-3.5 rounded-xl shadow-md transition"
              >
                <ScanLine className="w-4 h-4" /> Start Scanning Receipts
              </Link>
              <Link
                href="/signup"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-blue-700 hover:bg-blue-800 text-white font-bold text-sm px-7 py-3.5 rounded-xl transition border border-blue-500"
              >
                <Lock className="w-4 h-4" /> Create Free Account
              </Link>
            </div>
          </div>
        </section>

      </div>
    </div>
  );
}
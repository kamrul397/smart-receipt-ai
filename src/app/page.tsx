import Link from "next/link";
import { ScanLine, LayoutDashboard, CheckCircle2, ShieldCheck, Database, Sparkles } from "lucide-react";

export default function HomePage() {
  return (
    <div className="min-h-[calc(100vh-64px)] bg-slate-50/50 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto text-center">
        {/* Tech Stack Badge */}
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs font-bold mb-6">
          <Sparkles className="w-3.5 h-3.5" /> Next.js 16 • React 19 • PostgreSQL (Neon) • Gemini Vision • Zod
        </div>

        {/* Hero Headline */}
        <h1 className="text-4xl sm:text-5xl font-black text-slate-900 tracking-tight leading-tight mb-4">
          Automated Receipt Scanning & <br className="hidden sm:inline" />
          <span className="text-blue-600">Financial Document Auditing</span>
        </h1>

        <p className="text-base sm:text-lg text-slate-600 max-w-2xl mx-auto mb-8 leading-relaxed">
          Extract vendors, line items, taxes, and grand totals from photos and PDF receipts in seconds with strict schema validation and side-by-side human reconciliation.
        </p>

        {/* Call to Actions */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
          <Link
            href="/scan"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm px-6 py-3.5 rounded-xl shadow-sm transition"
          >
            <ScanLine className="w-4 h-4" /> Start Scanning Receipts
          </Link>
          <Link
            href="/dashboard"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 font-bold text-sm px-6 py-3.5 rounded-xl transition"
          >
            <LayoutDashboard className="w-4 h-4" /> View Analytics Dashboard
          </Link>
        </div>

        {/* 3 Engineering Architecture Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
            <div className="p-3 bg-blue-50 text-blue-600 rounded-xl w-fit mb-4">
              <Sparkles className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-sm text-slate-900 mb-1">Multimodal Vision AI</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Leverages Google Gemini Vision with strict JSON structured outputs and low temperature for zero-hallucination accuracy.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
            <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl w-fit mb-4">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-sm text-slate-900 mb-1">Zod Type Safety</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Every extraction passes through Zod runtime schema validation, preventing unformatted data or missing types from entering the database.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
            <div className="p-3 bg-purple-50 text-purple-600 rounded-xl w-fit mb-4">
              <Database className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-sm text-slate-900 mb-1">Normalized PostgreSQL</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Relational data modeling with Prisma ORM, featuring cascading line items, database indexes on date and categories, and live aggregations.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
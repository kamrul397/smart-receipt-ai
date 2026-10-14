"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Receipt, Printer, ArrowLeft, Loader2, CheckCircle2 } from "lucide-react";

export default function ReportPage() {
  const [expenses, setExpenses] = useState<any[]>([]);
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const [expRes, userRes] = await Promise.all([
          fetch("/api/expenses"),
          fetch("/api/auth/me"),
        ]);
        const expData = await expRes.json();
        const userData = await userRes.json();

        if (expData.success) setExpenses(expData.data);
        if (userData.user) setUser(userData.user);
      } catch (err) {
        console.error("Failed to load report data:", err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const totalSpent = expenses.reduce((sum, e) => sum + Number(e.totalAmount || 0), 0);
  const totalTax = expenses.reduce((sum, e) => sum + Number(e.taxAmount || 0), 0);
  const currentDate = new Date().toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-3">
        <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
        <p className="text-xs text-slate-500 font-semibold">Generating formal report...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-100/60 py-8 px-4 sm:px-6">
      {/* 1. TOP ACTION BAR (Hidden when printing/saving to PDF) */}
      <div className="max-w-4xl mx-auto mb-6 flex justify-between items-center print:hidden">
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-2 text-xs font-bold text-slate-600 hover:text-slate-900 bg-white border border-slate-200 px-3.5 py-2 rounded-xl transition shadow-xs"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Dashboard
        </Link>

        <button
          onClick={() => window.print()}
          className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold px-5 py-2.5 rounded-xl shadow-sm transition cursor-pointer"
        >
          <Printer className="w-4 h-4" /> Print / Save as PDF
        </button>
      </div>

      {/* 2. THE OFFICIAL REPORT STATEMENT (Printed Area) */}
      <div className="max-w-4xl mx-auto bg-white border border-slate-200 rounded-2xl p-8 sm:p-12 shadow-sm print:border-none print:shadow-none print:p-0 print:m-0">
        
        {/* Statement Header */}
        <div className="flex justify-between items-start border-b-2 border-slate-900 pb-6 mb-8">
          <div>
            <div className="flex items-center gap-2.5 font-black text-slate-900 text-xl tracking-tight mb-1">
              <div className="p-2 bg-blue-600 text-white rounded-xl print:border print:border-slate-300">
                <Receipt className="w-5 h-5" />
              </div>
              SmartReceipt <span className="text-blue-600">AI</span>
            </div>
            <p className="text-xs text-slate-500 uppercase tracking-widest font-bold">
              Official Expense Audit & Reconciliation Statement
            </p>
          </div>

          <div className="text-right">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Statement Date</span>
            <p className="text-sm font-extrabold text-slate-900">{currentDate}</p>
            <p className="text-[11px] text-slate-500 mt-0.5">Status: Verified & Audited</p>
          </div>
        </div>

        {/* User / Account Metadata */}
        <div className="grid grid-cols-2 gap-6 bg-slate-50 border border-slate-200 rounded-xl p-4 mb-8 text-xs">
          <div>
            <span className="text-slate-400 uppercase tracking-wider font-semibold block mb-0.5">
              Account Holder
            </span>
            <p className="font-extrabold text-slate-900 text-sm">{user?.name || "Account User"}</p>
            <p className="text-slate-500">{user?.email}</p>
          </div>
          <div className="text-right">
            <span className="text-slate-400 uppercase tracking-wider font-semibold block mb-0.5">
              Audit Period
            </span>
            <p className="font-extrabold text-slate-900 text-sm">All Active Transactions</p>
            <p className="text-slate-500">{expenses.length} Total Receipts Documented</p>
          </div>
        </div>

        {/* Summary Metric Cards */}
        <div className="grid grid-cols-3 gap-4 mb-8 text-center">
          <div className="border border-slate-200 rounded-xl p-3 bg-white">
            <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Total Expenditure</span>
            <p className="text-xl font-black text-slate-900 mt-1">${totalSpent.toFixed(2)}</p>
          </div>
          <div className="border border-slate-200 rounded-xl p-3 bg-white">
            <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Total Tax / VAT</span>
            <p className="text-xl font-black text-slate-900 mt-1">${totalTax.toFixed(2)}</p>
          </div>
          <div className="border border-slate-200 rounded-xl p-3 bg-white">
            <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Audited Receipts</span>
            <p className="text-xl font-black text-slate-900 mt-1">{expenses.length}</p>
          </div>
        </div>

        {/* Itemized Transactions Table */}
        <div className="mb-8">
          <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-3">
            Itemized Receipts & Line Items Breakdown
          </h3>

          <table className="w-full text-left text-xs border border-slate-200 rounded-xl overflow-hidden">
            <thead className="bg-slate-100 text-slate-700 font-bold border-b border-slate-200 uppercase text-[10px] tracking-wider">
              <tr>
                <th className="py-2.5 px-3">Date</th>
                <th className="py-2.5 px-3">Merchant / Store</th>
                <th className="py-2.5 px-3">Category</th>
                <th className="py-2.5 px-3">Line Items Summary</th>
                <th className="py-2.5 px-3 text-right">Tax</th>
                <th className="py-2.5 px-3 text-right">Total</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {expenses.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-slate-400">
                    No transactions recorded.
                  </td>
                </tr>
              ) : (
                expenses.map((item, idx) => (
                  <tr key={item.id} className={idx % 2 === 0 ? "bg-white" : "bg-slate-50/50"}>
                    <td className="py-2.5 px-3 font-medium text-slate-600 whitespace-nowrap">
                      {new Date(item.date).toLocaleDateString()}
                    </td>
                    <td className="py-2.5 px-3 font-bold text-slate-900">{item.merchantName}</td>
                    <td className="py-2.5 px-3 text-slate-600">
                      {item.category.replace("_", " ")}
                    </td>
                    <td className="py-2.5 px-3 text-slate-500 max-w-[200px]">
                      {(item.items || []).map((line: any) => `${line.quantity}x ${line.name}`).join(", ") || "—"}
                    </td>
                    <td className="py-2.5 px-3 text-right text-slate-500">
                      ${Number(item.taxAmount || 0).toFixed(2)}
                    </td>
                    <td className="py-2.5 px-3 text-right font-black text-slate-900">
                      ${Number(item.totalAmount).toFixed(2)}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
            <tfoot className="bg-slate-100 border-t-2 border-slate-900 font-bold text-slate-900">
              <tr>
                <td colSpan={5} className="py-3 px-3 text-right uppercase text-[11px] tracking-wider">
                  Grand Total Expenditure:
                </td>
                <td className="py-3 px-3 text-right text-sm font-black">
                  ${totalSpent.toFixed(2)}
                </td>
              </tr>
            </tfoot>
          </table>
        </div>

        {/* Statement Footer */}
        <div className="border-t border-slate-200 pt-6 flex justify-between items-center text-[10px] text-slate-400">
          <div className="flex items-center gap-1.5 text-slate-500 font-medium">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            Extracted with Multimodal Gemini Vision & Validated with Zod Schema
          </div>
          <div>SmartReceipt AI Platform • Confidential Financial Record</div>
        </div>
      </div>
    </div>
  );
}

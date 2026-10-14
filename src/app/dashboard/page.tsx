"use client";

import React, { useEffect, useState } from "react";
import ExpenseTable from "@/components/ExpenseTable";
import ExpenseCharts from "@/components/ExpenseCharts";
import { exportExpensesToCSV } from "@/lib/exportCsv";
import Link from "next/link";
import {
  Plus,
  Receipt,
  DollarSign,
  PieChart as ChartIcon,
  Loader2,
  ArrowLeft,
  FileText,
  Download,
  Lock,
  ScanLine,
  Sparkles,
} from "lucide-react";

export default function DashboardPage() {
  const [expenses, setExpenses] = useState<any[]>([]);
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // Fetch logged in user and their saved expenses from Neon PostgreSQL
  useEffect(() => {
    async function loadDashboard() {
      try {
        const [userRes, expRes] = await Promise.all([
          fetch("/api/auth/me"),
          fetch("/api/expenses"),
        ]);

        const userData = await userRes.json();
        const expData = await expRes.json();

        if (userData.user) {
          setUser(userData.user);
        }
        if (expData.success) {
          setExpenses(expData.data);
        }
      } catch (err) {
        console.error("Failed to load dashboard data:", err);
      } finally {
        setLoading(false);
      }
    }
    loadDashboard();
  }, []);

  // Delete an expense with optimistic state update
  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this expense? All line items will be removed.")) {
      return;
    }

    try {
      const res = await fetch(`/api/expenses?id=${id}`, { method: "DELETE" });
      const json = await res.json();
      if (json.success) {
        setExpenses((prev) => prev.filter((e) => e.id !== id));
      } else {
        alert("Failed to delete expense: " + json.error);
      }
    } catch (err: any) {
      alert("Error deleting expense: " + err.message);
    }
  };

  // Summary Metrics calculations
  const totalSpent = expenses.reduce((sum, e) => sum + Number(e.totalAmount || 0), 0);
  const totalReceipts = expenses.length;
  const uniqueCategories = new Set(expenses.map((e) => e.category)).size;

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50/50 flex flex-col items-center justify-center gap-3">
        <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
        <p className="text-xs text-slate-500 font-semibold">Loading your financial analytics...</p>
      </div>
    );
  }

  // GUEST USER BARRIER: If not logged in, explain that history is for registered accounts
  if (!user) {
    return (
      <div className="min-h-[calc(100vh-64px)] bg-slate-50/50 flex flex-col items-center justify-center p-4 sm:px-6">
        <div className="max-w-md w-full bg-white border border-slate-200 rounded-3xl p-8 sm:p-10 text-center shadow-sm">
          <div className="w-14 h-14 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mx-auto mb-5 shadow-xs">
            <Lock className="w-7 h-7" />
          </div>
          <span className="text-xs uppercase font-extrabold tracking-wider text-blue-600 mb-1 block">
            Member Feature
          </span>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight mb-2">
            Expense History is Locked
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 leading-relaxed mb-6">
            Guest users can scan receipts and download single PDF slips anytime. To save your records permanently, track monthly spending charts, and export consolidated tax audits, log in to your account.
          </p>

          <div className="flex flex-col gap-3">
            <Link
              href="/login"
              className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl transition shadow-xs"
            >
              Log In to View History
            </Link>
            <Link
              href="/signup"
              className="w-full py-3 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl transition shadow-xs"
            >
              Create Free Account
            </Link>
            <Link
              href="/scan"
              className="w-full py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition inline-flex items-center justify-center gap-1.5"
            >
              <ScanLine className="w-4 h-4" /> Try Scanner as Guest
            </Link>
          </div>

          <div className="mt-6 pt-6 border-t border-slate-100 text-[11px] text-slate-400">
            SmartReceipt AI isolates each member&apos;s data securely in PostgreSQL.
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-64px)] bg-slate-50/50 py-4 sm:py-5 px-3 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
          <div>
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-900 transition mb-1"
            >
              <ArrowLeft className="w-3.5 h-3.5" /> Back to Home
            </Link>
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              Expense Analytics Dashboard
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">
              Welcome back, <strong className="text-slate-700">{user.name || user.email}</strong>. Review and audit your saved records.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {/* View & Print PDF Report */}
            <Link
              href="/report"
              className="inline-flex items-center gap-1.5 bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 text-xs font-bold px-3 py-2 rounded-xl shadow-xs transition"
            >
              <FileText className="w-3.5 h-3.5 text-rose-600" />
              <span>PDF Report</span>
            </Link>

            {/* CSV Export Button */}
            <button
              onClick={() => exportExpensesToCSV(expenses)}
              disabled={expenses.length === 0}
              className="inline-flex items-center gap-1.5 bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 text-xs font-bold px-3 py-2 rounded-xl shadow-xs transition disabled:opacity-50 disabled:pointer-events-none cursor-pointer"
            >
              <Download className="w-3.5 h-3.5 text-emerald-600" />
              <span>Export CSV</span>
            </button>

            {/* Scan New Receipt Button */}
            <Link
              href="/scan"
              className="inline-flex items-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold px-3.5 py-2 rounded-xl shadow-xs transition"
            >
              <Plus className="w-3.5 h-3.5" /> Scan Receipt
            </Link>
          </div>
        </div>

        {/* 3 Summary Metrics Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-4">
          <div className="bg-white border border-slate-200 rounded-2xl p-3.5 sm:p-4 shadow-xs flex items-center gap-3">
            <div className="p-2.5 bg-emerald-50 text-emerald-600 rounded-xl shrink-0">
              <DollarSign className="w-5 h-5" />
            </div>
            <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                Total Expenditure
              </p>
              <p className="text-xl sm:text-2xl font-black text-slate-900 mt-0.5">
                ${totalSpent.toFixed(2)}
              </p>
            </div>
          </div>

          <div className="bg-white border border-slate-200 rounded-2xl p-3.5 sm:p-4 shadow-xs flex items-center gap-3">
            <div className="p-2.5 bg-blue-50 text-blue-600 rounded-xl shrink-0">
              <Receipt className="w-5 h-5" />
            </div>
            <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                Audited Receipts
              </p>
              <p className="text-xl sm:text-2xl font-black text-slate-900 mt-0.5">{totalReceipts}</p>
            </div>
          </div>

          <div className="bg-white border border-slate-200 rounded-2xl p-3.5 sm:p-4 shadow-xs flex items-center gap-3">
            <div className="p-2.5 bg-purple-50 text-purple-600 rounded-xl shrink-0">
              <ChartIcon className="w-5 h-5" />
            </div>
            <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                Active Categories
              </p>
              <p className="text-xl sm:text-2xl font-black text-slate-900 mt-0.5">{uniqueCategories}</p>
            </div>
          </div>
        </div>

        {/* Analytics Grid: Left (Donut Chart) + Right (History Table) */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 lg:gap-6">
          <div className="lg:col-span-1">
            <ExpenseCharts expenses={expenses} />
          </div>
          <div className="lg:col-span-2">
            <ExpenseTable expenses={expenses} onDelete={handleDelete} />
          </div>
        </div>
      </div>
    </div>
  );
}

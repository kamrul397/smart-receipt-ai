"use client";

import React, { useEffect, useState } from "react";
import ExpenseTable from "@/components/ExpenseTable";
import ExpenseCharts from "@/components/ExpenseCharts";
import Link from "next/link";
import { Plus, Receipt, DollarSign, PieChart as ChartIcon, Loader2, ArrowLeft } from "lucide-react";

export default function DashboardPage() {
    const [expenses, setExpenses] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    // Fetch all saved expenses from Neon PostgreSQL
    const fetchExpenses = async () => {
        try {
            const res = await fetch("/api/expenses");
            const json = await res.json();
            if (json.success) {
                setExpenses(json.data);
            }
        } catch (err) {
            console.error("Failed to load expenses:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchExpenses();
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
                // Optimistic UI removal
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

    return (
        <div className="min-h-screen bg-slate-50/50 py-10 px-4 sm:px-6 lg:px-8">
            <div className="max-w-6xl mx-auto">
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
                    <div>
                        <Link
                            href="/"
                            className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-900 transition mb-2"
                        >
                            <ArrowLeft className="w-3.5 h-3.5" /> Back to Home
                        </Link>
                        <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
                            Expense Analytics Dashboard
                        </h1>
                        <p className="text-sm text-slate-500 mt-0.5">
                            Review and audit all AI-extracted financial records stored in PostgreSQL.
                        </p>
                    </div>

                    <Link
                        href="/scan"
                        className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold px-4 py-2.5 rounded-xl shadow-sm transition"
                    >
                        <Plus className="w-4 h-4" /> Scan New Receipt
                    </Link>
                </div>

                {/* 3 Summary Metrics Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
                    <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm flex items-center gap-4">
                        <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl">
                            <DollarSign className="w-6 h-6" />
                        </div>
                        <div>
                            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                                Total Expenditure
                            </p>
                            <p className="text-2xl font-black text-slate-900 mt-0.5">
                                ${totalSpent.toFixed(2)}
                            </p>
                        </div>
                    </div>

                    <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm flex items-center gap-4">
                        <div className="p-3 bg-blue-50 text-blue-600 rounded-xl">
                            <Receipt className="w-6 h-6" />
                        </div>
                        <div>
                            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                                Audited Receipts
                            </p>
                            <p className="text-2xl font-black text-slate-900 mt-0.5">{totalReceipts}</p>
                        </div>
                    </div>

                    <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm flex items-center gap-4">
                        <div className="p-3 bg-purple-50 text-purple-600 rounded-xl">
                            <ChartIcon className="w-6 h-6" />
                        </div>
                        <div>
                            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                                Active Categories
                            </p>
                            <p className="text-2xl font-black text-slate-900 mt-0.5">{uniqueCategories}</p>
                        </div>
                    </div>
                </div>

                {/* Analytics Grid: Left (Donut Chart) + Right (History Table) */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
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
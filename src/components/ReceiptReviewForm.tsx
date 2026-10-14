"use client";

import React, { useState, useEffect } from "react";
import { ExtractedReceipt, ReceiptItem } from "@/types/receipt";
import { Trash2, Plus, CheckCircle2, Printer, Lock, Sparkles, FileText, ArrowRight, FileEdit } from "lucide-react";
import Link from "next/link";

interface ReceiptReviewFormProps {
    initialData: ExtractedReceipt;
    previewUrl: string;
    onSaved: () => void;
    onCancel: () => void;
}

export default function ReceiptReviewForm({
    initialData,
    previewUrl,
    onSaved,
    onCancel,
}: ReceiptReviewFormProps) {
    const [formData, setFormData] = useState<ExtractedReceipt>(initialData);
    const [isSaving, setIsSaving] = useState(false);
    const [user, setUser] = useState<any>(null);
    const [checkingAuth, setCheckingAuth] = useState(true);

    // Check if the current visitor is logged in
    useEffect(() => {
        fetch("/api/auth/me")
            .then((res) => res.json())
            .then((data) => {
                if (data.user) setUser(data.user);
            })
            .catch(() => setUser(null))
            .finally(() => setCheckingAuth(false));
    }, []);

    // Line item change handler: auto-recalculates grand total when prices change
    const handleItemChange = (index: number, field: keyof ReceiptItem, value: any) => {
        const updatedItems = [...formData.items];
        updatedItems[index] = { ...updatedItems[index], [field]: value };

        const newTotal = updatedItems.reduce(
            (sum, item) => sum + (Number(item.price) || 0) * (Number(item.quantity) || 1),
            0
        );

        setFormData({
            ...formData,
            items: updatedItems,
            totalAmount: Number(newTotal.toFixed(2)),
        });
    };

    const handleAddItem = () => {
        setFormData({
            ...formData,
            items: [...formData.items, { name: "New Item", price: 0, quantity: 1 }],
        });
    };

    const handleDeleteItem = (index: number) => {
        const updatedItems = formData.items.filter((_, i) => i !== index);
        const newTotal = updatedItems.reduce(
            (sum, item) => sum + (Number(item.price) || 0) * (Number(item.quantity) || 1),
            0
        );

        setFormData({
            ...formData,
            items: updatedItems,
            totalAmount: Number(newTotal.toFixed(2)),
        });
    };

    // Print or download PDF using browser print
    const handlePrintReceipt = () => {
        window.print();
    };

    // Submit verified data to PostgreSQL via /api/expenses (for logged-in users)
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user) {
            alert("Please log in or sign up to save expenses to your permanent cloud history.");
            return;
        }

        setIsSaving(true);
        try {
            const res = await fetch("/api/expenses", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    ...formData,
                    receiptUrl: previewUrl,
                }),
            });

            if (!res.ok) {
                const errorData = await res.json();
                throw new Error(errorData.error || "Failed to save expense");
            }

            onSaved();
        } catch (err: any) {
            alert(err.message);
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div>
            {/* ============================================================== */}
            {/* PRINT-ONLY SINGLE RECEIPT VOUCHER (Visible when printing / PDF) */}
            {/* ============================================================== */}
            <div className="hidden print:block p-8 bg-white max-w-2xl mx-auto font-sans text-slate-900">
                <div className="border-b-2 border-slate-900 pb-4 mb-6 flex justify-between items-start">
                    <div>
                        <h1 className="text-2xl font-black tracking-tight text-slate-900 uppercase">Receipt Audit Voucher</h1>
                        <p className="text-xs text-slate-500 mt-1">SmartReceipt AI • Verified Document Record</p>
                    </div>
                    <div className="text-right text-xs text-slate-600">
                        <p className="font-bold text-slate-900">{new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}</p>
                        <p>Status: <span className="text-emerald-700 font-bold">VERIFIED</span></p>
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-6 text-xs bg-slate-50 p-4 rounded-lg border border-slate-200">
                    <div>
                        <span className="text-slate-400 font-semibold block uppercase text-[10px]">Merchant</span>
                        <strong className="text-sm text-slate-900">{formData.merchantName || "Unspecified"}</strong>
                    </div>
                    <div>
                        <span className="text-slate-400 font-semibold block uppercase text-[10px]">Receipt Date</span>
                        <strong className="text-sm text-slate-900">{formData.date ? formData.date.slice(0, 10) : "N/A"}</strong>
                    </div>
                    <div>
                        <span className="text-slate-400 font-semibold block uppercase text-[10px]">Category</span>
                        <strong className="text-slate-800">{formData.category}</strong>
                    </div>
                    <div>
                        <span className="text-slate-400 font-semibold block uppercase text-[10px]">Currency</span>
                        <strong className="text-slate-800">{formData.currency}</strong>
                    </div>
                </div>

                <table className="w-full text-xs text-left mb-6 border-collapse">
                    <thead>
                        <tr className="border-b border-slate-300 text-slate-500 uppercase text-[10px]">
                            <th className="py-2">Line Item</th>
                            <th className="py-2 text-center">Qty</th>
                            <th className="py-2 text-right">Unit Price</th>
                            <th className="py-2 text-right">Total</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200">
                        {formData.items.map((item, idx) => (
                            <tr key={idx}>
                                <td className="py-2 font-medium">{item.name}</td>
                                <td className="py-2 text-center">{item.quantity}</td>
                                <td className="py-2 text-right">${Number(item.price).toFixed(2)}</td>
                                <td className="py-2 text-right font-bold">${(Number(item.price) * Number(item.quantity)).toFixed(2)}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                <div className="border-t border-slate-300 pt-3 flex flex-col items-end gap-1.5 text-xs">
                    <div className="flex justify-between w-48 text-slate-600">
                        <span>Tax / VAT:</span>
                        <span className="font-semibold">${Number(formData.taxAmount || 0).toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between w-48 text-sm font-black text-slate-900 border-t border-slate-200 pt-2">
                        <span>Grand Total:</span>
                        <span>${Number(formData.totalAmount).toFixed(2)} {formData.currency}</span>
                    </div>
                </div>

                {previewUrl && (
                    <div className="mt-8 pt-6 border-t border-slate-200 text-center">
                        <span className="text-[10px] text-slate-400 uppercase font-bold block mb-2">Original Receipt Photo Scan</span>
                        <img src={previewUrl} alt="Receipt" className="max-h-64 mx-auto border rounded p-1 object-contain" />
                    </div>
                )}
            </div>

            {/* ============================================================== */}
            {/* SCREEN VIEW (Split-Screen Interactive Review)                  */}
            {/* ============================================================== */}
            <div className="print:hidden space-y-2.5">
                {/* Guest Callout Banner */}
                {!checkingAuth && !user && (
                    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-2.5 sm:p-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2 shadow-xs">
                        <div className="flex items-center gap-2.5">
                            <div className="p-1.5 bg-blue-600 text-white rounded-lg shrink-0">
                                <Sparkles className="w-3.5 h-3.5" />
                            </div>
                            <p className="text-xs text-slate-700">
                                <strong className="font-bold text-slate-900">Guest Mode:</strong> Instant PDF download ready. <Link href="/signup" className="underline font-bold text-blue-600 hover:text-blue-700">Sign Up</Link> to save to cloud history.
                            </p>
                        </div>
                        <div className="flex items-center gap-1.5 shrink-0">
                            <Link
                                href="/signup"
                                className="px-2.5 py-1 bg-blue-600 hover:bg-blue-700 text-white text-[11px] font-bold rounded-md transition shadow-xs"
                            >
                                Sign Up Free
                            </Link>
                            <Link
                                href="/login"
                                className="px-2.5 py-1 bg-white hover:bg-slate-50 border border-slate-300 text-slate-700 text-[11px] font-semibold rounded-md transition"
                            >
                                Log In
                            </Link>
                        </div>
                    </div>
                )}

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 lg:gap-4 bg-white border border-slate-200 rounded-2xl p-3.5 sm:p-4 shadow-xs">
                    {/* LEFT COLUMN: Receipt Inspection */}
                    <div className="flex flex-col">
                        <div className="flex items-center justify-between mb-1.5">
                            <h3 className="text-[11px] font-bold text-slate-700 uppercase tracking-wider">
                                Original Receipt
                            </h3>
                            <span className="text-[11px] text-slate-500">Inspection View</span>
                        </div>
                        <div className="border border-slate-200 rounded-xl overflow-hidden bg-slate-50 flex items-center justify-center p-2 h-[340px] sm:h-[390px] lg:h-[430px]">
                            {previewUrl ? (
                                <img
                                    src={previewUrl}
                                    alt="Uploaded receipt preview"
                                    className="max-h-full max-w-full object-contain rounded-md"
                                />
                            ) : (
                                <div className="text-center p-4 max-w-xs">
                                    <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center mx-auto mb-2">
                                        <FileEdit className="w-5 h-5" />
                                    </div>
                                    <h4 className="font-bold text-xs text-slate-900 mb-0.5">Manual Entry Mode</h4>
                                    <p className="text-[11px] text-slate-500 leading-relaxed">
                                        No receipt image attached. Fill out the vendor, date, and line items to audit this expense.
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* RIGHT COLUMN: Interactive Form */}
                    <form onSubmit={handleSubmit} className="flex flex-col justify-between">
                        <div className="flex flex-col gap-2.5">
                            <div className="flex justify-between items-center border-b border-slate-100 pb-2">
                                <div>
                                    <h3 className="text-xs sm:text-sm font-bold text-slate-900">Extracted Financial Data</h3>
                                    <p className="text-[11px] text-slate-500">Verify and adjust fields before saving</p>
                                </div>
                                <span className="inline-flex items-center gap-1 text-[10px] bg-emerald-50 text-emerald-700 font-semibold px-2 py-0.5 rounded-full border border-emerald-200">
                                    <CheckCircle2 className="w-3 h-3" /> Validated by Zod
                                </span>
                            </div>

                            {/* Vendor & Date */}
                            <div className="grid grid-cols-2 gap-2.5">
                                <div>
                                    <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                                        Merchant / Store
                                    </label>
                                    <input
                                        type="text"
                                        value={formData.merchantName}
                                        onChange={(e) => setFormData({ ...formData, merchantName: e.target.value })}
                                        className="w-full px-2.5 py-1.5 text-xs border border-slate-300 rounded-lg focus:ring-1 focus:ring-blue-500 focus:outline-none"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-[11px] font-semibold text-slate-700 mb-1">Date</label>
                                    <input
                                        type="date"
                                        value={formData.date ? formData.date.slice(0, 10) : ""}
                                        onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                                        className="w-full px-2.5 py-1.5 text-xs border border-slate-300 rounded-lg focus:ring-1 focus:ring-blue-500 focus:outline-none"
                                        required
                                    />
                                </div>
                            </div>

                            {/* Category & Currency */}
                            <div className="grid grid-cols-2 gap-2.5">
                                <div>
                                    <label className="block text-[11px] font-semibold text-slate-700 mb-1">Category</label>
                                    <select
                                        value={formData.category}
                                        onChange={(e) => setFormData({ ...formData, category: e.target.value as any })}
                                        className="w-full px-2.5 py-1.5 text-xs border border-slate-300 rounded-lg focus:ring-1 focus:ring-blue-500 focus:outline-none bg-white"
                                    >
                                        <option value="MEALS">Meals & Dining</option>
                                        <option value="TRAVEL">Travel & Transport</option>
                                        <option value="OFFICE">Office Supplies</option>
                                        <option value="SOFTWARE">Software & Tech</option>
                                        <option value="UTILITIES">Utilities</option>
                                        <option value="OTHER">Other / Miscellaneous</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-[11px] font-semibold text-slate-700 mb-1">Currency</label>
                                    <input
                                        type="text"
                                        value={formData.currency}
                                        onChange={(e) => setFormData({ ...formData, currency: e.target.value })}
                                        className="w-full px-2.5 py-1.5 text-xs border border-slate-300 rounded-lg focus:ring-1 focus:ring-blue-500 focus:outline-none"
                                        required
                                    />
                                </div>
                            </div>

                            {/* Line Items Table */}
                            <div>
                                <div className="flex justify-between items-center mb-1">
                                    <label className="text-[11px] font-semibold text-slate-700">Line Items</label>
                                    <button
                                        type="button"
                                        onClick={handleAddItem}
                                        className="inline-flex items-center gap-1 text-[11px] font-bold text-blue-600 hover:text-blue-700"
                                    >
                                        <Plus className="w-3 h-3" /> Add Item
                                    </button>
                                </div>

                                <div className="border border-slate-200 rounded-lg overflow-hidden max-h-32 sm:max-h-36 overflow-y-auto">
                                    <table className="w-full text-left text-xs border-collapse">
                                        <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 sticky top-0 text-[10px]">
                                            <tr>
                                                <th className="py-1 px-2 font-medium">Item Name</th>
                                                <th className="py-1 px-1 font-medium w-12 text-center">Qty</th>
                                                <th className="py-1 px-2 font-medium w-20 text-right">Price</th>
                                                <th className="py-1 px-1 font-medium w-6"></th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-slate-100">
                                            {formData.items.map((item, idx) => (
                                                <tr key={idx} className="hover:bg-slate-50/50">
                                                    <td className="p-1">
                                                        <input
                                                            type="text"
                                                            value={item.name}
                                                            onChange={(e) => handleItemChange(idx, "name", e.target.value)}
                                                            className="w-full px-1.5 py-0.5 text-xs border border-transparent hover:border-slate-300 rounded focus:border-blue-500 focus:outline-none"
                                                        />
                                                    </td>
                                                    <td className="p-1">
                                                        <input
                                                            type="number"
                                                            min="1"
                                                            value={item.quantity}
                                                            onChange={(e) => handleItemChange(idx, "quantity", Number(e.target.value))}
                                                            className="w-full px-1 py-0.5 text-xs text-center border border-transparent hover:border-slate-300 rounded focus:border-blue-500 focus:outline-none"
                                                        />
                                                    </td>
                                                    <td className="p-1">
                                                        <input
                                                            type="number"
                                                            step="0.01"
                                                            value={item.price}
                                                            onChange={(e) => handleItemChange(idx, "price", Number(e.target.value))}
                                                            className="w-full px-1.5 py-0.5 text-xs text-right border border-transparent hover:border-slate-300 rounded focus:border-blue-500 focus:outline-none"
                                                        />
                                                    </td>
                                                    <td className="p-1 text-center">
                                                        <button
                                                            type="button"
                                                            onClick={() => handleDeleteItem(idx)}
                                                            className="text-slate-400 hover:text-red-500 transition"
                                                        >
                                                            <Trash2 className="w-3 h-3" />
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>

                            {/* Tax & Total Summary Card */}
                            <div className="bg-slate-50 border border-slate-200 rounded-xl p-2.5 flex justify-between items-center">
                                <div className="flex items-center gap-1.5">
                                    <span className="text-[11px] text-slate-600 font-medium">Tax / VAT:</span>
                                    <input
                                        type="number"
                                        step="0.01"
                                        value={formData.taxAmount || 0}
                                        onChange={(e) => setFormData({ ...formData, taxAmount: Number(e.target.value) })}
                                        className="w-20 px-2 py-0.5 text-xs border border-slate-300 rounded-md bg-white"
                                    />
                                </div>
                                <div className="text-right">
                                    <span className="text-[11px] text-slate-500 mr-1.5">Grand Total:</span>
                                    <span className="text-base font-extrabold text-slate-900">
                                        ${Number(formData.totalAmount).toFixed(2)}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex flex-col sm:flex-row gap-2 pt-2.5 border-t border-slate-100 mt-2.5">
                            <button
                                type="button"
                                onClick={onCancel}
                                className="py-2 px-3 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition"
                            >
                                Scan Another
                            </button>

                            {/* Print / Save Single PDF */}
                            <button
                                type="button"
                                onClick={handlePrintReceipt}
                                className="py-2 px-3 text-xs font-bold text-slate-800 bg-white border border-slate-300 hover:bg-slate-50 rounded-xl transition inline-flex items-center justify-center gap-1.5 shadow-xs"
                            >
                                <Printer className="w-3.5 h-3.5 text-blue-600" /> Print PDF Slip
                            </button>

                            {/* Save to History Button */}
                            {user ? (
                                <button
                                    type="submit"
                                    disabled={isSaving}
                                    className="flex-1 py-2 px-3 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl transition disabled:opacity-50 shadow-xs"
                                >
                                    {isSaving ? "Saving..." : "Confirm & Save Expense"}
                                </button>
                            ) : (
                                <Link
                                    href="/signup"
                                    className="flex-1 py-2 px-3 text-xs font-bold text-center text-white bg-blue-600 hover:bg-blue-700 rounded-xl transition shadow-xs inline-flex items-center justify-center gap-1.5"
                                >
                                    <Lock className="w-3 h-3" /> Sign Up to Save
                                </Link>
                            )}
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
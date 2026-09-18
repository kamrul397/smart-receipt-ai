"use client";

import React, { useState } from "react";
import { ExtractedReceipt, ReceiptItem } from "@/types/receipt";
import { Trash2, Plus, CheckCircle2 } from "lucide-react";

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

    // Submit verified data to PostgreSQL via /api/expenses
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
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
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 bg-white border border-slate-200 rounded-2xl p-6 lg:p-8 shadow-sm">
            {/* LEFT COLUMN: Receipt Inspection */}
            <div className="flex flex-col">
                <div className="flex items-center justify-between mb-3">
                    <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                        Original Receipt
                    </h3>
                    <span className="text-xs text-slate-500">Inspection View</span>
                </div>
                <div className="border border-slate-200 rounded-xl overflow-hidden bg-slate-50 flex items-center justify-center p-3 min-h-[450px]">
                    <img
                        src={previewUrl}
                        alt="Uploaded receipt preview"
                        className="max-h-[600px] w-auto object-contain rounded-lg shadow-sm"
                    />
                </div>
            </div>

            {/* RIGHT COLUMN: Interactive Form */}
            <form onSubmit={handleSubmit} className="flex flex-col justify-between">
                <div className="flex flex-col gap-5">
                    <div className="flex justify-between items-center border-b border-slate-100 pb-3">
                        <div>
                            <h3 className="text-sm font-bold text-slate-900">Extracted Financial Data</h3>
                            <p className="text-xs text-slate-500">Verify and adjust fields before saving</p>
                        </div>
                        <span className="inline-flex items-center gap-1 text-[11px] bg-emerald-50 text-emerald-700 font-semibold px-2.5 py-1 rounded-full border border-emerald-200">
                            <CheckCircle2 className="w-3.5 h-3.5" /> Validated by Zod
                        </span>
                    </div>

                    {/* Vendor & Date */}
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                                Merchant / Store
                            </label>
                            <input
                                type="text"
                                value={formData.merchantName}
                                onChange={(e) => setFormData({ ...formData, merchantName: e.target.value })}
                                className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-semibold text-slate-700 mb-1.5">Date</label>
                            <input
                                type="date"
                                value={formData.date.slice(0, 10)}
                                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                                className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                                required
                            />
                        </div>
                    </div>

                    {/* Category & Currency */}
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-semibold text-slate-700 mb-1.5">Category</label>
                            <select
                                value={formData.category}
                                onChange={(e) => setFormData({ ...formData, category: e.target.value as any })}
                                className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none bg-white"
                            >
                                <option value="FOOD_DINING">Food & Dining</option>
                                <option value="TRAVEL_TRANSPORT">Travel & Transport</option>
                                <option value="OFFICE_SUPPLIES">Office Supplies</option>
                                <option value="SOFTWARE_TECH">Software & Tech</option>
                                <option value="UTILITIES">Utilities</option>
                                <option value="HEALTHCARE">Healthcare</option>
                                <option value="ENTERTAINMENT">Entertainment</option>
                                <option value="OTHER">Other</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-xs font-semibold text-slate-700 mb-1.5">Currency</label>
                            <input
                                type="text"
                                value={formData.currency}
                                onChange={(e) => setFormData({ ...formData, currency: e.target.value })}
                                className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                            />
                        </div>
                    </div>

                    {/* Line Items Table */}
                    <div>
                        <div className="flex justify-between items-center mb-2">
                            <label className="block text-xs font-semibold text-slate-700">Line Items</label>
                            <button
                                type="button"
                                onClick={handleAddItem}
                                className="text-xs text-blue-600 hover:text-blue-700 font-semibold flex items-center gap-1"
                            >
                                <Plus className="w-3.5 h-3.5" /> Add Item
                            </button>
                        </div>

                        <div className="border border-slate-200 rounded-xl overflow-hidden max-h-52 overflow-y-auto">
                            <table className="w-full text-left text-xs">
                                <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold">
                                    <tr>
                                        <th className="py-2.5 px-3">Item Description</th>
                                        <th className="py-2.5 px-3 w-16 text-center">Qty</th>
                                        <th className="py-2.5 px-3 w-28 text-right">Price</th>
                                        <th className="py-2.5 px-2 w-10 text-center"></th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                    {formData.items.map((item, idx) => (
                                        <tr key={idx} className="hover:bg-slate-50/50">
                                            <td className="p-2">
                                                <input
                                                    type="text"
                                                    value={item.name}
                                                    onChange={(e) => handleItemChange(idx, "name", e.target.value)}
                                                    className="w-full px-2 py-1 border border-transparent hover:border-slate-300 rounded focus:border-blue-500 focus:outline-none"
                                                />
                                            </td>
                                            <td className="p-2">
                                                <input
                                                    type="number"
                                                    min="1"
                                                    value={item.quantity}
                                                    onChange={(e) => handleItemChange(idx, "quantity", Number(e.target.value))}
                                                    className="w-full px-1 py-1 text-center border border-transparent hover:border-slate-300 rounded focus:border-blue-500 focus:outline-none"
                                                />
                                            </td>
                                            <td className="p-2">
                                                <input
                                                    type="number"
                                                    step="0.01"
                                                    value={item.price}
                                                    onChange={(e) => handleItemChange(idx, "price", Number(e.target.value))}
                                                    className="w-full px-2 py-1 text-right border border-transparent hover:border-slate-300 rounded focus:border-blue-500 focus:outline-none"
                                                />
                                            </td>
                                            <td className="p-2 text-center">
                                                <button
                                                    type="button"
                                                    onClick={() => handleDeleteItem(idx)}
                                                    className="text-slate-400 hover:text-red-500 transition"
                                                >
                                                    <Trash2 className="w-3.5 h-3.5" />
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* Tax & Total Summary Card */}
                    <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 flex justify-between items-center">
                        <div className="flex items-center gap-2">
                            <span className="text-xs text-slate-600 font-medium">Tax / VAT:</span>
                            <input
                                type="number"
                                step="0.01"
                                value={formData.taxAmount || 0}
                                onChange={(e) => setFormData({ ...formData, taxAmount: Number(e.target.value) })}
                                className="w-24 px-2.5 py-1 text-xs border border-slate-300 rounded-md bg-white"
                            />
                        </div>
                        <div className="text-right">
                            <span className="text-xs text-slate-500 mr-2">Grand Total:</span>
                            <span className="text-lg font-extrabold text-slate-900">
                                ${Number(formData.totalAmount).toFixed(2)}
                            </span>
                        </div>
                    </div>
                </div>

                {/* Buttons */}
                <div className="flex gap-3 pt-6 border-t border-slate-100 mt-6">
                    <button
                        type="button"
                        onClick={onCancel}
                        className="flex-1 py-2.5 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition"
                    >
                        Cancel / Upload Another
                    </button>
                    <button
                        type="submit"
                        disabled={isSaving}
                        className="flex-1 py-2.5 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition disabled:opacity-50"
                    >
                        {isSaving ? "Saving to PostgreSQL..." : "Confirm & Save Expense"}
                    </button>
                </div>
            </form>
        </div>
    );
}
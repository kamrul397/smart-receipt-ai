"use client";

import React, { useState } from "react";
import { Trash2, Search, Filter } from "lucide-react";

interface ExpenseTableProps {
    expenses: any[];
    onDelete: (id: string) => void;
}

export default function ExpenseTable({ expenses, onDelete }: ExpenseTableProps) {
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("ALL");

    // Client-side filtering by search keyword and category
    const filtered = expenses.filter((e) => {
        const matchesSearch = e.merchantName.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCat = selectedCategory === "ALL" || e.category === selectedCategory;
        return matchesSearch && matchesCat;
    });

    return (
        <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
            {/* Search & Category Filter Toolbar */}
            <div className="p-4 border-b border-slate-100 flex flex-col sm:flex-row gap-3 justify-between items-center bg-slate-50/60">
                <div className="relative w-full sm:w-72">
                    <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                        type="text"
                        placeholder="Search merchant or store..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-9 pr-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                    />
                </div>

                <div className="flex items-center gap-2 w-full sm:w-auto">
                    <Filter className="w-3.5 h-3.5 text-slate-400 hidden sm:block" />
                    <select
                        value={selectedCategory}
                        onChange={(e) => setSelectedCategory(e.target.value)}
                        className="w-full sm:w-48 px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                    >
                        <option value="ALL">All Categories</option>
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
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                    <thead className="bg-slate-50/80 text-slate-600 border-b border-slate-200 uppercase tracking-wider font-bold">
                        <tr>
                            <th className="py-3 px-4">Merchant / Vendor</th>
                            <th className="py-3 px-4">Date</th>
                            <th className="py-3 px-4">Category</th>
                            <th className="py-3 px-4">Items Count</th>
                            <th className="py-3 px-4 text-right">Total</th>
                            <th className="py-3 px-4 text-center">Action</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {filtered.length === 0 ? (
                            <tr>
                                <td colSpan={6} className="py-12 text-center text-slate-400">
                                    No matching expenses found.
                                </td>
                            </tr>
                        ) : (
                            filtered.map((item) => (
                                <tr key={item.id} className="hover:bg-slate-50/80 transition">
                                    <td className="py-3.5 px-4 font-semibold text-slate-900">
                                        {item.merchantName}
                                    </td>
                                    <td className="py-3.5 px-4 text-slate-500">
                                        {new Date(item.date).toLocaleDateString("en-US", {
                                            year: "numeric",
                                            month: "short",
                                            day: "numeric",
                                        })}
                                    </td>
                                    <td className="py-3.5 px-4">
                                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-blue-50 text-blue-700 border border-blue-200">
                                            {item.category.replace("_", " ")}
                                        </span>
                                    </td>
                                    <td className="py-3.5 px-4 text-slate-500">
                                        {item.items?.length || 0} line item{item.items?.length === 1 ? "" : "s"}
                                    </td>
                                    <td className="py-3.5 px-4 text-right font-extrabold text-slate-900">
                                        ${Number(item.totalAmount).toFixed(2)}
                                    </td>
                                    <td className="py-3.5 px-4 text-center">
                                        <button
                                            onClick={() => onDelete(item.id)}
                                            className="text-slate-400 hover:text-red-600 p-1.5 rounded-md hover:bg-red-50 transition"
                                            title="Delete expense"
                                        >
                                            <Trash2 className="w-4 h-4 inline" />
                                        </button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
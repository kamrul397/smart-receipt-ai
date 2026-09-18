"use client";

import React from "react";
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip, Legend } from "recharts";

interface ExpenseChartsProps {
    expenses: any[];
}

const COLORS = ["#3b82f6", "#10b981", "#f59e0b", "#8b5cf6", "#ec4899", "#06b6d4", "#64748b"];

export default function ExpenseCharts({ expenses }: ExpenseChartsProps) {
    // Aggregate total amount spent per category
    const categoryTotals = expenses.reduce((acc: Record<string, number>, exp) => {
        const cat = exp.category.replace("_", " ");
        acc[cat] = (acc[cat] || 0) + exp.totalAmount;
        return acc;
    }, {});

    const data = Object.keys(categoryTotals).map((key) => ({
        name: key,
        value: Number(categoryTotals[key].toFixed(2)),
    }));

    if (data.length === 0) {
        return (
            <div className="h-64 flex items-center justify-center text-slate-400 text-xs border border-dashed border-slate-200 rounded-2xl bg-white">
                No expense data yet. Scan a receipt to see category breakdown.
            </div>
        );
    }

    return (
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
            <h3 className="text-sm font-bold text-slate-800 mb-1">Spending by Category</h3>
            <p className="text-xs text-slate-400 mb-4">Distribution across expense types</p>

            <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                        <Pie
                            data={data}
                            dataKey="value"
                            nameKey="name"
                            cx="50%"
                            cy="50%"
                            innerRadius={55}
                            outerRadius={80}
                            paddingAngle={4}
                        >
                            {data.map((_, index) => (
                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                        </Pie>
                        <Tooltip formatter={(value: any) => [`$${value}`, "Total Spent"]} />
                        <Legend wrapperStyle={{ fontSize: "11px", paddingTop: "8px" }} />
                    </PieChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}
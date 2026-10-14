"use client";

import React, { useState, useEffect } from "react";
import FileUploadZone from "@/components/FileUploadZone";
import ReceiptReviewForm from "@/components/ReceiptReviewForm";
import { ExtractedReceipt } from "@/types/receipt";
import { useRouter } from "next/navigation";
import { ArrowLeft, AlertTriangle, PenLine, Sparkles } from "lucide-react";
import Link from "next/link";

export default function ScanPage() {
    const router = useRouter();
    const [isScanning, setIsScanning] = useState(false);
    const [scanError, setScanError] = useState<string | null>(null);
    const [extractedData, setExtractedData] = useState<ExtractedReceipt | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string>("");
    const [user, setUser] = useState<any>(null);

    // Check if visitor is already logged in
    useEffect(() => {
        fetch("/api/auth/me")
            .then((res) => res.json())
            .then((data) => {
                if (data.user) setUser(data.user);
            })
            .catch(() => setUser(null));
    }, []);

    const handleFileSelected = async (base64: string, mimeType: string, dataUrl: string) => {
        setPreviewUrl(dataUrl);
        setIsScanning(true);
        setScanError(null);

        try {
            const res = await fetch("/api/scan-receipt", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    imageBase64: base64,
                    mimeType: mimeType,
                }),
            });

            const json = await res.json();
            if (!res.ok) {
                if (json.notReceipt) {
                    setScanError(
                        "Please upload a receipt or bill. The uploaded image does not appear to be a receipt, ticket, or invoice."
                    );
                    setPreviewUrl("");
                    return;
                }
                throw new Error(json.error || "Failed to scan receipt image.");
            }

            setExtractedData(json.data);
        } catch (err: any) {
            console.error("Scanning Error:", err);
            setScanError(err.message || "An unexpected error occurred while scanning.");
            setPreviewUrl("");
        } finally {
            setIsScanning(false);
        }
    };

    // Manual Entry: opens review form directly with blank fields
    const handleManualEntry = () => {
        setScanError(null);
        setPreviewUrl("");
        setExtractedData({
            merchantName: "",
            date: new Date().toISOString().slice(0, 10),
            totalAmount: 0,
            taxAmount: 0,
            currency: "USD",
            category: "OTHER",
            items: [{ name: "General Expense", price: 0, quantity: 1 }],
        });
    };

    return (
        <div className="min-h-[calc(100vh-64px)] bg-slate-50/50 py-3 sm:py-5 px-3 sm:px-6 lg:px-8 flex flex-col justify-center">
            <div className="max-w-6xl mx-auto w-full">
                {/* Navigation & Header */}
                <div className="mb-3 sm:mb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div>
                        <Link
                            href="/"
                            className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-900 transition mb-1"
                        >
                            <ArrowLeft className="w-3.5 h-3.5" /> Back to Overview
                        </Link>
                        <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                            Receipt &amp; Invoice Scanner
                        </h1>
                        <p className="text-xs text-slate-500 mt-0.5">
                            Upload any receipt photo to auto-extract details with AI, or enter an expense manually.
                        </p>
                    </div>
                </div>

                {/* Friendly Warning Banner if not a receipt */}
                {scanError && (
                    <div className="max-w-lg mx-auto mb-4 p-4 bg-amber-50 border border-amber-200 rounded-xl shadow-xs">
                        <div className="flex items-start gap-3">
                            <div className="p-2 bg-amber-100 text-amber-800 rounded-lg shrink-0 mt-0.5">
                                <AlertTriangle className="w-4 h-4" />
                            </div>
                            <div className="flex-1">
                                <h3 className="text-xs font-bold text-amber-900 mb-0.5">
                                    Please upload a receipt or bill
                                </h3>
                                <p className="text-xs text-amber-800 leading-relaxed mb-3">
                                    {scanError} Make sure the photo clearly shows store details, items, or a total price.
                                </p>
                                <div className="flex flex-wrap items-center gap-2">
                                    <button
                                        type="button"
                                        onClick={() => setScanError(null)}
                                        className="px-3 py-1 bg-white border border-amber-300 hover:bg-amber-100 text-amber-900 text-xs font-semibold rounded-lg transition shadow-xs"
                                    >
                                        Upload Another Photo
                                    </button>
                                    <button
                                        type="button"
                                        onClick={handleManualEntry}
                                        className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-lg transition shadow-xs inline-flex items-center gap-1.5"
                                    >
                                        <PenLine className="w-3.5 h-3.5" /> Type Details Manually
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Dynamic View: Upload Zone OR Split-Screen Review */}
                {!extractedData ? (
                    <div className="max-w-lg mx-auto">
                        <div className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-200 shadow-xs">
                            <FileUploadZone onFileSelected={handleFileSelected} isScanning={isScanning} />

                            {/* Manual Entry Fallback Link */}
                            <div className="mt-4 pt-3.5 border-t border-slate-100 text-center">
                                <p className="text-xs text-slate-500 mb-2">
                                    Don&apos;t have a paper receipt or paid with cash?
                                </p>
                                <button
                                    type="button"
                                    onClick={handleManualEntry}
                                    className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-600 hover:text-blue-700 bg-blue-50 hover:bg-blue-100 px-3.5 py-2 rounded-xl transition"
                                >
                                    <PenLine className="w-3.5 h-3.5" /> Enter Expense Details Manually
                                </button>
                            </div>
                        </div>

                        {/* Informative text for guest users (Never forced!) */}
                        {!user && (
                            <div className="mt-3.5 p-3.5 bg-slate-50 border border-slate-200/90 rounded-xl text-left shadow-xs">
                                <div className="flex items-center gap-1.5 text-xs font-bold text-slate-800 mb-1">
                                    <Sparkles className="w-3.5 h-3.5 text-blue-600" />
                                    <span>Why create a free account? (Optional)</span>
                                </div>
                                <p className="text-[11px] text-slate-500 mb-2 leading-relaxed">
                                    You can scan receipts and download single PDF slips anytime for free without signing up. Creating a free account unlocks:
                                </p>
                                <ul className="text-[11px] text-slate-600 space-y-1 pl-3.5 list-disc leading-relaxed">
                                    <li>
                                        <strong className="text-slate-800">Permanent Cloud Vault:</strong> Saves past receipts safely in PostgreSQL so you never lose an expense.
                                    </li>
                                    <li>
                                        <strong className="text-slate-800">Monthly Spending Charts:</strong> Automatically groups expenses by category (Meals, Travel, Software).
                                    </li>
                                    <li>
                                        <strong className="text-slate-800">Accounting Exports:</strong> 1-click full CSV spreadsheets and multi-receipt audit statements.
                                    </li>
                                </ul>
                                <div className="mt-2.5 pt-2 border-t border-slate-200/60 flex items-center justify-between text-[11px]">
                                    <span className="text-slate-500">Already a member?</span>
                                    <Link href="/login" className="text-blue-600 font-bold hover:underline">
                                        Log in to your account &rarr;
                                    </Link>
                                </div>
                            </div>
                        )}
                    </div>
                ) : (
                    <ReceiptReviewForm
                        initialData={extractedData}
                        previewUrl={previewUrl}
                        onSaved={() => router.push("/dashboard")}
                        onCancel={() => {
                            setExtractedData(null);
                            setPreviewUrl("");
                            setScanError(null);
                        }}
                    />
                )}
            </div>
        </div>
    );
}
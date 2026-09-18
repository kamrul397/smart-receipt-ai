"use client";

import React, { useState } from "react";
import FileUploadZone from "@/components/FileUploadZone";
import ReceiptReviewForm from "@/components/ReceiptReviewForm";
import { ExtractedReceipt } from "@/types/receipt";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function ScanPage() {
    const router = useRouter();
    const [isScanning, setIsScanning] = useState(false);
    const [extractedData, setExtractedData] = useState<ExtractedReceipt | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string>("");

    const handleFileSelected = async (base64: string, mimeType: string, dataUrl: string) => {
        setPreviewUrl(dataUrl);
        setIsScanning(true);

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
                throw new Error(json.error || "Failed to scan receipt image.");
            }

            setExtractedData(json.data);
        } catch (err: any) {
            console.error("Scanning Error:", err);
            alert(err.message || "An unexpected error occurred while scanning.");
        } finally {
            setIsScanning(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-50/50 py-10 px-4 sm:px-6 lg:px-8">
            <div className="max-w-6xl mx-auto">
                {/* Navigation & Header */}
                <div className="mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                        <Link
                            href="/"
                            className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-900 transition mb-2"
                        >
                            <ArrowLeft className="w-3.5 h-3.5" /> Back to Overview
                        </Link>
                        <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
                            Receipt & Invoice Scanner
                        </h1>
                        <p className="text-sm text-slate-500 mt-0.5">
                            Upload any document to extract merchant details, line items, and totals automatically.
                        </p>
                    </div>
                </div>

                {/* Dynamic View: Upload Zone OR Split-Screen Review */}
                {!extractedData ? (
                    <div className="max-w-xl mx-auto mt-8 bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-sm">
                        <FileUploadZone onFileSelected={handleFileSelected} isScanning={isScanning} />
                    </div>
                ) : (
                    <ReceiptReviewForm
                        initialData={extractedData}
                        previewUrl={previewUrl}
                        onSaved={() => router.push("/dashboard")}
                        onCancel={() => {
                            setExtractedData(null);
                            setPreviewUrl("");
                        }}
                    />
                )}
            </div>
        </div>
    );
}
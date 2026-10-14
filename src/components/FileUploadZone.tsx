"use client";

import React, { useState, useRef } from "react";
import { UploadCloud, Loader2 } from "lucide-react";

interface FileUploadZoneProps {
    onFileSelected: (base64: string, mimeType: string, previewUrl: string) => void;
    isScanning: boolean;
}

export default function FileUploadZone({ onFileSelected, isScanning }: FileUploadZoneProps) {
    const [dragActive, setDragActive] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const processFile = (file: File) => {
        if (!file) return;

        // Validate supported file types
        const validTypes = ["image/jpeg", "image/png", "image/webp", "application/pdf"];
        if (!validTypes.includes(file.type)) {
            alert("Please upload a JPG, PNG, or PDF file.");
            return;
        }

        // Convert file to Base64 using browser FileReader
        const reader = new FileReader();
        reader.onload = () => {
            const dataUrl = reader.result as string;
            // Strip out the "data:image/png;base64," metadata prefix so Gemini receives pure Base64
            const base64Data = dataUrl.split(",")[1];
            onFileSelected(base64Data, file.type, dataUrl);
        };
        reader.readAsDataURL(file);
    };

    const handleDrag = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === "dragenter" || e.type === "dragover") setDragActive(true);
        else if (e.type === "dragleave") setDragActive(false);
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            processFile(e.dataTransfer.files[0]);
        }
    };

    return (
        <div
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className={`border-2 border-dashed rounded-2xl p-6 sm:p-8 text-center cursor-pointer transition-all duration-200 ${dragActive
                    ? "border-blue-500 bg-blue-50/60 scale-[1.01]"
                    : "border-slate-300 hover:border-blue-400 bg-slate-50/50 hover:bg-slate-50"
                } ${isScanning ? "pointer-events-none opacity-70" : ""}`}
        >
            <input
                ref={fileInputRef}
                type="file"
                accept="image/*,application/pdf"
                className="hidden"
                onChange={(e) => e.target.files?.[0] && processFile(e.target.files[0])}
            />

            <div className="flex flex-col items-center justify-center gap-2.5">
                {isScanning ? (
                    <>
                        <Loader2 className="w-10 h-10 text-blue-600 animate-spin" />
                        <p className="text-sm font-bold text-slate-800">
                            Gemini Vision is analyzing your receipt...
                        </p>
                        <p className="text-xs text-slate-500">
                            Extracting vendor, line items, taxes, and amounts
                        </p>
                    </>
                ) : (
                    <>
                        <div className="p-3 bg-blue-100/80 rounded-full text-blue-600">
                            <UploadCloud className="w-6 h-6" />
                        </div>
                        <div>
                            <p className="text-sm sm:text-base font-semibold text-slate-800">
                                Click to upload or drag &amp; drop receipt
                            </p>
                            <p className="text-[11px] text-slate-500 mt-0.5">Supports PNG, JPG, or PDF (up to 10MB)</p>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}
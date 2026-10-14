"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Receipt, Loader2, ArrowRight } from "lucide-react";

export default function LoginPage() {
    const router = useRouter();
    const [formData, setFormData] = useState({ email: "", password: "" });
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        try {
            const res = await fetch("/api/auth/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });

            const data = await res.json();
            if (!res.ok) {
                throw new Error(data.error || "Failed to log in.");
            }

            // Refresh to load authenticated user session and navigate
            const params = new URLSearchParams(window.location.search);
            const destination = params.get("redirect") || "/dashboard";
            router.push(destination);
            router.refresh();
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-[calc(100vh-64px)] bg-slate-50/50 flex flex-col justify-center py-4 sm:py-6 px-4 sm:px-6 lg:px-8">
            <div className="sm:mx-auto sm:w-full sm:max-w-md">
                <div className="flex justify-center mb-2">
                    <div className="p-2.5 bg-blue-600 text-white rounded-xl shadow-xs">
                        <Receipt className="w-6 h-6" />
                    </div>
                </div>
                <h2 className="text-center text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                    Welcome back to SmartReceipt
                </h2>
                <p className="mt-0.5 text-center text-xs text-slate-500">
                    Sign in to access your scanned expenses and analytics
                </p>
            </div>

            <div className="mt-4 sm:mx-auto sm:w-full sm:max-w-md">
                <div className="bg-white py-6 px-6 sm:px-8 rounded-2xl border border-slate-200 shadow-xs">
                    {error && (
                        <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl font-medium">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                                Email Address
                            </label>
                            <input
                                type="email"
                                placeholder="kamrul@example.com"
                                value={formData.email}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                className="w-full px-3.5 py-2.5 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                                Password
                            </label>
                            <input
                                type="password"
                                placeholder="••••••••"
                                value={formData.password}
                                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                className="w-full px-3.5 py-2.5 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none"
                                required
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full mt-2 py-3 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl transition flex items-center justify-center gap-2 shadow-sm disabled:opacity-50"
                        >
                            {loading ? (
                                <>
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                    Signing In...
                                </>
                            ) : (
                                <>
                                    Sign In <ArrowRight className="w-4 h-4" />
                                </>
                            )}
                        </button>
                    </form>

                    <div className="mt-6 text-center border-t border-slate-100 pt-4">
                        <p className="text-xs text-slate-500">
                            Don't have an account yet?{" "}
                            <Link href="/signup" className="font-bold text-blue-600 hover:text-blue-700">
                                Sign up free
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
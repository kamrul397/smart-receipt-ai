"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { Receipt, LayoutDashboard, ScanLine, LogOut, User as UserIcon } from "lucide-react";

export default function Navbar() {
    const router = useRouter();
    const pathname = usePathname();
    const [user, setUser] = useState<{ id: string; name?: string; email: string } | null>(null);
    const [loading, setLoading] = useState(true);

    // Check auth session
    const checkUser = async () => {
        try {
            const res = await fetch("/api/auth/me");
            const data = await res.json();
            setUser(data.user || null);
        } catch (err) {
            setUser(null);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        checkUser();
    }, [pathname]);

    const handleLogout = async () => {
        try {
            await fetch("/api/auth/logout", { method: "POST" });
            setUser(null);
            router.push("/login");
            router.refresh();
        } catch (err) {
            console.error("Failed to logout:", err);
        }
    };

    return (
        <header className="bg-white border-b border-slate-200 sticky top-0 z-50 shadow-xs">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex justify-between items-center">
                {/* Brand Logo */}
                <Link href="/" className="flex items-center gap-2.5 font-black text-slate-900 text-lg tracking-tight">
                    <div className="p-2 bg-blue-600 text-white rounded-xl shadow-xs">
                        <Receipt className="w-5 h-5" />
                    </div>
                    SmartReceipt <span className="text-blue-600">AI</span>
                </Link>

                {/* Navigation Links */}
                <nav className="flex items-center gap-3 sm:gap-4">
                    {user ? (
                        <>
                            <Link
                                href="/dashboard"
                                className="flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-blue-600 px-3 py-2 rounded-lg hover:bg-slate-50 transition"
                            >
                                <LayoutDashboard className="w-4 h-4" />
                                <span className="hidden sm:inline">Analytics Dashboard</span>
                            </Link>

                            <Link
                                href="/scan"
                                className="flex items-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold px-3.5 py-2 rounded-xl shadow-xs transition"
                            >
                                <ScanLine className="w-4 h-4" />
                                <span>Scan Receipt</span>
                            </Link>

                            {/* User Profile Badge */}
                            <div className="flex items-center gap-2 pl-2 border-l border-slate-200">
                                <div className="flex items-center gap-1.5 text-xs text-slate-700 font-semibold bg-slate-100 px-2.5 py-1.5 rounded-lg">
                                    <UserIcon className="w-3.5 h-3.5 text-slate-500" />
                                    <span className="max-w-[120px] truncate">{user.name || user.email}</span>
                                </div>

                                {/* Logout Button */}
                                <button
                                    onClick={handleLogout}
                                    title="Log out"
                                    className="p-1.5 text-slate-400 hover:text-red-600 rounded-lg hover:bg-red-50 transition"
                                >
                                    <LogOut className="w-4 h-4" />
                                </button>
                            </div>
                        </>
                    ) : !loading ? (
                        <div className="flex items-center gap-2">
                            <Link
                                href="/login"
                                className="text-xs font-bold text-slate-600 hover:text-blue-600 px-3 py-2 rounded-lg transition"
                            >
                                Log In
                            </Link>
                            <Link
                                href="/signup"
                                className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold px-4 py-2 rounded-xl shadow-xs transition"
                            >
                                Sign Up Free
                            </Link>
                        </div>
                    ) : null}
                </nav>
            </div>
        </header>
    );
}
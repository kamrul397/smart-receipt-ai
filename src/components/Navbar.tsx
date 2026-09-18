import Link from "next/link";
import { Receipt, LayoutDashboard, ScanLine } from "lucide-react";

export default function Navbar() {
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
                    <Link
                        href="/dashboard"
                        className="flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-blue-600 px-3 py-2 rounded-lg hover:bg-slate-50 transition"
                    >
                        <LayoutDashboard className="w-4 h-4" />
                        <span className="hidden sm:inline">Analytics Dashboard</span>
                    </Link>

                    <Link
                        href="/scan"
                        className="flex items-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold px-4 py-2 rounded-xl shadow-xs transition"
                    >
                        <ScanLine className="w-4 h-4" />
                        <span>Scan Receipt</span>
                    </Link>
                </nav>
            </div>
        </header>
    );
}
import type { Metadata } from "next";
import { Roboto, Roboto_Mono } from "next/font/google";
import Navbar from "@/components/Navbar";
import "./globals.css";

const roboto = Roboto({
  weight: ["300", "400", "500", "700"],
  subsets: ["latin"],
  variable: "--font-roboto",
  display: "swap",
});

const robotoMono = Roboto_Mono({
  subsets: ["latin"],
  variable: "--font-roboto-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: "SmartReceipt AI — Financial Document Parser & Expense Auditor",
  description: "Automated receipt scanning with multimodal Gemini Vision and Zod schema validation",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${roboto.variable} ${robotoMono.variable} h-full antialiased`}>
      <body className={`${roboto.className} min-h-full flex flex-col bg-white text-slate-900`}>
        <Navbar />
        <main className="flex-1">{children}</main>
      </body>
    </html>
  );
}

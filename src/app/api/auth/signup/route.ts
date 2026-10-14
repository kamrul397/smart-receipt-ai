import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { hashPassword, signToken } from "@/lib/auth";
import { z } from "zod";

const SignupSchema = z.object({
    name: z.string().min(2, "Name must be at least 2 characters").optional(),
    email: z.string().email("Invalid email address"),
    password: z.string().min(6, "Password must be at least 6 characters"),
});

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { name, email, password } = SignupSchema.parse(body);

        // 1. Check if user already exists in PostgreSQL
        const existing = await prisma.user.findUnique({
            where: { email: email.toLowerCase() },
        });

        if (existing) {
            return NextResponse.json(
                { error: "An account with this email already exists." },
                { status: 400 }
            );
        }

        // 2. Hash the password
        const hashedPassword = await hashPassword(password);

        // 3. Create user in database
        const user = await prisma.user.create({
            data: {
                name: name || null,
                email: email.toLowerCase(),
                password: hashedPassword,
            },
            select: {
                id: true,
                name: true,
                email: true,
                createdAt: true,
            },
        });

        // 4. Create JWT Token
        const token = signToken({ userId: user.id, email: user.email });

        // 5. Set HTTP-Only Cookie
        const response = NextResponse.json({ success: true, user }, { status: 201 });
        response.cookies.set("auth_token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            maxAge: 7 * 24 * 60 * 60, // 7 days
            path: "/",
        });

        return response;
    } catch (error: any) {
        console.error("Signup Error:", error);
        return NextResponse.json(
            { error: error.message || "Failed to create account" },
            { status: 400 }
        );
    }
}
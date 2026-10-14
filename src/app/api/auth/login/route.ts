import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { comparePassword, signToken } from "@/lib/auth";
import { z } from "zod";

const LoginSchema = z.object({
    email: z.string().email("Invalid email address"),
    password: z.string().min(1, "Password is required"),
});

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { email, password } = LoginSchema.parse(body);

        // 1. Find user by email
        const user = await prisma.user.findUnique({
            where: { email: email.toLowerCase() },
        });

        if (!user) {
            return NextResponse.json(
                { error: "Invalid email or password." },
                { status: 401 }
            );
        }

        // 2. Compare password with hashed database password
        const isValid = await comparePassword(password, user.password);
        if (!isValid) {
            return NextResponse.json(
                { error: "Invalid email or password." },
                { status: 401 }
            );
        }

        // 3. Create JWT Token
        const token = signToken({ userId: user.id, email: user.email });

        // 4. Set HTTP-Only Cookie
        const response = NextResponse.json({
            success: true,
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
            },
        });

        response.cookies.set("auth_token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            maxAge: 7 * 24 * 60 * 60, // 7 days
            path: "/",
        });

        return response;
    } catch (error: any) {
        console.error("Login Error:", error);
        return NextResponse.json(
            { error: error.message || "Failed to log in" },
            { status: 400 }
        );
    }
}
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";

const JWT_SECRET = process.env.JWT_SECRET || "smart_receipt_default_secret_key_fallback";

export interface TokenPayload {
    userId: string;
    email: string;
}

// 1. Password Security: One-way hash with 10 salt rounds
export async function hashPassword(password: string): Promise<string> {
    const salt = await bcrypt.genSalt(10);
    return bcrypt.hash(password, salt);
}

// 2. Password Verification: Compares plain password with database hash
export async function comparePassword(plain: string, hashed: string): Promise<boolean> {
    return bcrypt.compare(plain, hashed);
}

// 3. Token Creation: Signs a secure 7-day JWT token
export function signToken(payload: TokenPayload): string {
    return jwt.sign(payload, JWT_SECRET, {
        expiresIn: "7d",
    });
}

// 4. Token Verification: Validates token integrity and expiration
export function verifyToken(token: string): TokenPayload | null {
    try {
        return jwt.verify(token, JWT_SECRET) as TokenPayload;
    } catch (error) {
        return null;
    }
}

// 5. Session Helper: Reads the HTTP-Only cookie to identify the current user
export async function getAuthUser(): Promise<TokenPayload | null> {
    try {
        const cookieStore = await cookies();
        const token = cookieStore.get("auth_token")?.value;
        if (!token) return null;

        return verifyToken(token);
    } catch (error) {
        return null;
    }
}
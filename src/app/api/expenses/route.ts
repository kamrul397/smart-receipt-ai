import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAuthUser } from "@/lib/auth";

// GET /api/expenses -> Fetch only the logged-in user's expenses
export async function GET(req: NextRequest) {
    try {
        const auth = await getAuthUser();
        if (!auth) {
            return NextResponse.json(
                { error: "Unauthorized. Please log in to view expenses." },
                { status: 401 }
            );
        }

        const { searchParams } = new URL(req.url);
        const category = searchParams.get("category");

        const expenses = await prisma.expense.findMany({
            where: {
                userId: auth.userId, // User Data Isolation!
                ...(category && category !== "ALL" ? { category: category as any } : {}),
            },
            include: {
                items: true,
            },
            orderBy: {
                date: "desc",
            },
        });

        return NextResponse.json({ success: true, data: expenses });
    } catch (error: any) {
        console.error("Fetch Expenses Error:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

// POST /api/expenses -> Save receipt linked to the logged-in user
export async function POST(req: NextRequest) {
    try {
        const auth = await getAuthUser();
        if (!auth) {
            return NextResponse.json(
                { error: "Unauthorized. Please log in to save expenses." },
                { status: 401 }
            );
        }

        const body = await req.json();
        const {
            merchantName,
            date,
            totalAmount,
            taxAmount,
            currency,
            category,
            receiptUrl,
            notes,
            items,
        } = body;

        const expense = await prisma.expense.create({
            data: {
                userId: auth.userId, // Automatically attached to current user!
                merchantName,
                date: new Date(date),
                totalAmount: Number(totalAmount),
                taxAmount: taxAmount ? Number(taxAmount) : 0,
                currency: currency || "USD",
                category: category || "OTHER",
                receiptUrl: receiptUrl || null,
                notes: notes || null,
                items: {
                    create: (items || []).map((item: any) => ({
                        name: item.name,
                        price: Number(item.price),
                        quantity: Number(item.quantity) || 1,
                    })),
                },
            },
            include: {
                items: true,
            },
        });

        return NextResponse.json({ success: true, data: expense }, { status: 201 });
    } catch (error: any) {
        console.error("Create Expense Error:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

// DELETE /api/expenses?id=... -> Delete only if it belongs to current user
export async function DELETE(req: NextRequest) {
    try {
        const auth = await getAuthUser();
        if (!auth) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { searchParams } = new URL(req.url);
        const id = searchParams.get("id");
        if (!id) {
            return NextResponse.json({ error: "Expense ID is required." }, { status: 400 });
        }

        // Verify ownership before deleting
        const expense = await prisma.expense.findUnique({ where: { id } });
        if (!expense || expense.userId !== auth.userId) {
            return NextResponse.json({ error: "Expense not found or unauthorized." }, { status: 404 });
        }

        await prisma.expense.delete({ where: { id } });

        return NextResponse.json({ success: true });
    } catch (error: any) {
        console.error("Delete Expense Error:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
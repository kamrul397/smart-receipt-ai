import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET /api/expenses -> Fetch all expenses (with optional category filter)
export async function GET(req: NextRequest) {
    try {
        const { searchParams } = new URL(req.url);
        const category = searchParams.get("category");

        const expenses = await prisma.expense.findMany({
            where: category && category !== "ALL" ? { category: category as any } : undefined,
            include: {
                items: true, // Relational join to include all line items
            },
            orderBy: {
                date: "desc", // Most recent transactions first
            },
        });

        return NextResponse.json({ success: true, data: expenses });
    } catch (error: any) {
        console.error("Fetch Expenses Error:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

// POST /api/expenses -> Save a confirmed scanned receipt
export async function POST(req: NextRequest) {
    try {
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

        // Relational insert: creates Expense AND nested ExpenseItem records atomically
        const expense = await prisma.expense.create({
            data: {
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
// DELETE /api/expenses?id=... -> Delete an expense with cascade
export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    if (!id) {
      return NextResponse.json({ error: "Expense ID is required." }, { status: 400 });
    }

    await prisma.expense.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Delete Expense Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

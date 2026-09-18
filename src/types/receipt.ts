import { z } from "zod";

// 1. Expense Categories: We define strict allowed categories
export const CategoryEnum = z.enum([
    "FOOD_DINING",
    "TRAVEL_TRANSPORT",
    "OFFICE_SUPPLIES",
    "SOFTWARE_TECH",
    "UTILITIES",
    "HEALTHCARE",
    "ENTERTAINMENT",
    "OTHER",
]);

export type Category = z.infer<typeof CategoryEnum>;

// 2. Individual Line Items (e.g. 1x Coffee @ $4.50)
export const ReceiptItemSchema = z.object({
    name: z.string().describe("Name or description of the purchased item"),
    price: z.number().describe("Price of the item as a number"),
    quantity: z.number().default(1).describe("Quantity purchased"),
});

export type ReceiptItem = z.infer<typeof ReceiptItemSchema>;

// 3. Complete Receipt Schema: The grand blueprint
export const ReceiptSchema = z.object({
    merchantName: z.string().describe("Name of the store, company, or vendor"),
    date: z.string().describe("Date of purchase in YYYY-MM-DD format"),
    totalAmount: z.number().describe("Grand total amount charged"),
    taxAmount: z.number().nullable().default(0).describe("Tax or VAT amount"),
    currency: z.string().default("USD").describe("Currency code, e.g. USD, EUR, BDT"),
    category: CategoryEnum.describe("Best matching expense category"),
    items: z.array(ReceiptItemSchema).describe("List of purchased items"),
});

export type ExtractedReceipt = z.infer<typeof ReceiptSchema>;
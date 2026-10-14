import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { ReceiptSchema } from "@/types/receipt";

export async function POST(req: NextRequest) {
    try {
        const { imageBase64, mimeType } = await req.json();

        if (!imageBase64 || !mimeType) {
            return NextResponse.json(
                { error: "Image base64 data and mimeType are required." },
                { status: 400 }
            );
        }

        const apiKey = process.env.GEMINI_API_KEY;
        if (!apiKey) {
            return NextResponse.json(
                { error: "Server error: GEMINI_API_KEY is not configured." },
                { status: 500 }
            );
        }

        const genAI = new GoogleGenerativeAI(apiKey);

        const prompt = `
You are a financial document auditor and OCR classifier.
First, check whether the image is actually a receipt, invoice, bill, cash register ticket, payment slip, or proof of purchase.

Case 1 - The image is NOT a receipt, bill, or invoice:
(For example: photos of pets, cars, selfies, landscapes, food dishes without receipts, memes, unrelated graphics, or general text documents that are not financial bills).
Return strictly this JSON:
{
  "isReceipt": false,
  "reason": "This image does not appear to be a receipt or bill."
}

Case 2 - The image IS a receipt, bill, or invoice:
Extract the financial details in strict JSON matching this structure:
{
  "isReceipt": true,
  "merchantName": string,
  "date": string (YYYY-MM-DD format. If year is missing, assume current year),
  "totalAmount": number (pure numeric float without currency symbols like $),
  "taxAmount": number or 0 (numeric float),
  "currency": string (e.g. "USD", "EUR", "BDT"),
  "category": "FOOD_DINING" | "TRAVEL_TRANSPORT" | "OFFICE_SUPPLIES" | "SOFTWARE_TECH" | "UTILITIES" | "HEALTHCARE" | "ENTERTAINMENT" | "OTHER",
  "items": [
    {
      "name": string,
      "price": number,
      "quantity": number
    }
  ]
}

Rules:
1. Ensure totalAmount and item prices are numeric floats, NOT strings.
2. If any individual item is unreadable, summarize or group it reasonably.
3. Category must be one of the exact 8 enum values listed above.
`;

        // Production Resilience: Fallback list in case of temporary 503 spikes
        const candidateModels = ["gemini-flash-latest", "gemini-3.8-flash", "gemini-3.6-flash"];
        let result = null;
        let lastError = null;

        for (const modelName of candidateModels) {
            try {
                const model = genAI.getGenerativeModel({
                    model: modelName,
                    generationConfig: {
                        responseMimeType: "application/json",
                        temperature: 0.1,
                    },
                });

                result = await model.generateContent([
                    prompt,
                    {
                        inlineData: {
                            data: imageBase64,
                            mimeType: mimeType,
                        },
                    },
                ]);

                if (result) break;
            } catch (err: any) {
                console.warn(`Model ${modelName} busy or error: ${err.message}. Trying next fallback...`);
                lastError = err;
                // Brief pause before trying the next fallback model
                await new Promise((resolve) => setTimeout(resolve, 800));
            }
        }

        if (!result) {
            throw lastError || new Error("All Gemini models are currently busy. Please try again.");
        }

        const rawResponseText = result.response.text();
        const rawJson = JSON.parse(rawResponseText);

        // Guardrail: Check if the AI identified the image as non-receipt
        if (rawJson.isReceipt === false) {
            return NextResponse.json(
                {
                    success: false,
                    notReceipt: true,
                    error: "Please upload a receipt or bill. The uploaded image does not appear to be a receipt or invoice.",
                },
                { status: 422 }
            );
        }

        // Validate using Zod
        const validatedData = ReceiptSchema.parse(rawJson);

        return NextResponse.json({
            success: true,
            data: validatedData,
        });
    } catch (error: any) {
        console.error("Receipt Scan Error:", error);
        return NextResponse.json(
            { error: error.message || "Failed to scan receipt" },
            { status: 500 }
        );
    }
}

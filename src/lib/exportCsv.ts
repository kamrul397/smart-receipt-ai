export interface ExpenseExportData {
    merchantName: string;
    date: string | Date;
    category: string;
    totalAmount: number;
    taxAmount?: number | null;
    currency: string;
    notes?: string | null;
    items?: Array<{ name: string; quantity: number; price: number }>;
}

export function exportExpensesToCSV(expenses: ExpenseExportData[]) {
    if (!expenses || expenses.length === 0) {
        alert("No expenses available to export.");
        return;
    }

    // 1. Define Column Headers
    const headers = [
        "Date",
        "Merchant / Vendor",
        "Category",
        "Total Amount",
        "Tax Amount",
        "Currency",
        "Line Items Breakdown",
        "Notes",
    ];

    // Helper to escape commas and quotes so Excel parses cells cleanly
    const escapeCell = (text: string | number | null | undefined): string => {
        if (text === null || text === undefined) return '""';
        const str = String(text).replace(/"/g, '""'); // Escape inner double-quotes
        return `"${str}"`;
    };

    // 2. Build rows
    const rows = expenses.map((exp) => {
        const formattedDate = new Date(exp.date).toISOString().split("T")[0];
        const category = exp.category.replace("_", " ");

        // Flatten nested line items into a readable summary string:
        // e.g. "Latte (1x $4.50) | Croissant (1x $3.50)"
        const itemsSummary = (exp.items || [])
            .map((item) => `${item.name} (${item.quantity}x $${Number(item.price).toFixed(2)})`)
            .join(" | ");

        return [
            escapeCell(formattedDate),
            escapeCell(exp.merchantName),
            escapeCell(category),
            escapeCell(Number(exp.totalAmount).toFixed(2)),
            escapeCell(Number(exp.taxAmount || 0).toFixed(2)),
            escapeCell(exp.currency || "USD"),
            escapeCell(itemsSummary),
            escapeCell(exp.notes || ""),
        ].join(",");
    });

    // 3. Combine headers and rows with newlines
    const csvContent = [headers.join(","), ...rows].join("\r\n");

    // 4. Create Blob with UTF-8 BOM so Excel opens special characters correctly
    const blob = new Blob(["\uFEFF" + csvContent], {
        type: "text/csv;charset=utf-8;",
    });

    // 5. Trigger download in the user's browser
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    const today = new Date().toISOString().split("T")[0];

    link.setAttribute("href", url);
    link.setAttribute("download", `SmartReceipt_Expenses_${today}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url); // Clean up memory
}
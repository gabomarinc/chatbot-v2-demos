/**
 * Costs based on average pricing for GPT-4o-mini and Gemini 1.5 Flash
 * Prices are in USD per 1,000,000 tokens as of Dec 2024
 */
export const MODEL_PRICES: Record<string, { pricePerMillion: number }> = {
    'gpt-4o-mini': { pricePerMillion: 0.45 }, // Average of input/output
    'gemini-1.5-flash': { pricePerMillion: 0.20 }, // Average of input/output
    'default': { pricePerMillion: 0.50 }
};

export function calculateEstimatedCost(model: string, tokens: number): number {
    const modelKey = Object.keys(MODEL_PRICES).find(key => model.toLowerCase().includes(key)) || 'default';
    const price = MODEL_PRICES[modelKey].pricePerMillion;
    return (tokens / 1000000) * price;
}

export function formatCurrency(amount: number): string {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 0,
        maximumFractionDigits: 2
    }).format(amount);
}

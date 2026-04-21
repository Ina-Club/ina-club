export function getPenaltyFeeAmount(): number {
    // We use "100" as the default fallback to maintain consistency across the app.
    return parseFloat(process.env.PENALTY_FEE_AMOUNT || "100");
}

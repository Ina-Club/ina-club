export function formatShekelAmount(
  amount: number | null | undefined,
  options?: { compact?: boolean },
) {
  if (amount === null || amount === undefined || Number.isNaN(amount)) {
    return "";
  }

  const formatted = amount.toLocaleString("he-IL", {
    maximumFractionDigits: 0,
  });

  return `₪${formatted}`;
}

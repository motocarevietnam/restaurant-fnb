export function formatCurrency(
  value: number | string,
  currency = "VND",
  locale = "vi-VN",
): string {
  const amount = typeof value === "string" ? Number(value) : value;
  const formatted = new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
    maximumFractionDigits: currency === "VND" ? 0 : 2,
  }).format(amount);
  return currency === "VND" ? formatted.replace("₫", "đ") : formatted;
}

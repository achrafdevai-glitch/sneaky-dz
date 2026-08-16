/** Maps backend order errors (raised by the stock triggers) to Arabic messages. */
export const parseOrderError = (error: unknown): string => {
  const message =
    (typeof error === "object" && error !== null && "message" in error
      ? String((error as { message?: unknown }).message)
      : String(error)) || "";

  if (message.includes("MISSING_VARIANT_SELECTION")) {
    return "يرجى اختيار اللون والمقاس قبل إتمام الطلب";
  }

  const outOfStock = message.match(/OUT_OF_STOCK:(\d+)/);
  if (outOfStock) {
    const available = Number(outOfStock[1]);
    return available > 0
      ? `الكمية المتوفرة ${available} فقط، يرجى تعديل الكمية`
      : "نفذت الكمية - المنتج غير متوفر حالياً";
  }
  if (message.includes("OUT_OF_STOCK")) {
    return "نفذت الكمية - المنتج غير متوفر حالياً";
  }

  return "تعذّر إتمام الطلب، يرجى المحاولة مرة أخرى";
};

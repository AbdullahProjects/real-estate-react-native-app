export const formatPrice = (price: number): string => {
  if (price >= 10000000) {
    return `${(price / 1000000).toFixed(1)}M rupees`.replace(/\.0$/, "");
  }

  if (price >= 100000) {
    return `${(price / 1000).toFixed(1)}L rupees`.replace(/\.0$/, "");
  }

  return `${price.toLocaleString()} rupees`;
};

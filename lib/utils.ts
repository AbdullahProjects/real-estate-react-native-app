export const formatPrice = (price: number): string => {
  if (price >= 10000000) {
    return `Rs.${(price / 1000000).toFixed(0)}M`.replace(/\.0$/, "");
  }

  if (price >= 100000) {
    return `Rs.${(price / 1000).toFixed(0)}K`.replace(/\.0$/, "");
  }

  return `Rs.${price.toLocaleString()}`;
};

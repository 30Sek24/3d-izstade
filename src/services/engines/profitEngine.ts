export const PLATFORM_COMMISSION_RATE = 0.15; // 15%

/**
 * Aprēķina platformas komisiju no apgrozījuma
 */
export const calculateCommission = (totalPrice: number): number => {
  return totalPrice * PLATFORM_COMMISSION_RATE;
};

/**
 * Aprēķina tīro peļņu uzņēmumam pēc komisijas
 */
export const calculateNetProfit = (totalPrice: number, cost: number): number => {
  const grossProfit = totalPrice - cost;
  const commission = calculateCommission(totalPrice);
  return grossProfit - commission;
};

export function calculateCost(materials: any[], labour: any[]) {
  let materialCost = materials.reduce(
    (sum, m) => sum + (m.price * m.quantity),
    0
  );

  let labourCost = labour.reduce(
    (sum, l) => sum + (l.hourRate * l.hours),
    0
  );

  return {
    materialCost,
    labourCost,
    total: materialCost + labourCost
  };
}

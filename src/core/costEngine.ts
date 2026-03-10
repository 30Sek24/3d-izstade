export function calculateCost(materials: any[], labour: any[]) {
  const materialCost = materials.reduce(
    (sum, m) => sum + (m.price * m.quantity),
    0
  );

  const labourCost = labour.reduce(
    (sum, l) => sum + (l.hourRate * l.hours),
    0
  );

  return {
    materialCost,
    labourCost,
    total: materialCost + labourCost
  };
}

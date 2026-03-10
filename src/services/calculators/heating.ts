export function calculateHeating(area: number, unitPrice: number, laborRate: number, units: number) {
  const materials = (area * 0.5 * unitPrice) + (units * unitPrice);
  const labor = (area * laborRate) + (units * laborRate * 2);
  const overhead = materials * 0.1;
  const total = materials + labor + overhead;

  return { materials, labor, overhead, total };
}

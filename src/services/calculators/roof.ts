export function calculateRoof(area: number, materialPrice: number, laborRate: number) {
  const materials = area * materialPrice;
  const labor = area * laborRate;
  const overhead = materials * 0.1;
  const total = materials + labor + overhead;

  return { materials, labor, overhead, total };
}

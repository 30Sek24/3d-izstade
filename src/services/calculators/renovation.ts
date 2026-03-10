export function calculateRenovation(area: number, materialQualityMultiplier: number, laborRate: number) {
  const baseMaterialPrice = 50; // base price per sqm
  const materials = area * baseMaterialPrice * materialQualityMultiplier;
  const labor = area * laborRate;
  const overhead = (materials + labor) * 0.1;
  const total = materials + labor + overhead;

  return { materials, labor, overhead, total };
}

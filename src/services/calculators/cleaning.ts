export function calculateCleaning(area: number, ratePerSqm: number, deepClean: boolean) {
  const multiplier = deepClean ? 1.5 : 1.0;
  const materials = area * 0.5 * multiplier; // cleaning supplies
  const labor = area * ratePerSqm * multiplier;
  const overhead = labor * 0.1;
  const total = materials + labor + overhead;

  return { materials, labor, overhead, total };
}

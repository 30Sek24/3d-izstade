export function calculateAutoservice(partsCost: number, estimatedHours: number, hourlyRate: number) {
  const materials = partsCost;
  const labor = estimatedHours * hourlyRate;
  const overhead = labor * 0.1; // shop supplies/disposal
  const total = materials + labor + overhead;

  return { materials, labor, overhead, total };
}

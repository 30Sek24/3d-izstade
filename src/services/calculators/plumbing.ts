export function calculatePlumbing(points: number, pipeLength: number, pointPrice: number, pipePrice: number, laborRate: number) {
  const materials = (points * pointPrice) + (pipeLength * pipePrice);
  const labor = (points * laborRate * 1.5) + (pipeLength * laborRate * 0.5);
  const overhead = materials * 0.1;
  const total = materials + labor + overhead;

  return { materials, labor, overhead, total };
}

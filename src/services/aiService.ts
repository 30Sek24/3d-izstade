export async function aiEstimate(description: string) {
  // Šī funkcija sūta pieprasījumu uz tavu API endpointu
  const response = await fetch("/api/ai-estimate", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ description })
  });

  return await response.json();
}

/**
 * Sniedz profesionālu padomu vai mārketinga tekstu, balstoties uz AI analīzi.
 */
export async function aiAdvise() {
  // Simulācija vai reāls izsaukums
  return "Generated with Warpala AI Construction OS. Ieteikums: Fokuss uz premium materiāliem, lai palielinātu ROI.";
}

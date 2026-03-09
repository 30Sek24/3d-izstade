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
 * Ģenerē AI video reklāmu balstoties uz promptu un stilu.
 */
export async function generateAiVideo(prompt: string, style: string) {
  console.log(`Iniciē AI Video ģenerēšanu: ${prompt} (Style: ${style})`);
  // Simulācija reālam API (piem. HeyGen vai Luma)
  await new Promise(r => setTimeout(r, 5000));
  
  return {
    success: true,
    videoUrl: 'https://test-videos.co.uk/vids/bigbuckbunny/mp4/h264/1080/Big_Buck_Bunny_1080_10s_1MB.mp4',
    thumbnail: 'https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?auto=format&fit=crop&w=400&q=80'
  };
}

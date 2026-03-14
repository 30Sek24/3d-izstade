export const aiSimulator = {
  async generateBusinessIdeas(interests: string, location: string) {
    console.log(`Generating ideas for: ${interests} in ${location}`);
    await new Promise(r => setTimeout(r, 2000));
    return [
      {
        title: `${interests.charAt(0).toUpperCase() + interests.slice(1)} Innovation Lab`,
        description: `Focused on ${interests} solutions in ${location}.`,
        marketGap: "High demand, low supply of specialized providers.",
        initialInvestment: "€1,500 - €3,000",
        steps: ["Market research", "Pilot program", "Scale"]
      },
      {
        title: `Smart ${interests} Services`,
        description: `Revolutionizing ${interests} in ${location} with AI.`,
        marketGap: "Traditional players are too slow to adapt.",
        initialInvestment: "€500 - €1,000",
        steps: ["Build MVP", "Beta testing", "Launch"]
      }
    ];
  },

  async createOffer(business: string, targetClient: string) {
    await new Promise(r => setTimeout(r, 2500));
    return `
**Subject: Elevate Your Space with Premium ${business} Solutions**

Hi ${targetClient},

I noticed your recent focus on improving your property's value and efficiency. I run a specialized ${business} service tailored specifically for clients like you.

**The Problem:** Many property owners struggle with outdated systems that cost them money and comfort.
**Our Solution:** We provide seamless, non-intrusive upgrades that pay for themselves within 2 years.

**Exclusive Offer for You:**
- Free initial consultation and site audit (Value: €150)
- 15% discount on your first installation
- 2-year premium warranty on all craftsmanship

Let's schedule a brief 10-minute call this Thursday to see if we're a good fit.

Best regards,
Warpala AI Agent
    `;
  },

  async calculatePricing(serviceType: string, scope: string) {
    console.log(`Calculating pricing for: ${serviceType} with scope: ${scope}`);
    await new Promise(r => setTimeout(r, 1500));
    
    // Simulate some logic
    let baseRate = 50;
    let materialMultiplier = 1.5;
    
    if (serviceType.toLowerCase().includes('premium')) {
      baseRate = 80;
      materialMultiplier = 2.5;
    }

    const hours = Math.floor(Math.random() * 20) + 5;
    const materialCost = Math.floor(Math.random() * 500) + 100;
    
    const labor = hours * baseRate;
    const materials = materialCost * materialMultiplier;
    const total = labor + materials;

    return {
      breakdown: [
        { item: "Labor (Estimated)", cost: labor, details: `${hours} hours @ €${baseRate}/hr` },
        { item: "Materials & Equipment", cost: materials, details: `Base cost €${materialCost} x ${materialMultiplier} quality multiplier` },
        { item: "Contingency / AI Buffer", cost: total * 0.1, details: "10% safety margin recommended" }
      ],
      total: total * 1.1,
      currency: "EUR",
      recommendation: `Based on current market rates for ${serviceType}, this pricing is highly competitive. Consider offering a 5% discount for upfront payment.`
    };
  },

  async generateLeads(niche: string, location: string) {
    await new Promise(r => setTimeout(r, 3000));
    const names = ["Jānis Bērziņš", "Anna Kalniņa", "TechStart SIA", "GreenBuild Baltic", "Mārtiņš Ozols", "Līga Zariņa"];
    const roles = ["Homeowner", "CEO", "Procurement Manager", "Project Lead"];
    
    return Array.from({ length: 5 }).map((_, i) => ({
      id: `lead-${Date.now()}-${i}`,
      name: names[Math.floor(Math.random() * names.length)],
      role: roles[Math.floor(Math.random() * roles.length)],
      company: i % 2 === 0 ? "Independent" : "Local Business Corp",
      matchScore: Math.floor(Math.random() * 30) + 70, // 70-100
      status: "Discovered",
      reason: `Recently searched for "${niche}" related services in ${location}.`,
      suggestedAction: "Send introductory email with portfolio."
    }));
  },

  async generateProducts(businessName: string, niche: string) {
    await new Promise(r => setTimeout(r, 2000));
    return [
      {
        id: 'p1',
        name: `${niche} Starter Pack`,
        description: `Everything needed to begin with ${businessName}.`,
        price: 299,
        margin: 0.65
      },
      {
        id: 'p2',
        name: `Premium ${niche} Solution`,
        description: `Advanced tier for scaling ${businessName} operations.`,
        price: 999,
        margin: 0.80
      },
      {
        id: 'p3',
        name: `Enterprise ${niche} Ecosystem`,
        description: `Full-scale integration for large organizations.`,
        price: 4500,
        margin: 0.90
      }
    ];
  },

  async generateMarketingCampaign(businessName: string, niche: string) {
    await new Promise(r => setTimeout(r, 2500));
    return {
      name: `${businessName} Launch Campaign`,
      platform: "Omnichannel (LinkedIn, Meta, Google)",
      strategy: `Targeting underserved users in the ${niche} sector.`,
      assets: [
        { type: "Ad Copy", content: `Stop struggling with outdated ${niche} methods. Switch to ${businessName}.` },
        { type: "Video Script", content: `[Scene: High-tech office] Narrative: The future of ${niche} is here.` },
        { type: "Email Sequence", content: `Day 1: Introduction. Day 3: Case Study. Day 7: The Offer.` }
      ],
      estimatedReach: "15,000 - 25,000 impressions",
      projectedCPA: "€12.50"
    };
  }
};

import { useState } from 'react';
import { aiSimulator } from '../services/aiSimulator';

export default function AiPlatformPrototype() {
  const [activeTab, setActiveTab] = useState('ideas');
  
  // States for Business Ideas
  const [ideaInterests, setIdeaInterests] = useState('');
  const [ideaLocation, setIdeaLocation] = useState('Riga');
  const [isGeneratingIdeas, setIsGeneratingIdeas] = useState(false);
  const [ideas, setIdeas] = useState<any[] | null>(null);

  // States for Offer Creator
  const [offerBusiness, setOfferBusiness] = useState('');
  const [offerClient, setOfferClient] = useState('');
  const [isCreatingOffer, setIsCreatingOffer] = useState(false);
  const [offerResult, setOfferResult] = useState<string | null>(null);

  // States for Calculator
  const [calcService, setCalcService] = useState('');
  const [calcScope, setCalcScope] = useState('');
  const [isCalculating, setIsCalculating] = useState(false);
  const [calcResult, setCalcResult] = useState<any | null>(null);

  // States for Leads
  const [leadNiche, setLeadNiche] = useState('');
  const [leadLocation, setLeadLocation] = useState('Riga');
  const [isFindingLeads, setIsFindingLeads] = useState(false);
  const [leadsResult, setLeadsResult] = useState<any[] | null>(null);

  const handleGenerateIdeas = async () => {
    setIsGeneratingIdeas(true);
    const res = await aiSimulator.generateBusinessIdeas(ideaInterests, ideaLocation);
    setIdeas(res);
    setIsGeneratingIdeas(false);
  };

  const handleCreateOffer = async () => {
    setIsCreatingOffer(true);
    const res = await aiSimulator.createOffer(offerBusiness, offerClient);
    setOfferResult(res);
    setIsCreatingOffer(false);
  };

  const handleCalculatePricing = async () => {
    setIsCalculating(true);
    const res = await aiSimulator.calculatePricing(calcService, calcScope);
    setCalcResult(res);
    setIsCalculating(false);
  };

  const handleGenerateLeads = async () => {
    setIsFindingLeads(true);
    const res = await aiSimulator.generateLeads(leadNiche, leadLocation);
    setLeadsResult(res);
    setIsFindingLeads(false);
  };

  const tabs = [
    { id: 'ideas', label: '💡 Business Ideas', color: '#3b82f6' },
    { id: 'offers', label: '📝 Offer Creator', color: '#ec4899' },
    { id: 'pricing', label: '📊 Smart Pricing', color: '#10b981' },
    { id: 'leads', label: '🎯 AI Lead Finder', color: '#f59e0b' }
  ];

  return (
    <div style={{ minHeight: '100vh', background: '#020617', color: '#fff', padding: '60px 20px', fontFamily: 'system-ui, sans-serif' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '50px' }}>
          <h1 style={{ fontSize: '4rem', fontWeight: 900, letterSpacing: '-2px', margin: 0, background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            WARPALA AI CORE
          </h1>
          <p style={{ color: '#94a3b8', fontSize: '1.2rem', marginTop: '15px' }}>
            Platform Prototype: Generate Businesses, Offers, Pricing & Leads.
          </p>
        </div>

        {/* Navigation Tabs */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: '15px', marginBottom: '50px', flexWrap: 'wrap' }}>
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                padding: '15px 30px',
                borderRadius: '12px',
                border: `2px solid ${activeTab === tab.id ? tab.color : '#1e293b'}`,
                background: activeTab === tab.id ? `${tab.color}22` : 'transparent',
                color: activeTab === tab.id ? '#fff' : '#64748b',
                fontWeight: 800,
                fontSize: '1rem',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                boxShadow: activeTab === tab.id ? `0 0 20px ${tab.color}44` : 'none'
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Content Area */}
        <div style={{ background: 'rgba(30, 41, 59, 0.5)', border: '1px solid #334155', borderRadius: '24px', padding: '40px', backdropFilter: 'blur(10px)' }}>
          
          {/* 1. BUSINESS IDEA GENERATOR */}
          {activeTab === 'ideas' && (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '40px' }}>
              <div>
                <h2 style={{ color: '#3b82f6', marginBottom: '20px' }}>AI Business Generator</h2>
                <p style={{ color: '#94a3b8', marginBottom: '30px' }}>Discover unsaturated niches and launch steps tailored to your skills.</p>
                
                <div style={{ marginBottom: '20px' }}>
                  <label style={{ display: 'block', marginBottom: '8px', color: '#cbd5e1', fontWeight: 'bold' }}>Your Skills / Interests</label>
                  <input type="text" value={ideaInterests} onChange={e => setIdeaInterests(e.target.value)} placeholder="e.g. woodworking, 3D design, sales..." style={inputStyle} />
                </div>
                <div style={{ marginBottom: '30px' }}>
                  <label style={{ display: 'block', marginBottom: '8px', color: '#cbd5e1', fontWeight: 'bold' }}>Target Location</label>
                  <input type="text" value={ideaLocation} onChange={e => setIdeaLocation(e.target.value)} placeholder="e.g. Riga, London, Remote..." style={inputStyle} />
                </div>
                
                <button onClick={handleGenerateIdeas} disabled={isGeneratingIdeas || !ideaInterests} style={{...btnStyle, background: '#3b82f6'}}>
                  {isGeneratingIdeas ? '🤖 ANALYZING MARKETS...' : 'GENERATE BUSINESS IDEAS'}
                </button>
              </div>
              
              <div style={{ background: '#0f172a', borderRadius: '16px', padding: '30px', border: '1px solid #1e293b', maxHeight: '600px', overflowY: 'auto' }}>
                {isGeneratingIdeas ? <LoadingSpinner color="#3b82f6" /> : ideas ? (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                    {ideas.map((idea, i) => (
                      <div key={i} style={{ background: 'rgba(59, 130, 246, 0.1)', border: '1px solid rgba(59, 130, 246, 0.3)', padding: '20px', borderRadius: '12px' }}>
                        <h3 style={{ color: '#fff', marginTop: 0, fontSize: '1.2rem' }}>{idea.title}</h3>
                        <p style={{ color: '#94a3b8', fontSize: '0.9rem', lineHeight: '1.5' }}>{idea.description}</p>
                        <div style={{ marginTop: '15px', fontSize: '0.85rem' }}>
                          <div style={{ color: '#ec4899', marginBottom: '5px' }}><strong>Market Gap:</strong> {idea.marketGap}</div>
                          <div style={{ color: '#10b981', marginBottom: '10px' }}><strong>Est. Investment:</strong> {idea.initialInvestment}</div>
                          <strong style={{ color: '#cbd5e1' }}>First Steps:</strong>
                          <ul style={{ color: '#94a3b8', margin: '5px 0 0 0', paddingLeft: '20px' }}>
                            {idea.steps.map((s: string, j: number) => <li key={j}>{s}</li>)}
                          </ul>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : <EmptyState text="Waiting for input to generate brilliant ideas..." icon="💡" />}
              </div>
            </div>
          )}

          {/* 2. OFFER CREATOR */}
          {activeTab === 'offers' && (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '40px' }}>
              <div>
                <h2 style={{ color: '#ec4899', marginBottom: '20px' }}>AI Offer Creator</h2>
                <p style={{ color: '#94a3b8', marginBottom: '30px' }}>Generate hyper-personalized, high-converting sales pitches instantly.</p>
                
                <div style={{ marginBottom: '20px' }}>
                  <label style={{ display: 'block', marginBottom: '8px', color: '#cbd5e1', fontWeight: 'bold' }}>Your Business / Service</label>
                  <input type="text" value={offerBusiness} onChange={e => setOfferBusiness(e.target.value)} placeholder="e.g. Premium Web Design, SEO Optimization..." style={inputStyle} />
                </div>
                <div style={{ marginBottom: '30px' }}>
                  <label style={{ display: 'block', marginBottom: '8px', color: '#cbd5e1', fontWeight: 'bold' }}>Target Client Profile</label>
                  <input type="text" value={offerClient} onChange={e => setOfferClient(e.target.value)} placeholder="e.g. Local Restaurant Owners, Tech Startups..." style={inputStyle} />
                </div>
                
                <button onClick={handleCreateOffer} disabled={isCreatingOffer || !offerBusiness} style={{...btnStyle, background: '#ec4899'}}>
                  {isCreatingOffer ? '✍️ WRITING COPY...' : 'CRAFT PERFECT OFFER'}
                </button>
              </div>
              
              <div style={{ background: '#0f172a', borderRadius: '16px', padding: '30px', border: '1px solid #1e293b' }}>
                {isCreatingOffer ? <LoadingSpinner color="#ec4899" /> : offerResult ? (
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                      <span style={{ color: '#ec4899', fontWeight: 'bold', fontSize: '0.9rem', textTransform: 'uppercase' }}>Generated Pitch</span>
                      <button style={{ background: '#1e293b', border: 'none', color: '#fff', padding: '5px 10px', borderRadius: '6px', cursor: 'pointer' }}>Copy</button>
                    </div>
                    <div style={{ whiteSpace: 'pre-wrap', color: '#e2e8f0', lineHeight: '1.7', fontSize: '0.95rem' }}>
                      {offerResult}
                    </div>
                  </div>
                ) : <EmptyState text="Describe your service to generate an offer." icon="📝" />}
              </div>
            </div>
          )}

          {/* 3. CALCULATOR */}
          {activeTab === 'pricing' && (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '40px' }}>
              <div>
                <h2 style={{ color: '#10b981', marginBottom: '20px' }}>AI Pricing Calculator</h2>
                <p style={{ color: '#94a3b8', marginBottom: '30px' }}>Dynamic cost estimation based on market rates and project scope.</p>
                
                <div style={{ marginBottom: '20px' }}>
                  <label style={{ display: 'block', marginBottom: '8px', color: '#cbd5e1', fontWeight: 'bold' }}>Service Type</label>
                  <input type="text" value={calcService} onChange={e => setCalcService(e.target.value)} placeholder="e.g. Bathroom Renovation, Mobile App Dev..." style={inputStyle} />
                </div>
                <div style={{ marginBottom: '30px' }}>
                  <label style={{ display: 'block', marginBottom: '8px', color: '#cbd5e1', fontWeight: 'bold' }}>Project Scope / Requirements</label>
                  <textarea value={calcScope} onChange={e => setCalcScope(e.target.value)} placeholder="e.g. 5 pages, custom UI, stripe integration..." style={{...inputStyle, height: '100px', resize: 'none'}} />
                </div>
                
                <button onClick={handleCalculatePricing} disabled={isCalculating || !calcService} style={{...btnStyle, background: '#10b981'}}>
                  {isCalculating ? '🧮 CRUNCHING NUMBERS...' : 'CALCULATE PRICING'}
                </button>
              </div>
              
              <div style={{ background: '#0f172a', borderRadius: '16px', padding: '30px', border: '1px solid #1e293b' }}>
                {isCalculating ? <LoadingSpinner color="#10b981" /> : calcResult ? (
                  <div>
                    <h3 style={{ color: '#10b981', marginTop: 0, textAlign: 'center', fontSize: '2rem', marginBottom: '10px' }}>
                      {calcResult.total.toFixed(2)} {calcResult.currency}
                    </h3>
                    <p style={{ textAlign: 'center', color: '#94a3b8', fontSize: '0.9rem', marginBottom: '30px' }}>Total Estimated Cost</p>
                    
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '15px', marginBottom: '30px' }}>
                      {calcResult.breakdown.map((item: any, i: number) => (
                        <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #1e293b', paddingBottom: '15px' }}>
                          <div>
                            <div style={{ color: '#e2e8f0', fontWeight: 'bold' }}>{item.item}</div>
                            <div style={{ color: '#64748b', fontSize: '0.8rem', marginTop: '4px' }}>{item.details}</div>
                          </div>
                          <div style={{ color: '#fff', fontWeight: 'bold' }}>{item.cost.toFixed(2)} {calcResult.currency}</div>
                        </div>
                      ))}
                    </div>
                    
                    <div style={{ background: 'rgba(16, 185, 129, 0.1)', padding: '15px', borderRadius: '8px', color: '#a7f3d0', fontSize: '0.9rem', lineHeight: '1.5' }}>
                      <strong>AI Tip:</strong> {calcResult.recommendation}
                    </div>
                  </div>
                ) : <EmptyState text="Input scope to calculate an accurate quote." icon="📊" />}
              </div>
            </div>
          )}

          {/* 4. LEAD FINDER */}
          {activeTab === 'leads' && (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '40px' }}>
              <div>
                <h2 style={{ color: '#f59e0b', marginBottom: '20px' }}>AI Lead Finder</h2>
                <p style={{ color: '#94a3b8', marginBottom: '30px' }}>Identify and score high-intent prospects for your specific niche.</p>
                
                <div style={{ marginBottom: '20px' }}>
                  <label style={{ display: 'block', marginBottom: '8px', color: '#cbd5e1', fontWeight: 'bold' }}>Target Niche / Industry</label>
                  <input type="text" value={leadNiche} onChange={e => setLeadNiche(e.target.value)} placeholder="e.g. B2B SaaS, Real Estate, Healthcare..." style={inputStyle} />
                </div>
                <div style={{ marginBottom: '30px' }}>
                  <label style={{ display: 'block', marginBottom: '8px', color: '#cbd5e1', fontWeight: 'bold' }}>Target Location</label>
                  <input type="text" value={leadLocation} onChange={e => setLeadLocation(e.target.value)} placeholder="e.g. Global, Europe, Riga..." style={inputStyle} />
                </div>
                
                <button onClick={handleGenerateLeads} disabled={isFindingLeads || !leadNiche} style={{...btnStyle, background: '#f59e0b', color: '#000'}}>
                  {isFindingLeads ? '🔍 SCRAPING WEB...' : 'FIND WARM LEADS'}
                </button>
              </div>
              
              <div style={{ background: '#0f172a', borderRadius: '16px', padding: '30px', border: '1px solid #1e293b', maxHeight: '600px', overflowY: 'auto' }}>
                {isFindingLeads ? <LoadingSpinner color="#f59e0b" /> : leadsResult ? (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                    <div style={{ color: '#f59e0b', fontWeight: 'bold', marginBottom: '10px' }}>Found {leadsResult.length} High-Intent Prospects</div>
                    {leadsResult.map((lead, i) => (
                      <div key={i} style={{ background: '#1e293b', padding: '15px', borderRadius: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div>
                          <div style={{ color: '#fff', fontWeight: 'bold', fontSize: '1.1rem' }}>{lead.name}</div>
                          <div style={{ color: '#94a3b8', fontSize: '0.85rem', marginTop: '4px' }}>{lead.role} @ {lead.company}</div>
                          <div style={{ color: '#cbd5e1', fontSize: '0.8rem', marginTop: '8px', fontStyle: 'italic' }}>"{lead.reason}"</div>
                        </div>
                        <div style={{ textAlign: 'center' }}>
                          <div style={{ width: '50px', height: '50px', borderRadius: '50%', background: `conic-gradient(#f59e0b ${lead.matchScore}%, #334155 0)`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <div style={{ width: '42px', height: '42px', borderRadius: '50%', background: '#1e293b', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 'bold', fontSize: '0.85rem' }}>
                              {lead.matchScore}
                            </div>
                          </div>
                          <div style={{ color: '#94a3b8', fontSize: '0.7rem', marginTop: '5px' }}>Match Score</div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : <EmptyState text="Enter criteria to unleash the AI Lead Engine." icon="🎯" />}
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}

// Helper Components & Styles
const inputStyle = {
  width: '100%',
  padding: '15px 20px',
  background: 'rgba(15, 23, 42, 0.8)',
  border: '1px solid #334155',
  borderRadius: '12px',
  color: '#fff',
  fontSize: '1rem',
  outline: 'none',
  boxSizing: 'border-box' as any
};

const btnStyle = {
  width: '100%',
  padding: '18px',
  border: 'none',
  borderRadius: '12px',
  color: '#fff',
  fontSize: '1.1rem',
  fontWeight: 900,
  cursor: 'pointer',
  transition: 'transform 0.2s',
};

const LoadingSpinner = ({ color }: { color: string }) => (
  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', minHeight: '200px' }}>
    <div style={{ width: '50px', height: '50px', border: `4px solid ${color}44`, borderTopColor: color, borderRadius: '50%', animation: 'spin 1s linear infinite' }}></div>
    <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    <div style={{ marginTop: '20px', color: '#94a3b8' }}>AI is processing...</div>
  </div>
);

const EmptyState = ({ text, icon }: { text: string, icon: string }) => (
  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', minHeight: '300px', opacity: 0.5 }}>
    <div style={{ fontSize: '4rem', marginBottom: '20px' }}>{icon}</div>
    <div style={{ color: '#fff', fontSize: '1.1rem', textAlign: 'center', maxWidth: '80%' }}>{text}</div>
  </div>
);

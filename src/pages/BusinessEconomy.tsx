import { useState, useEffect } from 'react';
import { aiSimulator } from '../services/aiSimulator';
import { expoService } from '../services/expoService';
import { Link } from 'react-router-dom';

export default function BusinessEconomy() {
  const [activeStep, setStep] = useState(1); // 1: Idea, 2: Product, 3: Marketing, 4: Publishing, 5: Economy
  const [niche, setNiche] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  
  // Business Data
  const [business, setBusiness] = useState<any>(null);
  const [products, setProducts] = useState<any[]>([]);
  const [campaign, setCampaign] = useState<any>(null);
  const [revenueData, setRevenueData] = useState<any[]>([]);
  const [expoId, setExpoId] = useState<string | null>(null);

  const handleGenerateBusiness = async () => {
    setIsProcessing(true);
    const ideas = await aiSimulator.generateBusinessIdeas(niche, 'Global');
    const selected = ideas[0];
    setBusiness(selected);
    setIsProcessing(false);
    setStep(2);
  };

  const handleGenerateProducts = async () => {
    setIsProcessing(true);
    const prods = await aiSimulator.generateProducts(business.title, niche);
    setProducts(prods);
    setIsProcessing(false);
    setStep(3);
  };

  const handleGenerateMarketing = async () => {
    setIsProcessing(true);
    const mkt = await aiSimulator.generateMarketingCampaign(business.title, niche);
    setCampaign(mkt);
    setIsProcessing(false);
    setStep(4);
  };

  const handlePublishToExpo = async () => {
    setIsProcessing(true);
    const result = await expoService.registerAiBusiness({
      name: business.title,
      description: business.description,
      category: niche,
      products: products,
      campaign: campaign
    });
    
    if (result.success) {
      setExpoId(result.companyId);
      setIsProcessing(false);
      setStep(5);
    } else {
      alert("Failed to sync with Expo City. Check database connection.");
      setIsProcessing(false);
    }
  };

  // Simulate Live Revenue
  useEffect(() => {
    if (activeStep === 5) {
      const interval = setInterval(() => {
        setRevenueData(prev => {
          const newEntry = {
            time: new Date().toLocaleTimeString(),
            sales: Math.floor(Math.random() * 5),
            revenue: Math.floor(Math.random() * 1000) + 200
          };
          const updated = [...prev, newEntry];
          return updated.slice(-10); // Keep last 10 entries
        });
      }, 3000);
      return () => clearInterval(interval);
    }
  }, [activeStep]);

  const totalRevenue = revenueData.reduce((acc, curr) => acc + curr.revenue, 0);

  return (
    <div style={{ minHeight: '100vh', background: '#020617', color: '#fff', padding: '60px 20px', fontFamily: 'system-ui, sans-serif' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '60px' }}>
          <h1 style={{ fontSize: '3.5rem', fontWeight: 900, background: 'linear-gradient(135deg, #fbbf24, #f59e0b)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            WARPALA ECONOMY ENGINE
          </h1>
          <p style={{ color: '#94a3b8', fontSize: '1.2rem', marginTop: '10px' }}>
            Turning AI Agents into a fully operational business ecosystem.
          </p>
        </div>

        {/* Workflow Progress */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: '20px', marginBottom: '50px' }}>
          {['BUSINESS IDEA', 'PRODUCT LINE', 'MARKETING', 'EXPO SYNC', 'LIVE ECONOMY'].map((label, i) => (
            <div key={label} style={{ display: 'flex', alignItems: 'center', gap: '10px', opacity: activeStep >= i + 1 ? 1 : 0.3 }}>
              <div style={{ width: '30px', height: '30px', borderRadius: '50%', background: activeStep === i + 1 ? '#f59e0b' : '#1e293b', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>
                {i + 1}
              </div>
              <span style={{ fontSize: '0.8rem', fontWeight: 800, letterSpacing: '1px' }}>{label}</span>
            </div>
          ))}
        </div>

        {/* Main Interface */}
        <div style={{ background: 'rgba(30, 41, 59, 0.5)', border: '1px solid #334155', borderRadius: '24px', padding: '40px', backdropFilter: 'blur(10px)' }}>
          
          {/* STEP 1: BUSINESS IDEA */}
          {activeStep === 1 && (
            <div style={{ maxWidth: '600px', margin: '0 auto', textAlign: 'center' }}>
              <h2 style={{ fontSize: '2rem', marginBottom: '20px' }}>What industry are we disrupting?</h2>
              <input 
                type="text" 
                value={niche} 
                onChange={e => setNiche(e.target.value)}
                placeholder="e.g. 3D Printing, SaaS for Dentists, Green Logistics..." 
                style={inputStyle}
              />
              <button 
                onClick={handleGenerateBusiness} 
                disabled={!niche || isProcessing}
                style={{ ...btnStyle, background: '#f59e0b', marginTop: '30px' }}
              >
                {isProcessing ? 'ANALYZING MARKET...' : 'INITIALIZE BUSINESS GENERATOR'}
              </button>
            </div>
          )}

          {/* STEP 2: PRODUCT LINE */}
          {activeStep === 2 && business && (
            <div style={{ animation: 'fadeIn 0.5s' }}>
              <div style={{ textAlign: 'center', marginBottom: '40px' }}>
                <h2 style={{ color: '#f59e0b' }}>{business.title}</h2>
                <p style={{ color: '#94a3b8' }}>{business.description}</p>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '40px' }}>
                <div style={{ background: '#0f172a', padding: '30px', borderRadius: '16px', border: '1px solid #1e293b' }}>
                  <h3 style={{ marginBottom: '20px' }}>Market Analysis</h3>
                  <div style={{ marginBottom: '15px' }}><strong>Gap:</strong> {business.marketGap}</div>
                  <div><strong>Est. Investment:</strong> {business.initialInvestment}</div>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                  <h3 style={{ marginBottom: '20px' }}>Next Action: Generate Products</h3>
                  <p style={{ color: '#94a3b8', marginBottom: '30px' }}>The AI will now design a 3-tier product line based on this market gap.</p>
                  <button onClick={handleGenerateProducts} disabled={isProcessing} style={{ ...btnStyle, background: '#10b981' }}>
                    {isProcessing ? 'DESIGNING PRODUCTS...' : 'CREATE PRODUCT LINE'}
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* STEP 3: MARKETING */}
          {activeStep === 3 && (
            <div style={{ animation: 'fadeIn 0.5s' }}>
              <h2 style={{ textAlign: 'center', marginBottom: '40px', color: '#10b981' }}>Product Portfolio Ready</h2>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px', marginBottom: '40px' }}>
                {products.map(p => (
                  <div key={p.id} style={{ background: 'rgba(16, 185, 129, 0.1)', border: '1px solid rgba(16, 185, 129, 0.3)', padding: '20px', borderRadius: '12px' }}>
                    <h4 style={{ margin: '0 0 10px 0' }}>{p.name}</h4>
                    <p style={{ fontSize: '0.85rem', color: '#94a3b8' }}>{p.description}</p>
                    <div style={{ marginTop: '15px', fontWeight: 900, fontSize: '1.2rem' }}>€{p.price}</div>
                  </div>
                ))}
              </div>
              <div style={{ textAlign: 'center' }}>
                <p style={{ color: '#94a3b8', marginBottom: '20px' }}>Strategy confirmed. Now, let's launch the marketing automation.</p>
                <button onClick={handleGenerateMarketing} disabled={isProcessing} style={{ ...btnStyle, background: '#3b82f6', maxWidth: '400px' }}>
                  {isProcessing ? 'WRITING AD COPY...' : 'GENERATE CAMPAIGNS'}
                </button>
              </div>
            </div>
          )}

          {/* STEP 4: EXPO SYNC */}
          {activeStep === 4 && campaign && (
            <div style={{ animation: 'fadeIn 0.5s', textAlign: 'center' }}>
              <h2 style={{ color: '#3b82f6', marginBottom: '20px' }}>Marketing Strategy Synthesized</h2>
              <p style={{ color: '#94a3b8', marginBottom: '40px' }}>Finalizing the digital presence. Next, the AI will build your physical booth in Warpala Expo City.</p>
              
              <div style={{ maxWidth: '600px', margin: '0 auto', background: '#0f172a', padding: '30px', borderRadius: '20px', border: '1px solid #3b82f6', marginBottom: '40px' }}>
                <div style={{ fontSize: '3rem', marginBottom: '20px' }}>🏙️</div>
                <h3>Warpala Expo Integration</h3>
                <p style={{ fontSize: '0.9rem', color: '#94a3b8' }}>We will generate a 3D building, marketing screens, and product catalogs automatically.</p>
              </div>

              <button onClick={handlePublishToExpo} disabled={isProcessing} style={{ ...btnStyle, background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)', maxWidth: '400px' }}>
                {isProcessing ? 'GENERATING 3D ASSETS...' : 'PUBLISH TO EXPO CITY'}
              </button>
            </div>
          )}

          {/* STEP 5: LIVE ECONOMY */}
          {activeStep === 5 && campaign && (
            <div style={{ animation: 'fadeIn 0.5s' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '40px' }}>
                <div>
                  <h2 style={{ color: '#3b82f6', marginBottom: '20px' }}>Business Live</h2>
                  
                  {/* Link to Expo */}
                  <Link to={`/expo/booth/${expoId}`} style={{ textDecoration: 'none' }}>
                    <div style={{ background: 'linear-gradient(135deg, #10b981, #3b82f6)', padding: '20px', borderRadius: '12px', marginBottom: '20px', border: 'none', cursor: 'pointer', transition: 'transform 0.2s' }} onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.02)'} onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}>
                      <div style={{ fontSize: '0.8rem', fontWeight: 900, color: '#fff', letterSpacing: '1px' }}>VIEW IN 3D EXPO</div>
                      <div style={{ marginTop: '5px', fontSize: '1.1rem', fontWeight: 900, color: '#fff' }}>OPEN BOOTH →</div>
                    </div>
                  </Link>

                  <div style={{ background: '#0f172a', padding: '20px', borderRadius: '12px', marginBottom: '20px', borderLeft: '4px solid #3b82f6' }}>
                    <div style={{ fontSize: '0.8rem', fontWeight: 800, color: '#3b82f6' }}>LIVE STRATEGY</div>
                    <div style={{ marginTop: '10px', fontSize: '0.9rem' }}>{campaign.strategy}</div>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    {campaign.assets.map((a: any, i: number) => (
                      <div key={i} style={{ fontSize: '0.8rem', color: '#94a3b8', background: 'rgba(255,255,255,0.05)', padding: '10px', borderRadius: '8px' }}>
                        <strong>{a.type}:</strong> {a.content}
                      </div>
                    ))}
                  </div>
                </div>

                <div style={{ background: '#0f172a', borderRadius: '20px', padding: '30px', border: '1px solid #1e293b' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
                    <h2 style={{ margin: 0 }}>Revenue Tracker</h2>
                    <div style={{ padding: '8px 15px', background: 'rgba(16, 185, 129, 0.2)', color: '#10b981', borderRadius: '20px', fontSize: '0.8rem', fontWeight: 900 }}>LIVE TRANSACTIONS</div>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '30px' }}>
                    <div style={{ background: 'rgba(255,255,255,0.02)', padding: '20px', borderRadius: '12px', textAlign: 'center' }}>
                      <div style={{ color: '#94a3b8', fontSize: '0.7rem' }}>TOTAL GENERATED</div>
                      <div style={{ fontSize: '2rem', fontWeight: 950, color: '#10b981' }}>€{totalRevenue.toLocaleString()}</div>
                    </div>
                    <div style={{ background: 'rgba(255,255,255,0.02)', padding: '20px', borderRadius: '12px', textAlign: 'center' }}>
                      <div style={{ color: '#94a3b8', fontSize: '0.7rem' }}>EST. PROFIT (MARGIN)</div>
                      <div style={{ fontSize: '2rem', fontWeight: 950, color: '#f59e0b' }}>€{(totalRevenue * 0.75).toLocaleString()}</div>
                    </div>
                  </div>

                  <div style={{ maxHeight: '250px', overflowY: 'auto' }}>
                    {revenueData.slice().reverse().map((entry, i) => (
                      <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 0', borderBottom: '1px solid #1e293b' }}>
                        <span style={{ color: '#64748b', fontSize: '0.85rem' }}>{entry.time}</span>
                        <span style={{ color: '#10b981', fontWeight: 'bold' }}>+{entry.sales} NEW SALES</span>
                        <span style={{ fontWeight: 900 }}>€{entry.revenue}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

        </div>
      </div>
      <style>{`
        @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
      `}</style>
    </div>
  );
}

const inputStyle = {
  width: '100%',
  padding: '20px',
  background: 'rgba(15, 23, 42, 0.8)',
  border: '1px solid #334155',
  borderRadius: '16px',
  color: '#fff',
  fontSize: '1.2rem',
  outline: 'none',
  boxSizing: 'border-box' as any
};

const btnStyle = {
  width: '100%',
  padding: '20px',
  border: 'none',
  borderRadius: '16px',
  color: '#fff',
  fontSize: '1.2rem',
  fontWeight: 950,
  cursor: 'pointer',
  transition: 'transform 0.2s',
  letterSpacing: '1px'
};

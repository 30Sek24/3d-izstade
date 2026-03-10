import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../components/calculator/styles/CalculatorPro.css';
import { MarketplaceAPI } from '../../services/marketplace';
import { LeadsAPI } from '../../services/leads';
import { AutomationAPI } from '../../services/automation';

export default function OnboardingPage() {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [industry, setIndustry] = useState('');
  const [location, setLocation] = useState('');
  const navigate = useNavigate();

  // Mock User ID
  const USER_ID = '00000000-0000-0000-0000-000000000000';

  const nextStep = () => setStep(prev => prev + 1);

  const handleStep1 = async () => {
    setLoading(true);
    try {
      // Step 1: Install first agent (Lead Finder)
      await MarketplaceAPI.installAgent(USER_ID, 'lead_finder');
      nextStep();
    } catch (e) { console.error(e); } finally { setLoading(false); }
  };

  const handleStep2 = async () => {
    if (!industry || !location) return;
    setLoading(true);
    try {
      // Step 2: Generate first leads
      await LeadsAPI.generateLeads(industry, location);
      nextStep();
    } catch (e) { console.error(e); } finally { setLoading(false); }
  };

  const handleStep3 = async () => {
    setLoading(true);
    try {
      // Step 3: Install workflow
      await MarketplaceAPI.installWorkflow(USER_ID, 'lead_gen_system');
      nextStep();
    } catch (e) { console.error(e); } finally { setLoading(false); }
  };

  const handleStep4 = async () => {
    setLoading(true);
    try {
      // Step 4: Run first automation
      await AutomationAPI.startBusinessWorkflow('first-project-id', `Onboarding project for ${industry}`);
      navigate('/platform/dashboard');
    } catch (e) { console.error(e); } finally { setLoading(false); }
  };

  return (
    <div className="calculator-pro-wrapper" style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div className="glass-card" style={{ maxWidth: '600px', width: '100%', padding: '50px', textAlign: 'center' }}>
        
        {/* Progress Bar */}
        <div style={{ display: 'flex', gap: '10px', marginBottom: '40px' }}>
          {[1, 2, 3, 4].map(s => (
            <div key={s} style={{ flex: 1, height: '4px', background: step >= s ? '#3b82f6' : 'rgba(255,255,255,0.1)', borderRadius: '2px' }}></div>
          ))}
        </div>

        {step === 1 && (
          <div style={{ animation: 'fadeIn 0.5s' }}>
            <h1 style={{ fontSize: '2.5rem', marginBottom: '20px' }}>Welcome to Warpala OS</h1>
            <p style={{ color: '#94a3b8', fontSize: '1.1rem', marginBottom: '40px' }}>Let's set up your AI workforce. First, we'll activate your Lead Finder agent.</p>
            <button onClick={handleStep1} disabled={loading} className="btn-primary" style={{ width: '100%', padding: '18px' }}>
              {loading ? 'ACTIVATING...' : 'ACTIVATE LEAD FINDER'}
            </button>
          </div>
        )}

        {step === 2 && (
          <div style={{ animation: 'fadeIn 0.5s' }}>
            <h1 style={{ fontSize: '2.2rem', marginBottom: '20px' }}>Find Your First Clients</h1>
            <p style={{ color: '#94a3b8', marginBottom: '30px' }}>Tell us your niche and location to start real-time lead scraping.</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '15px', marginBottom: '30px' }}>
              <input 
                placeholder="Industry (e.g. Solar Panels)" 
                value={industry} 
                onChange={e => setIndustry(e.target.value)}
                style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', padding: '15px', borderRadius: '10px' }}
              />
              <input 
                placeholder="Location (e.g. Berlin)" 
                value={location} 
                onChange={e => setLocation(e.target.value)}
                style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', padding: '15px', borderRadius: '10px' }}
              />
            </div>
            <button onClick={handleStep2} disabled={loading || !industry || !location} className="btn-primary" style={{ width: '100%', padding: '18px' }}>
              {loading ? 'SCRAPING WEB...' : 'GENERATE FIRST LEADS'}
            </button>
          </div>
        )}

        {step === 3 && (
          <div style={{ animation: 'fadeIn 0.5s' }}>
            <h1 style={{ fontSize: '2.2rem', marginBottom: '20px' }}>Automation Engine</h1>
            <p style={{ color: '#94a3b8', marginBottom: '40px' }}>We've found leads. Now, let's install the Lead-to-Sale pipeline to handle outreach automatically.</p>
            <button onClick={handleStep3} disabled={loading} className="btn-primary" style={{ width: '100%', padding: '18px', background: '#8b5cf6' }}>
              {loading ? 'INSTALLING...' : 'INSTALL AUTOMATION PIPELINE'}
            </button>
          </div>
        )}

        {step === 4 && (
          <div style={{ animation: 'fadeIn 0.5s' }}>
            <h1 style={{ fontSize: '2.2rem', marginBottom: '20px' }}>Ready for Takeoff</h1>
            <p style={{ color: '#94a3b8', marginBottom: '40px' }}>Your AI agents are ready to work. Launch the first automation to start your business growth.</p>
            <button onClick={handleStep4} disabled={loading} className="btn-primary" style={{ width: '100%', padding: '18px', background: '#10b981' }}>
              {loading ? 'LAUNCHING...' : 'LAUNCH WORKSPACE'}
            </button>
          </div>
        )}

      </div>
      <style>{`
        @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
      `}</style>
    </div>
  );
}

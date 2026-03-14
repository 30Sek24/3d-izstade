import { useState } from 'react';

export default function AutonomousEngine() {
  const [niche, setNiche] = useState('');
  const [location, setLocation] = useState('Global');
  const [isRunning, setIsRunning] = useState(false);
  const [logs, setLogs] = useState<{ time: string; msg: string; type: string }[]>([]);
  const [progress, setProgress] = useState(0);

  const addLog = (msg: string, type: 'info' | 'success' | 'warning' = 'info') => {
    setLogs(prev => [...prev, { time: new Date().toLocaleTimeString(), msg, type }]);
  };

  const startEngine = async () => {
    if (!niche) return;
    
    setIsRunning(true);
    setLogs([]);
    setProgress(10);
    addLog(`[SYSTEM] Initializing Warpala Autonomous Engine for niche: ${niche}`, 'info');

    try {
      // Simulate real-time progress for the frontend demonstration
      addLog(`[AGENT: System Architect] Defining business model...`, 'info');
      await new Promise(r => setTimeout(r, 2000));
      setProgress(30);
      addLog(`[AGENT: System Architect] Business created: ${niche} Solutions`, 'success');

      addLog(`[AGENT: Marketing Agent] Analyzing target audience and generating campaign...`, 'info');
      await new Promise(r => setTimeout(r, 2500));
      setProgress(50);
      addLog(`[AGENT: Marketing Agent] Generated 3 social media hooks & 1 ad script.`, 'success');

      addLog(`[AGENT: Sales Agent] Scraping web for leads in ${location}...`, 'info');
      await new Promise(r => setTimeout(r, 3000));
      setProgress(75);
      addLog(`[AGENT: Sales Agent] Found 14 high-intent leads. Initializing email sequences.`, 'success');

      addLog(`[AGENT: Finance Agent] Setting up Stripe integrations and conversion tracking...`, 'info');
      await new Promise(r => setTimeout(r, 1500));
      setProgress(100);
      addLog(`[AGENT: Finance Agent] Revenue tracking online. System fully autonomous.`, 'success');

      addLog(`[SYSTEM] Full Autonomous Loop completed successfully.`, 'success');
      
    } catch (error) {
      addLog(`[SYSTEM] Engine failure: ${error}`, 'warning');
    } finally {
      setIsRunning(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', background: '#020617', color: '#fff', padding: '60px 20px', fontFamily: 'system-ui, sans-serif' }}>
      <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
        
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '50px' }}>
          <h1 style={{ fontSize: '3.5rem', fontWeight: 900, letterSpacing: '-2px', margin: 0, background: 'linear-gradient(135deg, #10b981, #3b82f6)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            AUTONOMOUS BUSINESS ENGINE
          </h1>
          <p style={{ color: '#94a3b8', fontSize: '1.2rem', marginTop: '15px' }}>
            Launch a fully automated AI business in seconds. Marketing, leads, sales, and revenue - handled by agents.
          </p>
        </div>

        {/* Input Area */}
        <div style={{ background: 'rgba(30, 41, 59, 0.5)', border: '1px solid #334155', borderRadius: '24px', padding: '40px', backdropFilter: 'blur(10px)', marginBottom: '40px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '30px' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '10px', color: '#cbd5e1', fontWeight: 'bold' }}>Target Niche / Industry</label>
              <input 
                type="text" 
                value={niche} 
                onChange={e => setNiche(e.target.value)} 
                placeholder="e.g. AI Automation Agency, Eco-friendly Furniture..." 
                style={inputStyle}
                disabled={isRunning}
              />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '10px', color: '#cbd5e1', fontWeight: 'bold' }}>Target Location</label>
              <input 
                type="text" 
                value={location} 
                onChange={e => setLocation(e.target.value)} 
                placeholder="e.g. New York, Global, remote..." 
                style={inputStyle}
                disabled={isRunning}
              />
            </div>
          </div>
          
          <button 
            onClick={startEngine} 
            disabled={isRunning || !niche} 
            style={{
              ...btnStyle, 
              background: isRunning ? '#334155' : 'linear-gradient(135deg, #10b981, #3b82f6)',
              color: isRunning ? '#94a3b8' : '#fff'
            }}
          >
            {isRunning ? 'ENGINE RUNNING...' : 'LAUNCH AUTONOMOUS BUSINESS'}
          </button>
        </div>

        {/* Console / Output Area */}
        <div style={{ background: '#0f172a', borderRadius: '16px', border: '1px solid #1e293b', overflow: 'hidden' }}>
          <div style={{ padding: '15px 20px', background: '#1e293b', borderBottom: '1px solid #334155', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontWeight: 800, color: '#94a3b8', fontSize: '0.9rem', letterSpacing: '1px' }}>SYSTEM TERMINAL</span>
            {isRunning && <div className="pulse-dot" style={{ width: '10px', height: '10px', background: '#10b981', borderRadius: '50%' }}></div>}
          </div>
          
          {/* Progress Bar */}
          {progress > 0 && (
            <div style={{ height: '4px', background: '#334155', width: '100%' }}>
              <div style={{ height: '100%', background: '#10b981', width: `${progress}%`, transition: 'width 0.5s ease' }}></div>
            </div>
          )}

          <div style={{ padding: '30px', minHeight: '300px', maxHeight: '500px', overflowY: 'auto', fontFamily: 'monospace', fontSize: '0.95rem' }}>
            {logs.length === 0 ? (
              <div style={{ color: '#64748b', textAlign: 'center', marginTop: '100px', opacity: 0.5 }}>
                <div style={{ fontSize: '3rem', marginBottom: '10px' }}>⚙️</div>
                Waiting for engine launch...
              </div>
            ) : (
              logs.map((log, i) => (
                <div key={i} style={{ marginBottom: '12px', color: log.type === 'success' ? '#10b981' : log.type === 'warning' ? '#f59e0b' : '#cbd5e1', lineHeight: '1.5' }}>
                  <span style={{ color: '#64748b', marginRight: '15px' }}>[{log.time}]</span>
                  {log.msg}
                </div>
              ))
            )}
          </div>
        </div>

      </div>
      <style>{`
        @keyframes pulse {
          0% { box-shadow: 0 0 0 0 rgba(16, 185, 129, 0.4); }
          70% { box-shadow: 0 0 0 10px rgba(16, 185, 129, 0); }
          100% { box-shadow: 0 0 0 0 rgba(16, 185, 129, 0); }
        }
        .pulse-dot { animation: pulse 2s infinite; }
      `}</style>
    </div>
  );
}

const inputStyle = {
  width: '100%',
  padding: '15px 20px',
  background: 'rgba(15, 23, 42, 0.8)',
  border: '1px solid #334155',
  borderRadius: '12px',
  color: '#fff',
  fontSize: '1.1rem',
  outline: 'none',
  boxSizing: 'border-box' as any
};

const btnStyle = {
  width: '100%',
  padding: '20px',
  border: 'none',
  borderRadius: '12px',
  fontSize: '1.2rem',
  fontWeight: 900,
  cursor: 'pointer',
  transition: 'transform 0.2s',
  letterSpacing: '1px',
  boxShadow: '0 10px 30px rgba(16, 185, 129, 0.2)'
};

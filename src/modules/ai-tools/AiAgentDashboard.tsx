import { useState } from 'react';
import '../../components/calculator/styles/CalculatorPro.css';
import { runSeoTask } from '../../agents/seoAgent';

export default function AiAgentDashboard() {
  const [stats, setStats] = useState({ revenue: 4250, completed: 84, active: 0 });
  const [logs, setLogs] = useState<string[]>([]);
  const [isRunning, setIsRunning] = useState(false);

  const addLog = (msg: string) => {
    setLogs(prev => [`[${new Date().toLocaleTimeString()}] ${msg}`, ...prev].slice(0, 50));
  };

  const executeAgent = async (type: string) => {
    setIsRunning(true);
    setStats(s => ({ ...s, active: s.active + 1 }));
    addLog(`INIT: Starting ${type.toUpperCase()} FLEET AGENT...`);
    
    try {
      if (type === 'seo') {
        addLog(`PROCESS: Connecting to Global Keyword Database...`);
        await new Promise(r => setTimeout(r, 1000));
        addLog(`ACTION: Identifying high-intent keywords for "Construction EU"...`);
        await runSeoTask();
        addLog(`SUCCESS: 3 Optimized landing pages deployed to Expo City.`);
        setStats(s => ({ ...s, completed: s.completed + 3 }));
      } else if (type === 'sales') {
        addLog(`PROCESS: Scanning CRM for high-value leads...`);
        await new Promise(r => setTimeout(r, 1500));
        addLog(`DATA: Found 2 leads with budget > 5,000€.`);
        addLog(`ACTION: Crafting personalized AI offers based on regional prices...`);
        await new Promise(r => setTimeout(r, 1000));
        addLog(`SUCCESS: 2 Offers sent to Jānis Bērziņš and SIA "Logistics".`);
        setStats(s => ({ ...s, revenue: s.revenue + 2450, completed: s.completed + 1 }));
      } else if (type === 'lead') {
        addLog(`PROCESS: Deep-scanning industry directories...`);
        await new Promise(r => setTimeout(r, 2000));
        addLog(`ACTION: Extracting verified business contacts...`);
        addLog(`SUCCESS: Found 12 new high-quality leads. Added to CRM.`);
        setStats(s => ({ ...s, completed: s.completed + 12 }));
      } else if (type === 'ads') {
        addLog(`PROCESS: Analyzing Ad Performance across Meta/Google...`);
        await new Promise(r => setTimeout(r, 1200));
        addLog(`ACTION: Auto-adjusting bids for "Roof Renovation" campaign.`);
        addLog(`SUCCESS: ROI increased by 14.2% through real-time bidding.`);
        setStats(s => ({ ...s, completed: s.completed + 1 }));
      } else {
        addLog(`PROCESS: Fleet-wide synchronization in progress...`);
        await new Promise(r => setTimeout(r, 2000));
        addLog(`SUCCESS: All neural nodes optimized.`);
      }
    } catch (err) {
      addLog(`ERROR: Critical sync failure in node ${Math.floor(Math.random()*1000)}.`);
    } finally {
      setIsRunning(false);
      setStats(s => ({ ...s, active: Math.max(0, s.active - 1) }));
    }
  };

  return (
    <div className="calculator-pro-wrapper" style={{ maxWidth: '1400px' }}>
      <div className="calc-header">
        <h1 style={{ background: 'linear-gradient(135deg, #8b5cf6, #10b981)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', fontSize: '3rem' }}>
          Warpala AI Fleet Control
        </h1>
        <p>Autonomā aģentu flote tavai biznesa izaugsmei.</p>
      </div>

      {/* AGENT STATS BAR */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px', marginBottom: '40px' }}>
        <div className="glass-card" style={{ padding: '25px', textAlign: 'center', borderColor: '#10b981' }}>
          <div style={{ fontSize: '0.7rem', color: '#aaa', fontWeight: 900 }}>REVENUE GENERATED</div>
          <div style={{ fontSize: '2.5rem', fontWeight: 950, color: '#10b981' }}>{stats.revenue.toLocaleString()} €</div>
        </div>
        <div className="glass-card" style={{ padding: '25px', textAlign: 'center', borderColor: '#3b82f6' }}>
          <div style={{ fontSize: '0.7rem', color: '#aaa', fontWeight: 900 }}>TASKS COMPLETED</div>
          <div style={{ fontSize: '2.5rem', fontWeight: 950, color: '#3b82f6' }}>{stats.completed}</div>
        </div>
        <div className="glass-card" style={{ padding: '25px', textAlign: 'center', borderColor: isRunning ? '#f59e0b' : '#334155' }}>
          <div style={{ fontSize: '0.7rem', color: '#aaa', fontWeight: 900 }}>ACTIVE AGENTS</div>
          <div style={{ fontSize: '2.5rem', fontWeight: 950, color: isRunning ? '#f59e0b' : '#fff' }}>{stats.active}</div>
        </div>
      </div>

      {/* SEO PIPELINE VISUAL WORKFLOW */}
      <div className="glass-card" style={{ padding: '30px', marginBottom: '40px', background: 'rgba(15, 23, 42, 0.9)', borderColor: '#ec4899' }}>
        <h3 style={{ color: '#ec4899', fontSize: '0.8rem', fontWeight: 900, marginBottom: '25px', textAlign: 'center', letterSpacing: '2px' }}>AUTONOMOUS SEO PIPELINE</h3>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '15px' }}>
          <div style={{ textAlign: 'center', flex: 1 }}>
            <div style={{ fontSize: '1.5rem' }}>🔑</div>
            <div style={{ fontWeight: 900, fontSize: '0.7rem', color: '#fff' }}>KEYWORD</div>
            <div style={{ color: '#aaa', fontSize: '0.6rem' }}>AI Research</div>
          </div>
          <div style={{ color: '#334155' }}>➔</div>
          <div style={{ textAlign: 'center', flex: 1 }}>
            <div style={{ fontSize: '1.5rem' }}>✍️</div>
            <div style={{ fontWeight: 900, fontSize: '0.7rem', color: '#fff' }}>WRITE</div>
            <div style={{ color: '#aaa', fontSize: '0.6rem' }}>AI Copywriter</div>
          </div>
          <div style={{ color: '#334155' }}>➔</div>
          <div style={{ textAlign: 'center', flex: 1 }}>
            <div style={{ fontSize: '1.5rem' }}>📄</div>
            <div style={{ fontWeight: 900, fontSize: '0.7rem', color: '#fff' }}>BUILD</div>
            <div style={{ color: '#aaa', fontSize: '0.6rem' }}>SEO Page</div>
          </div>
          <div style={{ color: '#334155' }}>➔</div>
          <div style={{ textAlign: 'center', flex: 1 }}>
            <div style={{ fontSize: '1.5rem' }}>🚀</div>
            <div style={{ fontWeight: 900, fontSize: '0.7rem', color: '#fff' }}>PUBLISH</div>
            <div style={{ color: '#aaa', fontSize: '0.6rem' }}>Live on Hub</div>
          </div>
          <div style={{ color: '#334155' }}>➔</div>
          <div style={{ textAlign: 'center', flex: 1 }}>
            <div style={{ fontSize: '1.5rem' }}>🔍</div>
            <div style={{ fontWeight: 900, fontSize: '0.7rem', color: '#fff' }}>INDEX</div>
            <div style={{ color: '#aaa', fontSize: '0.6rem' }}>Google Sync</div>
          </div>
          <div style={{ color: '#334155' }}>➔</div>
          <div style={{ textAlign: 'center', flex: 1 }}>
            <div style={{ fontSize: '1.5rem' }}>💰</div>
            <div style={{ fontWeight: 900, fontSize: '0.7rem', color: '#fff' }}>TRAFFIC</div>
            <div style={{ color: '#10b981', fontSize: '0.6rem' }}>Revenue Flow</div>
          </div>
        </div>
      </div>

      <div className="calc-grid">
        <div className="calc-form-column" style={{ flex: 1 }}>
          <section className="calc-section" style={{ borderLeftColor: '#8b5cf6' }}>
            <h2>Agent Fleet</h2>
            <div style={{ display: 'grid', gap: '10px' }}>
              <button onClick={() => executeAgent('seo')} className="btn-pro" style={{ background: '#ec4899', fontSize: '0.8rem' }}>PALAIST SEO AGENT (Traffic)</button>
              <button onClick={() => executeAgent('lead')} className="btn-pro" style={{ background: '#f59e0b', fontSize: '0.8rem' }}>PALAIST LEAD AGENT (Clients)</button>
              <button onClick={() => executeAgent('sales')} className="btn-pro" style={{ background: '#3b82f6', fontSize: '0.8rem' }}>PALAIST SALES AGENT (Deals)</button>
              <button onClick={() => executeAgent('ads')} className="btn-pro" style={{ background: '#10b981', fontSize: '0.8rem' }}>PALAIST ADS AGENT (Growth)</button>
              <button onClick={() => executeAgent('analytics')} className="btn-pro" style={{ background: '#ef4444', fontSize: '0.8rem' }}>PALAIST ANALYTICS (Optimization)</button>
            </div>
          </section>
        </div>

        <div className="calc-results-column" style={{ flex: 2 }}>
          <div className="sticky-results">
            <h3 className="results-title">Fleet Brain Terminal</h3>
            <div style={{ 
              background: '#050505', border: '1px solid #334155', borderRadius: '12px', padding: '20px', 
              height: '450px', overflowY: 'auto', fontFamily: 'JetBrains Mono, monospace', fontSize: '0.85rem', color: '#10b981'
            }}>
              {logs.map((log, i) => (
                <div key={i} style={{ marginBottom: '8px', color: log.includes('SUCCESS') ? '#10b981' : log.includes('ERROR') ? '#ef4444' : '#3b82f6' }}>
                  {log}
                </div>
              ))}
              {logs.length === 0 && <div style={{ color: '#475569' }}>$ Waiting for fleet activation...</div>}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

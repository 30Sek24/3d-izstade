import { useEffect, useState } from 'react';
import { marketplaceDashboardService } from '../app/marketplace/marketplaceDashboardService';
import { AgentCard } from '../components/ui/AgentCard';

export default function MarketplacePage() {
  const [agents, setAgents] = useState<any[]>([]);
  const [workflows, setWorkflows] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const USER_ID = '00000000-0000-0000-0000-000000000000';

  useEffect(() => {
    async function fetchData() {
      const [agentsRes, workflowsRes] = await Promise.all([
        marketplaceDashboardService.getMarketplaceAgents(),
        marketplaceDashboardService.getMarketplaceWorkflows()
      ]);
      if (agentsRes.data) setAgents(agentsRes.data);
      if (workflowsRes.data) setWorkflows(workflowsRes.data);
      setLoading(false);
    }
    fetchData();
  }, []);

  const handleInstallAgent = async (agentId: string) => {
    const res = await marketplaceDashboardService.installAgent(USER_ID, agentId);
    if (res.success) alert(`Agent ${agentId} installed successfully!`);
    else alert(`Error installing agent: ${res.error}`);
  };

  const handleInstallWorkflow = async (workflowId: string) => {
    const res = await marketplaceDashboardService.installWorkflow(USER_ID, workflowId);
    if (res.success) alert(`Workflow ${workflowId} installed successfully!`);
    else alert(`Error installing workflow: ${res.error}`);
  };

  if (loading) return <div style={{ padding: '50px', color: '#fff' }}>Loading App Store...</div>;

  return (
    <div style={{ padding: '40px', maxWidth: '1400px', margin: '0 auto', color: '#fff' }}>
      <h1 style={{ fontSize: '2.5rem', marginBottom: '10px' }}>AI App Store</h1>
      <p style={{ color: '#94a3b8', marginBottom: '40px' }}>Expand your capabilities with new AI workers and pipelines.</p>

      <div style={{ marginBottom: '50px' }}>
        <h2 style={{ fontSize: '1.5rem', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '10px', marginBottom: '20px' }}>🤖 Available Agents</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' }}>
          {agents.map(a => (
            <AgentCard 
              key={a.id}
              name={a.name}
              description={a.description}
              price={a.price}
              actionLabel={`Install for ${a.price === 0 ? 'FREE' : a.price + ' CR'}`}
              onAction={() => handleInstallAgent(a.id)}
            />
          ))}
        </div>
      </div>

      <div>
        <h2 style={{ fontSize: '1.5rem', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '10px', marginBottom: '20px' }}>⚙️ Automation Workflows</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' }}>
          {workflows.map(w => (
            <div key={w.id} style={{ background: 'rgba(255,255,255,0.03)', padding: '20px', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.05)' }}>
              <h3 style={{ margin: '0 0 10px 0', color: '#fff' }}>{w.name}</h3>
              <p style={{ color: '#94a3b8', fontSize: '0.9rem', marginBottom: '20px' }}>{w.description}</p>
              <div style={{ fontSize: '0.8rem', color: '#64748b', marginBottom: '20px' }}>
                <strong>Steps:</strong> {w.steps?.join(' → ')}
              </div>
              <button 
                onClick={() => handleInstallWorkflow(w.id)}
                style={{ width: '100%', background: '#8b5cf6', color: '#fff', border: 'none', padding: '10px', borderRadius: '8px', fontWeight: 700, cursor: 'pointer' }}
              >
                INSTALL PIPELINE ({w.price} CR)
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

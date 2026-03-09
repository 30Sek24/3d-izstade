import { useEffect, useState } from 'react';
import { agentControlService } from '../app/agents/agentControlService';
import { AgentCard } from '../components/ui/AgentCard';

export default function AgentsPage() {
  const [agents, setAgents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  const USER_ID = '00000000-0000-0000-0000-000000000000';

  useEffect(() => {
    async function fetchAgents() {
      const res = await agentControlService.listInstalledAgents(USER_ID);
      if (res.data) setAgents(res.data);
      setLoading(false);
    }
    fetchAgents();
  }, []);

  const handleRunTask = async (agentId: string) => {
    alert(`Running test task for agent ${agentId}...`);
    await agentControlService.runAgentTask(agentId, { action: 'Test execution from UI' });
  };

  const handleDisable = async (agentId: string) => {
    await agentControlService.disableAgent(USER_ID, agentId);
    alert('Agent disabled.');
  };

  return (
    <div style={{ padding: '40px', maxWidth: '1400px', margin: '0 auto', color: '#fff' }}>
      <h1 style={{ fontSize: '2.5rem', marginBottom: '10px' }}>My AI Workforce</h1>
      <p style={{ color: '#94a3b8', marginBottom: '40px' }}>Manage and trigger your installed agents.</p>

      {loading ? <p>Loading agents...</p> : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' }}>
          {agents.length === 0 ? <p style={{ color: '#64748b' }}>No agents installed. Visit the Marketplace.</p> : null}
          {agents.map((record) => (
            <div key={record.id} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <AgentCard 
                name={`Agent: ${record.marketplace_agent_id}`}
                status="enabled"
                isInstalled={true}
                actionLabel="Run Task"
                onAction={() => handleRunTask(record.marketplace_agent_id)}
              />
              <button onClick={() => handleDisable(record.marketplace_agent_id)} style={{ background: 'transparent', border: 'none', color: '#ef4444', cursor: 'pointer', fontSize: '0.8rem' }}>Disable Agent</button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

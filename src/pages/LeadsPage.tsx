import { useEffect, useState } from 'react';
import { leadDashboardService } from '../app/leads/leadDashboardService';
import { LeadTable } from '../components/ui/LeadTable';

export default function LeadsPage() {
  const [leads, setLeads] = useState<any[]>([]);
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      const [leadsRes, statsRes] = await Promise.all([
        leadDashboardService.getLeads(),
        leadDashboardService.getLeadStats()
      ]);
      if (leadsRes.data) setLeads(leadsRes.data);
      if (statsRes.data) setStats(statsRes.data);
      setLoading(false);
    }
    fetchData();
  }, []);

  const handleGenerate = async () => {
    alert('Started AI Lead Generation...');
    await leadDashboardService.runLeadGeneration('Tech', 'Riga');
    // Reload would happen here in real app
  };

  const handleContact = (id: string) => {
    alert(`Triggering Sales Agent to contact lead ${id}`);
    // Update local state to visually indicate it was clicked
    setLeads(prev => prev.map(l => l.id === id ? { ...l, contacted: true } : l));
  };

  return (
    <div style={{ padding: '40px', maxWidth: '1400px', margin: '0 auto', color: '#fff' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '40px' }}>
        <div>
          <h1 style={{ fontSize: '2.5rem', margin: 0 }}>Lead Engine</h1>
          <p style={{ color: '#94a3b8', margin: '10px 0 0 0' }}>Manage AI-generated business prospects.</p>
        </div>
        <button 
          onClick={handleGenerate}
          style={{ background: '#10b981', color: '#fff', border: 'none', padding: '12px 24px', borderRadius: '8px', fontWeight: 800, cursor: 'pointer' }}
        >
          + GENERATE LEADS
        </button>
      </div>

      {stats && (
        <div style={{ display: 'flex', gap: '20px', marginBottom: '30px' }}>
          <div style={{ background: 'rgba(255,255,255,0.05)', padding: '20px', borderRadius: '12px', flex: 1 }}>
            <div style={{ fontSize: '0.8rem', color: '#94a3b8' }}>TOTAL LEADS</div>
            <div style={{ fontSize: '2rem', fontWeight: 800 }}>{stats.total}</div>
          </div>
          <div style={{ background: 'rgba(255,255,255,0.05)', padding: '20px', borderRadius: '12px', flex: 1 }}>
            <div style={{ fontSize: '0.8rem', color: '#94a3b8' }}>HIGH QUALITY (&gt;80)</div>
            <div style={{ fontSize: '2rem', fontWeight: 800, color: '#f59e0b' }}>{stats.highValue}</div>
          </div>
          <div style={{ background: 'rgba(255,255,255,0.05)', padding: '20px', borderRadius: '12px', flex: 1 }}>
            <div style={{ fontSize: '0.8rem', color: '#94a3b8' }}>CONTACTED</div>
            <div style={{ fontSize: '2rem', fontWeight: 800, color: '#10b981' }}>{stats.contacted}</div>
          </div>
        </div>
      )}

      {loading ? <p>Loading leads...</p> : (
        <div style={{ background: 'rgba(15, 23, 42, 0.6)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '16px', overflow: 'hidden' }}>
          <LeadTable leads={leads} onContact={handleContact} />
        </div>
      )}
    </div>
  );
}

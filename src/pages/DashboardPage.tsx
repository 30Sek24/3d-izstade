import { useEffect, useState } from 'react';
import { dashboardService } from '../app/dashboard/dashboardService';
import { MetricCard } from '../components/ui/MetricCard';

export default function DashboardPage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Mock user ID for this implementation
  const USER_ID = '00000000-0000-0000-0000-000000000000';

  useEffect(() => {
    async function loadDashboard() {
      const res = await dashboardService.getUserDashboard(USER_ID);
      if (res.error) {
        setError(res.error);
      } else {
        setData(res.data);
      }
      setLoading(false);
    }
    loadDashboard();
  }, []);

  if (loading) return <div style={{ padding: '50px', color: '#fff' }}>Loading Platform Control Center...</div>;
  if (error) return <div style={{ padding: '50px', color: '#ef4444' }}>Error: {error}</div>;

  return (
    <div style={{ padding: '40px', maxWidth: '1400px', margin: '0 auto', color: '#fff' }}>
      <h1 style={{ fontSize: '2.5rem', marginBottom: '10px' }}>Platform Control Center</h1>
      <p style={{ color: '#94a3b8', marginBottom: '40px' }}>Overview of your AI operations and Metaverse metrics.</p>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '20px' }}>
        <MetricCard title="Credits Balance" value={data.credits_balance} subtitle="Available for AI operations" />
        <MetricCard title="Active Agents" value={data.active_agents} subtitle="Installed and ready" />
        <MetricCard title="Tasks Completed" value={data.running_tasks} subtitle="By your AI workforce" />
        <MetricCard title="Generated Leads" value={data.generated_leads} subtitle="Total collected" />
        <MetricCard title="Expo Visits" value={data.expo_booth_stats} subtitle="Across all your booths" />
      </div>
    </div>
  );
}

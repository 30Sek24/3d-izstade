import { useState, useEffect } from 'react';
import '../../components/calculator/styles/CalculatorPro.css';

export default function Leaderboard() {
  const [leaders, setLeaders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulējam datu ielādi no platformas statistikas
    const mockLeaders = [
      { id: 1, name: 'BuildMaster SIA', revenue: 450200, projects: 142, rating: 4.9, growth: '+12%' },
      { id: 2, name: 'EcoHeat Systems', revenue: 380500, projects: 89, rating: 4.8, growth: '+8%' },
      { id: 3, name: 'RenderMax Studio', revenue: 125000, projects: 215, rating: 5.0, growth: '+25%' },
      { id: 4, name: 'GreenClean PRO', revenue: 98400, projects: 312, rating: 4.7, growth: '+5%' },
      { id: 5, name: 'Solar Energy LV', revenue: 85000, projects: 45, rating: 4.6, growth: '+15%' },
    ].sort((a, b) => b.revenue - a.revenue);
    
    setTimeout(() => {
      setLeaders(mockLeaders);
      setLoading(false);
    }, 800);
  }, []);

  return (
    <div className="calculator-pro-wrapper">
      <div className="calc-header" style={{ textAlign: 'center' }}>
        <h1 className="text-accent" style={{ fontSize: '3.5rem' }}>Platform Top 100</h1>
        <p>Visveiksmīgākie uzņēmumi Warpala ekosistēmā šomēnes.</p>
      </div>

      <div className="glass-card" style={{ padding: '0', overflow: 'hidden', marginTop: '40px' }}>
        {loading ? (
          <div style={{ padding: '100px', textAlign: 'center' }}>
            <div className="spinner" style={{ border: '4px solid rgba(255,255,255,0.1)', borderTop: '4px solid var(--accent-blue)', borderRadius: '50%', width: '40px', height: '40px', animation: 'spin 1s linear infinite', margin: '0 auto 20px' }}></div>
          </div>
        ) : (
          <table className="results-table" style={{ margin: 0 }}>
            <thead>
              <tr style={{ background: 'rgba(255,255,255,0.02)' }}>
                <th style={{ padding: '25px', width: '80px' }}>RANK</th>
                <th>UZŅĒMUMS</th>
                <th>IEŅĒMUMI</th>
                <th>PROJEKTI</th>
                <th>RATING</th>
                <th style={{ textAlign: 'right', padding: '25px' }}>IZAUGSME</th>
              </tr>
            </thead>
            <tbody>
              {leaders.map((company, index) => (
                <tr key={company.id} className="activity-item" style={{ borderBottom: '1px solid rgba(255,255,255,0.03)' }}>
                  <td style={{ padding: '25px', textAlign: 'center' }}>
                    <div style={{ 
                      width: '40px', height: '40px', borderRadius: '50%', 
                      background: index === 0 ? '#fbbf24' : index === 1 ? '#94a3b8' : index === 2 ? '#92400e' : 'rgba(255,255,255,0.05)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontWeight: 900, color: index < 3 ? '#000' : '#fff', fontSize: '1rem'
                    }}>
                      {index + 1}
                    </div>
                  </td>
                  <td>
                    <div style={{ fontWeight: 800, color: '#fff', fontSize: '1.1rem' }}>{company.name}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>Verified Pro Member</div>
                  </td>
                  <td style={{ fontWeight: 900, color: 'var(--accent-blue)', fontSize: '1.2rem' }}>
                    {company.revenue.toLocaleString()} €
                  </td>
                  <td style={{ color: '#fff' }}>{company.projects}</td>
                  <td>⭐ {company.rating}</td>
                  <td style={{ textAlign: 'right', padding: '25px', color: '#10b981', fontWeight: 800 }}>
                    {company.growth}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <div style={{ marginTop: '40px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
        <div className="glass-card" style={{ padding: '30px', textAlign: 'center', background: 'rgba(59, 130, 246, 0.05)' }}>
          <h3 style={{ margin: '0 0 10px 0' }}>Tavs Rank: #42</h3>
          <p style={{ color: 'var(--text-dim)', fontSize: '0.9rem' }}>Tev pietrūkst 12,400 € līdz Top 30. Aktivizē AI mārketingu!</p>
          <button className="btn-primary" style={{ marginTop: '15px' }}>BOOST REVENUE</button>
        </div>
        <div className="glass-card" style={{ padding: '30px', textAlign: 'center', background: 'rgba(16, 185, 129, 0.05)' }}>
          <h3 style={{ margin: '0 0 10px 0' }}>Kopējā Ekonomika</h3>
          <p style={{ color: 'var(--text-dim)', fontSize: '0.9rem' }}>Šomēnes platformā apgrozīti 2.4M €. Izaugsme: +14%.</p>
          <button className="btn-glass" style={{ marginTop: '15px' }}>VIEW FULL STATS</button>
        </div>
      </div>
    </div>
  );
}

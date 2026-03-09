import { useState, useEffect } from 'react';
import '../../components/calculator/styles/CalculatorPro.css';
import { fetchClients } from '../../services/queries';

export default function ClientsDashboard() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [clients, setClients] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      try {
        const data = await fetchClients();
        setClients(data || []);
      } catch (e) {
        console.error("Kļūda ielādējot klientus:", e);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const filteredClients = clients.filter(client => {
    const matchesSearch = client.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          (client.projects && client.projects.some((p: any) => p.title.toLowerCase().includes(searchTerm.toLowerCase())));
    const matchesStatus = filterStatus === 'all' || (client.projects && client.projects.some((p: any) => p.status === filterStatus));
    return matchesSearch && matchesStatus;
  });

  const getStatusStyle = (status: string) => {
    switch(status) {
      case 'active': return { color: '#3b82f6', bg: 'rgba(59, 130, 246, 0.1)', text: 'AKTĪVS' };
      case 'lead': return { color: '#f59e0b', bg: 'rgba(245, 158, 11, 0.1)', text: 'POTENCIĀLS' };
      case 'completed': return { color: '#10b981', bg: 'rgba(16, 185, 129, 0.1)', text: 'PABEIGTS' };
      default: return { color: '#94a3b8', bg: 'rgba(148, 163, 184, 0.1)', text: 'DRAFT' };
    }
  };

  return (
    <div className="calculator-pro-wrapper">
      <div className="calc-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
        <div>
          <h1 className="text-accent">Klientu Vadība</h1>
          <p>Pārvaldi savus pasūtītājus un projektu statusus vienuviet.</p>
        </div>
        <button className="btn-primary">+ PIEVIENOT KLIENTU</button>
      </div>

      {/* FILTERS */}
      <div style={{ display: 'flex', gap: '20px', margin: '40px 0', alignItems: 'center' }}>
        <div style={{ flex: 1, position: 'relative' }}>
          <input 
            type="text" 
            placeholder="Meklēt pēc vārda vai projekta..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ width: '100%', padding: '15px 20px', borderRadius: '14px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', outline: 'none' }}
          />
        </div>
        <select 
          value={filterStatus} 
          onChange={(e) => setFilterStatus(e.target.value)}
          style={{ padding: '15px 20px', borderRadius: '14px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', outline: 'none' }}
        >
          <option value="all">Visi statusi</option>
          <option value="active">Aktīvie</option>
          <option value="lead">Potenciālie</option>
          <option value="completed">Pabeigtie</option>
        </select>
      </div>

      {/* CLIENTS TABLE */}
      <div className="glass-card" style={{ padding: '0', overflow: 'hidden' }}>
        {loading ? (
          <div style={{ padding: '60px', textAlign: 'center' }}>
            <div className="spinner" style={{ border: '4px solid rgba(255,255,255,0.1)', borderTop: '4px solid var(--accent-blue)', borderRadius: '50%', width: '40px', height: '40px', animation: 'spin 1s linear infinite', margin: '0 auto 20px' }}></div>
            <p>Ielādē klientus...</p>
          </div>
        ) : (
          <table className="results-table" style={{ margin: 0 }}>
            <thead>
              <tr style={{ background: 'rgba(255,255,255,0.02)' }}>
                <th style={{ padding: '20px' }}>KLIENTS</th>
                <th>PROJEKTI</th>
                <th>STATUSS</th>
                <th>VĒRTĪBA</th>
                <th>KONTAKTI</th>
                <th style={{ textAlign: 'right', padding: '20px' }}>DARBĪBAS</th>
              </tr>
            </thead>
            <tbody>
              {filteredClients.map(client => {
                const mainProject = client.projects?.[0];
                const status = getStatusStyle(mainProject?.status || 'draft');
                const totalValue = client.projects?.reduce((sum: number, p: any) => sum + (p.quotes?.[0]?.total_price || 0), 0) || 0;

                return (
                  <tr key={client.id} className="activity-item" style={{ borderBottom: '1px solid rgba(255,255,255,0.03)' }}>
                    <td style={{ padding: '20px' }}>
                      <div style={{ fontWeight: 800, color: '#fff' }}>{client.name}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>{client.address || 'Nav adreses'}</div>
                    </td>
                    <td>
                      <div style={{ fontSize: '0.9rem', color: '#e2e8f0' }}>
                        {client.projects?.length > 0 ? (
                          client.projects.map((p: any) => <div key={p.id}>• {p.title}</div>)
                        ) : (
                          <span style={{ opacity: 0.5 }}>Nav projektu</span>
                        )}
                      </div>
                    </td>
                    <td>
                      <span style={{ 
                        padding: '5px 12px', borderRadius: '20px', fontSize: '0.7rem', fontWeight: 900,
                        background: status.bg, color: status.color, border: `1px solid ${status.color}33`
                      }}>
                        {status.text}
                      </span>
                    </td>
                    <td style={{ fontWeight: 800, color: '#fff' }}>
                      {totalValue.toLocaleString()} €
                    </td>
                    <td>
                      <div style={{ fontSize: '0.8rem', color: 'var(--text-dim)' }}>{client.email}</div>
                      <div style={{ fontSize: '0.8rem', color: 'var(--text-dim)' }}>{client.phone}</div>
                    </td>
                    <td style={{ textAlign: 'right', padding: '20px' }}>
                      <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
                        <button className="btn-glass" style={{ padding: '8px', borderRadius: '10px' }}>📞</button>
                        <button className="btn-glass" style={{ padding: '8px', borderRadius: '10px' }}>✉️</button>
                        <button className="btn-glass" style={{ padding: '8px', borderRadius: '10px', borderColor: 'var(--accent-blue)' }}>→</button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
        {!loading && filteredClients.length === 0 && (
          <div style={{ padding: '60px', textAlign: 'center', color: 'var(--text-dim)' }}>
            Nekas netika atrasts.
          </div>
        )}
      </div>

      {/* SUMMARY STATS */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px', marginTop: '30px' }}>
        <div className="glass-card" style={{ padding: '20px', textAlign: 'center' }}>
          <div style={{ fontSize: '0.7rem', color: 'var(--text-dim)', fontWeight: 900 }}>KOPĒJĀ PORTFEĻA VĒRTĪBA</div>
          <div style={{ fontSize: '1.8rem', fontWeight: 900, color: '#fff', marginTop: '5px' }}>
            {clients.reduce((sum, c) => sum + (c.projects?.reduce((ps: number, p: any) => ps + (p.quotes?.[0]?.total_price || 0), 0) || 0), 0).toLocaleString()} €
          </div>
        </div>
        <div className="glass-card" style={{ padding: '20px', textAlign: 'center' }}>
          <div style={{ fontSize: '0.7rem', color: 'var(--text-dim)', fontWeight: 900 }}>KLIENTU SKAITS</div>
          <div style={{ fontSize: '1.8rem', fontWeight: 900, color: 'var(--accent-purple)', marginTop: '5px' }}>
            {clients.length}
          </div>
        </div>
        <div className="glass-card" style={{ padding: '20px', textAlign: 'center' }}>
          <div style={{ fontSize: '0.7rem', color: 'var(--text-dim)', fontWeight: 900 }}>AKTUĀLIE PROJEKTI</div>
          <div style={{ fontSize: '1.8rem', fontWeight: 900, color: 'var(--accent-blue)', marginTop: '5px' }}>
            {clients.reduce((sum, c) => sum + (c.projects?.filter((p: any) => p.status === 'active').length || 0), 0)}
          </div>
        </div>
      </div>
      <style>{`
        @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
}

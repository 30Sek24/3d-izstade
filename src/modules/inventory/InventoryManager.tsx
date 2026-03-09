import { useState } from 'react';
import '../../components/calculator/styles/CalculatorPro.css';

export default function InventoryManager() {
  const [inventory] = useState([
    { id: 'item-1', name: 'Panasonic Aquarea T-CAP 9kW', category: 'Siltumsūkņi', stock: 4, minStock: 2, price: 6500, status: 'ok' },
    { id: 'item-2', name: 'Reģipsis KNAUF White 12.5mm', category: 'Būvmateriāli', stock: 15, minStock: 50, price: 8.50, status: 'low' },
    { id: 'item-3', name: 'Ruukki Monterrey Jumta profils', category: 'Jumta segumi', stock: 120, minStock: 100, price: 14.20, status: 'ok' },
    { id: 'item-4', name: 'Makita 18V Urbjmašīna (Noma)', category: 'Iekārtas', stock: 0, minStock: 2, price: 15.00, status: 'out' },
    { id: 'item-5', name: 'Akmens vate PAROC eXtra 100mm', category: 'Siltināšana', stock: 8, minStock: 20, price: 28.00, status: 'low' },
  ]);

  const [searchTerm, setSearchTerm] = useState('');

  const filtered = inventory.filter(i => i.name.toLowerCase().includes(searchTerm.toLowerCase()) || i.category.toLowerCase().includes(searchTerm.toLowerCase()));

  const totalValue = inventory.reduce((acc, item) => acc + (item.stock * item.price), 0);

  return (
    <div className="calculator-pro-wrapper">
      <div className="calc-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
        <div>
          <h1 className="text-accent" style={{ fontSize: '3.5rem' }}>Noliktava & Aktīvi</h1>
          <p>Reāllaika preču atlikumi, iekārtu reģistrs un AI apgādes prognozes.</p>
        </div>
        <div style={{ display: 'flex', gap: '15px' }}>
          <button className="btn-glass">AI APGĀDES PROGNOZE</button>
          <button className="btn-primary">+ PIEVIENOT PRECI</button>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px', marginTop: '40px', marginBottom: '40px' }}>
        <div className="glass-card" style={{ padding: '25px', borderLeft: '4px solid #3b82f6' }}>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-dim)', fontWeight: 900, marginBottom: '5px' }}>KOPĒJĀ NOLIKTAVAS VĒRTĪBA</div>
          <div style={{ fontSize: '2rem', fontWeight: 950, color: '#fff' }}>{totalValue.toLocaleString()} €</div>
        </div>
        <div className="glass-card" style={{ padding: '25px', borderLeft: '4px solid #f59e0b' }}>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-dim)', fontWeight: 900, marginBottom: '5px' }}>KRITISKS ATLIKUMS</div>
          <div style={{ fontSize: '2rem', fontWeight: 950, color: '#f59e0b' }}>
            {inventory.filter(i => i.status === 'low' || i.status === 'out').length} PRECES
          </div>
        </div>
        <div className="glass-card" style={{ padding: '25px', background: 'rgba(59, 130, 246, 0.1)', borderColor: 'rgba(59, 130, 246, 0.3)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
            <div style={{ fontSize: '2.5rem' }}>🤖</div>
            <div>
              <div style={{ fontSize: '0.8rem', color: 'var(--accent-blue)', fontWeight: 900, marginBottom: '5px' }}>AI RECOMMENDATION</div>
              <div style={{ fontSize: '0.85rem', color: '#fff' }}>Ieteicams pasūtīt <b>Reģipsi</b> pirms piektdienas (prognozēts pieprasījums).</div>
            </div>
          </div>
        </div>
      </div>

      <div style={{ marginBottom: '20px' }}>
        <input 
          type="text" 
          placeholder="Meklēt preci vai kategoriju..." 
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{ width: '100%', maxWidth: '400px', padding: '15px 20px', borderRadius: '14px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', outline: 'none' }}
        />
      </div>

      <div className="glass-card" style={{ padding: '0', overflow: 'hidden' }}>
        <table className="results-table" style={{ margin: 0 }}>
          <thead>
            <tr style={{ background: 'rgba(255,255,255,0.02)' }}>
              <th style={{ padding: '20px' }}>PRECE / IEKĀRTA</th>
              <th>KATEGORIJA</th>
              <th>ATLIKUMS</th>
              <th>VĒRTĪBA (GAB)</th>
              <th style={{ textAlign: 'right', padding: '20px' }}>STATUSS</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(item => (
              <tr key={item.id} className="activity-item" style={{ borderBottom: '1px solid rgba(255,255,255,0.03)' }}>
                <td style={{ padding: '20px', fontWeight: 800, color: '#fff' }}>{item.name}</td>
                <td style={{ color: 'var(--text-dim)', fontSize: '0.9rem' }}>{item.category}</td>
                <td>
                  <span style={{ fontWeight: 900, color: item.status === 'out' ? '#ef4444' : item.status === 'low' ? '#f59e0b' : '#10b981', fontSize: '1.2rem' }}>
                    {item.stock}
                  </span>
                  <span style={{ color: 'var(--text-dim)', fontSize: '0.75rem', marginLeft: '8px' }}>/ Min: {item.minStock}</span>
                </td>
                <td style={{ fontWeight: 800 }}>{item.price.toFixed(2)} €</td>
                <td style={{ textAlign: 'right', padding: '20px' }}>
                  {item.status === 'out' ? (
                    <span style={{ background: 'rgba(239, 68, 68, 0.1)', color: '#ef4444', padding: '5px 12px', borderRadius: '20px', fontSize: '0.7rem', fontWeight: 900 }}>OUT OF STOCK</span>
                  ) : item.status === 'low' ? (
                    <span style={{ background: 'rgba(245, 158, 11, 0.1)', color: '#f59e0b', padding: '5px 12px', borderRadius: '20px', fontSize: '0.7rem', fontWeight: 900 }}>LOW STOCK</span>
                  ) : (
                    <span style={{ background: 'rgba(16, 185, 129, 0.1)', color: '#10b981', padding: '5px 12px', borderRadius: '20px', fontSize: '0.7rem', fontWeight: 900 }}>OPTIMAL</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

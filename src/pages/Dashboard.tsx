import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import type { Session } from '@supabase/supabase-js';
import { Link } from 'react-router-dom';

export default function Dashboard() {
  const [session, setSession] = useState<Session | null>(null);
  const [estimates, setEstimates] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (session) {
        fetchMyEstimates(session.user.id);
      } else {
        setIsLoading(false);
      }
    });
  }, []);

  const fetchMyEstimates = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('estimate')
        .select('id, estimate_no, status, client_name, location_address, created_at, updated_at')
        .eq('created_by', userId)
        .order('updated_at', { ascending: false });

      if (error) throw error;
      setEstimates(data || []);
    } catch (error) {
      console.error("Kļūda ielādējot tāmes:", error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) return <div style={{ padding: '40px', textAlign: 'center' }}>Ielādē datus...</div>;

  if (!session) {
    return (
      <div style={{ maxWidth: '800px', margin: '40px auto', padding: '0 20px', textAlign: 'center' }}>
        <h2>Piekļuve liegta</h2>
        <p style={{ color: '#666', marginBottom: '20px' }}>Lūdzu, ielogojieties, lai redzētu savus saglabātos aprēķinus.</p>
        <Link to="/login" className="btn">Ielogoties</Link>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '1000px', margin: '40px auto', padding: '0 20px', width: '100%' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
        <h1 style={{ fontSize: '2rem' }}>Mans Kabinets</h1>
        <Link to="/kalkulators" className="btn" style={{ background: '#eab308', color: '#000', fontWeight: 'bold' }}>
          + Jauna Tāme
        </Link>
      </div>

      <div style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: '8px', overflow: 'hidden', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: '#f9fafb', borderBottom: '1px solid #e5e7eb', textAlign: 'left' }}>
              <th style={{ padding: '15px', color: '#6b7280', fontWeight: 500, fontSize: '0.9rem' }}>Nr.</th>
              <th style={{ padding: '15px', color: '#6b7280', fontWeight: 500, fontSize: '0.9rem' }}>Klients / Objekts</th>
              <th style={{ padding: '15px', color: '#6b7280', fontWeight: 500, fontSize: '0.9rem' }}>Statuss</th>
              <th style={{ padding: '15px', color: '#6b7280', fontWeight: 500, fontSize: '0.9rem' }}>Izveidots</th>
              <th style={{ padding: '15px', color: '#6b7280', fontWeight: 500, fontSize: '0.9rem', textAlign: 'right' }}>Darbības</th>
            </tr>
          </thead>
          <tbody>
            {estimates.length === 0 ? (
              <tr>
                <td colSpan={5} style={{ padding: '40px', textAlign: 'center', color: '#9ca3af' }}>
                  Jums vēl nav saglabātu tāmju.
                </td>
              </tr>
            ) : (
              estimates.map((est) => (
                <tr key={est.id} style={{ borderBottom: '1px solid #f3f4f6' }}>
                  <td style={{ padding: '15px', fontWeight: 500 }}>{est.estimate_no}</td>
                  <td style={{ padding: '15px' }}>
                    <div style={{ fontWeight: 500 }}>{est.client_name}</div>
                    <div style={{ fontSize: '0.85rem', color: '#6b7280' }}>{est.location_address}</div>
                  </td>
                  <td style={{ padding: '15px' }}>
                    <span style={{ 
                      padding: '4px 8px', 
                      borderRadius: '4px', 
                      fontSize: '0.8rem',
                      fontWeight: 600,
                      background: est.status === 'draft' ? '#fef9c3' : '#dcfce7',
                      color: est.status === 'draft' ? '#854d0e' : '#166534'
                    }}>
                      {est.status === 'draft' ? 'Melnraksts' : 'Pabeigts'}
                    </span>
                  </td>
                  <td style={{ padding: '15px', color: '#6b7280', fontSize: '0.9rem' }}>
                    {new Date(est.created_at).toLocaleDateString('lv-LV')}
                  </td>
                  <td style={{ padding: '15px', textAlign: 'right' }}>
                    <button className="btn btn-soft" style={{ padding: '6px 12px', fontSize: '0.85rem' }}>Atvērt</button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
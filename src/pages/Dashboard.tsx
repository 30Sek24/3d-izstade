import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import type { Session } from '@supabase/supabase-js';
import { Link, useNavigate } from 'react-router-dom';
import '../components/calculator/styles/CalculatorPro.css';

export default function Dashboard() {
  const [session, setSession] = useState<Session | null>(null);
  const [estimates, setEstimates] = useState<any[]>([]);
  const [gameProgress, setGameProgress] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [showSeminarForm, setShowSeminarForm] = useState(false);
  const [seminarTitle, setSeminarTitle] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (session) {
        fetchMyEstimates(session.user.id);
        loadGameProgress();
      } else {
        setIsLoading(false);
      }
    });
  }, []);

  const loadGameProgress = () => {
    const saved = localStorage.getItem('biz_game_progress');
    if (saved) {
      const completed = JSON.parse(saved);
      setGameProgress(Math.round((completed.length / 30) * 100));
    }
  };

  const fetchMyEstimates = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('estimate')
        .select('id, estimate_no, status, client_name, location_address, created_at, total_amount')
        .eq('created_by', userId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setEstimates(data || []);
    } catch (error) {
      console.error("Kļūda ielādējot tāmes:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleStartSeminar = async () => {
    if (!seminarTitle) return alert("Ievadiet semināra tēmu!");
    alert(`Seminārs "${seminarTitle}" ir izsludināts! Jūsu stends tagad tiek reklamēts Semināru zālē.`);
    setShowSeminarForm(false);
  };

  if (isLoading) return <div style={{ padding: '100px', textAlign: 'center', fontSize: '1.2rem', color: '#64748b' }}>Sagatavo darba virsmu...</div>;

  if (!session) {
    return (
      <div style={{ maxWidth: '500px', margin: '100px auto', padding: '40px', textAlign: 'center', background: '#fff', borderRadius: '20px', boxShadow: '0 20px 40px rgba(0,0,0,0.05)' }}>
        <div style={{ fontSize: '4rem', marginBottom: '20px' }}>🔒</div>
        <h2 style={{ fontSize: '2rem', marginBottom: '10px' }}>Piekļuve liegta</h2>
        <p style={{ color: '#64748b', marginBottom: '30px' }}>Lai piekļūtu savam PRO kabinetam, lūdzu, autorizējieties.</p>
        <button onClick={() => navigate('/login')} className="btn-primary" style={{ width: '100%' }}>Ielogoties</button>
      </div>
    );
  }

  const userRole = session.user.user_metadata?.role || 'builder';
  const roleName = {
    builder: 'Būvniecības Meistars',
    architect: 'Arhitekts / Dizainers',
    materials: 'Materiālu Piegādātājs',
    real_estate: 'Īpašumu Aģents',
    services: 'Pakalpojumu sniedzējs'
  }[userRole as string] || 'Lietotājs';

  return (
    <div style={{ maxWidth: '1200px', margin: '40px auto', padding: '0 20px' }}>
      
      {/* Header Profile */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px' }}>
        <div>
          <h1 style={{ fontSize: '2.5rem', fontWeight: 900, color: '#0f172a', margin: 0 }}>Sveiki, {session.user.email?.split('@')[0]}!</h1>
          <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
            <span style={{ padding: '4px 12px', background: '#3b82f615', color: '#3b82f6', borderRadius: '50px', fontSize: '0.85rem', fontWeight: 800, textTransform: 'uppercase' }}>{roleName}</span>
            <span style={{ padding: '4px 12px', background: '#10b98115', color: '#10b981', borderRadius: '50px', fontSize: '0.85rem', fontWeight: 800 }}>PRO STATUSS</span>
          </div>
        </div>
        <div style={{ display: 'flex', gap: '15px' }}>
          <button onClick={() => setShowSeminarForm(true)} className="btn-secondary" style={{ padding: '12px 25px', background: '#8b5cf6', color: '#fff', borderColor: '#8b5cf6' }}>🎤 Rīkot Semināru</button>
          <button onClick={() => navigate('/expo')} className="btn-secondary" style={{ padding: '12px 25px' }}>Mans 3D Stends</button>
          <button onClick={() => navigate('/kalkulators')} className="btn-primary" style={{ padding: '12px 25px', background: '#3b82f6' }}>+ Jauna Tāme</button>
        </div>
      </div>

      {showSeminarForm && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)', zIndex: 10000, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ background: '#fff', padding: '40px', borderRadius: '20px', width: '400px' }}>
            <h2 style={{ marginBottom: '20px' }}>Izsludināt Semināru</h2>
            <input type="text" placeholder="Semināra tēma" value={seminarTitle} onChange={(e) => setSeminarTitle(e.target.value)} style={{ width: '100%', padding: '12px', marginBottom: '20px', borderRadius: '8px', border: '1px solid #ddd' }} />
            <button onClick={handleStartSeminar} className="btn-primary" style={{ width: '100%', background: '#8b5cf6' }}>PUBLICĒT REKLĀMU</button>
            <button onClick={() => setShowSeminarForm(false)} style={{ width: '100%', background: 'none', border: 'none', marginTop: '10px', color: '#64748b', cursor: 'pointer' }}>Atcelt</button>
          </div>
        </div>
      )}

      {/* Grid Layout */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '25px', marginBottom: '40px' }}>
        
        {/* Card 1: Game Progress */}
        <div style={{ background: '#fff', padding: '30px', borderRadius: '20px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px rgba(0,0,0,0.02)' }}>
          <h3 style={{ fontSize: '0.9rem', color: '#64748b', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '20px' }}>Biznesa Izaicinājums</h3>
          <div style={{ fontSize: '2.5rem', fontWeight: 900, color: '#0f172a', marginBottom: '10px' }}>{gameProgress}%</div>
          <div style={{ background: '#f1f5f9', height: '8px', borderRadius: '10px', overflow: 'hidden', marginBottom: '15px' }}>
            <div style={{ width: `${gameProgress}%`, background: '#8b5cf6', height: '100%' }}></div>
          </div>
          <Link to="/bizness30" style={{ color: '#8b5cf6', fontWeight: 700, textDecoration: 'none', fontSize: '0.9rem' }}>Turpināt uzdevumus →</Link>
        </div>

        {/* Card 2: Estimates Stat */}
        <div style={{ background: '#fff', padding: '30px', borderRadius: '20px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px rgba(0,0,0,0.02)' }}>
          <h3 style={{ fontSize: '0.9rem', color: '#64748b', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '20px' }}>Aktīvās Tāmes</h3>
          <div style={{ fontSize: '2.5rem', fontWeight: 900, color: '#0f172a', marginBottom: '10px' }}>{estimates.length}</div>
          <p style={{ color: '#64748b', fontSize: '0.9rem', margin: 0 }}>Kopējā vērtība: <strong style={{color: '#0f172a'}}>{estimates.reduce((acc, curr) => acc + (curr.total_amount || 0), 0).toFixed(0)} €</strong></p>
        </div>

        {/* Card 3: New Leads */}
        <div style={{ background: '#fff', padding: '30px', borderRadius: '20px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px rgba(0,0,0,0.02)' }}>
          <h3 style={{ fontSize: '0.9rem', color: '#64748b', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '20px' }}>Jauni Pasūtījumi</h3>
          <div style={{ fontSize: '2.5rem', fontWeight: 900, color: '#10b981', marginBottom: '10px' }}>3</div>
          <p style={{ color: '#64748b', fontSize: '0.9rem', margin: 0 }}>Pieteikumi no Expo Info Galda</p>
        </div>

      </div>

      {/* Estimates Table */}
      <div style={{ background: '#fff', borderRadius: '20px', border: '1px solid #e2e8f0', overflow: 'hidden', boxShadow: '0 10px 30px rgba(0,0,0,0.03)' }}>
        <div style={{ padding: '25px 30px', borderBottom: '1px solid #f1f5f9', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 800, margin: 0 }}>Pēdējie aprēķini</h2>
          <Link to="/kalkulators" style={{ fontSize: '0.9rem', fontWeight: 700, color: '#3b82f6', textDecoration: 'none' }}>Skatīt visus</Link>
        </div>
        
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ textAlign: 'left', background: '#f8fafc' }}>
              <th style={{ padding: '15px 30px', color: '#64748b', fontSize: '0.75rem', textTransform: 'uppercase' }}>Nr.</th>
              <th style={{ padding: '15px', color: '#64748b', fontSize: '0.75rem', textTransform: 'uppercase' }}>Klients / Adrese</th>
              <th style={{ padding: '15px', color: '#64748b', fontSize: '0.75rem', textTransform: 'uppercase' }}>Statuss</th>
              <th style={{ padding: '15px', color: '#64748b', fontSize: '0.75rem', textTransform: 'uppercase' }}>Summa</th>
              <th style={{ padding: '15px 30px', textAlign: 'right', color: '#64748b', fontSize: '0.75rem', textTransform: 'uppercase' }}>Darbības</th>
            </tr>
          </thead>
          <tbody>
            {estimates.length === 0 ? (
              <tr>
                <td colSpan={5} style={{ padding: '60px', textAlign: 'center', color: '#94a3b8' }}>
                  <div style={{ fontSize: '2rem', marginBottom: '10px' }}>📄</div>
                  Jums vēl nav saglabātu tāmju. Sāciet ar jaunu aprēķinu!
                </td>
              </tr>
            ) : (
              estimates.slice(0, 5).map((est) => (
                <tr key={est.id} style={{ borderBottom: '1px solid #f8fafc' }}>
                  <td style={{ padding: '20px 30px', fontWeight: 700, color: '#334155' }}>{est.estimate_no}</td>
                  <td style={{ padding: '20px' }}>
                    <div style={{ fontWeight: 700, color: '#0f172a' }}>{est.client_name || 'Privātpersona'}</div>
                    <div style={{ fontSize: '0.8rem', color: '#64748b' }}>{est.location_address || 'Nav norādīta'}</div>
                  </td>
                  <td style={{ padding: '20px' }}>
                    <span style={{ 
                      padding: '4px 10px', borderRadius: '6px', fontSize: '0.75rem', fontWeight: 800,
                      background: est.status === 'draft' ? '#fff7ed' : '#f0fdf4',
                      color: est.status === 'draft' ? '#c2410c' : '#16a34a',
                      border: `1px solid ${est.status === 'draft' ? '#ffedd5' : '#dcfce7'}`
                    }}>
                      {est.status === 'draft' ? 'MELNRAKSTS' : 'NOSŪTĪTS'}
                    </span>
                  </td>
                  <td style={{ padding: '20px', fontWeight: 800, color: '#0f172a' }}>
                    {(est.total_amount || 0).toFixed(0)} €
                  </td>
                  <td style={{ padding: '20px 30px', textAlign: 'right' }}>
                    <button style={{ padding: '8px 15px', background: '#f1f5f9', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 700, color: '#475569' }}>Atvērt PDF</button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Quick Links */}
      <div style={{ marginTop: '40px', display: 'flex', gap: '20px' }}>
        <div style={{ flex: 1, background: 'linear-gradient(135deg, #0f172a, #334155)', padding: '30px', borderRadius: '24px', color: '#fff' }}>
          <h3 style={{ margin: '0 0 10px 0' }}>Vajadzīgs atbalsts?</h3>
          <p style={{ color: '#94a3b8', fontSize: '0.9rem', marginBottom: '20px' }}>Mūsu dežuranti ir pieejami 24/7, lai palīdzētu ar sistēmas lietošanu.</p>
          <button style={{ padding: '10px 20px', background: '#fff', color: '#0f172a', border: 'none', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer' }}>Čatot ar atbalstu</button>
        </div>
        <div style={{ flex: 1, background: '#fefce8', border: '1px solid #fef08a', padding: '30px', borderRadius: '24px' }}>
          <h3 style={{ margin: '0 0 10px 0', color: '#854d0e' }}>Mārketinga Padoms</h3>
          <p style={{ color: '#a16207', fontSize: '0.9rem', marginBottom: '20px' }}>Pievieno "Pirms/Pēc" bildes savam profilam, lai piesaistītu par 40% vairāk klientu.</p>
          <button style={{ padding: '10px 20px', background: '#eab308', color: '#000', border: 'none', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer' }}>Atjaunot Portfolio</button>
        </div>
      </div>

    </div>
  );
}
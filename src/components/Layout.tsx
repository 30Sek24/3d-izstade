import { useState, useEffect } from 'react';
import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import type { Session } from '@supabase/supabase-js';

export default function Layout() {
  const [session, setSession] = useState<Session | null>(null);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/');
  };

  const isExpo = location.pathname.startsWith('/expo');

  return (
    <div className="layout-root">
      <header className="glass-nav">
        <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '16px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Link to="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ 
              width: '40px', height: '40px', 
              background: 'linear-gradient(135deg, var(--accent-primary), var(--accent-secondary))', 
              borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', 
              fontWeight: 'bold', fontSize: '1.2rem', color: '#fff', 
              boxShadow: '0 4px 15px rgba(59, 130, 246, 0.4)' 
            }}>P</div>
            <span style={{ fontWeight: 900, fontSize: '1.4rem', letterSpacing: '-1px', color: 'var(--text-primary)' }}>Platformu Centrs</span>
          </Link>
          
          <nav style={{ display: 'flex', gap: '30px', alignItems: 'center', fontSize: '0.9rem', fontWeight: 600 }}>
            <Link to="/expo" className="nav-link">3D EXPO</Link>
            <Link to="/kalkulators" className="nav-link">PRO TĀMES</Link>
            <Link to="/bizness30" className="nav-link">BIZNESA SKOLA</Link>
            <Link to="/orakuls" className="nav-link">AI ORĀKULS</Link>
            
            <div style={{ width: '1px', height: '20px', background: 'var(--border-glass)' }}></div>
            
            {session ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                <Link to="/dashboard" style={{ textDecoration: 'none', color: 'var(--accent-primary)', fontWeight: 800 }}>KABINETS</Link>
                <button onClick={handleLogout} className="btn-pro btn-pro-secondary" style={{ padding: '8px 16px', fontSize: '0.8rem' }}>IZIET</button>
              </div>
            ) : (
              <Link to="/login" className="btn-pro btn-pro-primary">IENĀKT</Link>
            )}
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main style={{ flexGrow: 1, minHeight: 'calc(100vh - 73px)' }}>
        <Outlet />
      </main>

      {/* Footer (Hidden on Expo pages) */}
      {!isExpo && (
        <footer style={{ 
          padding: '80px 24px 40px', 
          background: 'rgba(2, 6, 23, 0.5)', 
          borderTop: '1px solid var(--border-glass)',
          color: 'var(--text-secondary)'
        }}>
          <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '40px', marginBottom: '60px' }}>
              <div>
                <h4 style={{ color: '#fff', marginBottom: '20px' }}>Platformu Centrs</h4>
                <p style={{ fontSize: '0.9rem' }}>Pasaulē pirmā 3D būvniecības ekosistēma. Tāmes, speciālisti un 3D izstādes vienuviet.</p>
              </div>
              <div>
                <h5 style={{ color: '#fff', marginBottom: '20px' }}>Resursi</h5>
                <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '0.9rem' }}>
                  <li><Link to="/kalkulators" style={{ color: 'inherit', textDecoration: 'none' }}>PRO Kalkulatori</Link></li>
                  <li><Link to="/expo" style={{ color: 'inherit', textDecoration: 'none' }}>3D Metaverse Expo</Link></li>
                  <li><Link to="/bizness30" style={{ color: 'inherit', textDecoration: 'none' }}>30 Dienu Spēle</Link></li>
                </ul>
              </div>
              <div>
                <h5 style={{ color: '#fff', marginBottom: '20px' }}>Juridiskā info</h5>
                <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '0.9rem' }}>
                  <li><Link to="/terms" style={{ color: 'inherit', textDecoration: 'none' }}>Lietošanas noteikumi</Link></li>
                  <li><Link to="/privacy" style={{ color: 'inherit', textDecoration: 'none' }}>Privātuma politika</Link></li>
                </ul>
              </div>
              <div>
                <h5 style={{ color: '#fff', marginBottom: '20px' }}>Kontakti</h5>
                <p style={{ fontSize: '0.9rem' }}>support@platformucentrs.lv</p>
                <p style={{ fontSize: '0.9rem' }}>+371 20000000</p>
              </div>
            </div>
            <div style={{ textAlign: 'center', paddingTop: '40px', borderTop: '1px solid var(--border-glass)', fontSize: '0.8rem' }}>
              &copy; 2026 Platformu Centrs Metaverse. Built with 3D Precision.
            </div>
          </div>
        </footer>
      )}

      {/* Floating Expo Button */}
      {!isExpo && sessionStorage.getItem('expo_camera_pos') && (
        <button 
          onClick={() => navigate('/expo')}
          className="glass-card"
          style={{ 
            position: 'fixed', bottom: '40px', left: '40px', zIndex: 999,
            padding: '16px 32px', borderRadius: '50px', cursor: 'pointer',
            color: '#fff', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '12px',
            border: '2px solid var(--accent-primary)', textTransform: 'uppercase'
          }}
        >
          <span>←</span> Atpakaļ uz Izstādi
        </button>
      )}

      <style>{`
        .nav-link {
          text-decoration: none;
          color: var(--text-secondary);
          transition: color 0.2s;
        }
        .nav-link:hover {
          color: var(--text-primary);
        }
        .layout-root {
          min-height: 100vh;
          display: flex;
          flex-direction: column;
        }
      `}</style>
    </div>
  );
}

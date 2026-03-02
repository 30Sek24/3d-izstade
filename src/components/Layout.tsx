import { useState, useEffect } from 'react';
import { Outlet, Link, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import type { Session } from '@supabase/supabase-js';

export default function Layout() {
  const [session, setSession] = useState<Session | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Iegūstam pašreizējo sesiju
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    // Klausāmies uz ielogošanās/izlogošanās notikumiem
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

  const isInExpo = window.location.pathname === '/expo';

  return (
    <div className="layout">
      <header className="site-header">
        <div className="container site-header-main" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Link to="/" className="logo brand-lockup" style={{ textDecoration: 'none', color: 'inherit', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div style={{ width: '32px', height: '32px', background: 'var(--accent, #3b82f6)', borderRadius: '4px' }}></div>
            <span className="logo-wordmark" style={{ fontWeight: 'bold', fontSize: '1.2rem' }}>Platformu Centrs</span>
          </Link>
          <nav className="nav nav-primary" style={{ display: 'flex', gap: '15px', alignItems: 'center', fontSize: '0.95rem' }}>
            <Link to="/expo" style={{ textDecoration: 'none', color: '#333', fontWeight: 'bold' }}>3D Expo</Link>
            <Link to="/kalkulators" style={{ textDecoration: 'none', color: '#333' }}>Pro Tāmes</Link>
            <Link to="/bizness30" style={{ textDecoration: 'none', color: '#3b82f6', fontWeight: 'bold' }}>30 Dienu Izaicinājums</Link>
            
            <div style={{ width: '1px', height: '24px', background: '#e5e7eb', margin: '0 5px' }}></div>
            
            {session ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                <Link to="/dashboard" style={{ textDecoration: 'none', fontWeight: 'bold', color: '#3b82f6' }}>Kabinets</Link>
                <button onClick={handleLogout} className="btn btn-soft" style={{ padding: '4px 10px', fontSize: '0.85rem' }}>Iziet</button>
              </div>
            ) : (
              <Link to="/login" className="btn" style={{ padding: '6px 15px', fontSize: '0.9rem' }}>Ielogoties</Link>
            )}
          </nav>
        </div>
      </header>

      {!isInExpo && sessionStorage.getItem('expo_camera_pos') && (
        <div style={{ position: 'fixed', bottom: '30px', left: '30px', zIndex: 9999 }}>
          <button 
            onClick={() => navigate('/expo')}
            style={{ 
              background: '#0f172a', color: '#fff', border: '2px solid #3b82f6', padding: '15px 25px', 
              borderRadius: '50px', cursor: 'pointer', fontWeight: 'bold', boxShadow: '0 10px 25px rgba(0,0,0,0.3)',
              display: 'flex', alignItems: 'center', gap: '10px'
            }}
          >
            ← Atpakaļ uz Izstādi (Turpināt ceļu)
          </button>
        </div>
      )}

      <main style={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
        <Outlet />
      </main>

      <footer className="site-footer" style={{ padding: '20px', textAlign: 'center', background: '#f5f5f5', borderTop: '1px solid #e5e7eb' }}>
        <p>&copy; 2026 Platformu Centrs. Radīts nākotnei.</p>
      </footer>
    </div>
  );
}
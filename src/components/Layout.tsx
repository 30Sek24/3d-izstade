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
  const isDarkPage = isExpo || location.pathname === '/';

  return (
    <div style={{ 
      minHeight: '100vh', 
      display: 'flex', 
      flexDirection: 'column',
      background: isDarkPage ? '#020617' : '#fff',
      color: isDarkPage ? '#fff' : '#0f172a',
      fontFamily: 'Inter, system-ui, sans-serif',
      transition: 'background 0.3s ease'
    }}>
      <header style={{ 
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 1000,
        background: isDarkPage ? 'rgba(2, 6, 23, 0.8)' : 'rgba(255, 255, 255, 0.8)',
        backdropFilter: 'blur(12px)',
        borderBottom: `1px solid ${isDarkPage ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'}`,
        padding: '12px 0'
      }}>
        <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '0 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Link to="/" style={{ textDecoration: 'none', color: 'inherit', display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ width: '40px', height: '40px', background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', fontSize: '1.2rem', color: '#fff', boxShadow: '0 4px 15px rgba(59, 130, 246, 0.4)' }}>P</div>
            <span style={{ fontWeight: 900, fontSize: '1.4rem', letterSpacing: '-1px', color: isDarkPage ? '#fff' : '#0f172a' }}>Platformu Centrs</span>
          </Link>
          
          <nav style={{ display: 'flex', gap: '30px', alignItems: 'center', fontSize: '0.9rem', fontWeight: 600 }}>
            <Link to="/expo" style={{ textDecoration: 'none', color: isDarkPage ? '#fff' : '#475569', transition: 'color 0.2s' }}>3D EXPO</Link>
            <Link to="/kalkulators" style={{ textDecoration: 'none', color: isDarkPage ? '#fff' : '#475569', transition: 'color 0.2s' }}>PRO TĀMES</Link>
            <Link to="/bizness30" style={{ textDecoration: 'none', color: isDarkPage ? '#fff' : '#475569', transition: 'color 0.2s' }}>BIZNESA SKOLA</Link>
            <Link to="/orakuls" style={{ textDecoration: 'none', color: isDarkPage ? '#fff' : '#475569', transition: 'color 0.2s' }}>AI ORĀKULS</Link>
            <Link to="/pricing" style={{ textDecoration: 'none', color: '#3b82f6', transition: 'color 0.2s' }}>CENAS</Link>
            
            <div style={{ width: '1px', height: '24px', background: isDarkPage ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)' }}></div>
            
            {session ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                <Link to="/dashboard" style={{ textDecoration: 'none', color: '#3b82f6', fontWeight: 800 }}>KABINETS</Link>
                <button onClick={handleLogout} style={{ background: 'transparent', border: `1px solid ${isDarkPage ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.2)'}`, color: isDarkPage ? '#fff' : '#0f172a', padding: '8px 16px', borderRadius: '8px', cursor: 'pointer', fontSize: '0.8rem', fontWeight: 700 }}>IZIET</button>
              </div>
            ) : (
              <Link to="/login" style={{ 
                background: '#3b82f6', 
                color: '#fff', 
                textDecoration: 'none', 
                padding: '10px 24px', 
                borderRadius: '8px', 
                boxShadow: '0 10px 20px -5px rgba(59, 130, 246, 0.4)',
                transition: 'transform 0.2s'
              }}>IENĀKT</Link>
            )}
          </nav>
        </div>
      </header>

      <div style={{ height: '64px' }}></div>

      {location.pathname !== '/expo' && sessionStorage.getItem('expo_camera_pos') && (
        <div style={{ position: 'fixed', bottom: '40px', left: '40px', zIndex: 999 }}>
          <button 
            onClick={() => navigate('/expo')}
            style={{ 
              background: 'rgba(15, 23, 42, 0.9)', 
              color: '#fff', 
              border: '2px solid #3b82f6', 
              padding: '16px 32px', 
              borderRadius: '50px', 
              cursor: 'pointer', 
              fontWeight: 800, 
              boxShadow: '0 20px 40px rgba(0,0,0,0.4)',
              backdropFilter: 'blur(10px)',
              display: 'flex', 
              alignItems: 'center', 
              gap: '12px',
              textTransform: 'uppercase',
              letterSpacing: '1px'
            }}
          >
            <span style={{ fontSize: '1.2rem' }}>←</span> Atpakaļ uz Izstādi
          </button>
        </div>
      )}

      <main style={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
        <Outlet />
      </main>

      {location.pathname !== '/expo' && (
        <footer style={{ 
          padding: '80px 24px 40px', 
          background: isDarkPage ? '#020617' : '#f8fafc', 
          borderTop: `1px solid ${isDarkPage ? 'rgba(255,255,255,0.05)' : '#e5e7eb'}`,
          color: isDarkPage ? '#94a3b8' : '#64748b'
        }}>
          <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '40px', marginBottom: '60px' }}>
              <div>
                <h4 style={{ color: isDarkPage ? '#fff' : '#0f172a', marginBottom: '20px', fontWeight: 800 }}>Platformu Centrs</h4>
                <p style={{ fontSize: '0.9rem', lineHeight: 1.6 }}>Pasaulē pirmā 3D būvniecības ekosistēma. Tāmes, speciālisti un 3D izstādes vienuviet.</p>
              </div>
              <div>
                <h5 style={{ color: isDarkPage ? '#fff' : '#0f172a', marginBottom: '20px', fontWeight: 800 }}>Resursi</h5>
                <ul style={{ listStyle: 'none', padding: 0, margin: 0, fontSize: '0.9rem', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  <li><Link to="/kalkulators" style={{ color: 'inherit', textDecoration: 'none' }}>PRO Kalkulatori</Link></li>
                  <li><Link to="/expo" style={{ color: 'inherit', textDecoration: 'none' }}>3D Metaverse Expo</Link></li>
                  <li><Link to="/bizness30" style={{ color: 'inherit', textDecoration: 'none' }}>30 Dienu Spēle</Link></li>
                </ul>
              </div>
              <div>
                <h5 style={{ color: isDarkPage ? '#fff' : '#0f172a', marginBottom: '20px', fontWeight: 800 }}>Juridiskā info</h5>
                <ul style={{ listStyle: 'none', padding: 0, margin: 0, fontSize: '0.9rem', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  <li><Link to="/terms" style={{ color: 'inherit', textDecoration: 'none' }}>Lietošanas noteikumi</Link></li>
                  <li><Link to="/privacy" style={{ color: 'inherit', textDecoration: 'none' }}>Privātuma politika</Link></li>
                </ul>
              </div>
              <div>
                <h5 style={{ color: isDarkPage ? '#fff' : '#0f172a', marginBottom: '20px', fontWeight: 800 }}>Kontakti</h5>
                <p style={{ fontSize: '0.9rem' }}>support@platformucentrs.lv</p>
                <p style={{ fontSize: '0.9rem' }}>+371 20000000</p>
              </div>
            </div>
            <div style={{ textAlign: 'center', paddingTop: '40px', borderTop: `1px solid ${isDarkPage ? 'rgba(255,255,255,0.05)' : '#e5e7eb'}`, fontSize: '0.8rem' }}>
              &copy; 2026 Platformu Centrs Metaverse. Built with 3D Precision.
            </div>
          </div>
        </footer>
      )}
    </div>
  );
}
import React from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';

const navItems = [
  { path: '/dashboard', label: 'DASHBOARD', icon: '📊' },
  { path: '/projects', label: 'PROJECTS', icon: '📁' },
  { path: '/clients', label: 'CLIENTS', icon: '👥' },
  { path: '/calculators', label: 'CALCULATORS', icon: '🧮' },
  { path: '/generator', label: 'AI TOOLS', icon: '🧠' },
  { path: '/documents', label: 'DOCUMENTS', icon: '📄' },
  { path: '/finances', label: 'FINANCE', icon: '💰' },
  { path: '/settings', label: 'SETTINGS', icon: '⚙️' }
];

const Layout: React.FC = () => {
  const location = useLocation();

  return (
    <div style={{ minHeight: '100vh', background: '#020617', color: '#fff', fontFamily: 'Inter, sans-serif' }}>
      {/* PROFESSIONAL TOP NAV */}
      <nav style={{ 
        height: '70px', background: 'rgba(15, 23, 42, 0.8)', backdropFilter: 'blur(10px)', 
        borderBottom: '1px solid #1e293b', display: 'flex', alignItems: 'center', 
        justifyContent: 'space-between', padding: '0 40px', position: 'sticky', top: 0, zIndex: 1000 
      }}>
        <Link to="/" style={{ fontSize: '1.5rem', fontWeight: 900, color: '#fff', textDecoration: 'none', letterSpacing: '-1px' }}>
          30Sek24<span style={{ color: '#3b82f6' }}>.com</span>
        </Link>

        <div style={{ display: 'flex', gap: '5px' }}>
          {navItems.map(item => (
            <Link 
              key={item.path} 
              to={item.path} 
              style={{ 
                padding: '10px 15px', borderRadius: '8px', textDecoration: 'none', fontSize: '0.75rem', 
                fontWeight: 800, color: location.pathname === item.path ? '#fff' : '#64748b',
                background: location.pathname === item.path ? 'rgba(59, 130, 246, 0.1)' : 'transparent',
                transition: 'all 0.2s', border: location.pathname === item.path ? '1px solid rgba(59, 130, 246, 0.3)' : '1px solid transparent'
              }}
            >
              <span style={{ marginRight: '8px' }}>{item.icon}</span>
              {item.label}
            </Link>
          ))}
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
          <Link to="/expo" style={{ background: '#8b5cf6', color: '#fff', padding: '10px 20px', borderRadius: '8px', textDecoration: 'none', fontWeight: 900, fontSize: '0.8rem' }}>LIVE EXPO</Link>
          <div style={{ width: '35px', height: '35px', borderRadius: '50%', background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)' }}></div>
        </div>
      </nav>

      {/* PAGE CONTENT */}
      <main style={{ padding: '20px' }}>
        <Outlet />
      </main>

      {/* SYSTEM STATUS BAR */}
      <footer style={{ 
        height: '30px', background: '#0f172a', borderTop: '1px solid #1e293b', 
        display: 'flex', alignItems: 'center', padding: '0 20px', fontSize: '0.65rem', 
        color: '#475569', position: 'fixed', bottom: 0, width: '100%', zIndex: 1000 
      }}>
        <div style={{ display: 'flex', gap: '20px' }}>
          <span>NODE: RTX_4080_ULTRA</span>
          <span>STATUS: ONLINE</span>
          <span style={{ color: '#10b981' }}>SYSTEM_SYNC: ACTIVE</span>
        </div>
      </footer>
    </div>
  );
};

export default Layout;

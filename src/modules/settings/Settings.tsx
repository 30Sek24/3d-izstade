import { useState } from 'react';
import '../../components/calculator/styles/CalculatorPro.css';

export default function Settings() {
  const [activeTab, setActiveTab] = useState('profile');
  const [settings, setSettings] = useState({
    companyName: 'Warpala Industries',
    email: 'admin@warpala.com',
    currency: 'EUR',
    language: 'lv',
    aiModel: 'gpt-4o',
    autoSave: true,
    notifications: true
  });

  const tabs = [
    { id: 'profile', label: 'PROFILA DATI', icon: '👤' },
    { id: 'company', label: 'UZŅĒMUMS', icon: '🏢' },
    { id: 'api', label: 'API INTEGRĀCIJAS', icon: '🔑' },
    { id: 'system', label: 'SISTĒMA', icon: '⚙️' }
  ];

  return (
    <div className="calculator-pro-wrapper">
      <div className="calc-header">
        <h1 className="text-accent">Sistēmas Iestatījumi</h1>
        <p>Pielāgo Warpala OS savām biznesa vajadzībām.</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '280px 1fr', gap: '40px', marginTop: '40px' }}>
        {/* SIDEBAR TABS */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={activeTab === tab.id ? 'btn-primary' : 'btn-glass'}
              style={{ justifyContent: 'flex-start', padding: '15px 20px', fontSize: '0.85rem' }}
            >
              <span style={{ marginRight: '15px', fontSize: '1.2rem' }}>{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </div>

        {/* CONTENT AREA */}
        <div className="glass-card" style={{ padding: '40px', background: 'rgba(255,255,255,0.02)' }}>
          
          {activeTab === 'profile' && (
            <div style={{ animation: 'fadeIn 0.3s' }}>
              <h2 style={{ marginBottom: '30px' }}>Mans Profils</h2>
              <div style={{ display: 'flex', alignItems: 'center', gap: '30px', marginBottom: '40px' }}>
                <div style={{ width: '100px', height: '100px', borderRadius: '50%', background: 'linear-gradient(135deg, var(--accent-blue), var(--accent-purple))', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '3rem' }}>
                  A
                </div>
                <div>
                  <button className="btn-glass" style={{ marginBottom: '10px' }}>MAINĪT AVATARU</button>
                  <div style={{ color: 'var(--text-dim)', fontSize: '0.8rem' }}>JPG vai PNG, Max 2MB</div>
                </div>
              </div>
              <div className="input-group-2">
                <label>Vārds Uzvārds
                  <input type="text" value="Admin Warpala" readOnly />
                </label>
                <label>E-pasta adrese
                  <input type="email" value={settings.email} />
                </label>
              </div>
            </div>
          )}

          {activeTab === 'company' && (
            <div style={{ animation: 'fadeIn 0.3s' }}>
              <h2 style={{ marginBottom: '30px' }}>Uzņēmuma Informācija</h2>
              <div className="input-group" style={{ gap: '20px' }}>
                <label>Juridiskais nosaukums
                  <input type="text" value={settings.companyName} onChange={e => setSettings({...settings, companyName: e.target.value})} />
                </label>
                <label>Reģistrācijas numurs
                  <input type="text" placeholder="LV40000000000" />
                </label>
                <label>Juridiskā adrese
                  <input type="text" placeholder="Rīga, Latvija" />
                </label>
              </div>
            </div>
          )}

          {activeTab === 'api' && (
            <div style={{ animation: 'fadeIn 0.3s' }}>
              <h2 style={{ marginBottom: '30px' }}>API Atslēgas un Integrācijas</h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '25px' }}>
                <div className="glass-card" style={{ padding: '20px', background: 'rgba(0,0,0,0.2)', border: '1px solid rgba(59, 130, 246, 0.2)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
                    <div style={{ fontWeight: 800 }}>OpenAI API (GPT-4o)</div>
                    <span style={{ color: '#10b981', fontSize: '0.7rem', fontWeight: 900 }}>SAVIENOTS</span>
                  </div>
                  <input type="password" value="sk-••••••••••••••••••••••••" readOnly style={{ background: 'rgba(0,0,0,0.3)' }} />
                </div>

                <div className="glass-card" style={{ padding: '20px', background: 'rgba(0,0,0,0.2)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
                    <div style={{ fontWeight: 800 }}>Stripe (Maksājumi)</div>
                    <span style={{ color: 'var(--text-dim)', fontSize: '0.7rem', fontWeight: 900 }}>NAV PIESLĒGTS</span>
                  </div>
                  <button className="btn-primary" style={{ background: '#6366f1', width: '100%' }}>PIESLĒGT STRIPE KONTU</button>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'system' && (
            <div style={{ animation: 'fadeIn 0.3s' }}>
              <h2 style={{ marginBottom: '30px' }}>Sistēmas Preferences</h2>
              <div className="input-group-2">
                <label>Valoda
                  <select value={settings.language} onChange={e => setSettings({...settings, language: e.target.value})}>
                    <option value="lv">Latviešu</option>
                    <option value="en">English</option>
                    <option value="de">Deutsch</option>
                  </select>
                </label>
                <label>Valūta
                  <select value={settings.currency} onChange={e => setSettings({...settings, currency: e.target.value})}>
                    <option value="EUR">Euro (€)</option>
                    <option value="USD">Dollar ($)</option>
                  </select>
                </label>
              </div>
              <div style={{ marginTop: '30px', display: 'flex', flexDirection: 'column', gap: '15px' }}>
                <label style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: '12px', cursor: 'pointer' }}>
                  <input type="checkbox" checked={settings.autoSave} onChange={e => setSettings({...settings, autoSave: e.target.checked})} style={{ width: '20px', height: '20px', accentColor: '#3b82f6' }} />
                  <span>Automātiska projektu saglabāšana</span>
                </label>
                <label style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: '12px', cursor: 'pointer' }}>
                  <input type="checkbox" checked={settings.notifications} onChange={e => setSettings({...settings, notifications: e.target.checked})} style={{ width: '20px', height: '20px', accentColor: '#3b82f6' }} />
                  <span>Sūtīt paziņojumus uz e-pastu</span>
                </label>
              </div>
            </div>
          )}

          <div style={{ marginTop: '50px', paddingTop: '30px', borderTop: '1px solid rgba(255,255,255,0.05)', display: 'flex', justifyContent: 'flex-end' }}>
            <button className="btn-primary" style={{ padding: '15px 40px' }}>SAGLABĀT IZMAIŅAS</button>
          </div>

        </div>
      </div>
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}

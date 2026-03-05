import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../components/calculator/styles/CalculatorPro.css';

const PLANS = [
  { 
    id: 'free', name: 'FREELANCER', price: '0', 
    desc: 'Individuāliem meistariem darba uzsākšanai.',
    features: ['Standarta stends hallē', 'Pamata profils', '1 Kontakta poga', 'Tāmu kalkulatori'],
    color: 'var(--text-muted)', btnText: 'Pašreizējais plāns', popular: false
  },
  { 
    id: 'start', name: 'BUSINESS', price: '49', 
    desc: 'Uzņēmumiem, kas vēlas piesaistīt reālus klientus.',
    features: ['Viss no Freelancer', 'Portfolio (līdz 12 darbiem)', 'Lead pieteikumu CRM', 'Prioritārs supports'],
    color: 'var(--accent-primary)', btnText: 'Izvēlēties Business', popular: true
  },
  { 
    id: 'pro', name: 'ENTERPRISE', price: '199', 
    desc: 'Lielajiem spēlētājiem un būvmateriālu brendiem.',
    features: ['Viss no Business', 'Individuāls 3D stends', 'Semināru rīkošana', 'Video reklāma hallē'],
    color: 'var(--accent-secondary)', btnText: 'Sazināties ar mums', popular: false
  }
];

export default function Pricing() {
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
  const [isProcessing, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const handleCheckout = async (planId: string) => {
    if (planId === 'free') return;
    setSelectedPlan(planId);
    setIsSubmitting(true);
    
    // Simulate Secure Stripe Checkout
    setTimeout(() => {
      alert(`Pāreja uz drošu maksājumu vidi (Stripe API)... 

Plāns: ${planId.toUpperCase()}
Summa: ${PLANS.find(p => p.id === planId)?.price} EUR/mēn`);
      setIsSubmitting(false);
      navigate('/dashboard');
    }, 1200);
  };

  return (
    <div style={{ background: 'var(--bg-main)', minHeight: '100vh', padding: '100px 24px' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        
        {/* HEADER */}
        <div style={{ textAlign: 'center', marginBottom: '80px' }}>
          <div className="glass-card" style={{ display: 'inline-flex', padding: '8px 20px', borderRadius: '50px', marginBottom: '25px', borderColor: 'var(--accent-primary)' }}>
            <span style={{ fontSize: '0.8rem', fontWeight: 800, color: 'var(--accent-primary)', letterSpacing: '2px' }}>SCALE YOUR BUSINESS</span>
          </div>
          <h1 style={{ fontSize: '4.5rem', fontWeight: 950, letterSpacing: '-4px', lineHeight: 1, marginBottom: '25px' }}>
            Izvēlies savu <span style={{ background: 'linear-gradient(135deg, var(--accent-primary), var(--accent-secondary))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>jaudu hallē</span>
          </h1>
          <p style={{ fontSize: '1.3rem', color: 'var(--text-secondary)', maxWidth: '750px', margin: '0 auto' }}>
            Pievienojies nākotnes būvniecības ekosistēmai un sāc pārdot Metaversā profesionāli.
          </p>
        </div>

        {/* PLANS GRID */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '30px' }}>
          {PLANS.map(plan => (
            <div key={plan.id} className="glass-card animate-fade-in" style={{ 
              padding: '50px', 
              borderColor: plan.popular ? 'var(--accent-primary)' : 'var(--border-glass)',
              background: plan.popular ? 'rgba(30, 41, 59, 0.9)' : 'var(--bg-card)',
              position: 'relative',
              display: 'flex',
              flexDirection: 'column',
              transition: 'transform 0.3s ease',
              boxShadow: plan.popular ? '0 30px 60px rgba(0,0,0,0.4)' : 'var(--shadow-pro)'
            }}>
              {plan.popular && (
                <div style={{ 
                  position: 'absolute', top: '20px', right: '20px', 
                  background: 'var(--accent-primary)', color: '#fff', 
                  padding: '5px 15px', borderRadius: '50px', 
                  fontSize: '0.7rem', fontWeight: 900, letterSpacing: '1px' 
                }}>IETEICAMAIS</div>
              )}
              
              <h3 style={{ fontSize: '1rem', color: plan.color, fontWeight: 900, letterSpacing: '2px', textTransform: 'uppercase', marginBottom: '15px' }}>{plan.name}</h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', marginBottom: '30px', minHeight: '50px' }}>{plan.desc}</p>
              
              <div style={{ display: 'flex', alignItems: 'baseline', marginBottom: '40px', borderBottom: '1px solid var(--border-glass)', paddingBottom: '30px' }}>
                <span style={{ fontSize: '4rem', fontWeight: 950, color: '#fff', letterSpacing: '-3px' }}>{plan.price}€</span>
                <span style={{ color: 'var(--text-muted)', marginLeft: '10px', fontSize: '1.1rem', fontWeight: 600 }}>/ mēnesī</span>
              </div>

              <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 50px 0', flexGrow: 1 }}>
                {plan.features.map((f, i) => (
                  <li key={i} style={{ marginBottom: '18px', fontSize: '1.05rem', display: 'flex', gap: '15px', color: '#fff', alignItems: 'center' }}>
                    <span style={{ color: plan.popular ? 'var(--accent-primary)' : '#10b981', fontSize: '1.2rem' }}>✓</span> {f}
                  </li>
                ))}
              </ul>

              <button 
                onClick={() => handleCheckout(plan.id)}
                disabled={isProcessing}
                className={`btn-pro ${plan.popular ? 'btn-pro-primary' : 'btn-pro-secondary'}`}
                style={{ width: '100%', padding: '20px', fontSize: '1.1rem' }}
              >
                {isProcessing && selectedPlan === plan.id ? 'SINHRONIZĒ...' : plan.btnText}
              </button>
            </div>
          ))}
        </div>

        {/* TRUST BADGES */}
        <div className="glass-card" style={{ marginTop: '80px', padding: '30px', display: 'flex', justifyContent: 'center', gap: '60px', background: 'rgba(255,255,255,0.02)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-muted)' }}>
            <span style={{ fontSize: '1.2rem' }}>🔐</span> SSL SECURE STRIPE
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-muted)' }}>
            <span style={{ fontSize: '1.2rem' }}>🌍</span> GLOBAL ENTERPRISE READY
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-muted)' }}>
            <span style={{ fontSize: '1.2rem' }}>🇪🇺</span> GDPR DATA COMPLIANCE
          </div>
        </div>
      </div>
    </div>
  );
}

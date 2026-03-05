import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../components/calculator/styles/CalculatorPro.css';

const PLANS = [
  { 
    id: 'free', name: 'BEZMAKSAS', price: '0', 
    features: ['Standarta stends hallē', 'Pamata profils', '1 CTA poga (Telefons)', 'Tāmu kalkulatori'],
    color: '#64748b', btnText: 'Pašreizējais plāns'
  },
  { 
    id: 'start', name: 'START', price: '29', 
    features: ['Viss no FREE', 'Portfolio (līdz 6 bildēm)', 'Lead pieteikumu forma', 'Prioritārs supports'],
    color: '#3b82f6', btnText: 'Izvēlēties Start'
  },
  { 
    id: 'pro', name: 'PRO', price: '89', 
    features: ['Viss no START', 'Top pozīcija (pie ieejas)', 'Dinamiskā ekrāna rotācija', 'Leads eksports uz Excel'],
    color: '#8b5cf6', btnText: 'Kļūt par PRO', popular: true
  },
  { 
    id: 'biz', name: 'BIZNESA', price: '249', 
    features: ['Viss no PRO', 'Custom 3D stends', 'Semināru rīkošana', 'Video reklāma hallē'],
    color: '#0f172a', btnText: 'Sazināties'
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
      alert(`Pāreja uz drošu maksājumu vidi (Stripe/Bank)... 

Plāns: ${planId.toUpperCase()}
Summa: ${PLANS.find(p => p.id === planId)?.price} €/mēn`);
      setIsSubmitting(false);
      navigate('/dashboard');
    }, 1500);
  };

  return (
    <div className="calculator-pro-wrapper" style={{ paddingBottom: '100px' }}>
      <div className="calc-header">
        <h1 style={{ fontSize: '3.5rem', fontWeight: 900 }}>Izvēlies savu jaudu</h1>
        <p style={{ fontSize: '1.2rem', color: '#64748b' }}>Visiem stendiem hallē ir jāmaksā par elektrību un telpu, bet tu izvēlies, cik skaļi gribi izskatīties.</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px', marginTop: '50px' }}>
        {PLANS.map(plan => (
          <div key={plan.id} style={{ 
            background: '#fff', borderRadius: '24px', padding: '40px', border: plan.popular ? `3px solid ${plan.color}` : '1px solid #e2e8f0',
            position: 'relative', display: 'flex', flexDirection: 'column', boxShadow: plan.popular ? '0 20px 40px rgba(0,0,0,0.1)' : 'none'
          }}>
            {plan.popular && (
              <div style={{ position: 'absolute', top: '-15px', left: '50%', transform: 'translateX(-50%)', background: plan.color, color: '#fff', padding: '5px 20px', borderRadius: '50px', fontSize: '0.75rem', fontWeight: 'bold' }}>POPULĀRĀKAIS</div>
            )}
            
            <h3 style={{ fontSize: '1rem', color: plan.color, fontWeight: 800, textTransform: 'uppercase', marginBottom: '10px' }}>{plan.name}</h3>
            <div style={{ display: 'flex', alignItems: 'baseline', marginBottom: '30px' }}>
              <span style={{ fontSize: '3rem', fontWeight: 900 }}>{plan.price}€</span>
              <span style={{ color: '#94a3b8', marginLeft: '5px' }}>/mēn.</span>
            </div>

            <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 40px 0', flexGrow: 1 }}>
              {plan.features.map((f, i) => (
                <li key={i} style={{ marginBottom: '12px', fontSize: '0.95rem', display: 'flex', gap: '10px', color: '#475569' }}>
                  <span style={{ color: '#10b981' }}>✓</span> {f}
                </li>
              ))}
            </ul>

            <button 
              onClick={() => handleCheckout(plan.id)}
              disabled={isProcessing}
              style={{ 
                width: '100%', padding: '15px', borderRadius: '12px', border: 'none', fontWeight: 'bold', 
                background: plan.popular ? plan.color : '#f1f5f9',
                color: plan.popular ? '#fff' : '#475569',
                cursor: plan.id === 'free' ? 'default' : 'pointer'
              }}
            >
              {isProcessing && selectedPlan === plan.id ? 'Apstrādā...' : plan.btnText}
            </button>
          </div>
        ))}
      </div>

      {/* Security Badges */}
      <div style={{ marginTop: '60px', display: 'flex', justifyContent: 'center', gap: '40px', opacity: 0.5 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>🔐 SSL Secure Payment</div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>💳 Stripe Integrated</div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>🇪🇺 GDPR Compliant</div>
      </div>
    </div>
  );
}

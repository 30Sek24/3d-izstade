import { useState } from 'react';
import { supabase } from '../lib/supabase';
import { useNavigate } from 'react-router-dom';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('builder'); 
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);
  const navigate = useNavigate();

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMsg('');

    try {
      if (isSignUp) {
        // 1. Create User
        const { error: authError } = await supabase.auth.signUp({
          email,
          password,
          options: { 
            data: { role: role }
          }
        });
        if (authError) throw authError;

        const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({ email, password });
        
        if (signInError) {
            alert("Lūdzu, apstipriniet savu e-pastu, lai pabeigtu reģistrāciju!");
            setIsSignUp(false);
            setIsLoading(false);
            return;
        }

        if (signInData.user) {
          const { data: orgData, error: orgError } = await supabase
            .from('organization')
            .insert([{ 
                name: `${email.split('@')[0]} Business`, 
                business_type: role,
                owner_id: signInData.user.id
            }])
            .select()
            .single();
          
          if (orgError) throw orgError;

          if (orgData) {
            const side = Math.random() > 0.5 ? 'left' : 'right';
            const slug = email.split('@')[0].toLowerCase() + '-' + Math.random().toString(36).substring(2, 7);
            const { error: boothError } = await supabase
              .from('expo_booth')
              .insert([{ 
                org_id: orgData.id, 
                title: `${email.split('@')[0].toUpperCase()} SERVICES`,
                subtitle: role,
                slug: slug,
                position_z: -(Math.floor(Math.random() * 10) * 40 + 200),
                side: side,
                color: role === 'builder' ? '#eab308' : '#3b82f6'
              }]);
            
            if (boothError) throw boothError;
          }
          
          navigate('/dashboard');
        }
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        navigate('/dashboard');
      }
    } catch (error: unknown) {
      const err = error as { message?: string };
      setErrorMsg(err.message || "Autentifikācijas kļūda.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={{ 
      minHeight: '100vh', 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center',
      background: 'radial-gradient(circle at center, #1e293b 0%, var(--bg-main) 100%)',
      padding: '24px'
    }}>
      <div className="glass-card animate-fade-in" style={{ maxWidth: '450px', width: '100%', padding: '50px', borderColor: 'var(--accent-primary)' }}>
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <div style={{ 
            width: '60px', height: '60px', 
            background: 'linear-gradient(135deg, var(--accent-primary), var(--accent-secondary))', 
            borderRadius: '15px', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', 
            fontWeight: 900, fontSize: '1.8rem', color: '#fff', marginBottom: '20px',
            boxShadow: '0 10px 30px rgba(59, 130, 246, 0.4)'
          }}>P</div>
          <h1 style={{ fontSize: '2.2rem', fontWeight: 950, letterSpacing: '-2px', color: '#fff', margin: 0 }}>
            {isSignUp ? 'Reģistrēt Kontu' : 'PRO Ieja'}
          </h1>
          <p style={{ color: 'var(--text-secondary)', marginTop: '10px', fontSize: '1rem' }}>
            {isSignUp ? 'Pievienojies būvniecības ekosistēmai' : 'Autorizējies savā vadības panelī'}
          </p>
        </div>

        {errorMsg && (
          <div className="glass-card" style={{ padding: '15px', background: 'rgba(239, 68, 68, 0.1)', border: '1px solid #ef4444', color: '#f87171', marginBottom: '25px', fontSize: '0.9rem', textAlign: 'center', fontWeight: 600 }}>
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleAuth} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          
          {isSignUp && (
            <div className="input-group">
              <label>Tavs Arods / Nozare
                <select 
                  value={role} 
                  onChange={(e) => setRole(e.target.value)}
                  style={{ background: 'rgba(15, 23, 42, 0.6)', marginTop: '8px' }}
                >
                  <option value="builder">Būvniecība un Apdare</option>
                  <option value="architect">Arhitektūra un Dizains</option>
                  <option value="materials">Būvmateriālu Tirdzniecība</option>
                  <option value="real_estate">Nekustamo Īpašumu Aģents</option>
                  <option value="services">Juridiskie / Citi</option>
                </select>
              </label>
            </div>
          )}

          <div className="input-group">
            <label>E-pasts
              <input 
                type="email" value={email} 
                onChange={(e) => setEmail(e.target.value)} 
                required 
                placeholder="vards@uznemums.lv"
                style={{ background: 'rgba(15, 23, 42, 0.6)', marginTop: '8px' }}
              />
            </label>
          </div>
          
          <div className="input-group">
            <label>Parole
              <input 
                type="password" value={password} 
                onChange={(e) => setPassword(e.target.value)} 
                required 
                placeholder="••••••••"
                style={{ background: 'rgba(15, 23, 42, 0.6)', marginTop: '8px' }}
              />
            </label>
          </div>
          
          <button type="submit" disabled={isLoading} className="btn-pro btn-pro-primary" style={{ width: '100%', marginTop: '10px', padding: '18px' }}>
            {isLoading ? 'SINHRONIZĒ...' : (isSignUp ? 'IZVEIDOT KONTU' : 'AUTORIZĒTIES')}
          </button>
        </form>

        <div style={{ marginTop: '30px', textAlign: 'center', fontSize: '0.9rem', color: 'var(--text-muted)', borderTop: '1px solid var(--border-glass)', paddingTop: '25px' }}>
          {isSignUp ? 'Jau esi platformā? ' : 'Vēl neesi Metaversā? '}
          <button 
            onClick={() => setIsSignUp(!isSignUp)} 
            style={{ background: 'none', border: 'none', color: 'var(--accent-primary)', fontWeight: 800, cursor: 'pointer', padding: 0, textDecoration: 'none', fontSize: '0.9rem' }}
          >
            {isSignUp ? 'Ielogoties' : 'Reģistrēties tagad'}
          </button>
        </div>
      </div>
    </div>
  );
}

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

        // If email confirmation is off, the user is signed in immediately.
        // Let's explicitly log them in to make sure we have a session for RLS.
        const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({ email, password });
        
        if (signInError) {
            // This happens if email confirmation IS required but not done yet.
            alert("Lūdzu, apstipriniet savu e-pastu, lai pabeigtu reģistrāciju!");
            setIsSignUp(false);
            setIsLoading(false);
            return;
        }

        if (signInData.user) {
          console.log("User signed in:", signInData.user.id);
          // 2. Create Organization (now we have a session, RLS won't block)
          const { data: orgData, error: orgError } = await supabase
            .from('organization')
            .insert([{ 
                name: `${email.split('@')[0]} Business`, 
                business_type: role,
                owner_id: signInData.user.id
            }])
            .select()
            .single();
          
          if (orgError) {
            console.error("Org creation error:", orgError);
            throw new Error(`Database error (Org): ${orgError.message}`);
          }

          if (orgData) {
            console.log("Org created:", orgData.id);
            // 3. Create Booth Entry with Slug
            const side = Math.random() > 0.5 ? 'left' : 'right';
            const slug = email.split('@')[0].toLowerCase() + '-' + Math.random().toString(36).substring(2, 7);
            const { error: boothError } = await supabase
              .from('expo_booth')
              .insert([{ 
                org_id: orgData.id, 
                title: `${email.split('@')[0].toUpperCase()} SERVICES`,
                subtitle: role,
                slug: slug,
                position_z: -(Math.floor(Math.random() * 10) * 40 + 200), // Place deep in the hall
                side: side,
                color: role === 'builder' ? '#eab308' : '#3b82f6'
              }]);
            
            if (boothError) {
              console.error("Booth creation error:", boothError);
              throw new Error(`Database error (Booth): ${boothError.message}`);
            }
            console.log("Booth created successfully");
          }
          
          alert(`Reģistrācija veiksmīga! Tev ir piešķirta jauna būdiņa izstādes dziļumā.`);
          navigate('/dashboard');
        }
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        navigate('/dashboard');
      }
    } catch (error: unknown) {
      console.error("Auth process error:", error);
      const err = error as { message?: string };
      
      let friendlyError = err.message || "Radās kļūda autentifikācijā.";
      if (err.message?.includes('Email not confirmed')) {
        friendlyError = "Lūdzu apstiprini savu e-pastu, noklikšķinot uz saites, kuru mēs tev nosūtījām (Pārbaudi arī Spam/Mēstuļu mapi).";
      } else if (err.message?.includes('Invalid login credentials')) {
        friendlyError = "Nepareizs e-pasts vai parole.";
      } else if (err.message?.includes('User already registered')) {
        friendlyError = "Lietotājs ar šādu e-pastu jau eksistē. Lūdzu ielogojies.";
      }
      
      setErrorMsg(friendlyError);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: '400px', margin: '80px auto', padding: '40px', background: '#fff', border: '1px solid #e5e7eb', borderRadius: '12px', boxShadow: '0 10px 25px -5px rgba(0,0,0,0.1)' }}>
      <h1 style={{ fontSize: '28px', marginBottom: '10px', textAlign: 'center', color: '#0f172a', fontWeight: 800 }}>
        {isSignUp ? 'Reģistrēt Uzņēmumu' : 'Ielogoties Sistēmā'}
      </h1>
      
      {isSignUp && (
        <p style={{ textAlign: 'center', color: '#64748b', marginBottom: '20px', fontSize: '0.9rem' }}>
          Iegūsti savu vietu Metaversā un sāc pārdot.
        </p>
      )}

      {errorMsg && (
        <div style={{ padding: '12px', background: '#fee2e2', color: '#b91c1c', borderRadius: '6px', marginBottom: '20px', fontSize: '0.9rem', border: '1px solid #fca5a5' }}>
          {errorMsg}
        </div>
      )}

      <form onSubmit={handleAuth} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
        
        {isSignUp && (
          <label style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.95rem', fontWeight: 600, color: '#334155' }}>
            Uzņēmuma nozare / Tavs Arods
            <select 
              value={role} 
              onChange={(e) => setRole(e.target.value)}
              style={{ padding: '12px', border: '2px solid #cbd5e1', borderRadius: '8px', fontSize: '1rem', background: '#f8fafc', outline: 'none' }}
            >
              <option value="builder">Būvniecība un Apdare</option>
              <option value="architect">Arhitektūra un Dizains</option>
              <option value="materials">Būvmateriālu Tirdzniecība</option>
              <option value="real_estate">Nekustamo Īpašumu Aģents</option>
              <option value="services">Juridiskie un Citi Pakalpojumi</option>
            </select>
          </label>
        )}

        <label style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.95rem', fontWeight: 600, color: '#334155' }}>
          E-pasts
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required style={{ padding: '12px', border: '2px solid #cbd5e1', borderRadius: '8px', fontSize: '1rem' }} />
        </label>
        
        <label style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.95rem', fontWeight: 600, color: '#334155' }}>
          Parole
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required style={{ padding: '12px', border: '2px solid #cbd5e1', borderRadius: '8px', fontSize: '1rem' }} />
        </label>
        
        <button type="submit" disabled={isLoading} style={{ marginTop: '10px', padding: '15px', fontSize: '1.1rem', background: '#3b82f6', color: '#fff', border: 'none', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer' }}>
          {isLoading ? 'Lūdzu uzgaidiet...' : (isSignUp ? 'Reģistrēties' : 'Ielogoties')}
        </button>
      </form>

      <div style={{ marginTop: '25px', textAlign: 'center', fontSize: '0.95rem', color: '#64748b', borderTop: '1px solid #e2e8f0', paddingTop: '20px' }}>
        {isSignUp ? 'Jau ir izveidots stends? ' : 'Vēl neesi Metaversā? '}
        <button onClick={() => setIsSignUp(!isSignUp)} style={{ background: 'none', border: 'none', color: '#3b82f6', fontWeight: 'bold', cursor: 'pointer', padding: 0, textDecoration: 'underline' }}>
          {isSignUp ? 'Ielogoties' : 'Izveidot Stendu'}
        </button>
      </div>
    </div>
  );
}

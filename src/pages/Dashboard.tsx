import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import type { Session } from '@supabase/supabase-js';
import { Link, useNavigate } from 'react-router-dom';
import '../components/calculator/styles/CalculatorPro.css';

export default function Dashboard() {
  const [session, setSession] = useState<Session | null>(null);
  const [booth, setBooth] = useState<any>(null);
  const [offers, setOffers] = useState<any[]>([]);
  const [leads, setLeads] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Editor State
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState<any>({});
  const [newOffer, setNewOffer] = useState({ title: '', price: '', description: '' });
  
  // Seminar State
  const [showSeminarForm, setShowSeminarForm] = useState(false);
  const [seminarTitle, setSeminarTitle] = useState('');

  const navigate = useNavigate();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (session) {
        fetchUserData();
      } else {
        setIsLoading(false);
      }
    });
  }, []);

  const fetchUserData = async () => {
    try {
      // 1. Get booth for the user's organization
      // First, get the org_id (simplified for this demo, usually user has org_id)
      const { data: boothData } = await supabase
        .from('expo_booth')
        .select('*, organization(*)')
        .limit(1)
        .single();

      if (boothData) {
        setBooth(boothData);
        setEditData(boothData);
        
        // 2. Get offers
        const { data: offersData } = await supabase.from('booth_offer').select('*').eq('booth_id', boothData.id);
        setOffers(offersData || []);

        // 3. Get leads
        const { data: leadsData } = await supabase.from('booth_lead').select('*').eq('booth_id', boothData.id).order('created_at', { ascending: false });
        setLeads(leadsData || []);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateBooth = async () => {
    const { error } = await supabase.from('expo_booth').update({
      title: editData.title,
      subtitle: editData.subtitle,
      description: editData.description,
      color: editData.color
    }).eq('id', booth.id);

    if (!error) {
      setBooth({...booth, ...editData});
      setIsEditing(false);
      alert("Stends atjaunināts!");
    }
  };

  const handleAddOffer = async () => {
    if (!newOffer.title) return;
    const { data, error } = await supabase.from('booth_offer').insert([{
      booth_id: booth.id,
      ...newOffer
    }]).select().single();

    if (!error && data) {
      setOffers([...offers, data]);
      setNewOffer({ title: '', price: '', description: '' });
    }
  };

  const handleStartSeminar = async () => {
    if (!seminarTitle) return alert("Ievadiet semināra tēmu!");
    
    // Create a live seminar in the DB
    const { error } = await supabase.from('expo_seminar').insert([{
      booth_id: booth.id,
      title: seminarTitle,
      is_live: true,
      scheduled_at: new Date().toISOString()
    }]);

    if (!error) {
      alert(`Seminārs "${seminarTitle}" ir izsludināts! Jūsu stends tagad tiek reklamēts Semināru zālē.`);
      setShowSeminarForm(false);
      setSeminarTitle('');
    } else {
      alert("Kļūda izsludinot semināru.");
    }
  };

  if (isLoading) return <div style={{ padding: '100px', textAlign: 'center' }}>Ielādē vadības paneli...</div>;

  if (!session) return <div style={{ padding: '100px', textAlign: 'center' }}>Lūdzu, ielogojieties.</div>;

  return (
    <div style={{ maxWidth: '1200px', margin: '40px auto', padding: '0 20px' }}>
      
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px' }}>
        <h1 style={{ fontWeight: 900, fontSize: '2.5rem' }}>PRO Kabinets</h1>
        <div style={{ display: 'flex', gap: '15px' }}>
          <button onClick={() => setShowSeminarForm(true)} className="btn-secondary" style={{ background: '#8b5cf6', color: '#fff', border: 'none' }}>🎤 Rīkot Semināru</button>
          <button onClick={() => navigate('/expo')} className="btn-secondary">Apskatīt Halli</button>
          {booth && <Link to={`/expo/stends/${booth.slug || booth.id}`} className="btn-primary" style={{ background: booth.color }}>Mans 3D Stends</Link>}
        </div>
      </div>

      {showSeminarForm && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)', zIndex: 10000, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ background: '#fff', padding: '40px', borderRadius: '20px', width: '450px' }}>
            <h2 style={{ marginBottom: '10px' }}>Izsludināt Semināru</h2>
            <p style={{ color: '#64748b', marginBottom: '25px' }}>Jūsu uzņēmums parādīsies uz lielā ekrāna Semināru zālē.</p>
            <input 
              type="text" placeholder="Semināra tēma (piem. Inovācijas būvniecībā)" 
              value={seminarTitle} onChange={(e) => setSeminarTitle(e.target.value)} 
              style={{ width: '100%', padding: '15px', marginBottom: '20px', borderRadius: '8px', border: '1px solid #ddd' }} 
            />
            <button onClick={handleStartSeminar} className="btn-primary" style={{ width: '100%', background: '#8b5cf6' }}>SĀKT TIEŠRAIDI</button>
            <button onClick={() => setShowSeminarForm(false)} style={{ width: '100%', background: 'none', border: 'none', marginTop: '10px', color: '#64748b', cursor: 'pointer' }}>Atcelt</button>
          </div>
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 400px', gap: '40px' }}>
        
        {/* LEFT COLUMN: BOOTH MANAGEMENT */}
        <div>
          <section className="calc-section" style={{ borderLeftColor: booth?.color || '#3b82f6' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
              <h2>3D Stenda Informācija</h2>
              <button onClick={() => setIsEditing(!isEditing)} className="btn-secondary" style={{ padding: '5px 15px' }}>{isEditing ? 'Atcelt' : 'Rediģēt'}</button>
            </div>

            {isEditing ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                <label>Uzņēmuma Nosaukums
                  <input type="text" value={editData.title} onChange={e => setEditData({...editData, title: e.target.value})} />
                </label>
                <label>Saukilis / Nozare
                  <input type="text" value={editData.subtitle} onChange={e => setEditData({...editData, subtitle: e.target.value})} />
                </label>
                <label>Apraksts
                  <textarea rows={4} value={editData.description} onChange={e => setEditData({...editData, description: e.target.value})} style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #ddd' }} />
                </label>
                <label>Zīmola Krāsa (HEX)
                  <input type="color" value={editData.color} onChange={e => setEditData({...editData, color: e.target.value})} style={{ height: '50px' }} />
                </label>
                <button onClick={handleUpdateBooth} className="btn-primary" style={{ background: editData.color }}>SAGLABĀT IZMAIŅAS</button>
              </div>
            ) : (
              <div>
                <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
                  <div style={{ width: '60px', height: '60px', background: booth?.color, borderRadius: '12px' }}></div>
                  <div>
                    <div style={{ fontSize: '1.5rem', fontWeight: 800 }}>{booth?.title}</div>
                    <div style={{ color: '#64748b' }}>{booth?.subtitle}</div>
                  </div>
                </div>
                <p style={{ marginTop: '20px', color: '#475569', lineHeight: 1.6 }}>{booth?.description || 'Nav pievienots apraksts.'}</p>
              </div>
            )}
          </section>

          <section className="calc-section" style={{ marginTop: '30px' }}>
            <h2>Pakalpojumi un Piedāvājumi</h2>
            <div style={{ marginBottom: '20px', background: '#f8fafc', padding: '20px', borderRadius: '12px' }}>
              <h4>Pievienot jaunu:</h4>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 120px', gap: '10px', marginTop: '10px' }}>
                <input type="text" placeholder="Nosaukums" value={newOffer.title} onChange={e => setNewOffer({...newOffer, title: e.target.value})} />
                <input type="text" placeholder="Cena" value={newOffer.price} onChange={e => setNewOffer({...newOffer, price: e.target.value})} />
              </div>
              <textarea placeholder="Apraksts" value={newOffer.description} onChange={e => setNewOffer({...newOffer, description: e.target.value})} style={{ width: '100%', marginTop: '10px', padding: '10px', borderRadius: '8px', border: '1px solid #ddd' }} />
              <button onClick={handleAddOffer} className="btn-primary" style={{ marginTop: '10px', width: '100%' }}>PIEVIENOT SARAKSTAM</button>
            </div>

            <ul style={{ listStyle: 'none', padding: 0 }}>
              {offers.map(offer => (
                <li key={offer.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '15px', borderBottom: '1px solid #f1f5f9' }}>
                  <div>
                    <strong>{offer.title}</strong>
                    <div style={{ fontSize: '0.85rem', color: '#64748b' }}>{offer.description}</div>
                  </div>
                  <div style={{ fontWeight: 'bold' }}>{offer.price}</div>
                </li>
              ))}
            </ul>
          </section>
        </div>

        {/* RIGHT COLUMN: LEADS & STATS */}
        <div>
          <section className="calc-section" style={{ background: '#0f172a', color: '#fff' }}>
            <h2 style={{ color: '#fff' }}>Jaunākie Klienti (Leads)</h2>
            {leads.length === 0 ? (
              <p style={{ color: '#94a3b8', textAlign: 'center', padding: '20px' }}>Vēl nav saņemts neviens pieteikums.</p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '15px', marginTop: '20px' }}>
                {leads.map(lead => (
                  <div key={lead.id} style={{ background: 'rgba(255,255,255,0.05)', padding: '15px', borderRadius: '10px', borderLeft: '4px solid #10b981' }}>
                    <div style={{ fontWeight: 'bold', display: 'flex', justifyContent: 'space-between' }}>
                      <span>{lead.name}</span>
                      <span style={{ fontSize: '0.7rem', color: '#94a3b8' }}>{new Date(lead.created_at).toLocaleDateString()}</span>
                    </div>
                    <div style={{ fontSize: '0.9rem', color: '#10b981', margin: '5px 0' }}>📞 {lead.phone}</div>
                    <p style={{ fontSize: '0.85rem', color: '#cbd5e1', margin: 0 }}>{lead.message}</p>
                  </div>
                ))}
              </div>
            )}
          </section>

          <section className="calc-section" style={{ marginTop: '30px' }}>
            <h2>Statistika</h2>
            <div style={{ textAlign: 'center', padding: '20px' }}>
              <div style={{ fontSize: '0.8rem', color: '#64748b', textTransform: 'uppercase' }}>Stenda Apmeklējumi</div>
              <div style={{ fontSize: '3rem', fontWeight: 900 }}>428</div>
              <div style={{ color: '#10b981', fontSize: '0.9rem', fontWeight: 'bold' }}>+12% šonedēļ</div>
            </div>
          </section>
        </div>

      </div>
    </div>
  );
}
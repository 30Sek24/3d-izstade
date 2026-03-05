import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import type { Session } from '@supabase/supabase-js';
import { Link, useNavigate } from 'react-router-dom';
import '../components/calculator/styles/CalculatorPro.css';

interface Booth {
  id: string;
  org_id: string;
  title: string;
  subtitle: string;
  description: string;
  color: string;
  slug?: string;
  organization?: unknown;
}

interface Offer {
  id: string;
  booth_id: string;
  title: string;
  price: string;
  description: string;
}

interface Lead {
  id: string;
  booth_id: string;
  name: string;
  phone: string;
  message: string;
  created_at: string;
}

interface Campaign {
  id: string;
  org_id: string;
  slot_id: string;
  media_url: string;
  media_type: 'video' | 'image';
  link_url: string;
  is_active: boolean;
  start_date: string;
  end_date: string;
}

export default function Dashboard() {
  const [session, setSession] = useState<Session | null>(null);
  const [booth, setBooth] = useState<Booth | null>(null);
  const [offers, setOffers] = useState<Offer[]>([]);
  const [leads, setLeads] = useState<Lead[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Editor State
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState<Partial<Booth>>({});
  const [newOffer, setNewOffer] = useState({ title: '', price: '', description: '' });
  
  // Seminar State
  const [showSeminarForm, setShowSeminarForm] = useState(false);
  const [seminarTitle, setSeminarTitle] = useState('');

  // Ad Campaign State
  const [newCampaign, setNewCampaign] = useState({ slot_id: 'hall_wall_right', media_url: '', link_url: '' });

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
      const { data: boothData } = await supabase
        .from('expo_booth')
        .select('*, organization(*)')
        .limit(1)
        .single();

      if (boothData) {
        setBooth(boothData);
        setEditData(boothData);
        
        const { data: offersData } = await supabase.from('booth_offer').select('*').eq('booth_id', boothData.id);
        setOffers(offersData || []);

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
    if (!booth) return;
    const { error } = await supabase.from('expo_booth').update({
      title: editData.title,
      subtitle: editData.subtitle,
      description: editData.description,
      color: editData.color
    }).eq('id', booth.id);

    if (!error) {
      setBooth(prev => prev ? {...prev, ...editData} : null);
      setIsEditing(false);
      alert("Stends atjaunināts!");
    }
  };

  const handleAddOffer = async () => {
    if (!newOffer.title || !booth) return;
    const { data, error } = await supabase.from('booth_offer').insert([{
      booth_id: booth?.id,
      ...newOffer
    }]).select().single();

    if (!error && data) {
      setOffers([...offers, data]);
      setNewOffer({ title: '', price: '', description: '' });
    }
  };

  const handleStartSeminar = async () => {
    if (!seminarTitle) return alert("Ievadiet semināra tēmu!");
    const { error } = await supabase.from('expo_seminar').insert([{
      booth_id: booth?.id,
      title: seminarTitle,
      is_live: true,
      scheduled_at: new Date().toISOString()
    }]);

    if (!error) {
      alert(`Seminārs "${seminarTitle}" ir izsludināts!`);
      setShowSeminarForm(false);
      setSeminarTitle('');
    }
  };

  const handleBuyAd = async () => {
    if (!newCampaign.media_url || !booth) return alert("Norādiet banera URL vai ielogojieties.");
    
    // Create inactive campaign in DB
    const { data: campaign, error } = await supabase.from('ad_campaign').insert([{
      org_id: booth.org_id,
      slot_id: newCampaign.slot_id,
      media_url: newCampaign.media_url,
      media_type: newCampaign.media_url.endsWith('.mp4') ? 'video' : 'image',
      link_url: newCampaign.link_url,
      start_date: new Date().toISOString(),
      end_date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // 1 nedēļa
      is_active: false // Tiks aktivizēts caur webhook
    }]).select().single();

    if (error || !campaign) {
      return alert("Kļūda saglabājot kampaņu");
    }

    // Izsaucam Edge Function priekš Stripe
    const price = newCampaign.slot_id.includes('wall') ? 500 : 200; // Demorežīma cenas
    const res = await fetch('https://gbmxrposlrhctyaaznmj.supabase.co/functions/v1/create-checkout-session', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        campaignId: campaign.id,
        slotId: newCampaign.slot_id,
        price: price,
        returnUrl: window.location.origin + '/dashboard'
      })
    });
    
    if (res.ok) {
      const { url } = await res.json();
      window.location.href = url; // Redirect to Stripe
    } else {
      alert("Kļūda veidojot maksājumu.");
    }
  };

  if (isLoading) return <div style={{ background: 'var(--bg-main)', color: '#fff', height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>Ielādē vadības paneli...</div>;
  if (!session) return <div style={{ background: 'var(--bg-main)', color: '#fff', height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>Lūdzu, ielogojieties.</div>;

  return (
    <div style={{ background: 'var(--bg-main)', minHeight: '100vh', color: 'var(--text-primary)' }}>
      <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '60px 24px' }}>
        
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '60px' }}>
          <h1 style={{ fontWeight: 950, fontSize: '3.5rem', letterSpacing: '-3px' }}>PRO Kabinets</h1>
          <div style={{ display: 'flex', gap: '16px' }}>
            <button onClick={() => setShowSeminarForm(true)} className="btn-pro" style={{ background: 'var(--accent-secondary)', color: '#fff' }}>🎤 Rīkot Semināru</button>
            <button onClick={() => navigate('/expo')} className="btn-pro btn-pro-secondary">Apskatīt Halli</button>
            {booth && <Link to={`/expo/stends/${booth.slug || booth.id}`} className="btn-pro btn-pro-primary" style={{ background: booth.color || 'var(--accent-primary)' }}>Mans 3D Stends</Link>}
          </div>
        </div>

        {showSeminarForm && (
          <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.9)', zIndex: 10000, display: 'flex', alignItems: 'center', justifyContent: 'center', backdropFilter: 'blur(10px)' }}>
            <div className="glass-card" style={{ padding: '50px', width: '500px', borderColor: 'var(--accent-secondary)' }}>
              <h2 style={{ marginBottom: '15px', fontSize: '2rem' }}>Izsludināt Semināru</h2>
              <p style={{ color: 'var(--text-secondary)', marginBottom: '35px' }}>Jūsu uzņēmums parādīsies uz lielā ekrāna Semināru zālē tūkstošiem apmeklētāju.</p>
              <div className="input-group">
                <label>Semināra tēma
                  <input 
                    type="text" placeholder="piem. Inovācijas būvniecībā 2026" 
                    value={seminarTitle} onChange={(e) => setSeminarTitle(e.target.value)} 
                  />
                </label>
              </div>
              <button onClick={handleStartSeminar} className="btn-pro btn-pro-primary" style={{ width: '100%', marginTop: '30px', background: 'var(--accent-secondary)' }}>SĀKT TIEŠRAIDI</button>
              <button onClick={() => setShowSeminarForm(false)} style={{ width: '100%', background: 'none', border: 'none', marginTop: '20px', color: 'var(--text-muted)', cursor: 'pointer', fontWeight: 700 }}>Atcelt</button>
            </div>
          </div>
        )}

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 450px', gap: '40px' }}>
          
          {/* LEFT COLUMN: BOOTH MANAGEMENT */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '40px' }}>
            <section className="glass-card" style={{ padding: '40px', borderLeft: `6px solid ${booth?.color || 'var(--accent-primary)'}` }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
                <h2 style={{ margin: 0 }}>3D Stenda Konfigurācija</h2>
                <button onClick={() => setIsEditing(!isEditing)} className="btn-pro btn-pro-secondary" style={{ padding: '8px 20px', fontSize: '0.8rem' }}>{isEditing ? 'Atcelt' : 'Rediģēt'}</button>
              </div>

              {isEditing ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '25px' }}>
                  <div className="input-group-2">
                    <label>Uzņēmuma Nosaukums
                      <input type="text" value={editData.title} onChange={e => setEditData({...editData, title: e.target.value})} />
                    </label>
                    <label>Saukilis / Nozare
                      <input type="text" value={editData.subtitle} onChange={e => setEditData({...editData, subtitle: e.target.value})} />
                    </label>
                  </div>
                  <label>Apraksts
                    <textarea rows={4} value={editData.description} onChange={e => setEditData({...editData, description: e.target.value})} />
                  </label>
                  <label>Zīmola Krāsa (HEX)
                    <input type="color" value={editData.color} onChange={e => setEditData({...editData, color: e.target.value})} style={{ height: '60px', padding: '5px' }} />
                  </label>
                  <button onClick={handleUpdateBooth} className="btn-pro btn-pro-primary" style={{ background: editData.color }}>SAGLABĀT IZMAIŅAS</button>
                </div>
              ) : (
                <div>
                  <div style={{ display: 'flex', gap: '30px', alignItems: 'center' }}>
                    <div style={{ width: '80px', height: '80px', background: booth?.color, borderRadius: '20px', boxShadow: `0 10px 30px ${booth?.color}44` }}></div>
                    <div>
                      <div style={{ fontSize: '2rem', fontWeight: 900, letterSpacing: '-1px' }}>{booth?.title}</div>
                      <div style={{ color: 'var(--accent-primary)', fontWeight: 700, fontSize: '1.1rem' }}>{booth?.subtitle}</div>
                    </div>
                  </div>
                  <p style={{ marginTop: '30px', color: 'var(--text-secondary)', lineHeight: 1.8, fontSize: '1.1rem' }}>{booth?.description || 'Nav pievienots apraksts.'}</p>
                </div>
              )}
            </section>

            <section className="glass-card" style={{ padding: '40px' }}>
              <h2 style={{ marginBottom: '30px' }}>Īpašie Piedāvājumi</h2>
              <div style={{ marginBottom: '40px', background: 'rgba(255,255,255,0.03)', padding: '30px', borderRadius: '20px', border: '1px dashed var(--border-glass)' }}>
                <h4 style={{ color: 'var(--accent-primary)', marginBottom: '20px', fontSize: '0.9rem' }}>Pievienot jaunu pakalpojumu:</h4>
                <div className="input-group-2">
                  <label>Nosaukums
                    <input type="text" placeholder="piem. Sienu krāsošana" value={newOffer.title} onChange={e => setNewOffer({...newOffer, title: e.target.value})} />
                  </label>
                  <label>Cena
                    <input type="text" placeholder="no 15 EUR/m2" value={newOffer.price} onChange={e => setNewOffer({...newOffer, price: e.target.value})} />
                  </label>
                </div>
                <textarea placeholder="Īss pakalpojuma apraksts..." value={newOffer.description} onChange={e => setNewOffer({...newOffer, description: e.target.value})} style={{ width: '100%', marginTop: '20px' }} />
                <button onClick={handleAddOffer} className="btn-pro btn-pro-primary" style={{ marginTop: '25px', width: '100%' }}>PIEVIENOT SARAKSTAM</button>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {offers.map(offer => (
                  <div key={offer.id} className="glass-card" style={{ display: 'flex', justifyContent: 'space-between', padding: '20px', background: 'rgba(255,255,255,0.02)' }}>
                    <div>
                      <strong style={{ fontSize: '1.1rem' }}>{offer.title}</strong>
                      <div style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginTop: '4px' }}>{offer.description}</div>
                    </div>
                    <div style={{ fontWeight: 900, color: 'var(--accent-primary)', fontSize: '1.1rem' }}>{offer.price}</div>
                  </div>
                ))}
              </div>
            </section>
          </div>

          {/* RIGHT COLUMN: LEADS & STATS & ADS */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '40px' }}>
            <section className="glass-card" style={{ padding: '40px', background: 'linear-gradient(180deg, rgba(30, 41, 59, 0.9) 0%, var(--bg-main) 100%)' }}>
              <h2 style={{ marginBottom: '30px', color: '#fff' }}>Jaunākie Pieteikumi</h2>
              {leads.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>
                  <div style={{ fontSize: '3rem', marginBottom: '10px' }}>📩</div>
                  <p>Vēl nav saņemts neviens pieteikums.</p>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                  {leads.map(lead => (
                    <div key={lead.id} style={{ background: 'rgba(255,255,255,0.03)', padding: '20px', borderRadius: '16px', borderLeft: '4px solid #10b981' }}>
                      <div style={{ fontWeight: 800, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span>{lead.name}</span>
                        <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>{new Date(lead.created_at).toLocaleDateString()}</span>
                      </div>
                      <div style={{ fontSize: '0.9rem', color: '#10b981', margin: '8px 0', fontWeight: 700 }}>📞 {lead.phone}</div>
                      <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', margin: 0, lineHeight: 1.5 }}>{lead.message}</p>
                    </div>
                  ))}
                </div>
              )}
            </section>

            <section className="glass-card" style={{ padding: '40px' }}>
              <h2 style={{ marginBottom: '30px' }}>Reklāmas Baneri</h2>
              <div style={{ background: 'rgba(59, 130, 246, 0.05)', padding: '25px', borderRadius: '20px', border: '1px solid rgba(59, 130, 246, 0.2)' }}>
                <h4 style={{ margin: '0 0 20px 0', color: 'var(--accent-primary)' }}>Pirkt Reklāmu Hallē:</h4>
                <div className="input-group">
                  <label>Izvietojums
                    <select value={newCampaign.slot_id} onChange={e => setNewCampaign({...newCampaign, slot_id: e.target.value})}>
                      <option value="hall_wall_right">Labā Sienas Ekranizācija (€500)</option>
                      <option value="hall_wall_left">Kreisā Sienas Ekranizācija (€500)</option>
                      <option value="hall_end">Galvenais Plakāts (€800)</option>
                    </select>
                  </label>
                  <label>Banera/Video URL
                    <input type="text" placeholder="https://..." value={newCampaign.media_url} onChange={e => setNewCampaign({...newCampaign, media_url: e.target.value})} />
                  </label>
                </div>
                <button onClick={handleBuyAd} className="btn-pro btn-pro-primary" style={{ width: '100%', marginTop: '25px' }}>APMAKSĀT AR STRIPE</button>
              </div>
            </section>

            <section className="glass-card" style={{ padding: '40px', textAlign: 'center' }}>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '2px', fontWeight: 800 }}>Stenda Apmeklējumi</div>
              <div style={{ fontSize: '5rem', fontWeight: 950, letterSpacing: '-4px', margin: '10px 0' }}>428</div>
              <div className="glass-card" style={{ display: 'inline-flex', padding: '8px 16px', borderRadius: '50px', background: 'rgba(16, 185, 129, 0.1)', color: '#10b981', fontWeight: 800, fontSize: '0.9rem', borderColor: 'rgba(16, 185, 129, 0.2)' }}>
                📈 +12% šonedēļ
              </div>
            </section>
          </div>

        </div>
      </div>
    </div>
  );
}

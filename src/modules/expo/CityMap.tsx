import { useState } from 'react';
import '../../components/calculator/styles/CalculatorPro.css';
import { useNavigate } from 'react-router-dom';

export default function CityMap() {
  const nav = useNavigate();
  const [hoveredDistrict, setHoveredDistrict] = useState<string | null>(null);

  const DISTRICTS = [
    { id: 'construction', name: '1. Construction & Renovation', icon: '🏗️', color: '#eab308', desc: 'Būvniecība, materiāli, arhitekti, renovācija, jumti, logi.' },
    { id: 'logistics', name: '2. Logistics & Transport', icon: '🚛', color: '#f97316', desc: 'Kravu pārvadājumi, šoferi, piegāde, pārvākšanās.' },
    { id: 'cleaning', name: '3. Cleaning & Maintenance', icon: '🧹', color: '#06b6d4', desc: 'Uzkopšana pēc remonta, biroji, logi, paklāji.' },
    { id: 'realestate', name: '4. Real Estate District', icon: '🏢', color: '#ec4899', desc: 'Īpašumi, attīstītāji, investori, aģenti.' },
    { id: 'art', name: '5. Digital Art & Media', icon: '🎨', color: '#8b5cf6', desc: '8K video, animācijas, digitālās gleznas.' },
    { id: 'tech', name: '6. Electronics & Technology', icon: '💻', color: '#3b82f6', desc: 'Smart home, drošība, IT, audio/video.' },
    { id: 'auto', name: '7. Automotive & Mobility', icon: '🚗', color: '#64748b', desc: 'Auto tirgotāji, elektroauto, noma.' },
    { id: 'pets', name: '8. Pets & Animals', icon: '🐕', color: '#10b981', desc: 'Audzētāji, veterinārija, pet shopi.' },
    { id: 'food', name: '9. Food & Catering', icon: '🍎', color: '#ef4444', desc: 'Restorāni, food trucks, piegāde.' },
    { id: 'interior', name: '10. Interior & Furniture', icon: '🛋️', color: '#d97706', desc: 'Mēbeles, dizains, dekorācijas, virtuves, guļamistabas.' },
    { id: 'freelance', name: '11. Freelance & Digital', icon: '👨‍💻', color: '#6366f1', desc: 'Dizaineri, programmētāji, video montāža.' },
    { id: 'jobs', name: '12. Job & Recruitment', icon: '🤝', color: '#22c55e', desc: 'Darba piedāvājumi, freelancer projekti.' },
    { id: 'education', name: '13. Education & Courses', icon: '📚', color: '#a855f7', desc: 'Online kursi, semināri, apmācības.' },
    { id: 'health', name: '14. Health & Wellness', icon: '🏥', color: '#f43f5e', desc: 'Fitness, medicīna, spa.' },
    { id: 'beauty', name: '15. Beauty & Fashion', icon: '👗', color: '#ec4899', desc: 'Skaistumkopšana, apģērbi.' },
    { id: 'travel', name: '16. Travel & Tourism', icon: '✈️', color: '#0ea5e9', desc: 'Viesnīcas, tūrisma aģentūras.' },
    { id: 'entertainment', name: '17. Entertainment', icon: '🎬', color: '#f59e0b', desc: 'Koncerti, kino, pasākumi.' },
    { id: 'sports', name: '18. Sports District', icon: '⚽', color: '#10b981', desc: 'Sporta klubi, inventārs.' },
    { id: 'agriculture', name: '19. Agriculture & Farming', icon: '🚜', color: '#84cc16', desc: 'Tehnika, sēklas, lauksaimniecība.' },
    { id: 'industrial', name: '20. Industrial Equipment', icon: '⚙️', color: '#475569', desc: 'Rūpniecības iekārtas un tehnika.' },
    { id: 'energy', name: '21. Energy & Green Tech', icon: '☀️', color: '#fbbf24', desc: 'Saules paneļi, baterijas, zaļā enerģija.' },
    { id: 'finance', name: '22. Finance & Investment', icon: '💰', color: '#059669', desc: 'Bankas, investori, finanšu pakalpojumi.' },
    { id: 'startup', name: '23. Startup District', icon: '🚀', color: '#6366f1', desc: 'Jaunuzņēmumi un inovācijas.' },
    { id: 'gaming', name: '24. Gaming District', icon: '🎮', color: '#7c3aed', desc: 'Spēļu studijas un e-sports.' },
    { id: 'vr', name: '25. Virtual Reality', icon: '🥽', color: '#3b82f6', desc: 'VR projekti un meta-pasaules.' },
  ];

  return (
    <div className="calculator-pro-wrapper" style={{ maxWidth: '1600px' }}>
      <div className="calc-header" style={{ marginBottom: '40px' }}>
        <h1 style={{ background: 'linear-gradient(135deg, #fff, #3b82f6)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', fontSize: '3.5rem', fontWeight: 950 }}>
          WARPALA EXPO CITY
        </h1>
        <p style={{ fontSize: '1.2rem', color: '#cbd5e1' }}>25 Nozaru rajoni | Globāla biznesa ekosistēma</p>
        
        <div style={{ display: 'flex', gap: '10px', marginTop: '20px', justifyContent: 'center', flexWrap: 'wrap' }}>
          <button onClick={() => nav('/marketplace')} className="btn-pro" style={{ background: '#3b82f6', padding: '10px 20px', fontSize: '0.8rem' }}>🛒 MARKETPLACE</button>
          <button onClick={() => nav('/urgent-services')} className="btn-pro" style={{ background: '#ef4444', padding: '10px 20px', fontSize: '0.8rem' }}>🚨 URGENT</button>
          <button onClick={() => nav('/events')} className="btn-pro" style={{ background: '#8b5cf6', padding: '10px 20px', fontSize: '0.8rem' }}>📅 EVENTS</button>
          <button onClick={() => nav('/ads-network')} className="btn-pro" style={{ background: '#10b981', padding: '10px 20px', fontSize: '0.8rem' }}>📈 ADS</button>
          <button onClick={() => nav('/expo-3d')} className="btn-pro" style={{ background: '#fff', color: '#000', padding: '10px 20px', fontSize: '0.8rem' }}>🕹️ ENTER 3D</button>
        </div>
      </div>

      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', 
        gap: '15px',
        padding: '20px',
        background: 'rgba(15, 23, 42, 0.3)',
        borderRadius: '24px',
        border: '1px solid #1e293b'
      }}>
        {DISTRICTS.map((d) => (
          <div 
            key={d.id}
            onMouseEnter={() => setHoveredDistrict(d.id)}
            onMouseLeave={() => setHoveredDistrict(null)}
            onClick={() => nav('/expo-3d')}
            style={{ 
              background: hoveredDistrict === d.id ? `linear-gradient(135deg, ${d.color}22, ${d.color}11)` : 'rgba(255,255,255,0.02)',
              border: `1px solid ${hoveredDistrict === d.id ? d.color : '#1e293b'}`,
              borderRadius: '16px', padding: '20px', cursor: 'pointer', transition: 'all 0.2s ease',
              display: 'flex', flexDirection: 'column', gap: '10px'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
              <div style={{ fontSize: '2rem' }}>{d.icon}</div>
              <h3 style={{ color: d.color, fontWeight: 900, fontSize: '1rem', margin: 0 }}>{d.name}</h3>
            </div>
            <p style={{ fontSize: '0.75rem', color: '#94a3b8', margin: 0, lineHeight: '1.4' }}>{d.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

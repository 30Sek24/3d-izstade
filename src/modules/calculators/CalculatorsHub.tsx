import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const categories = [
  { id: 'all', label: 'Visi' },
  { id: 'construction', label: 'Būvniecība' },
  { id: 'creative', label: 'Radošums' },
  { id: 'services', label: 'Pakalpojumi' }
];

const calculators = [
  { 
    id: 'roof', 
    title: 'Jumta segums', 
    desc: 'Precīzs materiālu un darba izmaksu aprēķins jumta izbūvei.', 
    icon: '🏠', 
    path: '/roof-cost-calculator',
    category: 'construction'
  },
  { 
    id: 'heating', 
    title: 'Apkures sistēmas', 
    desc: 'Siltumsūkņu, radiatoru un silto grīdu aprēķins.', 
    icon: '🔥', 
    path: '/heating-cost-calculator',
    category: 'construction'
  },
  { 
    id: 'foundation', 
    title: 'Pamatu izbūve', 
    desc: 'Betona, armatūras un zemes darbu tāme.', 
    icon: '🏗️', 
    path: '/foundation-cost-calculator',
    category: 'construction'
  },
  { 
    id: 'interior', 
    title: 'Iekšdarbi', 
    desc: 'Pilns telpu remonta un apdares materiālu aprēķins.', 
    icon: '🎨', 
    path: '/renovation-cost-calculator',
    category: 'construction'
  },
  { 
    id: 'timber', 
    title: 'Koka karkass', 
    desc: 'Materiālu aprēķins koka karkasa mājām un nojumēm.', 
    icon: '🌲', 
    path: '/timber-house-calculator',
    category: 'construction'
  },
  { 
    id: 'windows', 
    title: 'Logi un durvis', 
    desc: 'PVC un koka konstrukciju izmaksu tāme.', 
    icon: '🪟', 
    path: '/windows-calculator',
    category: 'construction'
  },
  { 
    id: 'visuals', 
    title: '3D Vizuāļi', 
    desc: 'Arhitektūras un produktu vizualizāciju aprēķins.', 
    icon: '📸', 
    path: '/visuals-calculator',
    category: 'creative'
  },
  { 
    id: 'digital-art', 
    title: 'Digitālais Art', 
    desc: 'Grafiskā dizaina un ilustrāciju pakalpojumu tāme.', 
    icon: '🖼️', 
    path: '/digital-art-calculator',
    category: 'creative'
  },
  { 
    id: 'autoservice', 
    title: 'Auto serviss', 
    desc: 'Remonta darbu un rezerves daļu aprēķins.', 
    icon: '🚗', 
    path: '/autoservice-calculator',
    category: 'services'
  },
  { 
    id: 'cleaning', 
    title: 'Uzkopšana', 
    desc: 'Telpu un teritoriju profesionālās uzkopšanas tāme.', 
    icon: '🧹', 
    path: '/cleaning-calculator',
    category: 'services'
  },
  { 
    id: 'quick-fix', 
    title: 'Saimnieka palīgs', 
    desc: 'Sīkie remontdarbi un steidzamie izsaukumi.', 
    icon: '🛠️', 
    path: '/quick-fix-calculator',
    category: 'services'
  },
  { 
    id: 'plumbing', 
    title: 'Santehnika', 
    desc: 'Cauruļvadu, mezglu un ierīču montāžas aprēķins.', 
    icon: '🚰', 
    path: '/plumbing-calculator',
    category: 'services'
  }
];

const CalculatorsHub: React.FC = () => {
  const [activeCat, setActiveCat] = useState('all');
  const [search, setSearch] = useState('');

  const filtered = calculators.filter(c => 
    (activeCat === 'all' || c.category === activeCat) &&
    (c.title.toLowerCase().includes(search.toLowerCase()) || c.desc.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div style={{ maxWidth: '1400px', margin: '40px auto', padding: '0 20px' }}>
      {/* HEADER */}
      <div style={{ marginBottom: '60px', textAlign: 'center' }}>
        <h1 className="text-gradient" style={{ fontSize: '3.5rem', fontWeight: 900, marginBottom: '15px', letterSpacing: '-2px' }}>
          PRO CALCULATORS
        </h1>
        <p style={{ color: '#64748b', fontSize: '1.2rem', maxWidth: '600px', margin: '0 auto' }}>
          Precīzi aprēķini, materiālu tāmes un darba izmaksas vienuviet. Izvēlies nozari un sāc plānot.
        </p>
      </div>

      {/* FILTERS & SEARCH */}
      <div style={{ 
        display: 'flex', justifyContent: 'space-between', alignItems: 'center', 
        marginBottom: '40px', gap: '20px', flexWrap: 'wrap' 
      }}>
        <div style={{ display: 'flex', gap: '10px', background: 'rgba(255,255,255,0.03)', padding: '5px', borderRadius: '14px', border: '1px solid rgba(255,255,255,0.05)' }}>
          {categories.map(cat => (
            <button
              key={cat.id}
              onClick={() => setActiveCat(cat.id)}
              style={{
                padding: '10px 20px', borderRadius: '10px', border: 'none', cursor: 'pointer',
                fontWeight: 700, fontSize: '0.85rem', transition: 'all 0.2s',
                background: activeCat === cat.id ? '#3b82f6' : 'transparent',
                color: activeCat === cat.id ? '#fff' : '#64748b'
              }}
            >
              {cat.label}
            </button>
          ))}
        </div>

        <div style={{ position: 'relative', flex: '1', maxWidth: '400px' }}>
          <input 
            type="text" 
            placeholder="Meklēt rīku..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{
              width: '100%', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)',
              padding: '15px 20px', borderRadius: '14px', color: '#fff', fontSize: '1rem', outline: 'none'
            }}
          />
        </div>
      </div>

      {/* GRID */}
      <div style={{ 
        display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', 
        gap: '25px' 
      }}>
        {filtered.map(calc => (
          <Link key={calc.id} to={calc.path} style={{ textDecoration: 'none', color: 'inherit' }}>
            <div className="glass-card" style={{ padding: '30px', height: '100%', display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div style={{ fontSize: '2.5rem', background: 'rgba(59, 130, 246, 0.1)', width: '70px', height: '70px', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '18px' }}>
                {calc.icon}
              </div>
              <div>
                <h3 style={{ fontSize: '1.4rem', fontWeight: 800, marginBottom: '10px', color: '#fff' }}>{calc.title}</h3>
                <p style={{ color: '#94a3b8', fontSize: '0.95rem', lineHeight: '1.6', marginBottom: '20px' }}>{calc.desc}</p>
              </div>
              <div style={{ marginTop: 'auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '0.7rem', fontWeight: 900, color: '#3b82f6', background: 'rgba(59, 130, 246, 0.1)', padding: '5px 12px', borderRadius: '20px', textTransform: 'uppercase' }}>
                  {calc.category}
                </span>
                <span style={{ color: '#3b82f6', fontWeight: 900 }}>ATVĒRT →</span>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {filtered.length === 0 && (
        <div style={{ textAlign: 'center', padding: '100px', color: '#64748b' }}>
          <h2>Nekas netika atrasts...</h2>
          <p>Mēģiniet citu meklēšanas vārdu.</p>
        </div>
      )}
    </div>
  );
};

export default CalculatorsHub;

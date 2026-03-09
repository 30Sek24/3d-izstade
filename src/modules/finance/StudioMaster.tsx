import { useState } from 'react';
import '../../components/calculator/styles/CalculatorPro.css';
import { generateAiVideo } from '../../services/aiService';

export default function StudioMaster() {
  const [prompt, setPrompt] = useState('');
  const [style, setStyle] = useState('Modern Tech');
  const [isGenerating, setIsGenerating] = useState(false);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);

  const generateAd = async () => {
    setIsGenerating(true);
    setVideoUrl(null);
    try {
      const result = await generateAiVideo(prompt, style);
      setVideoUrl(result.videoUrl);
    } catch (e) {
      alert("Video ģenerēšanas kļūda");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="calculator-pro-wrapper">
      <div className="calc-header">
        <h1 className="text-accent">Virtual AI Studio</h1>
        <p>Ģenerējiet profesionālas video reklāmas savam uzņēmumam ar vienu klikšķi.</p>
      </div>

      <div className="calc-grid">
        <div className="calc-form-column">
          <section className="calc-section">
            <h2>1. Video Scenārijs</h2>
            <textarea 
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Aprakstiet savu reklāmu (piem. 'Dinamiska reklāma manam jumtu uzņēmumam ar mūsdienīgu mūziku')..."
              style={{ width: '100%', height: '150px', background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(139, 92, 246, 0.3)', borderRadius: '16px', padding: '20px', color: '#fff', fontSize: '1rem', outline: 'none', marginBottom: '20px' }}
            />
            
            <div className="input-group">
              <label>Video stils
                <select value={style} onChange={e => setStyle(e.target.value)}>
                  <option>Modern Tech</option>
                  <option>Cinematic</option>
                  <option>Minimalist</option>
                  <option>High Energy</option>
                </select>
              </label>
              <label style={{ marginTop: '15px' }}>Garums
                <select>
                  <option>15 sekundes (Stories/Reels)</option>
                  <option>30 sekundes (Youtube Ad)</option>
                  <option>60 sekundes (Full Promo)</option>
                </select>
              </label>
            </div>
          </section>

          <button 
            onClick={generateAd} 
            disabled={isGenerating || !prompt}
            className="btn-primary" 
            style={{ width: '100%', background: 'var(--accent-purple)', padding: '20px', fontSize: '1.2rem' }}
          >
            {isGenerating ? 'AI RENDERĒ REKLĀMU...' : '🎬 GENERATE VIDEO AD'}
          </button>
        </div>

        <div className="calc-results-column">
          <div className="sticky-results">
            <h3 className="results-title">Preview & Export</h3>
            
            {!videoUrl && !isGenerating ? (
              <div className="empty-state">
                <div className="empty-state-icon">🎥</div>
                <p>Jūsu video parādīsies šeit pēc ģenerēšanas.</p>
              </div>
            ) : isGenerating ? (
              <div style={{ textAlign: 'center', padding: '60px 0' }}>
                <div className="spinner" style={{ border: '4px solid rgba(255,255,255,0.1)', borderTop: '4px solid var(--accent-purple)', borderRadius: '50%', width: '50px', height: '50px', animation: 'spin 1s linear infinite', margin: '0 auto 20px' }}></div>
                <p style={{ color: 'var(--accent-purple)', fontWeight: 800 }}>ENGINEERING VISUALS...</p>
              </div>
            ) : (
              <div style={{ animation: 'fadeIn 0.5s' }}>
                <video src={videoUrl!} controls style={{ width: '100%', borderRadius: '16px', boxShadow: '0 20px 50px rgba(0,0,0,0.5)' }} />
                <div style={{ marginTop: '20px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                  <button className="btn-primary">DOWNLOAD 4K</button>
                  <button className="btn-glass">PUBLISH TO ADS</button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      <style>{`
        @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
      `}</style>
    </div>
  );
}

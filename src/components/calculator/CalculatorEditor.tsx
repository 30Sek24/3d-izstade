import { useState, useEffect, useRef } from 'react';
import { MOCK_SECTIONS } from '../../lib/calculator-types';
import type { Section, EstimateLine } from '../../lib/calculator-types';
import { fetchSections, saveEstimateDraft } from '../../api/queries';
import { MOCK_CATALOG, REGIONS } from '../../lib/catalog-types';
import type { CatalogItem } from '../../lib/catalog-types';
import CatalogModal from '../catalog/CatalogModal';
import PdfDocument from './PdfDocument';
import TakeoffViewer from './TakeoffViewer';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { supabase } from '../../lib/supabase';
import type { Session } from '@supabase/supabase-js';
import './styles/CalculatorPro.css'; // <--- Jaunie, smalkie stili

export default function CalculatorEditor() {
  const [sections, setSections] = useState<Section[]>([]);
  const [lines, setLines] = useState<EstimateLine[]>([]);
  const [activeSectionId, setActiveSectionId] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);
  const [isCatalogOpen, setIsCatalogOpen] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [session, setSession] = useState<Session | null>(null);
  
  const pdfRef = useRef<HTMLDivElement>(null);

  // Takeoff / Ģeometrijas stāvoklis (State)
  const [geometry, setGeometry] = useState({
    length: 5.0,
    width: 4.0,
    height: 2.7,
    openings: 3.5,
  });

  const floorArea = geometry.length * geometry.width;
  const perimeter = (geometry.length + geometry.width) * 2;
  const wallArea = (perimeter * geometry.height) - geometry.openings;

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    async function loadData() {
      const dbSections = await fetchSections();
      if (dbSections.length > 0) {
        setSections(dbSections);
        setActiveSectionId(dbSections[0].id);
      } else {
        setSections(MOCK_SECTIONS);
        setActiveSectionId(MOCK_SECTIONS[0].id);
      }
      setIsLoading(false);
    }
    loadData();
  }, []);

  const handleGeoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setGeometry({ ...geometry, [e.target.name]: parseFloat(e.target.value) || 0 });
  };

  const handleAddItems = (items: CatalogItem[], regionId: string) => {
    const region = REGIONS.find(r => r.id === regionId) || REGIONS[0];
    const newLines: EstimateLine[] = items.map(item => {
      let defaultQty = 1;
      if (item.default_unit === 'm2' && item.name.toLowerCase().includes('sien')) defaultQty = wallArea;
      if (item.default_unit === 'm') defaultQty = perimeter;

      const laborPrice = item.type === 'work' ? item.base_rate * region.laborMultiplier : 0;
      const materialPrice = item.type === 'material' ? item.base_rate * region.materialMultiplier : 0;

      return {
        id: `line-${Date.now()}-${Math.random()}`,
        section_id: activeSectionId,
        description: item.name,
        unit: item.default_unit,
        qty: defaultQty,
        unit_price_labor: laborPrice,
        unit_price_material: materialPrice,
      };
    });
    setLines([...lines, ...newLines]);
  };

  const handleQtyChange = (id: string, newQty: number) => {
    setLines(lines.map(l => l.id === id ? { ...l, qty: newQty } : l));
  };

  const removeLine = (id: string) => {
    setLines(lines.filter(l => l.id !== id));
  };

  // Aprēķini
  const laborTotal = lines.reduce((sum, line) => sum + (line.qty * line.unit_price_labor), 0);
  const materialTotal = lines.reduce((sum, line) => sum + (line.qty * line.unit_price_material), 0);
  const subtotal = laborTotal + materialTotal;
  const vat = subtotal * 0.21;
  const grandTotal = subtotal + vat;

  const activeSection = sections.find(s => s.id === activeSectionId);
  const activeLines = lines.filter(line => line.section_id === activeSectionId);

  const handleSaveDraft = async () => {
    if (!session) {
      alert("Lai saglabātu tāmi datubāzē, lūdzu, ielogojieties sistēmā.");
      return;
    }
    if (lines.length === 0) {
      alert("Tāme ir tukša.");
      return;
    }

    setIsSaving(true);
    const result = await saveEstimateDraft(lines, "Klients (Draft)", "Objekts (Draft)", geometry, session.user.id);
    setIsSaving(false);

    if (result.success) {
      alert("Tāme veiksmīgi saglabāta kā Draft!");
    } else {
      alert("Kļūda saglabājot: Visticamāk nav pievienotas datubāzes atslēgas vai neesat pareizi ielogojies.");
    }
  };

  const handleExportPDF = async () => {
    if (!pdfRef.current) return;
    setIsExporting(true);
    try {
      const canvas = await html2canvas(pdfRef.current, { scale: 2 });
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
      
      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save('Tame-Piedavajums.pdf');
    } catch (error) {
      console.error("PDF ģenerēšanas kļūda:", error);
      alert("Neizdevās izveidot PDF. Mēģiniet vēlreiz.");
    } finally {
      setIsExporting(false);
    }
  };

  if (isLoading) return <div style={{ padding: '40px', textAlign: 'center' }}>Ielādē sistēmu...</div>;

  return (
    <div className="calc-editor-container">
      {/* KREISĀ KOLONNA: Tāmes Struktūra */}
      <aside className="calc-sidebar">
        <h3>Tāmes Struktūra</h3>
        <ul className="section-list">
          {sections.map((section) => {
            const sectionLinesCount = lines.filter(l => l.section_id === section.id).length;
            return (
              <li key={section.id}>
                <button 
                  className={`section-btn ${activeSectionId === section.id ? 'active' : ''}`}
                  onClick={() => setActiveSectionId(section.id)}
                >
                  <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    {section.code === 'GEO' ? '📐' : '📝'} {section.name}
                  </span>
                  {section.code !== 'GEO' && (
                    <span className="section-status-badge">
                      {sectionLinesCount > 0 ? `${sectionLinesCount} poz.` : '-'}
                    </span>
                  )}
                </button>
              </li>
            );
          })}
        </ul>
      </aside>

      {/* VIDĒJĀ KOLONNA: Profesionālais Redaktors */}
      <section className="calc-main">
        <header className="calc-main-header">
          <div>
            <h2>{activeSection?.name}</h2>
            <p>Aizpildiet informāciju un specifikāciju</p>
          </div>
          {activeSection?.code !== 'GEO' && (
            <button className="btn-secondary-action" onClick={() => setIsCatalogOpen(true)}>
              + Pievienot no Kataloga
            </button>
          )}
        </header>
        
        {activeSection?.code === 'GEO' ? (
          <div className="takeoff-module">
            <div className="takeoff-grid">
              <label>Telpas garums (m)
                <input type="number" name="length" value={geometry.length} onChange={handleGeoChange} step="0.1" />
              </label>
              <label>Telpas platums (m)
                <input type="number" name="width" value={geometry.width} onChange={handleGeoChange} step="0.1" />
              </label>
              <label>Griestu augstums (m)
                <input type="number" name="height" value={geometry.height} onChange={handleGeoChange} step="0.1" />
              </label>
              <label>Logu/Durvju atvērumi (m²)
                <input type="number" name="openings" value={geometry.openings} onChange={handleGeoChange} step="0.1" />
              </label>
            </div>
            <div className="takeoff-results">
              <div className="geo-stats">
                <div className="geo-stat-box"><span>Grīda / Griesti</span> <strong>{floorArea.toFixed(2)} m²</strong></div>
                <div className="geo-stat-box"><span>Perimetrs</span> <strong>{perimeter.toFixed(2)} m</strong></div>
                <div className="geo-stat-box"><span>Sienu apdare (neto)</span> <strong>{wallArea.toFixed(2)} m²</strong></div>
              </div>
            </div>
            <TakeoffViewer />
          </div>
        ) : (
          <div className="calc-table-wrap">
            <table className="calc-table">
              <thead>
                <tr>
                  <th>Pozīcijas Apraksts</th>
                  <th style={{ width: '130px' }}>Apjoms</th>
                  <th style={{ width: '100px', textAlign: 'right' }}>Vien. Cena</th>
                  <th style={{ width: '120px', textAlign: 'right' }}>Kopā (€)</th>
                  <th style={{ width: '50px' }}></th>
                </tr>
              </thead>
              <tbody>
                {activeLines.length === 0 ? (
                  <tr>
                    <td colSpan={5}>
                      <div className="empty-state">
                        <div className="empty-state-icon">📋</div>
                        <div>Šajā sadaļā vēl nav pievienota neviena pozīcija.<br/>Nospiediet "Pievienot no Kataloga", lai sāktu.</div>
                      </div>
                    </td>
                  </tr>
                ) : (
                  activeLines.map((line) => {
                    const isWork = line.unit_price_labor > 0;
                    const lineTotal = (line.unit_price_labor + line.unit_price_material) * line.qty;
                    const unitPrice = line.unit_price_labor + line.unit_price_material;
                    
                    return (
                      <tr key={line.id}>
                        <td>
                          <div style={{ display: 'flex', alignItems: 'center' }}>
                            <span className={`row-type-indicator ${isWork ? 'row-type-work' : 'row-type-material'}`} title={isWork ? 'Darbs' : 'Materiāls'}></span>
                            <span style={{ fontWeight: 500 }}>{line.description}</span>
                          </div>
                        </td>
                        <td>
                          <div className="qty-input-group">
                            <input 
                              type="number" 
                              value={line.qty} 
                              onChange={(e) => handleQtyChange(line.id, parseFloat(e.target.value) || 0)}
                              className="qty-input" 
                            />
                            <span className="qty-unit">{line.unit}</span>
                          </div>
                        </td>
                        <td className="price-col" style={{ textAlign: 'right' }}>
                          {unitPrice.toFixed(2)}
                        </td>
                        <td className="total-col" style={{ textAlign: 'right' }}>
                          {lineTotal.toFixed(2)}
                        </td>
                        <td style={{ textAlign: 'center' }}>
                          <button 
                            onClick={() => removeLine(line.id)}
                            style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', fontSize: '1.2rem' }}
                            title="Dzēst pozīciju"
                          >×</button>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {/* LABĀ KOLONNA: Sticky Kopsavilkums */}
      <aside className="calc-summary">
        <div className="summary-card">
          <h3>Kopsavilkums</h3>
          
          <div className="summary-row">
            <span style={{ fontWeight: 600 }}>Celtniecības izmaksas</span>
          </div>
          <div className="summary-row sub-row">
            <span>Darba spēks</span>
            <span>{laborTotal.toFixed(2)} €</span>
          </div>
          <div className="summary-row sub-row">
            <span>Materiāli</span>
            <span>{materialTotal.toFixed(2)} €</span>
          </div>
          
          <div className="summary-divider"></div>
          
          <div className="summary-row" style={{ fontWeight: 600 }}>
            <span>Tāmes Starpsumma</span>
            <span>{subtotal.toFixed(2)} €</span>
          </div>
          <div className="summary-row sub-row">
            <span>PVN (21%)</span>
            <span>{vat.toFixed(2)} €</span>
          </div>
          
          <div className="summary-row grand-total">
            <span>KOPĀ</span>
            <span>{grandTotal.toFixed(2)} €</span>
          </div>
          
          <div className="action-buttons">
            <button 
              className="btn-secondary-action w-full" 
              onClick={handleSaveDraft}
              disabled={isSaving || lines.length === 0}
            >
              {isSaving ? 'Saglabā DB...' : '💾 Saglabāt kā Melnrakstu'}
            </button>

            <button 
              className="btn-primary-action w-full" 
              onClick={handleExportPDF}
              disabled={isExporting || lines.length === 0}
            >
              {isExporting ? 'Ģenerē PDF...' : '📄 Ģenerēt PDF (1 Kredīts)'}
            </button>
          </div>
          
        </div>
      </aside>

      <CatalogModal 
        isOpen={isCatalogOpen} 
        onClose={() => setIsCatalogOpen(false)} 
        catalogData={MOCK_CATALOG}
        onAddItems={handleAddItems}
      />

      <PdfDocument 
        ref={pdfRef} 
        lines={lines} 
        sections={sections} 
        totals={{ labor: laborTotal, material: materialTotal, subtotal, vat, grandTotal }} 
      />
    </div>
  );
}
import { useState } from 'react';
import { REGIONS } from '../../core/catalog-types';
import type { CatalogItem } from '../../core/catalog-types';
import './CatalogModal.css';

interface CatalogModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddItems: (items: CatalogItem[], regionId: string) => void;
  catalogData: CatalogItem[];
}

export default function CatalogModal({ isOpen, onClose, onAddItems, catalogData }: CatalogModalProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRegionId, setSelectedRegionId] = useState(REGIONS[0].id);
  const [selectedItemIds, setSelectedItemIds] = useState<Set<string>>(new Set());

  if (!isOpen) return null;

  const activeRegion = REGIONS.find(r => r.id === selectedRegionId) || REGIONS[0];

  const filteredItems = catalogData.filter(item => 
    item.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    item.code.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const toggleSelection = (id: string) => {
    const newSet = new Set(selectedItemIds);
    if (newSet.has(id)) newSet.delete(id);
    else newSet.add(id);
    setSelectedItemIds(newSet);
  };

  const handleAdd = () => {
    const itemsToAdd = catalogData.filter(item => selectedItemIds.has(item.id));
    onAddItems(itemsToAdd, selectedRegionId);
    setSelectedItemIds(new Set()); // Notīrām izvēli pēc pievienošanas
    onClose();
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <header className="modal-header">
          <h2>Katalogs & Tirgus Cenas</h2>
          <button onClick={onClose} className="close-btn">&times;</button>
        </header>

        <div className="modal-controls">
          <div className="control-group">
            <label>Reģionālās cenas:</label>
            <select 
              value={selectedRegionId} 
              onChange={(e) => setSelectedRegionId(e.target.value)}
              className="catalog-select"
            >
              {REGIONS.map(reg => (
                <option key={reg.id} value={reg.id}>{reg.name}</option>
              ))}
            </select>
          </div>
          <div className="control-group" style={{ flexGrow: 1 }}>
            <label>Meklēt pozīciju:</label>
            <input 
              type="text" 
              placeholder="Piem., 'Špaktelēšana' vai 'INT-W-01'" 
              value={searchTerm} 
              onChange={(e) => setSearchTerm(e.target.value)}
              className="catalog-input"
            />
          </div>
        </div>

        <div className="catalog-table-wrap">
          <table className="catalog-table">
            <thead>
              <tr>
                <th style={{ width: '40px' }}></th>
                <th style={{ width: '80px' }}>Kods</th>
                <th>Nosaukums / Apraksts</th>
                <th style={{ width: '100px' }}>Tips</th>
                <th style={{ width: '120px' }}>Tirgus Cena ({activeRegion.name})</th>
              </tr>
            </thead>
            <tbody>
              {filteredItems.map(item => {
                const multiplier = item.type === 'work' ? activeRegion.laborMultiplier : activeRegion.materialMultiplier;
                const finalPrice = item.base_rate * multiplier;

                return (
                  <tr key={item.id} className={selectedItemIds.has(item.id) ? 'selected-row' : ''} onClick={() => toggleSelection(item.id)}>
                    <td style={{ textAlign: 'center' }}>
                      <input 
                        type="checkbox" 
                        checked={selectedItemIds.has(item.id)} 
                        onChange={() => {}} // Handle on tr click instead
                        style={{ cursor: 'pointer' }}
                      />
                    </td>
                    <td><span className="code-badge">{item.code}</span></td>
                    <td>
                      <div style={{ fontWeight: 500 }}>{item.name}</div>
                      {item.brand && <div style={{ fontSize: '0.8rem', color: '#6b7280' }}>Zīmols: {item.brand}</div>}
                    </td>
                    <td>
                      <span className={`type-badge type-${item.type}`}>
                        {item.type === 'work' ? 'Darbs' : 'Materiāls'}
                      </span>
                    </td>
                    <td><strong>{finalPrice.toFixed(2)} €</strong> / {item.default_unit}</td>
                  </tr>
                );
              })}
              {filteredItems.length === 0 && (
                <tr>
                  <td colSpan={5} style={{ textAlign: 'center', padding: '40px', color: '#999' }}>Nekas netika atrasts.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <footer className="modal-footer">
          <div className="selected-count">
            Izvēlētas: <strong>{selectedItemIds.size}</strong> pozīcijas
          </div>
          <div className="modal-actions">
            <button className="btn btn-soft" onClick={onClose}>Atcelt</button>
            <button className="btn" onClick={handleAdd} disabled={selectedItemIds.size === 0}>
              Pievienot Tāmei
            </button>
          </div>
        </footer>
      </div>
    </div>
  );
}

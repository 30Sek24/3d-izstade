export interface Section {
  id: string;
  name: string;
  code: string;
  priority: number;
}

export interface EstimateLine {
  id: string;
  section_id: string;
  description: string;
  unit: string;
  qty: number;
  unit_price_labor: number;
  unit_price_material: number;
}

// Fiktīvi (mock) dati, kamēr nav pieslēgts Supabase
export const MOCK_SECTIONS: Section[] = [
  { id: 'sec-1', name: 'Objekts & Lokācija', code: 'OBJ', priority: 10 },
  { id: 'sec-2', name: 'Ģeometrija / Apjomi', code: 'GEO', priority: 20 },
  { id: 'sec-3', name: 'Sagatavošana / Demontāža', code: 'DEMO', priority: 30 },
  { id: 'sec-4', name: 'Elektrība', code: 'ELEC', priority: 40 },
  { id: 'sec-5', name: 'Santehnika', code: 'PLUMB', priority: 50 },
  { id: 'sec-6', name: 'Iekšējā apdare', code: 'INT', priority: 60 },
];

export const MOCK_LINES: EstimateLine[] = [
  { id: 'l-1', section_id: 'sec-4', description: 'Rozetes kārbas urbšana (betons)', unit: 'gab', qty: 15, unit_price_labor: 8.50, unit_price_material: 1.20 },
  { id: 'l-2', section_id: 'sec-4', description: 'Kabeļa vilkšana 3x2.5 (gofra)', unit: 'm', qty: 45, unit_price_labor: 2.00, unit_price_material: 1.80 },
  { id: 'l-3', section_id: 'sec-6', description: 'Sienu špaktelēšana un krāsošana', unit: 'm2', qty: 80, unit_price_labor: 12.00, unit_price_material: 4.50 },
];
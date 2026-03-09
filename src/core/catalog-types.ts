export interface CatalogItem {
  id: string;
  code: string;
  name: string;
  type: 'work' | 'material' | 'service';
  default_unit: string;
  section_id: string;
  base_rate: number; // Kombinēts field ērtai lietošanai front-endā (no work_item vai material)
  brand?: string;
}

export interface RegionPricing {
  id: string;
  name: string;
  laborMultiplier: number;
  materialMultiplier: number;
}

// Bāzes valsts ir Latvija/Baltija = 1.0
export const REGIONS: RegionPricing[] = [
  { id: 'baltics', name: 'Baltija (LV, LT, EE)', laborMultiplier: 1.0, materialMultiplier: 1.0 },
  { id: 'germany', name: 'Vācija (DE)', laborMultiplier: 2.8, materialMultiplier: 1.25 },
  { id: 'poland', name: 'Polija (PL)', laborMultiplier: 0.85, materialMultiplier: 0.90 },
  { id: 'scandinavia', name: 'Skandināvija (SE, NO, FI)', laborMultiplier: 3.5, materialMultiplier: 1.40 },
  { id: 'uk', name: 'Apvienotā Karaliste (UK)', laborMultiplier: 3.0, materialMultiplier: 1.30 },
  { id: 'france', name: 'Francija (FR)', laborMultiplier: 2.6, materialMultiplier: 1.20 },
  { id: 'italy', name: 'Itālija (IT)', laborMultiplier: 2.2, materialMultiplier: 1.15 },
  { id: 'spain', name: 'Spānija (ES)', laborMultiplier: 1.8, materialMultiplier: 1.10 },
  { id: 'balkans', name: 'Balkāni (RO, BG)', laborMultiplier: 0.70, materialMultiplier: 0.85 },
];

export const MOCK_CATALOG: CatalogItem[] = [
  // --- DEMONTĀŽA (sec-3) ---
  { id: 'd1', code: 'DEM-W-01', name: 'Veco tapešu un krāsas noņemšana', type: 'work', default_unit: 'm2', section_id: 'sec-3', base_rate: 3.50 },
  { id: 'd2', code: 'DEM-W-02', name: 'Flīžu demontāža', type: 'work', default_unit: 'm2', section_id: 'sec-3', base_rate: 8.00 },
  { id: 'd3', code: 'DEM-W-03', name: 'Nenesošo starpsienu nojaukšana (Reģipsis/Mūris)', type: 'work', default_unit: 'm2', section_id: 'sec-3', base_rate: 15.00 },
  { id: 'd4', code: 'DEM-S-01', name: 'Būvgružu izvešana (konteiners 8m3)', type: 'service', default_unit: 'gab', section_id: 'sec-3', base_rate: 220.00 },

  // --- ELEKTRĪBA (sec-4) ---
  { id: 'e1', code: 'EL-W-01', name: 'Kabeļa vilkšana (gofra, zemapmetuma)', type: 'work', default_unit: 'm', section_id: 'sec-4', base_rate: 2.50 },
  { id: 'e2', code: 'EL-M-01', name: 'Kabelis NYM-J 3x1.5 (Apgaismojums)', type: 'material', default_unit: 'm', section_id: 'sec-4', base_rate: 0.85, brand: 'Draka / Prysmian' },
  { id: 'e3', code: 'EL-M-02', name: 'Kabelis NYM-J 3x2.5 (Rozetes)', type: 'material', default_unit: 'm', section_id: 'sec-4', base_rate: 1.35, brand: 'Draka / Prysmian' },
  { id: 'e4', code: 'EL-W-02', name: 'Rozetes/slēdža kārbas urbšana (betons/ķieģelis)', type: 'work', default_unit: 'gab', section_id: 'sec-4', base_rate: 9.00 },
  { id: 'e5', code: 'EL-W-03', name: 'Rozetes vai slēdža mehānisma montāža', type: 'work', default_unit: 'gab', section_id: 'sec-4', base_rate: 4.50 },
  { id: 'e6', code: 'EL-M-03', name: 'Rozete ar zemējumu (Balta)', type: 'material', default_unit: 'gab', section_id: 'sec-4', base_rate: 4.20, brand: 'Schneider Electric / Jung' },
  { id: 'e7', code: 'EL-W-04', name: 'Sadales skapja komplektēšana un pieslēgšana', type: 'work', default_unit: 'gab', section_id: 'sec-4', base_rate: 150.00 },

  // --- SANTEHNIKA & APKURE (sec-5) ---
  { id: 's1', code: 'SAN-W-01', name: 'Ūdensvada caurules izbūve', type: 'work', default_unit: 'm', section_id: 'sec-5', base_rate: 12.00 },
  { id: 's2', code: 'SAN-M-01', name: 'Daudzslāņu caurule PEX/AL/PEX 16x2', type: 'material', default_unit: 'm', section_id: 'sec-5', base_rate: 1.45, brand: 'Uponor / Wavin' },
  { id: 's3', code: 'SAN-W-02', name: 'Kanalizācijas caurules izbūve (DN50/DN110)', type: 'work', default_unit: 'm', section_id: 'sec-5', base_rate: 14.00 },
  { id: 's4', code: 'SAN-M-02', name: 'Kanalizācijas caurule PVC', type: 'material', default_unit: 'm', section_id: 'sec-5', base_rate: 2.80, brand: 'Magnaplast' },
  { id: 's5', code: 'SAN-W-03', name: 'Sienas poda (iebūvējamā rāmja) montāža', type: 'work', default_unit: 'gab', section_id: 'sec-5', base_rate: 85.00 },
  { id: 's6', code: 'SAN-M-03', name: 'Iebūvējamais rāmis + pods + poga', type: 'material', default_unit: 'kompl', section_id: 'sec-5', base_rate: 280.00, brand: 'Geberit / Grohe' },
  { id: 's7', code: 'SAN-W-04', name: 'Siltās grīdas caurules ieklāšana', type: 'work', default_unit: 'm2', section_id: 'sec-5', base_rate: 7.50 },
  { id: 's8', code: 'SAN-M-04', name: 'Siltās grīdas caurule PE-RT 16x2', type: 'material', default_unit: 'm', section_id: 'sec-5', base_rate: 0.95, brand: 'Tece / Kan-Therm' },

  // --- IEKŠĒJĀ APDARE (sec-6) ---
  { id: 'i1', code: 'INT-W-01', name: 'Sienu gruntēšana', type: 'work', default_unit: 'm2', section_id: 'sec-6', base_rate: 1.50 },
  { id: 'i2', code: 'INT-M-01', name: 'Dziļumgrunts', type: 'material', default_unit: 'm2', section_id: 'sec-6', base_rate: 0.40, brand: 'Knauf Tiefengrund' },
  { id: 'i3', code: 'INT-W-02', name: 'Sienu špaktelēšana un slīpēšana (pilna, 2 kārtas)', type: 'work', default_unit: 'm2', section_id: 'sec-6', base_rate: 9.50 },
  { id: 'i4', code: 'INT-M-02', name: 'Gatavā špakteļmasa', type: 'material', default_unit: 'm2', section_id: 'sec-6', base_rate: 1.90, brand: 'Knauf Fill&Finish' },
  { id: 'i5', code: 'INT-W-03', name: 'Sienu krāsošana (2 kārtas)', type: 'work', default_unit: 'm2', section_id: 'sec-6', base_rate: 5.00 },
  { id: 'i6', code: 'INT-M-03', name: 'Iekšdarbu krāsa (pusmatēta, mazgājama)', type: 'material', default_unit: 'm2', section_id: 'sec-6', base_rate: 2.60, brand: 'Tikkurila Optiva' },
  { id: 'i7', code: 'INT-W-04', name: 'Grīdas lamināta vai vinila ieklāšana', type: 'work', default_unit: 'm2', section_id: 'sec-6', base_rate: 8.50 },
  { id: 'i8', code: 'INT-M-04', name: 'Lamināts 8mm / 32. klase + apakšklājs', type: 'material', default_unit: 'm2', section_id: 'sec-6', base_rate: 14.50, brand: 'Quick-Step / Tarkett' },
  { id: 'i9', code: 'INT-W-05', name: 'Grīdlīstu montāža', type: 'work', default_unit: 'm', section_id: 'sec-6', base_rate: 3.50 },
  { id: 'i10', code: 'INT-M-05', name: 'MDF / Plastmasas grīdlīste + furnitūra', type: 'material', default_unit: 'm', section_id: 'sec-6', base_rate: 4.20 },
  { id: 'i11', code: 'INT-W-06', name: 'Flīzēšana (Sienas / Grīda standarta izmērs)', type: 'work', default_unit: 'm2', section_id: 'sec-6', base_rate: 25.00 },
  { id: 'i12', code: 'INT-M-06', name: 'Flīžu līme + šuvotājs', type: 'material', default_unit: 'm2', section_id: 'sec-6', base_rate: 5.50, brand: 'Ceresit / Mapei' },
  { id: 'i13', code: 'INT-W-07', name: 'Iekšdurvju montāža (ar aplodām)', type: 'work', default_unit: 'gab', section_id: 'sec-6', base_rate: 65.00 },
];

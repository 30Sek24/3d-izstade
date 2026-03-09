export const COUNTRIES = {
  lv: { name: 'Latvija', workMult: 1.0, matMult: 1.0 },
  ee: { name: 'Igaunija', workMult: 1.2, matMult: 1.1 },
  lt: { name: 'Lietuva', workMult: 1.05, matMult: 1.0 },
  se: { name: 'Zviedrija', workMult: 2.5, matMult: 1.4 },
  fi: { name: 'Somija', workMult: 2.2, matMult: 1.35 },
  no: { name: 'Norvēģija', workMult: 2.8, matMult: 1.5 },
  de: { name: 'Vācija', workMult: 2.0, matMult: 1.2 },
  uk: { name: 'Lielbritānija', workMult: 2.1, matMult: 1.25 },
};

export const renderCountryOptions = () => {
  return Object.entries(COUNTRIES).map(([key, val]) => (
    <option key={key} value={key}>{val.name} (Darbs x{val.workMult} | Materiāli x{val.matMult})</option>
  ));
};

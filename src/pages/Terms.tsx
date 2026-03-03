import '../components/calculator/styles/CalculatorPro.css';

export default function Terms() {
  return (
    <div className="calculator-pro-wrapper" style={{ paddingBottom: '100px', lineHeight: '1.8' }}>
      <div className="calc-header">
        <h1>Lietošanas Noteikumi</h1>
        <p>Pēdējoreiz atjaunots: 02.03.2026.</p>
      </div>

      <div style={{ background: '#fff', padding: '50px', borderRadius: '24px', border: '1px solid #e2e8f0', color: '#334155' }}>
        <section>
          <h2>1. Vispārīgie noteikumi</h2>
          <p>Šie noteikumi regulē Platformu Centra (turpmāk - Platforma) lietošanu. Lietojot Platformu, Jūs piekrītat šiem noteikumiem pilnā apmērā.</p>
        </section>

        <section style={{ marginTop: '30px' }}>
          <h2>2. Pakalpojumi un Apmaksa</h2>
          <p>Platforma piedāvā bezmaksas un maksas abonementus uzņēmumiem. Maksas pakalpojumi tiek aktivizēti pēc sekmīgas apmaksas saņemšanas. Visi maksājumi tiek apstrādāti caur drošu Stripe maksājumu sistēmu.</p>
        </section>

        <section style={{ marginTop: '30px' }}>
          <h2>3. Atteikuma tiesības</h2>
          <p>Digitāliem pakalpojumiem, kas tiek aktivizēti nekavējoties, atteikuma tiesības ir ierobežotas saskaņā ar ES direktīvām. Ja stends ir publicēts un reklāma ir sākusi darboties, maksa par kārtējo periodu netiek atmaksāta.</p>
        </section>

        <section style={{ marginTop: '30px' }}>
          <h2>4. Lietotāja atbildība</h2>
          <p>Uzņēmumi ir pilnībā atbildīgi par ievietoto saturu (bildēm, video, tekstiem) un piedāvāto pakalpojumu kvalitāti. Platforma neuzņemas atbildību par darījumiem starp meistariem un klientiem.</p>
        </section>

        <section style={{ marginTop: '30px' }}>
          <h2>5. Drošība un Krāpniecība</h2>
          <p>Jebkāda krāpnieciska rīcība vai nepatiesas informācijas sniegšana tāmēs izraisīs tūlītēju konta bloķēšanu bez atmaksas.</p>
        </section>
      </div>
    </div>
  );
}
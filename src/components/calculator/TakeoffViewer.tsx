import { useState } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';

// Konfigurējam PDF.js strādnieku (worker), kas vajadzīgs react-pdf bibliotēkai
pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

export default function TakeoffViewer() {
  const [file, setFile] = useState<File | null>(null);
  const [numPages, setNumPages] = useState<number>(0);
  const [pageNumber, setPageNumber] = useState<number>(1);
  const [scale, setScale] = useState<number>(1.0);

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const onDocumentLoadSuccess = ({ numPages }: { numPages: number }) => {
    setNumPages(numPages);
    setPageNumber(1);
  };

  const isImage = file && file.type.startsWith('image/');

  return (
    <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '20px', marginTop: '20px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
        <h3 style={{ margin: 0, color: '#1e293b' }}>Rasējumu un Plānu Skatītājs</h3>
        
        {/* Kontroles josla (redzama tikai ja ir fails) */}
        {file && (
          <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
            <button onClick={() => setScale(s => Math.max(0.5, s - 0.2))} style={{ padding: '4px 8px', cursor: 'pointer' }}>- Zoom</button>
            <span style={{ fontSize: '0.9rem' }}>{Math.round(scale * 100)}%</span>
            <button onClick={() => setScale(s => Math.min(3, s + 0.2))} style={{ padding: '4px 8px', cursor: 'pointer' }}>+ Zoom</button>
            
            {!isImage && numPages > 1 && (
              <div style={{ marginLeft: '15px', display: 'flex', gap: '5px' }}>
                <button disabled={pageNumber <= 1} onClick={() => setPageNumber(p => p - 1)}>Iepriekšējā</button>
                <span style={{ fontSize: '0.9rem' }}>{pageNumber} / {numPages}</span>
                <button disabled={pageNumber >= numPages} onClick={() => setPageNumber(p => p + 1)}>Nākamā</button>
              </div>
            )}
            
            <button onClick={() => setFile(null)} style={{ marginLeft: '15px', color: 'red', cursor: 'pointer' }}>X Aizvērt</button>
          </div>
        )}
      </div>

      {!file ? (
        <div style={{ border: '2px dashed #cbd5e1', padding: '40px', textAlign: 'center', borderRadius: '8px', background: '#fff' }}>
          <p style={{ color: '#64748b', marginBottom: '15px' }}>Ievelc vai izvēlies PDF / JPG rasējumu, lai atvieglotu tāmes sastādīšanu.</p>
          <input 
            type="file" 
            accept=".pdf,image/png,image/jpeg" 
            onChange={onFileChange} 
            style={{ padding: '10px', border: '1px solid #e2e8f0', borderRadius: '4px', cursor: 'pointer' }}
          />
        </div>
      ) : (
        <div style={{ 
          background: '#e2e8f0', 
          height: '500px', 
          overflow: 'auto', 
          display: 'flex', 
          justifyContent: 'center', 
          border: '1px solid #cbd5e1',
          position: 'relative'
        }}>
          {isImage ? (
            <img 
              src={URL.createObjectURL(file)} 
              alt="Rasējums" 
              style={{ transform: `scale(${scale})`, transformOrigin: 'top center', transition: 'transform 0.2s', maxWidth: '100%', objectFit: 'contain' }} 
            />
          ) : (
            <div style={{ transform: `scale(${scale})`, transformOrigin: 'top center', transition: 'transform 0.2s' }}>
              <Document file={file} onLoadSuccess={onDocumentLoadSuccess} loading="Ielādē PDF dokumentu...">
                <Page pageNumber={pageNumber} renderTextLayer={false} renderAnnotationLayer={false} />
              </Document>
            </div>
          )}
          
          {/* Šeit nākotnē nāks Canvas pa virsu, lai zīmētu un mērītu Mērogu! */}
          {/* <canvas style={{ position: 'absolute', top: 0, left: 0, zIndex: 10, pointerEvents: 'none' }} /> */}
        </div>
      )}
    </div>
  );
}

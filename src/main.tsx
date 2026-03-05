import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { Buffer } from 'buffer';
import App from './App';
import './index.css';
import { reportWebVitals } from './lib/vitals';
import { registerSW } from 'virtual:pwa-register';

// Polify Buffer for the browser (needed by some PDF and crypto libraries)
if (typeof window !== 'undefined') {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (window as any).Buffer = (window as any).Buffer || Buffer;
}

// PWA: Register Service Worker for offline and caching
registerSW({ immediate: true });

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>
);

// P5: Core Web Vitals collection
reportWebVitals();
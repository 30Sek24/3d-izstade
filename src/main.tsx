import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import './index.css';
import { reportWebVitals } from './lib/vitals';
import { registerSW } from 'virtual:pwa-register';

// PWA: Register Service Worker for offline and caching
registerSW({ immediate: true });

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>
);

// P5: Core Web Vitals collection
reportWebVitals();
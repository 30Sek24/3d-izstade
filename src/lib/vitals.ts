import { onCLS, onINP, onLCP, type Metric } from 'web-vitals';

// Logs vitals to console, but in production should send to an endpoint or Supabase
function sendToAnalytics(metric: Metric) {
  // Example implementation of beacon payload
  // const body = JSON.stringify(metric);
  // if (navigator.sendBeacon) {
  //   navigator.sendBeacon('/api/vitals', body);
  // } else { ... }

  // For this initial setup we just log it to prove functionality
  console.log(`[Web Vitals] ${metric.name}:`, metric.value, metric.rating);
}

export function reportWebVitals() {
  onCLS(sendToAnalytics);
  onINP(sendToAnalytics);
  onLCP(sendToAnalytics);
}
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { toast } from '@/components/ui/sonner'
// import { initTelemetry } from '@/lib/telemetry'

createRoot(document.getElementById("root")!).render(<App />);

// Register Service Worker for PWA (production only)
if ('serviceWorker' in navigator && import.meta.env.PROD) {
  const swUrl = new URL(`${import.meta.env.BASE_URL}sw.js`, window.location.origin);
  window.addEventListener('load', () => {
    navigator.serviceWorker
      .register(swUrl.pathname)
      .then((reg) => {
        if (reg.installing) {
          reg.installing.addEventListener('statechange', () => {
            if (reg.installing?.state === 'installed') {
              if (!navigator.serviceWorker.controller) {
                try {
                  localStorage.setItem('lph_offline_ready', 'true');
                } catch {}
                window.dispatchEvent(new CustomEvent('lph:offline-ready'));
                toast('Offline ready', { description: 'Content is cached for offline use.' });
              } else {
                toast('Update available', {
                  description: 'A new version is ready.',
                  action: { label: 'Reload', onClick: () => window.location.reload() },
                });
              }
            }
          });
        }
        reg.addEventListener('updatefound', () => {
          const worker = reg.installing;
          if (!worker) return;
          worker.addEventListener('statechange', () => {
            if (worker.state === 'installed' && navigator.serviceWorker.controller) {
              toast('Update available', {
                description: 'A new version is ready.',
                action: { label: 'Reload', onClick: () => window.location.reload() },
              });
            }
          });
        });
      })
      .catch((err) => {
        console.warn('SW registration failed', err);
      });
  });
}

// Add to Home Screen prompt (PWA install)
if (import.meta.env.PROD) {
  // Initialize telemetry (Sentry or fallback)
  // initTelemetry();
  let deferredPrompt: any = null;
  window.addEventListener('beforeinstallprompt', (e: Event) => {
    e.preventDefault();
    // @ts-ignore
    deferredPrompt = e;
    // expose to app UI and notify
    // @ts-ignore
    window.__lph_deferredPrompt = e;
    window.dispatchEvent(new CustomEvent('lph:can-install'));
    toast('Install Laurence Photo Hub?', {
      description: 'Add the app to your home screen for a faster, full-screen experience.',
      action: {
        label: 'Install',
        onClick: async () => {
          if (!deferredPrompt) return;
          deferredPrompt.prompt();
          const choice = await deferredPrompt.userChoice;
          if (choice.outcome === 'accepted') {
            toast('Installing…');
          }
          deferredPrompt = null;
        },
      },
      // secondary action: dismiss only
    });
  });
}

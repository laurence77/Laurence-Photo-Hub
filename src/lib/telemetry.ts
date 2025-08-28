// Minimal telemetry bootstrap with Sentry (optional)
// To enable: add VITE_SENTRY_DSN to your environment and install @sentry/browser
// npm i @sentry/browser @sentry/tracing --save

export async function initTelemetry() {
  const DSN = import.meta.env.VITE_SENTRY_DSN as string | undefined;
  if (!import.meta.env.PROD || !DSN) {
    // Attach basic global error logging as a fallback
    window.addEventListener('error', (e) => console.warn('Global error:', e.error || e.message));
    window.addEventListener('unhandledrejection', (e) => console.warn('Unhandled rejection:', e.reason));
    return;
  }
  try {
    const Sentry = await import('@sentry/browser');
    // Optional: const Tracing = await import('@sentry/tracing');
    Sentry.init({ dsn: DSN, tracesSampleRate: 0.1 });
  } catch (e) {
    console.warn('Sentry not available; falling back to console logging');
    window.addEventListener('error', (e) => console.warn('Global error:', e.error || e.message));
    window.addEventListener('unhandledrejection', (e) => console.warn('Unhandled rejection:', e.reason));
  }
}


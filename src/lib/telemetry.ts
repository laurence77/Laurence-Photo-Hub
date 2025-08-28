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
    // Try to load Sentry only if it's installed
    const { init } = await import('@sentry/browser');
    init({ dsn: DSN, tracesSampleRate: 0.1 });
  } catch (e) {
    // Sentry not installed or failed to load - use fallback logging
    console.warn('Sentry not available; falling back to console logging');
    window.addEventListener('error', (e) => console.warn('Global error:', e.error || e.message));
    window.addEventListener('unhandledrejection', (e) => console.warn('Unhandled rejection:', e.reason));
  }
}


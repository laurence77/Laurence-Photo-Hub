import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  // Use root base during test (LHCI) builds so static server can resolve assets
  base: mode === 'test' ? '/' : '/Laurence-Photo-Hub/',
  server: {
    host: "::",
    port: 8080,
  },
  plugins: [
    react(),
    mode === 'development' &&
    componentTagger(),
    // Inject strict CSP only for production builds
    {
      name: 'inject-csp-meta',
      apply: 'build',
      transformIndexHtml(html) {
        const csp = [
          "default-src 'self'",
          "base-uri 'self'",
          "form-action 'self'",
          "frame-ancestors 'none'",
          "object-src 'none'",
          "img-src 'self' data:",
          "font-src 'self' data:",
          "style-src 'self' 'unsafe-inline'",
          "script-src 'self'",
          "connect-src 'self'",
          'upgrade-insecure-requests',
        ].join('; ');

        return html.replace(
          '</head>',
          `  <meta http-equiv="Content-Security-Policy" content="${csp}">\n  </head>`
        );
      },
    },
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    sourcemap: false,
    rollupOptions: {
      input: {
        main: path.resolve(__dirname, 'index.html')
      }
    },
    copyPublicDir: true
  },
}));

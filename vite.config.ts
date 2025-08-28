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
    // Custom plugin to handle external scripts
    {
      name: 'external-scripts',
      apply: 'build',
      transformIndexHtml: {
        enforce: 'pre',
        transform(html) {
          // Replace script tags to prevent bundling
          return html
            .replace('<script src="framebust.js"></script>', '<!-- framebust.js will be copied to dist -->')
            .replace('<script src="gh-spa-redirect.js"></script>', '<!-- gh-spa-redirect.js will be copied to dist -->');
        }
      },
      writeBundle() {
        // Copy external scripts manually after build
        const fs = require('fs');
        const path = require('path');
        
        try {
          fs.copyFileSync(
            path.resolve(__dirname, 'public/framebust.js'),
            path.resolve(__dirname, 'dist/framebust.js')
          );
          fs.copyFileSync(
            path.resolve(__dirname, 'public/gh-spa-redirect.js'), 
            path.resolve(__dirname, 'dist/gh-spa-redirect.js')
          );
        } catch (e) {
          console.warn('Failed to copy external scripts:', e);
        }
      }
    },
    // Inject strict CSP only for production builds
    {
      name: 'inject-csp-meta',
      apply: 'build',
      transformIndexHtml: {
        enforce: 'post',
        transform(html) {
          const csp = [
            "default-src 'self'",
            "base-uri 'self'",
            "form-action 'self'",
            "frame-ancestors 'none'",
            "object-src 'none'",
            "img-src 'self' data:",
            "font-src 'self' data:",
            "style-src 'self' 'unsafe-inline'",
            "script-src 'self' 'unsafe-inline'", // Allow inline scripts for framebust
            "connect-src 'self'",
            'upgrade-insecure-requests',
          ].join('; ');

          // Re-add the script tags and inject CSP
          return html
            .replace('<!-- framebust.js will be copied to dist -->', '<script src="framebust.js"></script>')
            .replace('<!-- gh-spa-redirect.js will be copied to dist -->', '<script src="gh-spa-redirect.js"></script>')
            .replace(
              '</head>',
              `  <meta http-equiv="Content-Security-Policy" content="${csp}">\n  </head>`
            );
        }
      }
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

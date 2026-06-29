import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import { fileURLToPath } from 'url';
import { dirname, join, resolve } from 'path';
import { existsSync, readFileSync, writeFileSync, rmSync, rmdirSync } from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    {
      name: 'rename-html-outputs',
      closeBundle() {
        const distDir = resolve(__dirname, 'dist');
        const mappings = [
          { from: join(distDir, 'src', 'popup', 'index.html'), to: join(distDir, 'popup.html') },
          { from: join(distDir, 'src', 'options', 'index.html'), to: join(distDir, 'options.html') },
        ];
        for (const { from, to } of mappings) {
          if (existsSync(from)) {
            let content = readFileSync(from, 'utf8');
            // Fix absolute paths to relative paths for Chrome extension compatibility
            content = content.replace(/src="\/([^"]+)"/g, 'src="./$1"');
            content = content.replace(/href="\/([^"]+)"/g, 'href="./$1"');
            writeFileSync(to, content, 'utf8');
            rmSync(from);
            console.log(`[rename-html] moved index.html → ${to.split('\\').pop()}`);
          }
        }
        // Remove empty src/ subdirs
        try {
          const srcPopup = join(distDir, 'src', 'popup');
          const srcOptions = join(distDir, 'src', 'options');
          const srcDir = join(distDir, 'src');
          if (existsSync(srcPopup)) rmdirSync(srcPopup);
          if (existsSync(srcOptions)) rmdirSync(srcOptions);
          if (existsSync(srcDir)) rmdirSync(srcDir);
        } catch (_) {}
      }
    }
  ],
  build: {
    rollupOptions: {
      input: {
        popup: 'src/popup/index.html',
        options: 'src/options/index.html',
        background: 'src/background/index.ts',
        content: 'src/content/index.ts'
      },
      output: {
        entryFileNames: '[name].js',
        chunkFileNames: 'assets/[name]-[hash].js',
        assetFileNames: 'assets/[name]-[hash].[ext]'
      }
    }
  }
});
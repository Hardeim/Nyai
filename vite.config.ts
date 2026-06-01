import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Configuração do Vite — build de produção SEM rastros de privacidade.
//
// Pontos importantes pra evitar que o .exe carregue informações do PC
// de quem buildou:
//
// - base: './'           → caminhos relativos (Electron carrega via file://)
// - sourcemap: false     → não gera arquivos .map com paths absolutos do build
// - rollupOptions.input  → reseta nomes de arquivo gerados pra padrão
// - emptyOutDir: true    → garante que builds antigos não sobram em dist/
export default defineConfig({
  plugins: [react()],
  base: './',
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    sourcemap: false,
    minify: 'esbuild',
    rollupOptions: {
      output: {
        // Nomes de arquivo previsíveis (sem hash de PC)
        entryFileNames: 'assets/[name]-[hash].js',
        chunkFileNames: 'assets/[name]-[hash].js',
        assetFileNames: 'assets/[name]-[hash].[ext]',
      },
    },
  },
  // Evita que o Vite injete identificador de PC nos comentários
  esbuild: {
    legalComments: 'none',
  },
  server: {
    port: 5173,
  },
});

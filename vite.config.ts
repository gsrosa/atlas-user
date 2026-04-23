import path from 'node:path';
import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import federation from '@originjs/vite-plugin-federation';
import { defineConfig } from 'vite';

export default defineConfig({
  plugins: [
    tailwindcss(),
    react(),
    federation({
      name: 'userApp',
      filename: 'remoteEntry.js',
      exposes: {
        './App': './src/bootstrap.tsx',
        './Skeleton': './src/skeleton.tsx',
        './ProfileLayout': './src/features/users/profile-layout.tsx',
        './ProfileAboutPage': './src/features/users/components/profile-page.tsx',
        './ProfilePasswordPage': './src/features/users/components/password-page.tsx',
        './ProfilePreferencesPage': './src/features/users/components/preferences-page.tsx',
      },
      shared: {
        '@gsrosa/atlas-ui': { singleton: true, requiredVersion: false as const },
        react: { singleton: true, requiredVersion: '^19.0.0' },
        'react-dom': { singleton: true, requiredVersion: '^19.0.0' },
        'react-router-dom': { singleton: true, requiredVersion: '^7.0.0' },
        'lucide-react': {
          singleton: true,
          requiredVersion: '^1.7.0',
        },
      },
    }),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
  },
  server: {
    port: 3003,
    strictPort: true,
    cors: true,
    headers: {
      'Cache-Control': 'no-store',
    },
  },
  preview: {
    port: 3003,
    strictPort: true,
    cors: true,
    headers: {
      'Cache-Control': 'no-store',
    },
  },
  optimizeDeps: {
    exclude: [
      '@gsrosa/atlas-ui',
      'react',
      'react-dom',
      'react-router-dom',
      'lucide-react',
    ],
  },
  build: {
    target: 'esnext',
    minify: false,
  },
});


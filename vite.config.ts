import { fileURLToPath, URL } from 'url';
import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import vuetify from 'vite-plugin-vuetify';

// https://vitejs.dev/config/

const config = {
  plugins: [
    vue({
      template: {
        compilerOptions: {
          isCustomElement: (tag) => ['v-list-recognize-title'].includes(tag)
        }
      }
    }),
    vuetify({
      autoImport: true
    })
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
      'vue-i18n': 'vue-i18n/dist/vue-i18n.esm-bundler.js'
    }
  },
  css: {
    preprocessorOptions: {
      scss: {}
    }
  },
  build: {
    chunkSizeWarningLimit: 1024 * 1024 // Set the limit to 1 MB
  },
  optimizeDeps: {
    exclude: ['vuetify'],
    entries: ['./src/**/*.vue']
  },
  server: {
    proxy: {
      '/account': 'https://cieestage.gogotest.xyz',
      '/api/v1': 'https://cieestage.gogotest.xyz',
      '/public': 'https://cieestage.gogotest.xyz'
    }
  },
  assetsInclude: ['**/*.xlsx'], // 新增這行來包含 .xlsx 文件

};
if (process.env.NODE_ENV === 'development') {
  config.server.proxy = {
    '/account': 'https://cieestage.gogotest.xyz',
    '/api/v1': 'https://cieestage.gogotest.xyz',
    '/public': 'https://cieestage.gogotest.xyz'
  }
}

export default defineConfig(config);

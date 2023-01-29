import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import Components from "unplugin-vue-components/vite";
import { VantResolver } from "unplugin-vue-components/resolvers";
import { resolve } from 'path';
import monacoEditorPlugin from 'vite-plugin-monaco-editor';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [,vue({
    template: {
      compilerOptions: {
        //  屏蔽使用自定义 custom element告警提示
        isCustomElement: tag => {
          if (tag == 'ion-icon') {
            return true
          }
        }
      }
    }
  }), Components({
    resolvers: [VantResolver()],
  })],
  resolve: {
    alias: {
      "vue": "vue/dist/vue.esm-bundler.js",
      '@': resolve(__dirname, './src')
    }
  }
})

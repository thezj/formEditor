import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import Components from "unplugin-vue-components/vite";
import { VantResolver } from "unplugin-vue-components/resolvers";
import { resolve } from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue(), Components({
    resolvers: [VantResolver()],
  })],
  resolve: {
    alias: {
      "vue": "vue/dist/vue.esm-bundler.js",
      '@': resolve(__dirname, './src')
    }
  },
  // 定义src中使用的全局变量
  define: {
  }

})

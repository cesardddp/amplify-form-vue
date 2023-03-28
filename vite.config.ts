import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import VueMacros from 'unplugin-vue-macros/vite';
// https://vitejs.dev/config/
export default defineConfig({
  plugins: [VueMacros({
    plugins: {
      vue: vue(),
      // vueJsx: VueJsx(), // if needed
    },
  }),], resolve: {
    alias: {
      "./runtimeConfig": "./runtimeConfig.browser",
    },
  },//https://stackoverflow.com/questions/70938763/build-problem-with-react-vitejs-and-was-amplify
})

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  build: {
    lib: {
      entry: resolve(__dirname, "src/index.ts"),
      name: 'amplify-form-vue',
      fileName: (format) => `amplify-form-vue.${format}.ts`,
    },
    rollupOptions: {
      // make sure to externalize deps that shouldn't be bundled
      // into your library
      external: [
        'vue',
        '@aws-amplify/api',
        'aws-amplify',
        '@syncfusion/ej2-base',
        '@syncfusion/ej2-data',
        '@syncfusion/ej2-inputs',
        '@syncfusion/ej2-vue-base',
        '@syncfusion/ej2-vue-buttons',
        '@syncfusion/ej2-vue-inputs',
        "bootstrap",
        "bootstrap-icons",
        "lodash",
        "lodash.debounce",
        "@syncfusion/ej2-vue-grids",
        "cpf-cnpj-validator"
      ],
      output: {
        // Provide global variables to use in the UMD build
        // for externalized deps
        
        globals: {
          vue: 'Vue',
          '@syncfusion/ej2-base': '@syncfusion/ej2-base',
          '@syncfusion/ej2-data': '@syncfusion/ej2-data',
          '@syncfusion/ej2-inputs': '@syncfusion/ej2-inputs',
          '@syncfusion/ej2-vue-base': '@syncfusion/ej2-vue-base',
          '@syncfusion/ej2-vue-buttons': '@syncfusion/ej2-vue-buttons',
          '@syncfusion/ej2-vue-inputs': '@syncfusion/ej2-vue-inputs',
          "bootstrap": "bootstrap",
          "bootstrap-icons": "bootstrap-icons",
          "lodash": "lodash",
          "lodash.debounce": "lodash.debounce",
          '@aws-amplify/api': '@aws-amplify/api',
          'aws-amplify': 'aws-amplify',
          "@syncfusion/ej2-vue-grids":"@syncfusion/ej2-vue-grids",
          "cpf-cnpj-validator":"cpf-cnpj-validator"
        }
      }
    }
  },
})

import { resolve } from "path";
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import dts from "vite-plugin-dts";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    dts({ insertTypesEntry: true, entryRoot: "./src/",tsConfigFilePath: "./tsconfig.json" }),
  ],
  resolve: {
    alias: {
      './runtimeConfig': './runtimeConfig.browser',
    }
  },
  build: {
    lib: {
      entry: resolve(__dirname, "src/index.ts"),
      name: 'amplify-form-vue',
      fileName: (format) => `amplify-form-vue.${format}.ts`,
      formats: ["es", "cjs", "umd"  ]  },
    rollupOptions: {
      // make sure to externalize deps that shouldn't be bundled
      // into your library
      external: [
        "@aws-amplify/api",
        "@syncfusion/ej2-base",
        "@syncfusion/ej2-data",
        "@syncfusion/ej2-inputs",
        "@syncfusion/ej2-vue-base",
        "@syncfusion/ej2-vue-buttons",
        "@syncfusion/ej2-vue-grids",
        "@syncfusion/ej2-vue-inputs",
        "@syncfusion/ej2-vue-navigations",
        "aws-amplify",
        "bootstrap",
        "bootstrap-icons",
        "cpf-cnpj-validator",
        "dot-object",
        "lodash",
        "lodash.debounce",
        "maska",
        "sass",
        "vue",
        "vue-class-component",
        "vue-json-pretty",
        "lodash.throttle"
      ],
      output: {
        // Provide global variables to use in the UMD build
        // for externalized deps

        globals: {
          vue: 'Vue',
          "lodash.throttle": "lodash.throttle",
          "@aws-amplify/api": "@aws-amplify/api",
          "@syncfusion/ej2-base": "@syncfusion/ej2-base",
          "@syncfusion/ej2-data": "@syncfusion/ej2-data",
          "@syncfusion/ej2-inputs": "@syncfusion/ej2-inputs",
          "@syncfusion/ej2-vue-base": "@syncfusion/ej2-vue-base",
          "@syncfusion/ej2-vue-buttons": "@syncfusion/ej2-vue-buttons",
          "@syncfusion/ej2-vue-grids": "@syncfusion/ej2-vue-grids",
          "@syncfusion/ej2-vue-inputs": "@syncfusion/ej2-vue-inputs",
          "@syncfusion/ej2-vue-navigations": "@syncfusion/ej2-vue-navigations",
          "aws-amplify": "aws-amplify",
          "bootstrap": "bootstrap",
          "bootstrap-icons": "bootstrap-icons",
          "cpf-cnpj-validator": "cpf-cnpj-validator",
          "dot-object": "dot-object",
          "lodash": "lodash",
          "lodash.debounce": "lodash.debounce",
          "maska": "maska",
          "sass": "sass",
          "vue-class-component": "vue-class-component",
          "vue-json-pretty": "vue-json-pretty",
        }
      }
    },
    commonjsOptions: {
      esmExternals: true
    },
  }
}
)

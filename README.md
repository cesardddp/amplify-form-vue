## dependencias
"sass": "^1.57.1"
"@syncfusion/ej2-base": "^20.4.44",
"@syncfusion/ej2-data": "^20.4.44",
"@syncfusion/ej2-inputs": "^20.4.42",
"@syncfusion/ej2-vue-base": "^20.4.42",
"@syncfusion/ej2-vue-buttons": "^20.4.44",
"bootstrap": "^5.2.3",
"bootstrap-icons": "^1.10.3",
"@syncfusion/ej2-vue-inputs": "^20.4.42",
"vue-class-component": "^8.0.0-rc.1"
Pacote instalavel para criar formulários e grid s de forma fácil baseado no 




## dicas pro eu do futuro como fazer pacote instalavel
adicionei essa essas configs no vite.config.ts->`defineConfig` ao lado de `plugins`
``` ts
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
  }
```

em tsconfig.json->`compilerOptions` vou testar se precisa adicionar: //TODO
```json
   "outDir": "dist",
    "declaration": true,
    "sourceMap": true
```


em package.json adicionei:
```json
...
   "type":"module",
   //add a paritr daqui
   "files":[
      "dist"
   ],
   "main": "./dist/<NOME>.umd.cjs",
   "module": "./dist/<NOME>.es.js",
   "types": "./dist/index.d.ts",
   "exports": {
      ".": {
         "import": "./dist/<NOME>.es.js",
         "require": "./dist/<NOME>.umd.ts"
      },
      "./dist/style.scss": "./dist/style.scss"
   },
```
substituindo <nome> pelo nome do pacote, no caso, amplify-grid-form-vue

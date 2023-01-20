<script setup lang="ts">
// import awsconfig from './old.js';
import AmplifyFormVue from "./components/AmplifyForm.vue";
import { AmplifyFormProps } from "./components/types";
import schema from "./example/schema.json";
import * as queries from "./example/queries";
import * as mutations from "./example/mutations";
import { reactive } from "vue";


const props: AmplifyFormProps = {
  graphQLJSONSchema: schema,
  entity: 'Campo',
  onSubmit: () => console.log('submit'),
}
const v=reactive(
  {
  "nome": "a",
  "label": "a",
  "tipo": "str",
  "visivel": true,
  "editavel": true,
  "listavel": true,
  "descricacao": "a",
  "mascara": "a",
  "tamanho": -1,
  "posicao": 1,
  "chave_primaria": false,
  "chave_extrangeira": false,
  "obrigatorio": true,
  "comentario": " a",
  "unique": true,
  "maxLength": 0,
  "minLength": 0,
  "formType": 'color',
  "items": [
    "a",
    "b"
  ],
  "default": "a",
  "modelCamposId": undefined,
  "chave primaria": true,
  "chave extrangeira": true,
  "maxlength": 1,
  "minlength": 1,
  "formtype": "text"
}
)
const form_refs = (e:any)=>console.log(e);

</script>

<template>
      <AmplifyFormVue :form_props="props" 
      :queries="queries"
      :mutations="mutations"
      :prefill="v"
      />
</template>

<style scoped>

</style>

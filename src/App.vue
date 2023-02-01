<script setup lang="ts">
// import awsconfig from './old.js';
import AmplifyFormVue from "./components/AmplifyForm/AmplifyForm.vue";
import Tabela from "./components/Table/Tabela.vue";
import { AmplifyFormProps } from "./components/types";
import schema from "./example/schema.json";
import * as queries from "./example/queries";
import * as mutations from "./example/mutations";
import { reactive } from "vue";
import {  GridTypes } from "./components/merm-types/tabela";
import { Api } from "./components/merm-types/merm_empresa_types";


const v = reactive(
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
const form_refs = (e: any) => console.log(e);
const tabelaOpcoes: GridTypes.OpcoesTabela = {}
const colunas: GridTypes.ColunaConfigs[] = [
  {label: 'label2',nome: 'nome1',posicao: 0,},
  {label: 'label2',nome: 'nome2',posicao: 1,},
  {label: 'label3',nome: 'nome3',posicao: 2,},
]

// campo teste
const form_campo = {
      
      graphQLJSONSchema: schema,
      entity: 'Campo',
      onSubmit: () => { console.log('submit'); debugger },
    
  }
// view test
const form_view: AmplifyFormProps = {
  graphQLJSONSchema: schema,
  entity: 'View',
  onSubmit: () => console.log('submit'),
}
const api:Api = {
  nome: 'api nome',
  tipoApi: 'GraphQL',
  nome_entidade: form_view.entity,

}
</script>

<template>
  
  teste campos:
  <!-- :prefill="prefill" -->
  <AmplifyFormVue
      @submit_result="e=>$emit('result',e)" 
      @refs="form_refs" 
      :form_props="form_campo" 
      :queries="(queries as any)" 
      :mutations="(mutations as any)"
    />
  
      <!-- <AmplifyFormVue :form_props="form_view"  -->
      <!-- :queries="queries" -->
      <!-- :mutations="mutations" -->
      <!-- :prefill="v" -->
      <!-- /> -->
  <!-- <Tabela :colunas="colunas" :opcoes="tabelaOpcoes" :tela="'teste'" :api="api" :queries="queries"       :mutations="mutations"/> -->
</template>

<style scoped>

</style>

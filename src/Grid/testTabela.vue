<script setup lang="ts" >
import { Cache } from "aws-amplify";
import { TabelaSyncFusion, ColunaConfigs } from "../../merm-schema/models";
import { ColunaConfigs as ColunaConfigs_ } from "../../merm-schema/merm-types";
import Tabela from "./Tabela.vue";
import mock_colunas from "./mock_colunas.json";
import { computed, provide, Ref, ref, watch } from "vue";

function get_cache() {
  return (Cache.getItem("colunas_exemplo_difinicoes", {
    callback: () => {
      console.log("MOCK CARREGADO");

      return mock_colunas.definicoes
    }
  })).map((coluna:any) => {
    const ne = Object.fromEntries(
      Object.entries(coluna)
        .map(([key, value]) => {
          return [key, typeof value === 'object' ? value : ref(value)]
        })
    )
    return ne
  }
  )
}

const colunas_ = ref<ColunaConfigs_[]>(
  get_cache()

)
const colunas = computed(()=>{
  return colunas_.value.map(coluna => {
    const ne = Object.fromEntries(
      Object.entries(coluna)
        .map(([key, value]) => {
          return [key, value]
          // return [key, typeof value === 'object' ? value.value : value]
        })
    ) as ColunaConfigs_|Ref<ColunaConfigs_>
    return ne
  }
  )
})



watch(colunas_, (colunas) => {
  Cache.setItem("colunas_exemplo_difinicoes", colunas)
  console.log(Cache.getItem("colunas_exemplo_difinicoes"));
  colunas = get_cache()
  // debugger

}, { deep: true })

function input_type(type_of: string) {
  switch (type_of) {
    case "string":
      return "text"
    case "number":
      return "number"
    case "boolean":
      return "checkbox"
    default:
      return "text"
  }
}
const dados = computed({
  get(): any[] {
    return Cache.getItem("dados_exemplo", {
      callback: () => {
        return mock_colunas.dados
      }
    })
  },
  set(dados) {
    Cache.setItem("dados_exemplo", dados)
  }
})
function clear_cache() {
  Cache.clear()
  window.location.reload()
}
function cria(dados_:any) {
  const tmp_dados = dados.value
  tmp_dados.push(dados_)
  dados.value = tmp_dados
}
function edita(dados_:any,indice_coluna:number) {
  const tmp_dados = dados.value
  tmp_dados[indice_coluna] = dados_
  dados.value = tmp_dados
}
provide("api_tabela_teste",{
  cria,
  edita
})

</script>

<template>
  <button @click="clear_cache" type="button" class="btn btn-outline-danger">clear cache</button>
  <Tabela :colunas="(colunas as any)" :dados="dados" :nome_entidade="'tabela_teste'" />
  <div v-for="coluna in colunas_" class="d-flex  mb-1">
    <label v-for="key of Object.keys(coluna)" class="m-1">{{ key }}
      <input :type="input_type(typeof coluna[key as keyof typeof coluna])" v-model="coluna[key as keyof typeof coluna]">
    </label>
  </div>
  <br />
  <!-- {{ dados }} -->
</template>
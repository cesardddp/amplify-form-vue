<script setup lang="ts">
import AmplifyFormVue from "../AmplifyForm.vue"
import schema from "../../file_tests/schema_06_06.json";
import Input from "../FormsElements/Input.vue";
import { computed, ComputedRef, reactive, Ref, ref, shallowRef, watch, watchEffect } from "vue";
import test_suite from "./test-parse-introspection";
import { IntrospectionSchema } from "../../introspectionSchemaInterface";
import { Cache } from "aws-amplify";
import VueJsonPretty from 'vue-json-pretty';
import 'vue-json-pretty/lib/styles.css';
import { FormStateHandler } from "../formStorage";
import _ from "lodash";
// // campo teste
const form_campo = {
  introspectionSchema: schema as IntrospectionSchema,
  entity: 'Campo'
}
// // view test
const form_view = {
  introspectionSchema: schema as IntrospectionSchema,
  entity: 'View',
}
type testes = 'allTypes' | 'Campo' | 'Modulo' | 'Api' | 'App' | 'Model' | 'Tela' | 'Suite Test';
const testando = reactive({
  quem: Cache.getItem('testando', { callback: () => 'Campo' }) as testes,
  id: "55b740f5-1184-458c-b8ec-d10e5b93212c",
  set(quem: testes) {
    this.quem = quem;
    Cache.setItem('testando', quem)
  }
})
function field_value_update(e: { name: string, value: Ref }) {
  console.log(
    e.name, e.value
  )
}
const convert_json = ref(false)
const tab = reactive({
  index: Object.keys(test_suite)[0],
  teste: Object.values(test_suite)[0] as Function,
  result: (undefined as unknown),
  set(index: string, teste: Function) {
    this.result = undefined;
    // this.state_store = undefined;
    this.index = index;
    this.teste = teste;
  },
  run() {
    this.result = this.teste()
  },
})
const current_state_storage = shallowRef<FormStateHandler>()
let json_result: ComputedRef
const deep = ref(1)
const pretify = ref(false)
const form_types_to_show = ref(false)


const vmodelteste = ref(testando.quem !== 'App' ? {} :
  {
    "nav_bar": {
      "nav_bar_opcoes": {
        "drop_down_menu": [
          {
            "nome": "Perfil",
            "href": "/perfil"
          }
        ]
      },
      "brand": {
        "is_home": true,
        "imagem_logo": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQmpZjaylmkLE-zx8i-woTHEO0nEsJU7MloIasVsOkcUQ&s"
      },
      "modulos": [
        {
          "grupos_auth": [
            "MeuCPD",
            "Usuarios"
          ],
          "modulo": "App",
          "telas": [
            {
              "nome": "Criar App",
              "auth": [
                "MeuCPD",
                "Usuarios"
              ],
              "tela": "createApp"
            },
            {
              "nome": "Atualizar App",
              "auth": [
                "MeuCPD",
                "Usuarios"
              ],
              "tela": "updateApp"
            },
            {
              "nome": "Listar Apps",
              "auth": [
                "MeuCPD",
                "Usuarios"
              ],
              "tela": "listAppsCards"
            }
          ]
        },
        {
          "grupos_auth": [
            "MeuCPD",
            "Usuarios"
          ],
          "modulo": "Model",
          "telas": [
            {
              "nome": "Criar Model",
              "auth": [
                "MeuCPD",
                "Usuarios"
              ],
              "tela": "createModel"
            },
            {
              "nome": "Atualizar Model",
              "auth": [
                "MeuCPD",
                "Usuarios"
              ],
              "tela": "updateModel"
            },
            {
              "nome": "Listar Models",
              "auth": [
                "MeuCPD",
                "Usuarios"
              ],
              "tela": "listModelsCards"
            }
          ]
        }
      ]
    },
    "grupos": [
      "MeuCPD",
      "Usuarios"
    ],
    "meta": {
      "BackendEnvironmentName": "producao",
      "BackendEnvironmentNameApp": "mermadminapp",
      "app_name": "mermadmin"
    },
    "login": {
      "form_login": {
        "logos": [
          {
            "imagem": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQmpZjaylmkLE-zx8i-woTHEO0nEsJU7MloIasVsOkcUQ&s",
            "legenda": "MeuCPD Soluções Tecnólogicas"
          },
          {
            "imagem": "favicon.png",
            "legenda": "MERM Melhor ERP do Mundo!"
          }
        ],
        "cor_primaria": "#4d4e9b",
        "cor_secundaria": "#6b6ccf",
        "background_color_theme": "bg_dark",
        "footer": {
          "sing_up_mensagem": "Não tem uma conta?",
          "link": "meucpd.com.br"
        },
        "cor_terciaria": "#333464"
      }
    },
    "ambiente": "dev",
    "id": "46c2b3be-5a77-4086-8049-946ba107e036",
    "nome": "mermadmin"
  }
)
const validar = ref(false);
function submit() {
  alert(amplForm.value.validacao.validar())
  // debugger
  alert(
    amplForm.value.validacao.erros
  )
}
const amplForm = ref()
</script>
<template>
  <!-- <input type="text" name="" v-model="vmodelteste.nome" id=""> -->
  <nav class="nav justify-content-center my-4">
    <button @click="() => { testando.set('Campo') }" class="btn nav-link mx-1" aria-current="page">Campos</button>
    <button @click="() => { testando.set('Modulo') }" class="btn nav-link mx-1" aria-current="page">Modulo</button>
    <button @click="() => { testando.set('Api') }" class="btn nav-link mx-1" aria-current="page">Api</button>
    <button @click="() => { testando.set('App') }" class="btn nav-link mx-1" aria-current="page">App</button>
    <button @click="() => { testando.set('Model') }" class="btn nav-link mx-1" aria-current="page">Model</button>
    <button @click="() => { testando.set('Tela') }" class="btn nav-link mx-1" aria-current="page">Tela</button>
    <button @click="() => { testando.set('Suite Test') }" class="btn nav-link mx-1" aria-current="page">
      Suite Test
    </button>
  </nav>
  <nav>
  </nav>
  <h1 class="text-center">testando: {{ testando.quem }}</h1>
  <div class="container">
    <div class="row" v-if="testando.quem !== 'Suite Test'">

      <div class="col">



        <Suspense>
          <AmplifyFormVue ref="amplForm"
            v-bind="{ introspectionSchema: schema as IntrospectionSchema, entity_name: testando.quem, form_id: testando.id }"
            :key="testando.quem" v-model="vmodelteste"/>
          <template #fallback>
            <div class="d-flex justify-content-center align-items-center w-100 h-50 ">
              <div class="spinner-border text-primary" style="width: 7rem; height: 7rem;" role="status">
                <span class="visually-hidden">Loading...</span>
              </div>
            </div>
          </template>
        </Suspense>
        <button type="button" @click="submit" class="btn btn-primary">submit</button>
        {{ validar }}



      </div>
      <div class="col-4">
        <div class="sticky-top">
          <!-- Nav tabs -->
          <ul class="nav nav-tabs" id="oia" role="tablist">
            <li class="nav-item" role="presentation">
              <button class="nav-link active" id="dados-tab" data-bs-toggle="tab" data-bs-target="#dados" type="button"
                role="tab" aria-controls="dados" aria-selected="true">dados</button>
            </li>
            <li class="nav-item" role="presentation">
              <button class="nav-link" id="form-tab" data-bs-toggle="tab" data-bs-target="#form" type="button" role="tab"
                aria-controls="form" aria-selected="false">form</button>
            </li>
          </ul>

          <!-- Tab panes -->
          <div class="tab-content">
            <div class="tab-pane active" id="dados" role="tabpanel" aria-labelledby="dados-tab">
              <div class="d-inline-flex">
                <div class="ms-3 form-check">
                  <input v-model="pretify" class="form-check-input" type="checkbox" id="pretify">
                  <label class="form-check-label" for="pretify">
                    Pretify?
                  </label>
                </div>
              </div>

              <pre v-if="!pretify">
{{ vmodelteste }}
              </pre>
              <vue-json-pretty v-else :data="vmodelteste" :deep="5" :key="5" :editable="false"
                :showSelectController="true" />
            </div>
            <div class="tab-pane" id="form" role="tabpanel" aria-labelledby="form-tab">
              <pre v-if="!pretify">{{ form_types_to_show }}</pre>
              <vue-json-pretty v-else :data="(form_types_to_show as any)" :deep="1" :key="'form'" :editable="false"
                :showSelectController="true" />
            </div>
          </div>
        </div>
      </div>
    </div>


    <div v-else-if="testando.quem === 'Suite Test'">
      <!-- Testes: -->
      <!-- Nav tabs -->
      <ul class="nav nav-tabs" id="myTab" role="tablist">
        <li @click="() => tab.set(index, teste)" v-for="(teste, index) in test_suite" :key="index" class="nav-item"
          role="presentation">
          <button class="nav-link" :class="index === 'testeGetTypeFromSchema' ? 'active' : ''" :id='index + "-tab"'
            data-bs-toggle="tab" :data-bs-target="'#' + index" type="button" role="tab" :aria-controls="index"
            :aria-selected="index === 'testeGetTypeFromSchema'">
            {{ index }}
          </button>
        </li>
      </ul>

      <!-- Tab panes -->
      <div class="tab-content">
        <div :key="tab.index" class="tab-pane active w-100" :id="tab.index" role="tabpanel"
          :aria-labelledby="tab.index + '-tab'">
          <div class="w-100 d-flex justify-content-center p-1">
            <button @click="tab.run" type="button" class="btn btn-danger">
              <samp>
                Run {{ tab.index }}
              </samp>
            </button>
          </div>
          <section v-if="tab.result">
            json deep: <input class="col-1" type="number" v-model="deep">(cuidado, operação custosas)
            <!-- https://www.npmjs.com/package/vue-json-pretty -->
            <vue-json-pretty :data="(tab.result as any)" :deep="deep" :key="deep" :editable="true"
              :showSelectController="true" />
          </section>

        </div>
      </div>
    </div>
  </div>
</template>
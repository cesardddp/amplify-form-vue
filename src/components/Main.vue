<script setup lang="ts">
import TesteComponentes from "./FormsElements/TesteComponentes.vue";
import { tests, test_retorna_para_gerar_compontes } from "./tests";
import { FormSchema } from "./types";
import { GraphQLJSONSchema } from "./types_generated";
// import formElements from "./FormsElements";
import Input from "./FormsElements/Input.vue";
import SubmitButton from "./FormsElements/SubmitButton.vue";
import SelectField from "./FormsElements/SelectField.vue";
import Items from "./FormsElements/Items.vue";
import { ref } from "vue";

import formSchemaFor from "./form-schema";
import graphqlJSONSchema from "../example/schema.json";


function return_element(schema: FormSchema) {
  let field_component = undefined;
  console.log("##########");
  console.log(schema.kind);
  //'BOOLEAN', 'INT', 'LIST', 'SELECT', 'STRING', 'relationship', 'undefined'
  switch (schema.kind) {

    case 'SELECT':
      return SelectField
      // field_component = formElements.SelectField
      break;
    case 'INT':
      return Input
      // field_component = formElements.NumberField
      break;
    case 'BOOLEAN':
      return Input
      // field_component = formElements.CheckboxField
      break;
    case 'STRING':
      return Input
      // field_component = formElements.TextField
      break;
    
    case 'LIST':
      return Items

    default:
      return Input
      // field_component = formElements.TextField
      break;
  }
  return field_component
}
function return_props(schema: FormSchema) {
  switch (schema.kind) {

    case 'SELECT':

      return {
        nome: schema.label,
        label: schema.label,
        options: schema.options
      }
    case 'LIST':

      return {
        nome: schema.label,
        label: schema.label,
      }
      // field_component = formElements.SelectField
    case 'INT':

      return { nome: schema.label, label: schema.label, type: 'number' }
      // field_component = formElements.NumberField
      break;
    case 'BOOLEAN':

      return { nome: schema.label, label: schema.label, type: 'checkbox' }
      // field_component = formElements.CheckboxField
      break;
    case 'STRING':

      return { nome: schema.label, label: schema.label, type: 'text' }
      // field_component = formElements.TextField
      break;

    default:

      return { nome: schema.label, label: schema.label, type: 'text' }
      // field_component = formElements.TextField
      break;
  }
}
const entity = ["Campo", "Tela", "Model", "View", "Api", "Modulo"]
const schema_teste = entity.map(
  (entity) => {
    return {
      ent: entity,
      schema: formSchemaFor(graphqlJSONSchema as GraphQLJSONSchema, entity, "create")
    }
  }
)
const refs = new Map()
const forms = schema_teste.map(sch => {

  return {
    ent: sch.ent,
    schema: Object.fromEntries(Object.values(sch.schema)
      .map((i: any) => {
        const campo = { ...i, ref: ref() }
        if (i.kind==='LIST')campo.ref = ref([''])
        refs.set(sch.ent + i.label, campo.ref)
        return [i.label, campo]
      })
    )
  }
}
)

const telas = ref(false)

</script>

<template>
  <h1>Tests</h1>

  <amplify-form-vue></amplify-form-vue>
  <div class="mb-5">
    <h3 class="fs-3"> merm-admin/src/components/formSchema/teste.ts</h3>
    <span>Isso testa se ele tá parseando o schema para form-componentes-props </span>
    <div>{{ tests() }} "Olhe console.log" </div>
  </div>

  <span class="fs-3"> merm-admin/src/components/formSchema/FormsElements/TesteComponentes.vue</span>
  <div class="d-grid gap-2 d-flex justify-content-center">
    <button type="button" @click="telas = false" name="" id=""
      class="btn btn-outline-info w-25 text-center">TesteComponentes</button>
    <button type="button" @click="telas = true" name="" id=""
      class="btn btn-outline-success w-25 text-center">TesteForms</button>
  </div>
  <TesteComponentes v-if="!telas" />

  <div v-else class="container mx-auto">

    <!-- Nav tabs -->
    <ul class="nav nav-tabs" id="myTab" role="tablist">
      <li v-for="form in forms" class="nav-item" role="presentation">
        <button class="nav-link" :id="form.ent + '-tab'" data-bs-toggle="tab" :data-bs-target="'#' + form.ent"
          type="button" role="tab" :aria-controls="form.ent" aria-selected="false">{{ form.ent }}</button>
      </li>
    </ul>

    <!-- Tab panes -->
    <div class="tab-content">
      <div v-for="form in forms" class="tab-pane" :id="form.ent" role="tabpanel" :aria-labelledby="form.ent + '-tab'">
        <section class="row border">

          <form class="col-5">
            <strong> {{ form.ent }} </strong>
            <component v-for="campo in form.schema" :is="return_element(campo)" v-bind="return_props(campo)"
              v-model="campo.ref.value" class="mb-3" />
          </form>
          <div class="col-6 border">
            <div v-for="f in form.schema">
              <strong>Valor {{ f.label }}: </strong>
              {{ refs.get(form.ent + f.label) }}
            </div>
          </div>
        </section>
      </div>
      <!-- t:<ul v-for="v in refs.entries()">{{ v }}</ul> -->
    </div>
  </div>
</template>

<style scoped>

</style>

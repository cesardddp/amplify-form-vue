<script lang="ts" >
import {
  FormSchema,
} from '../types';
import { Ref, defineComponent, markRaw, reactive, ref, toRef, watch } from 'vue'
import Input from "../FormsElements/Input.vue";
import SelectField from "../FormsElements/SelectField.vue";
import Items from "../FormsElements/Items.vue";
import { Cache } from "aws-amplify";
import { debug } from 'console';
//
//

function get_element(schema: FormSchema) {
  switch (schema.kind) {
    case 'SELECT':
      return SelectField
    case 'LIST':
      return Items

    case 'INT':
    case 'BOOLEAN':
    case 'STRING':
    case 'relationship':
      return Input
    default:
      debugger
      throw new Error("schema.kind desconhecido: " + schema.kind);

  }
}

function get_props(schema: FormSchema) {
  const validacoes = []

  if (schema.required) validacoes.push('required');

  switch (schema.kind) {
    case 'SELECT':
      return {
        nome: schema.label,
        label: schema.label,
        options: schema.options,
        validacoes
      }
    case 'LIST':
      return {
        nome: schema.label,
        label: schema.label,
        validacoes
      }
    case 'INT':
      return {
        nome: schema.label, label: schema.label, type: 'number',
        validacoes
      }

    case 'BOOLEAN':
      return {
        nome: schema.label, label: schema.label, type: 'checkbox',
        validacoes
      }

    case 'STRING':
      return {
        nome: schema.label, label: schema.label, type: 'text', bootstrap_syncfusion: 'bs',
        validacoes
      }
    case 'relationship':
      return {
        nome: schema.label, label: schema.label, type: 'text',
        validacoes, bs_class_wrap: 'd-none'
      }
    default:
      return {
        nome: schema.label, label: schema.label, type: 'text',
        validacoes
      }
  }
}
function parseCampos(formSchema: FormSchema, props_: any) {


  let c = Object.entries(formSchema).map(([a, b]: [any, any]) => {
console.log(a);

    if (!b.kind) {
      return parseCampos(Object.fromEntries(
        Object.entries(b).filter(
          c => (c[1] != null && typeof c[1] === 'object')
        )

      ), props_).flat()
    } else {
      const formComponent = get_element(b);
      const props = get_props(b);
      const ref = props_.refs[(b as any).nome]
      const k ={
        formComponent,
        props,
        ref: ref
      }
      // console.log(k);
      return k
    }
    

  })
  return c
  // debugger
  // let field: keyof FormSchema;
  // for (field in formSchema) {
  //   const f = formSchema[field] as FormSchema
  //   if (!f.kind) {
  //     console.log(...parseCampos(Object.fromEntries(
  //       Object.entries(f).filter(
  //         c => (c[1] != null && typeof c[1] === 'object')
  //       )

  //     ), props_))
  //   } else {
  //     const formComponent = get_element(f);
  //     const props = get_props(f);
  //     const ref = props_.refs[(f as any).nome]
  //     campos.push({
  //       formComponent,
  //       props,
  //       ref: ref
  //     })
  //   }
  // }

  // return campos

}
export default defineComponent({
  props: [
    'name',
    'formSchema',
    'refs',
    'was_validated',
    'disabled',
  ],
  components: {
  },
  emits: ['refs', 'submit_result'],
  methods: {

  }
  ,
  setup(props, { emit }) {

    const campos = parseCampos(props.formSchema, props).flat()
    debugger
    const nro_colunas = ref(Cache.getItem(props.name + 'nro_colunas') ?? 2)
    function muda_nro_col() {
      if (nro_colunas.value === 6) nro_colunas.value = 1
      else {
        nro_colunas.value += 1
      }
      Cache.setItem(props.name + 'nro_colunas', nro_colunas.value)
    }
    return {
      campos,
      nro_colunas,
      muda_nro_col,
    }
  }
}
)
</script>


<template>
  <div class="btn-group">
    <button class="btn dropdown-toggle" type="button" data-bs-toggle="dropdown" data-bs-auto-close="outside"
      aria-expanded="false">
    </button>
    <ul class="dropdown-menu">
      <li class="d-flex justify-content-center">
        <button @click="muda_nro_col" type="button" class="btn btn-outline-info btn-sm m-0"><i
            class="bi bi-arrow-left-right">{{ 'colunas: '+nro_colunas }}</i></button>
      </li>
    </ul>
  </div>
  <form @submit.prevent class="container w-100 row" :name="$props.name"
    :class="was_validated ? 'was-validated  row-cols-' + nro_colunas : 'row-cols-' + nro_colunas">
    <!-- {{ formSchema }} -->
    <div v-for="campo, index in campos">
      <component :is="campo.formComponent" v-bind="campo.props" :was_validated="$props.was_validated"
        v-model="campo.ref" :key="index" class="my-1" :disabled="$props.disabled" />
    </div>
  </form>
  <div class="w-100 d-flex justify-content-center">



  </div>
</template>
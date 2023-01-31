<script lang="ts" >
// import { VFC } from 'react';
// import { Storage } from 'aws-amplify';
// import FormComponent from '../FormComponent';
import { formSchemaFor } from './form-schema';
// import { parseObject } from '../../utils/parse-object';
// import { FormikHelpers } from 'formik';
// import lodashSet from 'lodash/set';
// import lodashGet from 'lodash/get';
// import camelCase from 'lodash/camelCase';
// import capitalize from 'lodash/capitalize';
import {
  AmplifyFormProps,
  FormSchema,
  FileWithSize,
  FormValues,
  FileWithStorageKey,
  ObjectWithKey,
  FileFields,
  TextAreas,
  Messages,
  FieldsProps,
  SubmitButtonProps,
} from './types';
import { defineComponent, markRaw, reactive, ref, toRef, watch } from 'vue'
import type { PropType } from 'vue'
import Input from "./FormsElements/Input.vue";
import SelectField from "./FormsElements/SelectField.vue";
import Items from "./FormsElements/Items.vue";
import SubmitButton from "./FormsElements/SubmitButton.vue";
import { Cache } from "aws-amplify";
//
import { GraphQLResult, GRAPHQL_AUTH_MODE } from '@aws-amplify/api';
import { Auth, API, Cache as AmplifyCache } from 'aws-amplify';
//

function return_element(schema: FormSchema) {
  switch (schema.kind) {
    case 'SELECT':
      return SelectField

    case 'INT':
      return Input

    case 'BOOLEAN':
      return Input

    case 'STRING':
      return Input

    case 'LIST':
      return Items

    default:
      return Input
  }
}
function return_props(schema: FormSchema) {
  const validacoes = []
  if (schema.required) validacoes.push('required')
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
      debugger
      return {
        nome: schema.label, label: schema.label, type: 'text',
        validacoes
      }
  }
}

export default defineComponent({
  props: {
    form_props: Object as PropType<AmplifyFormProps>,
    queries: Object,
    mutations: Object,
    prefill: Object,
    create_update: String as PropType<'create' | 'update'>,
    nro_colunas: { type: Number, default: 2 },
    disabled: Boolean,
    submitbutton: Object as PropType<SubmitButtonProps>
  },
  components: {
    SubmitButton
  },
  emits: ['refs', 'submit_result'],
  methods: {
    // async api() {
    //   debugger
    //   // this.was_validate
    //   // colunas.value?.forEach(coluna => {
    //   //   if (coluna.valor_padrao && !data[coluna.configs.nome]) {
    //   //     data[coluna.configs.nome] = coluna.valor_padrao()
    //   //   }
    //   // })

    //   const options = {
    //     query: (this.$props.mutations as any)['create' + this.$props.form_props?.entity],
    //     variables: { input: this.refs },
    //     // authMode: GRAPHQL_AUTH_MODE.AMAZON_COGNITO_USER_POOLS,
    //   }
    //   debugger
    //   try {
    //     const result = await (API.graphql(options) as Promise<any>);
    //     alert("hum")
    //   } catch (error: any) {
    //     console.log('error: ', error);
    //     alert(error.tostring())
    //   } finally {
    //     // atualizaPagina()
    //   }


    // }
  }
  ,
  setup(props, { emit }) {
    if (!props.form_props) throw new Error("?");
    const formSchema = formSchemaFor(
      props.form_props?.graphQLJSONSchema,
      props.form_props.entity,
      'create',

    );

    const refs = reactive(
      Object.fromEntries(
        Object.entries(formSchema)
          .map((
            [n, campo]) => {
            const _ref = (campo as FormSchema).kind === 'LIST'
              ? ref([''])
              : ref(props.prefill ? props.prefill[n] : undefined)
            return [n, markRaw(_ref)]
          }
          )
      )
    )
    watch(refs, () => {
      console.log(refs);

      emit('refs', refs)
    }, { deep: true })

    const was_validated = ref(false)
    const submited = ref<'success' | 'error' | 'waiting'>('waiting')
    async function api() {
      was_validated.value = true
        let erro=false;
      for (let k in formSchema) {
        const r = (formSchema[(k as keyof typeof formSchema)] as FormSchema)?.required;
        if (r) {
          if (refs[k] === undefined) {
            alert(`Por favor, preencha o campo "${k}" `)
            erro=true;
          }

        }
      }
      if(erro)return;

      const options = {
        query: (props.mutations as any)['create' + props.form_props?.entity],
        variables: { input: refs },
        authMode: GRAPHQL_AUTH_MODE.AMAZON_COGNITO_USER_POOLS,
      }

      try {
        const result = await (API.graphql(options) as Promise<any>);
        alert("Sucesso!")
        // TODO emita o result.data.createCoisa
        emit('submit_result', result.data['create' + props.form_props?.entity])
      } catch (error: any) {
        console.log('error: ', error);
        emit('submit_result', error)
        alert(error)
      } finally {
        // atualizaPagina()
      }


    }
    const nro_colunas = ref(Cache.getItem(props.form_props?.entity + 'nro_colunas') ?? props.nro_colunas)
    function muda_nro_col() {
      if (nro_colunas.value === 6) nro_colunas.value = 1
      else {
        nro_colunas.value += 1
      }
      Cache.setItem(props.form_props?.entity + 'nro_colunas', nro_colunas.value)
    }
    return { formSchema, return_element, return_props, refs, api, was_validated, submited, nro_colunas, muda_nro_col, disabled: props.disabled, submit_button: props.submitbutton }
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

      <!-- <li><a class="dropdown-item" href="#">Menu item</a></li> -->
      <!-- <li><a class="dropdown-item" href="#">Menu item</a></li> -->
    </ul>
  </div>

  <form @submit.prevent class="container w-100 row"
    :class="was_validated ? 'was-validated  row-cols-' + nro_colunas : 'row-cols-' + nro_colunas">
    <component v-for="campo, index in formSchema" :is="return_element(campo as FormSchema)"
      v-bind="return_props(campo as FormSchema)" :was_validated="was_validated" v-model="refs[(campo as any).nome]"
      :key="index" class="my-1" :disabled="disabled" />
  </form>
  <div class="w-100 d-flex justify-content-center">
    <!-- <button v-if="submited === 'waiting' || submited === 'error'" @click="api" type="submit"
      class="btn btn-primary text-center">
      {{ submited=== 'waiting' ? 'Enviar' : 'Tentar Novamente?' }}</button>
      aaaaaaaaaaaa -->


    <SubmitButton class="text-center" v-if="submited === 'waiting' || submited === 'error'" @click="api" type="submit"
      v-bind:submit_props="submit_button" />
  </div>
</template>
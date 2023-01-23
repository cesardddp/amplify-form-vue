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
} from './types';
import { defineComponent, markRaw, reactive, ref, watch } from 'vue'
import type { PropType } from 'vue'
import Input from "./FormsElements/Input.vue";
import SelectField from "./FormsElements/SelectField.vue";
import Items from "./FormsElements/Items.vue";

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

    default:
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
    prefill: Object
  },
  emits: ['refs'],
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

    async function api() {
      was_validated.value = true
      // colunas.value?.forEach(coluna => {
      //   if (coluna.valor_padrao && !data[coluna.configs.nome]) {
      //     data[coluna.configs.nome] = coluna.valor_padrao()
      //   }
      // })

      const options = {
        query: (props.mutations as any)['create' + props.form_props?.entity],
        variables: { input: refs },
        // authMode: GRAPHQL_AUTH_MODE.AMAZON_COGNITO_USER_POOLS,
      }
      debugger
      try {
        const result = await (API.graphql(options) as Promise<any>);
        alert("hum")
      } catch (error: any) {
        console.log('error: ', error);
        alert(error.tostring())
      } finally {
        // atualizaPagina()
      }


    }

    return { formSchema, return_element, return_props, refs, api, was_validated }
  }
}
)
</script>


<template>
  <form @submit.prevent :class="was_validated ? 'was-validated' : ''">
    <component v-for="campo, index in formSchema" :is="return_element(campo as FormSchema)"
      v-bind="return_props(campo as FormSchema)" :was_validated="was_validated" v-model="refs[(campo as any).nome]"
      :key="index" class="m-1" />
    <button @click="api" type="submit" class="btn btn-primary">Submit</button>
  </form>
</template>
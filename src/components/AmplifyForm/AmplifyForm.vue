<script lang="ts" >
// import { VFC } from 'react';
// import { Storage } from 'aws-amplify';
// import FormComponent from '../FormComponent';
import { formSchemaFor } from '../AmplifyForm/form-schema';
// import { parseObject } from '../../utils/parse-object';
// import { FormikHelpers } from 'formik';
import lodashSet from 'lodash/set';
import lodashGet from 'lodash/get';
import camelCase from 'lodash/camelCase';
import capitalize from 'lodash/capitalize';
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
} from '../types';
import {graphql_schema} from "../merm-types/generated_amplify_graphql_schema_interfaces";
import { defineComponent, markRaw, reactive, ref, toRef, watch } from 'vue'
import type { PropType } from 'vue'
import Input from "../FormsElements/Input.vue";
import SelectField from "../FormsElements/SelectField.vue";
import Items from "../FormsElements/Items.vue";
import SubmitButton from "../FormsElements/SubmitButton.vue";
import { Cache } from "aws-amplify";
//
import { GraphQLResult, GRAPHQL_AUTH_MODE } from '@aws-amplify/api';
import { Auth, API, Cache as AmplifyCache } from 'aws-amplify';
//
import BuildForm from "../AmplifyForm/BuildForm.vue";




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
    SubmitButton,
    BuildForm
  },
  emits: ['refs', 'submit_result'],
  methods: {

  }
  ,
  setup(props, { emit }) {
    if (!props.form_props) throw new Error("?");
    // Create formSchema
    const formSchema = formSchemaFor(
      props.form_props.graphQLJSONSchema,
      props.form_props.entity,
      'create',
      props.form_props.labelMap
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
      let erro = false;
      for (let k in formSchema) {
        const r = (formSchema[(k as keyof typeof formSchema)] as FormSchema)?.required;
        if (r) {
          if (refs[k] === undefined) {
            alert(`Por favor, preencha o campo "${k}" `)
            erro = true;
          }

        }
      }
      if (erro) return;

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

    return {
      formSchema,
      refs,
      api,
      was_validated,
       submited, disabled: props.disabled, submit_button: props.submitbutton,
      name: props.form_props.entity
    }
  }
}
)
</script>


<template>
<!-- was_validated: {{ was_validated }} -->
  <BuildForm :name="name" :formSchema="formSchema" :refs="refs" :was_validated="was_validated" :disabled="disabled" />
  <SubmitButton class="text-center" v-if="submited === 'waiting' || submited === 'error'" @click="api" type="submit"
    v-bind:submit_props="submit_button" />
</template>
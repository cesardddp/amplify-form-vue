<script lang="ts" >
// import { Storage } from 'aws-amplify';
import { formSchemaFor } from '../AmplifyForm/form-schema';
// import { parseObject } from '../../utils/parse-object';
// import { FormikHelpers } from 'formik';
// import lodashSet from 'lodash/set';
// import lodashGet from 'lodash/get';
// import camelCase from 'lodash/camelCase';
// import capitalize from 'lodash/capitalize';
import {
  AmplifyFormProps,
  FormSchema,
  // FileWithSize,
  // FormValues,
  // FileWithStorageKey,
  // ObjectWithKey,
  // FileFields,
  // TextAreas,
  // Messages,
  // FieldsProps,
  SubmitButtonProps,
} from '../types';
import { Ref, defineComponent, markRaw, provide, inject, reactive, ref, watch } from 'vue'
import { PropType } from 'vue'
import SubmitButton from "../FormsElements/SubmitButton.vue";
//
import { GraphQLResult, GRAPHQL_AUTH_MODE } from '@aws-amplify/api';
import { API } from 'aws-amplify';
//
import BuildForm from "../AmplifyForm/BuildForm.vue";
import {  set_refs_and_warchers_onEach_field_and_return_as_refs_list } from './parseSchema/parse_schema';

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
  setup(props, { emit }) {
    if (!props.form_props) throw new Error("form_props vazio!!!");
    // Create formSchema
    const formSchema = formSchemaFor(
      props.form_props.graphQLJSONSchema,
      props.form_props.entity,
      'create',
      // props.form_props.labelMap
    );



    // const refs = reactive<{ [key: string]: object }>({})
    const refs = set_refs_and_warchers_onEach_field_and_return_as_refs_list(
      formSchema,
      props.form_props?.entity,
      props.prefill as any,
      ()=>emit('refs', refs),
    )
    // Object.fromEntries(


    watch(refs, () => {
      console.log('big ref updated' + refs);
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
          debugger
          // if (refs[k] === undefined) {
          //   alert(`Por favor, preencha o campo "${k}" `)
          //   erro = true;
          // }

        }
      }
      if (erro) return;

      const options = {
        query: (props.mutations as any)['create' + props.form_props?.entity],
        variables: { input: refs },//TODO retormar o ref pra envia via graphql.api
        authMode: GRAPHQL_AUTH_MODE.AMAZON_COGNITO_USER_POOLS,
      }

      try {
        const { data, errors, extensions } = await (API.graphql(options) as Promise<GraphQLResult<any>>);
        if (data) {
          alert("Sucesso!")
          // TODO emita o result.data.createCoisa
          emit('submit_result', data['create' + props.form_props?.entity])

        }
        else if (errors) {
          alert(`Erro!
            ${errors.join('\n')}`
          )
        }
      } catch (error: any) {
        console.log('error: ', error);
        alert(error)
        emit('submit_result', error)
      } finally {
        // atualizaPagina()
      }


    }

    return {
      formSchema,
      // refs,
      api,
      was_validated,
      submited, disabled: props.disabled, submit_button: props.submitbutton,
      entity: props.form_props.entity
    }
  }
}
)
</script>


<template>
  <BuildForm :entity="entity" :formSchema="formSchema" :was_validated="was_validated" :disabled="disabled" />
  <SubmitButton class="text-center" v-if="submited === 'waiting' || submited === 'error'" @click="api" type="submit"
    v-bind:submit_props="submit_button" />
</template>
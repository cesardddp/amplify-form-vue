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
import { defineComponent, reactive, ref, watch } from 'vue'
import type { PropType } from 'vue'
import Input from "./FormsElements/Input.vue";
import SelectField from "./FormsElements/SelectField.vue";
import Items from "./FormsElements/Items.vue";

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
      // console.log("aaaaaaaaaaaaaaaaaaa");
      // console.log(schema);

      return Items

    default:
      return Input
  }
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
    case 'INT':
      return { nome: schema.label, label: schema.label, type: 'number' }

    case 'BOOLEAN':
      return { nome: schema.label, label: schema.label, type: 'checkbox' }

    case 'STRING':
      return { nome: schema.label, label: schema.label, type: 'text' }

    default:
      return { nome: schema.label, label: schema.label, type: 'text' }
  }
}

export default defineComponent({
  props: {
    form_props: Object as PropType<AmplifyFormProps>
  },
  emits: ['refs'],
  
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
            [n, campo]) => [
              n,
              (campo as FormSchema).kind === 'LIST' ? ref(['']) : ref()
            ]
          )
      )
    )
    // debugger
    watch(refs, () => {
      emit('refs', refs)
    }, { deep: true })
    return { formSchema, return_element, return_props, refs }
  }
}
)
</script>


<template>
  <component v-for="campo, index in formSchema" :is="return_element(campo as FormSchema)"
    v-bind="return_props(campo as FormSchema)" v-model="refs[(campo as any).label.toLowerCase()]" :key="index"
    class="m-1" />
</template>
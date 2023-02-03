<script lang="ts" >
import {
  FormSchema,
} from '../types';
import { Ref, defineComponent, markRaw, reactive, ref, toRef, watch } from 'vue'
import Input, { InputProps } from "../FormsElements/Input.vue";
import SelectField, { SelectProps } from "../FormsElements/SelectField.vue";
import Items, { ItemsProps } from "../FormsElements/Items.vue";
import { Cache } from "aws-amplify";
import { OpcoesValidacoes } from "../types";
//
//



type InputComponent = {
  is: "Input",
  props: InputProps,
  disabled: boolean
}
type SelectFieldComponent = {
  is: "SelectField",
  props: SelectProps,
  disabled: boolean
}
type ItemsComponent = {
  is: "Items",
  props: ItemsProps,
  disabled: boolean
}
function getFormElement(
  elementOptions: {
    name: string,
    formSchema: FormSchema,
    // theme?: FormTheme
    refs: { [k: string]: Ref },
    disabled: boolean
    prefix?: string,
    entity:string
    // prefix?: string = '',
  }

): InputComponent | SelectFieldComponent | ItemsComponent {
  const { kind, label, options, of, required, defaultValue, ...props } =
    elementOptions.formSchema;
  // const explicitName = (elementOptions.prefix ? elementOptions.prefix + '.' : '') + elementOptions.name;
  const explicitName = elementOptions.name;


  const validacoes: OpcoesValidacoes[] = []
  if (required) validacoes.push('required');


  if (!elementOptions.formSchema) {
    throw new Error("!formschema");

  }

  switch (kind) {
    // case undefined:
    //   return {

    //     props: {

    //       name: explicitName,
    //       label: label, //|| defaultLabel,
    //     }

    //     sei_la:
    //       Object.keys(props!).map(
    //         fieldName =>
    //           getFormElement(
    //             fieldName,
    //             props[fieldName]! as FormSchema,
    //             name,
    //             // (theme = theme)
    //           )
    //       )
    //   } as 


    case 'STRING':
    case 'AWSEMAIL':
    case 'AWSURL':
    case 'relationship':
      return {
        is: 'Input',
        // name:  explicitName ,
        props: {
          nome: explicitName,
          label: label,
          type: 'text',
          bootstrap_syncfusion: 'bs',
          validacoes: validacoes,
          // modelValue: elementOptions.refs[explicitName],
          // theme:  theme ,
          bs_class_wrap: kind === 'relationship' ? 'd-none' : undefined,
          entity:elementOptions.entity
        },
        disabled: elementOptions.disabled
      } satisfies InputComponent;

    // case 'TEXTAREA':
    // return {
    //     is: 'Input',
    //     // name:  explicitName ,
    //     props: {
    //       nome: explicitName,
    //       label: label,
    //       type: 'text',
    //       is_text_area:true,
    //       bootstrap_syncfusion: 'bs',
    //       validacoes: validacoes,
    //       modelValue: elementOptions.refs[explicitName],
    //       // theme:  theme ,
    //     },
    //     elementOptions.disabled
    //   } satisfies InputComponent;
    case 'INT':
    case 'FLOAT':
      return {
        is: 'Input',
        // name:  explicitName ,
        props: {
          nome: explicitName,
          label: label,
          type: 'number',
          bootstrap_syncfusion: 'bs',
          validacoes: validacoes,
          // modelValue: elementOptions.refs[explicitName],
          entity:elementOptions.entity
          // theme:  theme ,
        },
        disabled: elementOptions.disabled
      } satisfies InputComponent;

    case 'BOOLEAN':
      return {
        is: 'Input',
        // name:  explicitName ,
        props: {
          nome: explicitName,
          label: label,
          type: 'checkbox',
          bootstrap_syncfusion: 'bs',
          validacoes: validacoes,
          // modelValue: elementOptions.refs[explicitName],
          entity:elementOptions.entity
          // theme:  theme ,
        },
        disabled: elementOptions.disabled
      } satisfies InputComponent;

    case 'LIST':
      return {
        disabled: elementOptions.disabled,
        is: 'Items',
        props: {
          nome: explicitName,
          label: label ?? explicitName,
          // modelValue: elementOptions.refs[explicitName].value ?? '',
          entity:elementOptions.entity
        }
      } satisfies ItemsComponent
    case 'SELECT':
      return {
        is: 'SelectField',
        disabled: elementOptions.disabled,
        props: {
          options: options!,
          nome: explicitName,
          label: label,
          // selectedValue: elementOptions.refs[explicitName]?.value ?? '',
          // modelValue: elementOptions.refs[explicitName],
          entity:elementOptions.entity,
          validacoes
        }
      } satisfies SelectFieldComponent
    default:
      throw new Error("não sei o que fazer com esse kind" + kind);

  }

  // case 'relationship':
  // listFields.add(explicitName);
  //       <SelectField
  //           name={ explicitName }
  //   label = { ''}
  //   options = { options! }
  //   selectLabel = { select }
  //   theme = { theme }
  //   required = { required }
  //   {...props }
  //   />
  //     < /FieldSet>
  //     );
  // }

  //     case 'file')
  //   return (
  //     <FilesDropField
  //           name= { explicitName }
  //   label = { label }
  //   theme = { theme }
  //   required = { required }
  //   {...props }> </FilesDropField>
  //       );
  // }

};


export default defineComponent({
  props: [
    'entity',
    'formSchema',
    'refs',
    'was_validated',
    'disabled',
  ],
  components: {
    Input: Input,
    SelectField: SelectField,
    Items: Items,
  },
  emits: [ 'submit_result'],
  methods: {

  }
  ,
  setup(props, { emit }) {


    const campos: (InputComponent | SelectFieldComponent | ItemsComponent)[] = Object.entries(
      props.formSchema).map(
        a => {
          const nome = a[0];
          const content = a[1]
          return getFormElement(
            {
              name: nome,
              formSchema: content as FormSchema,
              refs: props.refs,
              disabled: props.disabled,
              entity:props.entity
              // prefix
            }
          )
        }
      )



    const nro_colunas = ref(Cache.getItem(props.entity + 'nro_colunas') ?? 2)
    function muda_nro_col() {
      if (nro_colunas.value === 6) nro_colunas.value = 1
      else {
        nro_colunas.value += 1
      }
      Cache.setItem(props.entity + 'nro_colunas', nro_colunas.value)
    }
    return {
      campos,
      nro_colunas,
      muda_nro_col,
      entity:props.entity
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
  <form @submit.prevent class="container w-100 row" :name="$props.entity"
    :class="was_validated ? 'was-validated  row-cols-' + nro_colunas : 'row-cols-' + nro_colunas">
    <!-- {{ formSchema }} -->
    <div v-for="campo, index in campos">
      <component :is="campo.is" v-bind:cpn_props="campo.props" :was_validated="$props.was_validated"
      :key="index" class="my-1" />
      <!-- v-model="campo.props.modelValue" -->
    </div>
  </form>
  <div class="w-100 d-flex justify-content-center">



  </div>
</template>
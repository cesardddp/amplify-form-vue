<script lang="ts" >
import {
  FormSchema, FormSchemaField, SubForm,
} from '../../merm-types/cesar_novos_types_vue_form';
import { Ref, defineComponent, markRaw, reactive, ref, toRef, watch } from 'vue'
import Input, { InputProps } from "../FormsElements/Input.vue";
import SelectField, { SelectProps } from "../FormsElements/SelectField.vue";
import Items, { ItemsProps } from "../FormsElements/Items.vue";
import { Cache } from "aws-amplify";
import { OpcoesValidacoes } from "../types";
import { map_field_on_FormSchema } from "./parseSchema/parse_schema";
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
type Form = {
  is: "Form"
  fields: any//(InputComponent | SelectFieldComponent | ItemsComponent)[]
}
function getFormElement(
  field: FormSchemaField, entity: string, disabled: boolean

): InputComponent | SelectFieldComponent | ItemsComponent | Form {
  // const explicitName = (elementOptions.prefix ? elementOptions.prefix + '.' : '') + elementOptions.name;
  const explicitName = field.name;


  const validacoes: OpcoesValidacoes[] = []
  if (field.required) validacoes.push('required');


  if (!field) {
    throw new Error("!formschema");

  }

  switch (field.kind) {

    case 'STRING':
    case 'relationship':
      return {
        is: 'Input',
        // name:  explicitName ,
        props: {
          nome: explicitName,
          // label: field.label,
          label: explicitName,
          type: 'text',
          bootstrap_syncfusion: 'bs',
          validacoes: validacoes,
          // modelValue: elementOptions.refs[explicitName],
          // theme:  theme ,
          bs_class_wrap: field.kind === 'relationship' ? 'd-none' : undefined,
          entity
        },
        disabled
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
          // label: elementOptions.formSchema.label,
          label: explicitName,
          type: 'number',
          bootstrap_syncfusion: 'bs',
          validacoes: validacoes,
          // modelValue: elementOptions.refs[explicitName],
          entity: entity
          // theme:  theme ,
        },
        disabled
      } satisfies InputComponent;

    case 'BOOLEAN':
      return {
        is: 'Input',
        // name:  explicitName ,
        props: {
          nome: explicitName,
          // label: elementOptions.formSchema.label,
          label: explicitName,
          type: 'checkbox',
          bootstrap_syncfusion: 'bs',
          validacoes: validacoes,
          // modelValue: elementOptions.refs[explicitName],
          entity: entity
          // theme:  theme ,
        },
        disabled
      } satisfies InputComponent;

    case 'LIST':
      //TODO unhadle
      // debugger
      // field.of
      if (field.of && 'length' in field.of) {
        return field.of.map(f => {
          const k = getFormElement(f, '', false)
          return getFormElement(f, '', false)
        })
      }

      return {
        disabled,
        is: 'Items',
        props: {
          nome: explicitName,
          label: explicitName,
          // modelValue: elementOptions.refs[explicitName].value ?? '',
          entity: entity
        }
      } satisfies ItemsComponent
    case 'SELECT':



      return {
        is: 'SelectField',
        disabled,
        props: {
          options: field.options!,
          nome: explicitName,
          // label: elementOptions.formSchema.label,
          label: explicitName,
          // selectedValue: elementOptions.refs[explicitName]?.value ?? '',
          // modelValue: elementOptions.refs[explicitName],
          entity: entity,
          validacoes
        }
      } satisfies SelectFieldComponent
    default:
      debugger
      throw new Error("não sei o que fazer com esse kind: " + field.kind);

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
  emits: ['submit_result'],
  setup(props, { emit }) {
    const formSchema: FormSchema = props.formSchema
    // const campos: unknown = {}

    map_field_on_FormSchema(
      formSchema,
      (field: any) => {
        // if (field.kind === 'LIST') {
        //   debugger
        //   field.fied_form_props = field.of.map(f => f.fied_form_props = getFormElement(f, formSchema.formName, false));}
        // else
        field.fied_form_props = getFormElement(field, formSchema.formName, false)//ponto de parada
      }
    )



    const forms: unknown[] = []
    const to_forms = (field, pai?: string) => {
      if ('fields' in field) {
        forms.push(
          {
            pai,
            formName: field.name,
            fields: field.fields.map(f => {
              return to_forms(f, field.name)
            }),
            multiple: field.multiple
          }
        )
      }
      else {
        if ('kind' in field) {
          // if(field.kind==='LIST'){
          return field.fied_form_props
        } else {
          debugger
        }
      }
    }
    const hum = formSchema.fields.map(
      f => to_forms(f))


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
      forms,
      nro_colunas,
      muda_nro_col,
      entity: props.entity
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
    <!-- {{ campos }} -->
    {{ forms }}


    <!-- <component v-if="campo" : ="campo.is" v-bind:cpn_props="campo.props" :was_validated="$props.was_validated"
          :key="index" class="my-1" /> -->

  </form>
  <div class="w-100 d-flex justify-content-center">



  </div>
</template>
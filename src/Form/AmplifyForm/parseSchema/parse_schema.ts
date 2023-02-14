import { markRaw, provide, reactive, ref, Ref, watch } from "vue";
import { FormSchema, FormSchemaField, SubForm } from "../../../merm-types/cesar_novos_types_vue_form";

function fieldIsFormSchemaField(field: FormSchemaField | SubForm): field is FormSchemaField {
  return ('kind' in field)
}
function fieldIsSubForm(field: FormSchemaField | SubForm): field is SubForm {
  return !('kind' in field)
}
export function map_field_on_FormSchema(formSchema: FormSchema, func: Function) {
  // Executa uma função `func` pra cada field em `formSchema`
  const recursao_tentativa = (field: FormSchemaField | SubForm):any => {
    if (fieldIsFormSchemaField(field)) {

      return func(field)

    } else if (fieldIsSubForm(field)) {
      return field.fields.map(
        f => recursao_tentativa(f)
      )
    }
  }

  return formSchema.fields.map((field_subForm) => {
    recursao_tentativa(field_subForm)
  })
}


export function set_refs_and_warchers_onEach_field_and_return_as_refs_list(
  formSchema: FormSchema,
  entity: string,
  prefill: {
    [k: string]: Object;
  },
  callBackEmit: Function,
) {
  const refs = reactive<{ [key: string]: object }>({})

  // cria função que cria um ref para um field e coloca um watcher nele
  function set_ref_watcher_and_provider(field: FormSchemaField) {
    const is_campo_LIST = field.kind === 'LIST';
    const _ref: Ref = is_campo_LIST ?
      ref([''])
      : ref(prefill ? prefill[field.name] : undefined);
    provide('create' + entity + 'Input' + '_' + field.name, _ref)
    // console.log('create' + entity + 'Input' + '_' + field.name);

    watch(_ref, () => {
      // console.log( `watched ${props.form_props?.entity + '_' + n} is changed: ${_ref.value}`);
      callBackEmit
    }, { deep: is_campo_LIST }
    )

    refs[field.name] = markRaw(_ref)
  }

  map_field_on_FormSchema(
    formSchema,
    set_ref_watcher_and_provider
  )

  return refs;
}

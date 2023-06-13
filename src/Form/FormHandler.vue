<script setup lang="ts" >
import { computed, inject, Ref, watchEffect } from "vue";
import Form from "./Form.vue";
import { FormSchemasMap, FormSchema } from "./parse-introspection";
import { FormStateHandler as GlobalFormStateHandler } from "./formStorage";
import { FormHandlerProps, FormProps } from "./formTypes";

const props = defineProps<FormHandlerProps>()
const emits = defineEmits(['qtos_forms'])
const global_form_state_handler = (inject('form_state_handler') as GlobalFormStateHandler)

const input = (inject("form_types") as FormSchemasMap).get(props.form_name)!;

// multiple logic:
class Inner_forms_handler {
  buttons_refs: { [key: string]: Ref } = {}

  public forms_datas = global_form_state_handler.getField(props.introspection_caminho)

  constructor() {
    if (!this.forms_datas.value) {
      this.forms_datas.value = [null]
    }
  }

  form_components = //global_form_state_handler.getField(props.introspection_caminho)
    computed(() => (this.forms_datas.value as Ref[])
      .map(
        (data, index) => ({
          props: this.copia_e_preenche_form_props_com_introspec_caminho(
            `${props.introspection_caminho}[${index}]`
          )
        })
      )
    )
  novo_item_form() {
    this.forms_datas.value.push(null)
  }

  copia_e_preenche_form_props_com_introspec_caminho(introspect_caminho: string) {
    // pega um copia das props do componente do form, e preenche com o introspect_caminho deste item
    const form_prop: FormProps = {
      form_type: input,
      is_multipleform_item: true,
      introspection_caminho: introspect_caminho,
      form_name: props.form_name,
    };

    form_prop.form_type.form_fields = form_prop.form_type.form_fields.map(
      (ff) => {
        const form_component_info = { ...ff.form_component_info };
        form_component_info.props.introspect_caminho = `${introspect_caminho}.${form_component_info.props.nome}`;
        return {
          nome: ff.nome,
          kind: ff.kind,
          form_component_info,
        };
      }
    );
    return form_prop;
  }

  remove_item(introspect_caminho: string) {
    global_form_state_handler.delete(introspect_caminho)
    delete this.buttons_refs[introspect_caminho];
  }
}

let inner_forms_handler: Inner_forms_handler

if (input.multiple) {
  inner_forms_handler = new Inner_forms_handler();
  if (!inner_forms_handler.form_components.value.length)
    inner_forms_handler.novo_item_form();

  watchEffect(() => {
    emits(
      'qtos_forms',
      {
        quem: props.field_name,
        qtos: inner_forms_handler.form_components.value.length
      }
    )
  })
}

function get_form_field_content(index: number) {
  const ppp = inner_forms_handler.forms_datas.value[index];

  if (!ppp || ppp.length <= 0) return

  const first = Object.values(ppp).filter(f => typeof f != 'object')[0];
  return first ? first : '(editando)'
}

</script>
<template>
  <Form v-if="!input.multiple" v-bind="{
    form_name,
    form_type: input,
    introspection_caminho,
    is_multipleform_item,
  }" />
  <article v-else>


    <!-- Nav tabs -->
    <ul class="nav nav-tabs" role="tablist">
      <li v-for="form, index in inner_forms_handler.form_components.value" class="nav-item position-relative"
        role="presentation" :key="form.props.introspection_caminho">
        <!-- {{ form.introspection_caminho }} -->
        <button @click="() => inner_forms_handler.remove_item(form.props.introspection_caminho)" type="button"
          role="button"
          class="z-3 position-absolute top-0 start-0 translate-middle badge border border-light rounded-circle bg-danger ">
          x
        </button>
        <button class="nav-link" :id="`${form.props.introspection_caminho}-tab`" data-bs-toggle="tab"
          :data-bs-target="`#${form.props?.introspection_caminho}`" type="button" role="tab"
          :aria-controls="`${form.props?.introspection_caminho}`" aria-selected="false"
          :class="index === 0 ? 'active' : ''" :ref="inner_forms_handler.buttons_refs[form.props.introspection_caminho]">
          {{ index + 1 }}: {{ get_form_field_content(index) ?? '(editando)' }}
        </button>

      </li>
      <li class="nav-item " role="presentation" aria-selected="false">
        <button @click="() => inner_forms_handler.novo_item_form()" class="nav-link">
          <i type="button" class="bi bi-plus"></i>
        </button>
      </li>
    </ul>

    <!-- Tab panes -->
    <div class="tab-content">
      <div v-for="form, index in inner_forms_handler.form_components.value  " class="tab-pane"
        :id="`${form.props.introspection_caminho}`" role="tabpanel"
        :aria-labelledby="`${form.props?.introspection_caminho}-tab`" :class="index === 0 ? 'active' : ''"
        :key="form.props.introspection_caminho">

        <!-- {{ form }} -->
        <Form v-bind="form.props" />
      </div>
    </div>
  </article>
</template>
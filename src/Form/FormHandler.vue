<script setup lang="ts" >
import { computed, inject, reactive, Ref, ref, shallowRef, toRef, watch, watchEffect } from "vue";
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
  private add_um = ref(false)

  form_components_props = computed(() => {
    const _keys = []
    let index_encontrados: string[] = [];
    for (let key of global_form_state_handler.state_as_Map.keys()) {
      if (key.startsWith(props.introspection_caminho)) {

        const field = key.split(props.introspection_caminho+"[").pop()!.split("]").shift()!;

        const index = field.split(".").shift()!;
        if (index_encontrados.includes(index)) continue;
        index_encontrados.push(index);
        _keys.push(`${props.introspection_caminho}[${index}]`)
      }
    }

    
    // para novo form item, altera add_um pra true, isso força o recalculo do computed, computando com mais um item após o ultimo indexado no geranciador global
    if (this.add_um.value) {
      const last_indice = Number(index_encontrados.pop() ?? -1)
      const key = `${props.introspection_caminho}[${last_indice + 1}]`
      _keys.push(key)
      this.buttons_refs[key] = ref()

      // retorna add_um pra false pra não adicionar novamente no proximo computed
      this.add_um.value = false
      

      setTimeout(() => {
        
        this.buttons_refs[key].value[0].click()
      }, 100)
    }

    return _keys
      .map((introspect_caminho) => this.copia_e_preenche_form_props_com_introspec_caminho(introspect_caminho))
  })
  novo_item_form() {
    this.add_um.value = true
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
    [...global_form_state_handler.state_as_Map.keys()]
      .filter(key => key.startsWith(introspect_caminho))
      .map(key => global_form_state_handler.state_as_Map.delete(key))

    delete this.buttons_refs[introspect_caminho];
  }
}

let inner_forms_handler: Inner_forms_handler

if (input.multiple) {
  inner_forms_handler = new Inner_forms_handler();
  if (!inner_forms_handler.form_components_props.value.length)
    inner_forms_handler.novo_item_form();

  watchEffect(() => {
    emits(
      'qtos_forms',
      {
        quem: props.field_name,
        qtos: inner_forms_handler.form_components_props.value.length
      }
    )
  })
}

function get_form_field_content(introspect_caminho: string) {
  const ppp = [
    ...global_form_state_handler.state_as_Map.keys()
  ].filter(i => i.startsWith(introspect_caminho)).slice(0, 5)
    .map(k => [k.split('.').pop(), global_form_state_handler.state_as_Map.get(k)?.value])

  if (!ppp || ppp.length <= 0) return

  const first = ppp[0]
  return first[1] ? first[1] : '(editando)'
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
      <li v-for="form, index in inner_forms_handler.form_components_props.value" class="nav-item position-relative"
        role="presentation" :key="form.introspection_caminho">
        <button @click="() => inner_forms_handler.remove_item(form.introspection_caminho)" type="button" role="button"
          class="z-3 position-absolute top-0 start-0 translate-middle badge border border-light rounded-circle bg-danger ">
          x
        </button>
        <button class="nav-link" :id="`${form.introspection_caminho}-tab`" data-bs-toggle="tab"
          :data-bs-target="`#${form?.introspection_caminho}`" type="button" role="tab"
          :aria-controls="`${form?.introspection_caminho}`" aria-selected="false" :class="index === 0 ? 'active' : ''"
          :ref="inner_forms_handler.buttons_refs[form.introspection_caminho]">
          {{ index + 1 }}: {{ get_form_field_content(form.introspection_caminho) ?? '(editando)' }}
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
      <div v-for="form, index in inner_forms_handler.form_components_props.value" class="tab-pane"
        :id="`${form.introspection_caminho}`" role="tabpanel" :aria-labelledby="`${form?.introspection_caminho}-tab`"
        :class="index === 0 ? 'active' : ''" :key="form.introspection_caminho">

        <Form v-bind="form" />
      </div>
    </div>
  </article>
</template>
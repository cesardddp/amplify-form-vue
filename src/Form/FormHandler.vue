<script setup lang="ts" >
import { computed, inject, markRaw, PropType, reactive, ref, shallowRef, toRef, watch } from "vue";
import Form from "./Form.vue";
import { FormSchema, FormSchemaValue } from "./parse-introspection";
import { FormStateHandler as GlobalFormStateHandler } from "./formStorage";
import { cloneDeep } from "lodash";
import { FormHandlerProps, FormProps } from "./types";


const props = defineProps<FormHandlerProps>()

const global_form_state_handler = (inject('form_state_handler') as GlobalFormStateHandler)

const input = inject<FormSchema>("form_types")!.get(props.form_name);
if (!input) throw new Error("Input Form não encontrado! Form.vue error");


// multiple logic:
class Inner_forms_handler {
    form_components_props = ref(
        new Map<number, FormProps|null>()
    );

    constructor() {
        let index_encontrados: string[] = []
        for (let key of global_form_state_handler.state_as_Map.keys()) {
            if (key.startsWith(props.introspection_caminho)) {

                const field = key.replace(props.introspection_caminho + '.', '')
                // debugger
                const index = field.split('.').shift()!
                // só pega o primeiro campo do subfor e ignora o subseuqantes
                // uma vez que `novo_item_form` já trata cada campo
                if (index_encontrados.includes(index)) continue
                index_encontrados.push(index)
                // subform ta com index errado do pai
                this.novo_item_form()
                //     // this.novo_item_form()
            }
        }
        this.form_components_props.value.size || this.set_form_item()
    }

    index_disponivel() {
        let [key,value] = [-1,undefined as unknown]
        for([key,value] of this.form_components_props.value.entries()){
            if(value===null)return key
        }
        return key+1
        return this.form_components_props.value.size
    }
    set_form_item() {
        const index_key = this.index_disponivel();
        const _introspection_caminho = `${props.introspection_caminho}.${index_key}`
        const form_prop: FormProps = {
            form_type: input!,
            is_multipleform_item: true,
            introspection_caminho: _introspection_caminho,
            form_name: props.form_name,
            form_fields_gbl_state_unseters: []
        }
        props.form_fields_gbl_state_unseters?.push(form_prop.form_fields_gbl_state_unseters!)

        form_prop.form_type.form_fields = form_prop.form_type.form_fields.map(ff => {
            const form_component_info = { ...ff.form_component_info };
            form_component_info.props.introspect_caminho = `${_introspection_caminho}.${form_component_info.props.nome}`;

            return {
                nome: ff.nome,
                kind: ff.kind,
                form_component_info
            }
        })


        this.form_components_props.value.set(index_key, form_prop);
    }

    novo_item_form() {
        this.set_form_item()
    }
    remove_item(index_key: number) {
        this.form_components_props.value.get(index_key)!
            .form_fields_gbl_state_unseters!
            .flat()
            .map(i => {
                if(Array.isArray(i))throw new Error("flat não funcionou");
                i()
            })
        this.form_components_props.value.set(index_key, null)
        // this.form_components_props.value.delete(index_key); //tiro do map de items
    }
}
let inner_forms_handler: Inner_forms_handler
if (input.multiple) {
    inner_forms_handler = new Inner_forms_handler()
}
function get_5_form_fields(introspect_caminho: string) {
    const ppp = [
        ...global_form_state_handler.state_as_Map.keys()
    ].filter(i => i.startsWith(introspect_caminho)).slice(0, 5)
        .map(k => [k.split('.').pop(), global_form_state_handler.state_as_Map.get(k)?.value])
    // debugger
    return ppp
}
</script>
<template>
    <Form v-if="!input.multiple" v-bind="{
        form_name,
        form_type: input,
        introspection_caminho,
        is_multipleform_item,
        form_fields_gbl_state_unseters
    }" />
    <article v-else>


        <div v-for="[key, form], index in inner_forms_handler.form_components_props.value.entries()" :key="key"
            class="accordion accordion-flush border border-top-0 rounded m-1 px-1 pb-1" :id="introspection_caminho + key">
            <div v-if="form" class="accordion-item" :key="introspection_caminho + key">
                <h2 class="accordion-header position-relative" id="headingOne">
                    <button class="accordion-button collapsed " type="button" data-bs-toggle="collapse"
                        :data-bs-target="'#' + index" aria-expanded="false" :aria-controls="index.toString()">
                        {{ index }} -

                        <span v-for="[k, v] in get_5_form_fields(form.introspection_caminho)"
                            class="badge border text-dark border-success fs-6 mx-1">
                            {{ k }}: <span> {{ v ? v : 'vazio' }} </span>
                        </span>


                    </button>
                    <button @click="() => inner_forms_handler.remove_item(key)" type="button" role="button"
                        class="btn-close fs-6 z-3 position-absolute top-0 start-0 border rounded translate-middle bg-danger">
                    </button>
                </h2>
                <div :id="index.toString()" class="accordion-collapse collapse" aria-labelledby="headingOne"
                    :data-bs-parent="'#' + introspection_caminho + key">
                    <div class="accordion-body">
                        <div class="align-middle col-1 d-flex align-items-center text-6">
                        </div>
                        <Form v-bind="form" :key="form.introspection_caminho" />
                    </div>
                </div>
            </div>
        </div>


        <div class="text-end">
            <i @click="() => inner_forms_handler.novo_item_form()" type="button"
                class="border rounded bg-success border-success text-center text-light bi bi-plus m-2 me-3 px-2">
                adicionar {{ field_name }}
            </i>
        </div>
    </article>
</template>
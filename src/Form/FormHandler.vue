<script setup lang="ts" >
import { computed, ComputedRef, inject, markRaw, PropType, reactive, Ref, ref, shallowRef, toRef, watch } from "vue";
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
    form_components_props = reactive(
        new Map<number, FormProps | null>()
    )
    change_tracker_form_components_props = 1

    inner_form_list = computed(() => {
        this.change_tracker_form_components_props = 1;
        const k = [
            ...this.form_components_props.entries()
        ].filter(
            ([key, form]) => form != null
        )
        return k
    })

    selected = ref(0)

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
        this.form_components_props.size || this.set_form_item()
    }

    index_disponivel() {
        let [key, value] = [-1, undefined as unknown]
        for ([key, value] of this.form_components_props.entries()) {
            if (value === null) return key
        }
        return key + 1
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


        this.form_components_props.set(index_key, form_prop);
    }

    novo_item_form() {
        this.set_form_item()
        this.selected.value = this.index_disponivel() - 1
        this.change_tracker_form_components_props += 1
    }
    remove_item(index_key: number) {
        this.form_components_props.get(index_key)!
            .form_fields_gbl_state_unseters!
            .flat()
            .map(i => {
                if (Array.isArray(i)) throw new Error("flat não funcionou");
                i()
            })
        this.form_components_props.set(index_key, null)
        this.change_tracker_form_components_props += 1
        // this.form_components_props.delete(index_key); //tiro do map de items
    }

}
let inner_forms_handler: Inner_forms_handler
let formulario_em_visualizacao: ComputedRef<FormProps>

if (input.multiple) {
    inner_forms_handler = new Inner_forms_handler()
    formulario_em_visualizacao = computed(
        () => inner_forms_handler.form_components_props.get(inner_forms_handler.selected.value)!
    )

}

function get_5_form_fields(introspect_caminho: string) {
    const ppp = [
        ...global_form_state_handler.state_as_Map.keys()
    ].filter(i => i.startsWith(introspect_caminho)).slice(0, 5)
        .map(k => [k.split('.').pop(), global_form_state_handler.state_as_Map.get(k)?.value])
    // debugger
    if (!ppp || ppp.length <= 0) return

    const first = ppp[0]
    return first[1]
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
        <!-- Nav tabs -->

        <!-- Nav tabs -->
        <ul class="nav nav-tabs" id="myTab" role="tablist">
            <li v-for="[key, form], index in inner_forms_handler.inner_form_list.value" class="nav-item position-relative"
                role="presentation">
                <button @click="() => inner_forms_handler.remove_item(key)" type="button" role="button"
                    class="z-3 position-absolute top-0 start-0 translate-middle badge border border-light rounded-circle bg-danger ">
                    x
                </button>
                <button class="nav-link" :id="`${form?.introspection_caminho}-tab`" data-bs-toggle="tab"
                    :data-bs-target="`#${form?.introspection_caminho}`" type="button" role="tab"
                    :aria-controls="`${form?.introspection_caminho}`" aria-selected="false">{{
                        `${form?.introspection_caminho}` }}</button>

            </li>
            <li class="nav-item nav-link " type="button" role="tab" aria-selected="true">
                <i @click="() => inner_forms_handler.novo_item_form()" type="button" class="bi bi-plus">
                </i>
            </li>
        </ul>

        <!-- Tab panes -->
        <div class="tab-content">
            <div v-for="[key, form], index in inner_forms_handler.inner_form_list.value" class="tab-pane"
                :id="`${form?.introspection_caminho}`" role="tabpanel"
                :aria-labelledby="`${form?.introspection_caminho}-tab`">
                <!-- {{ `${form?.introspection_caminho}` }}  -->
                <Form v-bind="form!" :key="form!.introspection_caminho" />
            </div>
        </div>

        <!-- <Form v-bind="form!" :key="form!.introspection_caminho" /> -->



    </article>
</template>
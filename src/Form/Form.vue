<script setup lang="ts" >
import { PropType, reactive, ref } from "vue";
import Form from "./Form.vue";
import { FormSchemasMap } from "./parse-introspection";
import { FormProps } from "./formTypes";
import FormHandler from "./FormHandler.vue";


const props = defineProps<FormProps>()

const input = props.form_type;
if (!input) throw new Error("Input Form não encontrado! Form.vue error");

const sub_forms = reactive({
    nav_forms: input.sub_forms,
    filho: undefined as (typeof input.sub_forms)[number] | undefined,
    index_desse_form: props.is_multipleform_item ? props.introspection_caminho.at(-1) : -1,
    select(filho: (typeof input.sub_forms)[number]) {
        this.filho = filho === this.filho ? undefined : filho
    }
})

const set_opacity = ref(false)
const qtd_itens_dos_multiplos = reactive(new Map)
function set_qtd_itens(e: {
    quem: string,
    qtos: number
}) {
    qtd_itens_dos_multiplos.set(e.quem, e.qtos)
}
</script>
<template>
    <!-- ITEM FIELDS -->
    <div role="form" :class="set_opacity ? 'opacity-50' : ''">
        <div @click="set_opacity = false">
            <component v-for="form_field, index in input.form_fields" :is="form_field.form_component_info.is" class="my-1"
                v-bind="form_field.form_component_info.props"
                v-bind:introspect_caminho="`${introspection_caminho}.${form_field.nome}`"
                :key="form_field.form_component_info.props.introspect_caminho"
                >
            </component>
        </div>
    </div>

    <!-- SUBFORM NAVBAR -->
    <div v-if="sub_forms.nav_forms.length" @click="set_opacity = true">
        <nav class="nav nav-tabs mt-1" id="sub_forms" role="tablist">
            <li class="nav-item" role="presentation" v-for="filho in sub_forms.nav_forms">
                <button class="nav-link position-relative" @click="sub_forms.select(filho)" :id="filho.name + '-tab'"
                    data-bs-toggle="tab" :data-bs-target="'#' + filho.name" type="button" role="tab"
                    :aria-controls="filho.name" aria-selected="true"
                    :class="sub_forms.filho?.name === filho.name ? 'active' : ''">
                    {{ filho.name }}
                    <span v-if="filho.multiple"
                        class="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                        {{ qtd_itens_dos_multiplos.get(filho.name) ?? 0 }}
                        <span class="visually-hidden">unread messages</span>
                    </span>
                </button>
            </li>
        </nav>

    </div>
    <!-- CURRENT SUBFORM SELECTED -->
    <section @click="set_opacity = true" v-if="sub_forms.filho" class="col border border-top-0 p-1"
        :class="set_opacity ? 'opacity-100' : 'opacity-50'">
        <div class="tab-pane active" :id="sub_forms.filho.name" role="tabpanel"
            :aria-labelledby="sub_forms.filho.name + '-tab'">
            <FormHandler :introspection_caminho="`${introspection_caminho}.${sub_forms.filho.name}`"
                :form_name="sub_forms.filho.type" :key="sub_forms.filho.type" :is_multipleform_item="true"
                :field_name="sub_forms.filho.name" 
                @qtos_forms="set_qtd_itens" />
        </div>
    </section>
</template>
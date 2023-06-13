<script setup lang="ts" >
import { computed, inject, reactive, ref, watch } from "vue";
import { FormProps, Validacao } from "./formTypes";
import FormHandler from "./FormHandler.vue";
import FormFieldEditor from "./FormsElements/controlador.vue";
import { FormStylingHandler } from "./formStorage";

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
const edit_mode = ref(false)
const formStylingHandler = inject<FormStylingHandler>("form_styling_handler")
const form_fields = computed(() => input.form_fields.filter(
    form_field => {
        return edit_mode.value || !(formStylingHandler?.get_field_references(
            `${props.introspection_caminho}.${form_field.nome}`
        ).nao_usar.value ?? false)
    }
))
const validacao = inject<Validacao>("validacao")!
const formElement = ref<HTMLFormElement>()
watch(()=>validacao.trigger_validacao, () => {
    if (validacao.trigger_validacao) {
        const v = formElement.value!.reportValidity()
        
        validacao.validado = validacao.validado && v
        // formElement.value.
        if (!v) {
            // alert(props.introspection_caminho)
            validacao.validacoes.push({
                elemento: props.introspection_caminho,
                erros: ["?"]
            })
        }
    }
})
</script>
<template>
    <!-- {{ validacao }} -->
    <div class="btn-group dropstart">
        <button class="btn btn-sm" type="button" data-bs-toggle="dropdown" aria-expanded="false">
            ...
        </button>
        <ul class="dropdown-menu ">
            <li @click="edit_mode = !edit_mode" class="dropdown-item">Modo de edição</li>
        </ul>
    </div>
    <button v-if="edit_mode" class="btn btn-outline-danger btn-sm" type="button" @click="edit_mode = false">
        X Fechar edição
    </button>
    <!-- ITEM FIELDS -->
    <form ref="formElement" role="form" :class="{'opacity-50':set_opacity,'was-validated':validacao.trigger_validacao}">
        <div @click="set_opacity = false" class="my-1" v-for="form_field in form_fields">
            <FormFieldEditor v-if="edit_mode" :introspect_caminho="`${introspection_caminho}.${form_field.nome}`">
                <component :is="form_field.form_component_info.is" v-bind="form_field.form_component_info.props"
                    v-bind:introspect_caminho="`${introspection_caminho}.${form_field.nome}`">
                </component>
            </FormFieldEditor>
            <div v-else>
                <component :is="form_field.form_component_info.is" v-bind="form_field.form_component_info.props"
                    v-bind:introspect_caminho="`${introspection_caminho}.${form_field.nome}`">
                </component>
            </div>
        </div>
    </form>

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
                :field_name="sub_forms.filho.name" @qtos_forms="set_qtd_itens" />
        </div>
    </section>
</template>
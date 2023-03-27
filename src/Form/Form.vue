<script setup lang="ts" >
import { PropType, reactive } from "vue";
import Form from "./Form.vue";
import { FormSchema } from "./parse-introspection";
import { FormProps } from "./types";
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
console.log();

</script>
<template>
    <!-- META INFO -->
    <!-- <h4>{{ form_name }}</h4> -->
    <!-- <span class="badge bg-danger mx-1"> {{ input.multiple ? 'multiple' : 'não-multiple' }} </span> -->
    <!-- <p v-if="input.sub_forms.length > 0"> -->
    <!-- subforms: -->
    <!-- <span class="badge bg-primary mx-1" v-for="filho in input.sub_forms"> -->
    <!-- {{ filho.name }} -->
    <!-- </span> -->
    <!-- </p> -->

    <!-- MULTIPLE ITEMS -->
    <!-- ITEM FIELDS -->
    <component v-for="form_field, index in input.form_fields" :is="form_field.form_component_info.is"
        v-bind="form_field.form_component_info.props"
        v-bind:introspect_caminho="`${introspection_caminho}.${form_field.nome}`"
        :key="form_field.form_component_info.props.introspect_caminho"
        v-bind:form_fields_gbl_state_unseters="form_fields_gbl_state_unseters">
    </component>

    <!-- ITEM SUBFORMS -->
    <article v-if="sub_forms.nav_forms.length" id="subforms">


        <!-- SUBFORM NAVBAR -->
        <nav class="nav nav-tabs mt-1" id="sub_forms" role="tablist">
            <li class="nav-item" role="presentation" v-for="filho in sub_forms.nav_forms">
                <button class="nav-link" @click="sub_forms.select(filho)" :id="filho.name + '-tab'" data-bs-toggle="tab"
                    :data-bs-target="'#' + filho.name" type="button" role="tab" :aria-controls="filho.name"
                    aria-selected="true" :class="sub_forms.filho?.name === filho.name ? 'active' : ''">
                    {{ filho.name }}
                </button>
            </li>
        </nav>

        <!-- CURRENT SUBFORM SELECTED -->
        <section v-if="sub_forms.filho" class="col border border-top-0 p-1">
            <div class="tab-pane active" :id="sub_forms.filho.name" role="tabpanel"
                :aria-labelledby="sub_forms.filho.name + '-tab'">
                <FormHandler :introspection_caminho="`${introspection_caminho}.${sub_forms.filho.name}`"
                    :form_name="sub_forms.filho.type" :key="sub_forms.filho.type" :is_multipleform_item="true"
                    :field_name="sub_forms.filho.name"
                    :form_fields_gbl_state_unseters="form_fields_gbl_state_unseters"
                    />
            </div>
        </section>
    </article>
</template>
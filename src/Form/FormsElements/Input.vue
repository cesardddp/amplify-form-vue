<script setup lang="ts">
import { Input } from "@syncfusion/ej2-inputs";
import { onMounted, ref, computed, inject, onUnmounted } from "vue";
import { FormStateHandler } from "../formStorage";
import type { InputProps, Validacoes } from "./elementsTypes";
import { Tooltip } from "bootstrap";

const props = withDefaults(defineProps<InputProps>(), {
    bootstrap_syncfusion: 'bs',
    type: 'text',
    bs_class_wrap: '',
    bs_class_input: '',
    bs_class_label: '',
    description: 'Sem descrição.'
})

console.log('injecting: ' + props.introspect_caminho);
if (!props.introspect_caminho)
    throw new Error(`Não foi passado introspect_caminho em ${props.nome}: ${props.introspect_caminho} `);

const global_form_state_handler = (inject('form_state_handler') as FormStateHandler)
const _ref = global_form_state_handler.state_as_Map.get(props.introspect_caminho) ??
    global_form_state_handler.addRef(props.introspect_caminho, false)

const value = computed({
    get() {
        return _ref.value
    },
    set(value) {
        _ref.value = value
    }
})
const validacao = computed(() => {
    let valid_feedback_msg: string[] = [];
    let invalid_feedback_msg: string[] = [];
    let validou = false;
    let validacoes: Validacoes = {
        required: false,
        minlength: undefined,
        maxlength: undefined,
    }
    props.validacoes?.forEach(v => {
        switch (v) {
            case 'required':
                invalid_feedback_msg.push('Por favor, preencha esse campo!')
                validacoes.required = true
                break;
            case v.match(/minlength:[0-9]*/)?.input:
                debugger
                validacoes.minlength = parseInt(
                    v.replace("minlength:", '')
                )
                break;
            case v.match(/maxlength:[0-9]*/)?.input:
                debugger
                validacoes.maxlength = parseInt(
                    v.replace("maxlength:", '')
                )
                break;
            default:
                throw new Error("Validador Inválido: " + v);
        }
    })

    return {
        valid_feedback_msg,
        invalid_feedback_msg,
        validacoes
    }
})
const cssSFClass = computed(
    () => {
        const cssSyncFusion = props.cssSFClass ? props.cssSFClass : 'e-primary';

        return (cssSyncFusion + ' ' + props.bs_class_input).trim().replace(/ +(?= )/g, '')
    }
    //a regex -> https://stackoverflow.com/questions/3286874/remove-all-multiple-spaces-in-javascript-and-replace-with-single-space
)
const bs_class_wrap = computed(() => {
    let base_wrap = '';

    switch (props.type) {
        case 'checkbox':
            base_wrap = 'form-checkbox'
            break;
        case 'text':
        case 'number':
            base_wrap = 'form-floating'
            break;

        default:
            break;
    }
    return base_wrap + ' ' + props.bs_class_wrap
}
)
const bs_class_label = computed(
    () => (props.type === 'checkbox' ? 'form-check-label' : '') + ' ' + props.bs_class_label
)
const bs_class_input = computed(
    () => {
        let base_input = '';
        switch (props.type) {
            case 'checkbox':
                base_input = 'form-check-input'
                break;
            case 'text':
            case 'number':
                base_input = 'form-control'
                break;

            default:
                break;
        }
        return base_input + ' ' + props.bs_class_input
    }
)
const safeFieldSize = ref('md');//fieldSizeMap.get(fieldSize) ? fieldSize : 'md';        
// return {
//     value,
//     validacao,
//     bs_class_wrap,
//     bs_class_input,
//     bs_class_label,
//     type: props.type,
//     placeholder: props.bootstrap_syncfusion,
//     bootstrap_syncfusion: props.bootstrap_syncfusion,
//     nome: props.nome,
//     step: props.step,
//     disabled: props.disabled,
//     label: props.label,
//     cssSFClass: props.cssSFClass,
//     is_text_area: props.is_text_area,
//     floatLabelType: props.floatLabelType,
//     currency: props.currency
// }
//     },
// })



const this_input = ref();
onMounted(() => {
    new Tooltip(this_input.value!, {
        container: 'body',
        trigger: 'hover',
        placement: 'left'
    });
    if (props.focus_on_mount) {
        this_input.value.focus();
    }
});

</script>
<template>
    <div v-if="bootstrap_syncfusion === 'bs'">

        <div :class="bs_class_wrap">

            <input :class="bs_class_input" v-model="value" :type='type' :id="introspect_caminho" :name="introspect_caminho"
                :placeholder="placeholder ?? 'Insira ' + nome" :step="step" :disabled="disabled"
                :required="validacao.validacoes.required" :minlength="validacao.validacoes.minlength"
                :maxlength="validacao.validacoes.maxlength" data-bs-toggle="tooltip" :title="description" ref="this_input">

            <label data-bs-toggle="popover" data-bs-trigger="hover" :class="bs_class_label" :for="introspect_caminho">{{
                label }}</label>
            <div class="valid-feedback"></div>
            <div class="invalid-feedback">
                <p v-for="m in validacao.invalid_feedback_msg">{{ m }}</p>
            </div>
        </div>
    </div>
    <div v-else-if="bootstrap_syncfusion === 'sf'">
        <div v-if="type === 'checkbox'" :class="bs_class_wrap">
            <ejs-checkbox :label='label' :cssClass='cssSFClass' v-model="value" :disabled="disabled"></ejs-checkbox>
        </div>
        <div v-else-if="type === 'text'" :class="bs_class_wrap">
            <ejs-textbox :cssclass="bs_class_input" :name='introspect_caminho' :multiline="is_text_area"
                :placeholder="placeholder ? placeholder : nome" v-model="value" :floatLabelType="floatLabelType"
                :disabled="disabled" :cssClass='cssSFClass'></ejs-textbox>

        </div>
        <div v-else-if="type === 'number'" :class="bs_class_wrap">
            <ejs-numerictextbox :label='label' :cssClass='cssSFClass' v-model="value" :disabled="disabled"
                :currency="currency"></ejs-numerictextbox>
        </div>
    </div>
    <div v-else>Error</div>
</template>

<style>
/* .e-checkbox-wrapper {
    margin-top: 18px;
} */

.e-checkbox-wrapper.e-primary:hover .e-frame.e-check {
    /* csslint allow: adjoining-classes */
    background-color: #e03872;
}

.e-checkbox-wrapper.e-success .e-frame.e-check,
.e-checkbox-wrapper.e-success .e-checkbox:focus+.e-frame.e-check {
    /* csslint allow: adjoining-classes */
    background-color: #689f38;
}

.e-checkbox-wrapper.e-success:hover .e-frame.e-check {
    /* csslint allow: adjoining-classes */
    background-color: #449d44;
}

.e-checkbox-wrapper.e-info .e-frame.e-check,
.e-checkbox-wrapper.e-info .e-checkbox:focus+.e-frame.e-check {
    /* csslint allow: adjoining-classes */
    background-color: #2196f3;
}

.e-checkbox-wrapper.e-info:hover .e-frame.e-check {
    /* csslint allow: adjoining-classes */
    background-color: #0b7dda;
}

.e-checkbox-wrapper.e-warning .e-frame.e-check,
.e-checkbox-wrapper.e-warning .e-checkbox:focus+.e-frame.e-check {
    /* csslint allow: adjoining-classes */
    background-color: #ef6c00;
}

.e-checkbox-wrapper.e-warning:hover .e-frame.e-check {
    /* csslint allow: adjoining-classes */
    background-color: #cc5c00;
}

.e-checkbox-wrapper.e-danger .e-frame.e-check,
.e-checkbox-wrapper.e-danger .e-checkbox:focus+.e-frame.e-check {
    /* csslint allow: adjoining-classes */
    background-color: #d84315;
}

.e-checkbox-wrapper.e-danger:hover .e-frame.e-check {
    /* csslint allow: adjoining-classes */
    background-color: #ba3912;
}
</style>
<script  lang="ts">
import { Input } from "@syncfusion/ej2-inputs";
import { ref, computed, PropType, defineComponent,defineEmits, inject, Ref } from "vue";
import { OpcoesValidacoes, SubmitButtonProps } from "../types";
type Validacoes = {
    required: boolean;
    minlength?: number;
    maxlength?: number;
}
export type InputProps = {
    entity:string;
    nome: string;
    label?: string;
    type?: 'text' | 'number' | 'checkbox',
    disabled?: boolean;
    bs_class_wrap?: string;
    bs_class_input?: string;
    bs_class_label?: string;
    bootstrap_syncfusion?: 'bs' | 'sf';
    placeholder?: string;
    validacoes?: OpcoesValidacoes[];
    // checkbox
    //sf
    cssSFClass?: string | "e-primary" | "e-success" | "e-info" | "e-warning" | "e-danger";
    //number
    step?: string,
    //sf
    currency?: 'BRL' | 'EUR' | 'USD', // TODO adicionar mais opções https://pt.wikipedia.org/wiki/ISO_4217
    //
    //sf 
    is_text_area?: boolean,
    floatLabelType?: "Auto" | "Always" | "Never";
    // default: string | number | boolean;
    // modelValue: any// string //| number | boolean

}
export default defineComponent({
    props: {
        cpn_props: {
            type: Object as PropType<InputProps>,
            default: {
                bootstrap_syncfusion: 'bs',
                type: 'text',
                bs_class_wrap: '',
                bs_class_input: '',
                bs_class_label: '',
            }
        },
    },
    emits:['update:modelValue'],
    setup(props, ctx) {
        let _ref = inject(props.cpn_props.entity+'_'+props.cpn_props.nome) as Ref
        // debugger
        console.log('injecting: '+props.cpn_props.entity+'_'+props.cpn_props.nome);
        
        const value = computed({
            get() {
                // return props.cpn_props.modelValue
                return _ref.value
            },
            set(value) {
                _ref.value = value
                // ctx.emit('update:modelValue', value)
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
            props.cpn_props.validacoes?.forEach(v => {
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
                const cssSyncFusion = props.cpn_props.cssSFClass ? props.cpn_props.cssSFClass : 'e-primary';

                return (cssSyncFusion + ' ' + props.cpn_props.bs_class_input).trim().replace(/ +(?= )/g, '')
            }
            //a regex -> https://stackoverflow.com/questions/3286874/remove-all-multiple-spaces-in-javascript-and-replace-with-single-space
        )
        const bs_class_wrap = computed(() => {
            let base_wrap = '';

            switch (props.cpn_props.type) {
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
            return base_wrap + ' ' + props.cpn_props.bs_class_wrap
        }
        )
        const bs_class_label = computed(
            () => (props.cpn_props.type === 'checkbox' ? 'form-check-label' : '') + ' ' + props.cpn_props.bs_class_label
        )
        const bs_class_input = computed(
            () => {
                let base_input = '';
                switch (props.cpn_props.type) {
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
                return base_input + ' ' + props.cpn_props.bs_class_input
            }
        )
        const safeFieldSize = ref('md');//fieldSizeMap.get(fieldSize) ? fieldSize : 'md';        
        return {
            value,
            validacao,
            bs_class_wrap,
            bs_class_input,
            bs_class_label,
            type:props.cpn_props.type,
            placeholder: props.cpn_props.bootstrap_syncfusion,
            bootstrap_syncfusion: props.cpn_props.bootstrap_syncfusion,
            nome: props.cpn_props.nome,
            step: props.cpn_props.step,
            disabled: props.cpn_props.disabled,
            label: props.cpn_props.label,
            cssSFClass:props.cpn_props.cssSFClass,
            is_text_area:props.cpn_props.is_text_area,
            floatLabelType:props.cpn_props.floatLabelType,   
            currency:props.cpn_props.currency
        }
    },
})



</script>
<template>
<!-- <p>type:{{type}}</p> -->
<!-- <p>placeholder:{{placeholder}}</p> -->
<!-- <p>bootstrap_syncfusion:{{bootstrap_syncfusion}}</p> -->
<!-- <p>nome:{{nome}}</p> -->
<!-- <p>step:{{step}}</p> -->
<!-- <p>disabled:{{disabled}}</p> -->
<!-- <p>label:{{label}}</p> -->
<!-- <p>bs_class_wrap:{{bs_class_wrap}}</p> -->
<!-- <p>bs_class_input:{{bs_class_input}}</p> -->
<!-- <p>bs_class_label:{{bs_class_label}}</p> -->
<!-- <p>cssSFClass:{{cssSFClass}}</p> -->
<!-- <p>is_text_area:{{is_text_area}}</p> -->
<!-- <p>floatLabelType:{{floatLabelType}}</p> -->
<!-- <p>currency:{{currency}}</p> -->
    <div v-if="bootstrap_syncfusion === 'bs'">
        <div :class="bs_class_wrap">
            <input :class="bs_class_input" v-model="value" :type='type' :id="nome" :name="nome"
                :placeholder="placeholder ?? 'Insira ' + nome" :step="step" :disabled="disabled"
                :required="validacao.validacoes.required" :minlength="validacao.validacoes.minlength"
                :maxlength="validacao.validacoes.maxlength">
            <label :class="bs_class_label" :for="nome">{{ label }}</label>
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
            <ejs-textbox :cssclass="bs_class_input" :name='nome' :multiline="is_text_area"
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
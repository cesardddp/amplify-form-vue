<script setup lang="ts">
import { Popover, Tooltip } from "bootstrap";
import { computed, inject, onMounted, onUnmounted, ref, toRef, watch } from "vue";
import { FormStateHandler, FormStylingHandler } from "../formStorage";
import type { SelectProps } from "./elementsTypes";


const props = withDefaults(defineProps<SelectProps>(), {
    description: 'Sem descrição'
})

console.log('injecting: ' + props.introspect_caminho);
if (!props.introspect_caminho)
    throw new Error(`introspect_caminho em ${props.nome} invalido: ${props.introspect_caminho} `);


const bs_classes = await (inject("form_styling_handler") as FormStylingHandler).get_field_references(props.introspect_caminho)!;

const global_form_state_handler = (inject('form_state_handler') as FormStateHandler)
const value = global_form_state_handler.getField(props.introspect_caminho)

type Validacoes = {// TODO tirar isso para fora, como syncfusion
    required: boolean;
    minlength?: number;
    maxlength?: number;
}
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






// debugger
//   fieldSize,
//   theme,
//   placeholder = '',
//   options,
//   selectLabel = 'Select',
//   multiple,
//   ...rest

// }) => {
//   const fieldname = rest.name;
//   const safeSize = props.selectfieldSize
//     ? fieldSizeMap.get(props.fieldSize)
//       ? props.fieldSize
//       : undefined
//     : undefined;
//   const adaptiveFieldSize = safeSize || (multiple ? '2xl' : 'md');

//   const color =
//     theme?.branding == 'full'
//       ? chroma(optionColorMap.get(theme?.color)!)
//       : chroma('#9ca3af');
//   const customStyles: StylesConfig<Option, true> = {
//     control: styles => ({
//       ...styles,
//       backgroundColor: 'transparent',
//       border: 0,
//       boxShadow: 'transparent',
//     }),
//     option: (styles, { isFocused, isSelected }) => ({
//       ...styles,
//       'backgroundColor': isSelected
//         ? color.css()
//         : isFocused
//         ? color.alpha(0.1).css()
//         : undefined,
//       ':active': {
//         ...styles[':active'],
//         backgroundColor: isSelected ? color.css() : color.alpha(0.3).css(),
//       },
//     }),
//     input: styles => ({
//       ...styles,
//       backgroundColor: 'transparent',
//     }),
//     placeholder: styles => ({
//       ...styles,
//       color: 'black',
//     }),
//   };

// const validate = (value: FormValues) => {
//     if (value[fieldname] == '') {
//         return 'Required';
//     }
//     return;
// };

// const [{ name, onChange, ...otherFieldProps }, , { setValue }] = useField<
//     MultiValue<Option>
// >({
//     validate,
//     ...rest,
// });

const this_select = ref();
onMounted(() => {
    new Tooltip(this_select.value!, {
        container: 'body',
        trigger: 'hover',
        placement: 'left'
    });
    if (props.focus_on_mount) {
        this_select.value.focus();
    }
});

</script>
<template>
    <!-- <FieldWithError props.fieldSize={adaptiveFieldSize} theme={theme} {...rest}> -->
    <!-- <div
data-testid={`${fieldname}-sizing-div`}
className={`${selectStyle} ${fieldSizeMap.get(adaptiveFieldSize)}`}>
<ReactSelect
    className='peer'
    styles={customStyles}
    options={options}
    isMulti={multiple || undefined}
    isSearchable={false}
    placeholder={selectLabel}
    onChange={values => setValue(values)}
    {...otherFieldProps}
/> 
</div>
-->

    <!-- :styles="{{ customStyles }}" -->
    <!-- </FieldWithError> -->

    <div class="form-floating" :class="bs_classes.bs_class_wrap" data-bs-toggle="tooltip" :title="description"
        ref="this_select">
        <select class="form-select" :name="nome" :id="introspect_caminho" v-model="value" aria-label="Floating label select"
            :class="bs_classes.bs_class_input" :required="validacao.validacoes.required">
            <option selected value="">Selecione uma opção...</option>
            <option v-for="op, index in options" :value="op.value" :key="index">{{ op.label ?? op.value }}</option>
        </select>
        <label :for="introspect_caminho" class="form-label" :class="bs_classes.bs_class_label">{{ label ?? nome }}</label>
    </div>
</template>
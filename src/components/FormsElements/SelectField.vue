<script lang="ts">
import { PropType, Ref, computed, defineComponent, inject, ref, toRef } from "vue";
import { OpcoesValidacoes } from "../types";

export type SelectProps = {
    options: {
        label?: string;
        value: string;
    }[],
    entity:string;
    nome: string,
    label?: string,
    labelCentered?: boolean,
    isSubmitting?: boolean,
    selectedValue?: string,
    // fieldSize?: FieldSize;
    // theme?: FormTheme;
    // modelValue?: Ref<string | number | boolean>,
    validacoes: OpcoesValidacoes[];

}


export default defineComponent({
    props: {
        cpn_props: {
            type: Object as PropType<SelectProps>,
            default: {
                bootstrap_syncfusion: 'bs',
                type: 'select',
                bs_class_wrap: '',
                bs_class_input: '',
                bs_class_label: '',
            }
        }
    },
    emits: ['update:modelValue'],
    setup(props, ctx) {
        let _ref = inject(props.cpn_props.entity + '_' + props.cpn_props.nome) as Ref
        // debugger
        console.log('injecting: ' + props.cpn_props.entity + '_' + props.cpn_props.nome);
        const value = computed({
            get() {
                // return props.cpn_props.modelValue
                return _ref.value
            },
            set(value) {
                _ref.value=value
                // ctx.emit('update:modelValue', value)
            }
        })
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
            props.cpn_props.validacoes.forEach(v => {
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
        return {
            nome: props.cpn_props.nome,
            label: props.cpn_props.label,
            labelCentered: props.cpn_props.labelCentered,
            isSubmitting: props.cpn_props.isSubmitting,
            selectedValue: props.cpn_props.selectedValue,
            // modelValue: props.cpn_props.modelValue,
            options: props.cpn_props.options,
            validacao,
            value
        }

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


    <div class="form-floating">
        <select class="form-select" :name="nome" :id="nome" v-model="value" aria-label="Floating label select"
            :required="validacao.validacoes.required">
            <option   selected value="">Selecione uma opção...</option>
            <option v-for="op in options" :value="op.value">{{ op.label ?? op.value }}</option>
        </select>
        <label :for="nome" class="form-label">{{ label?? nome }}</label>
    </div>
</template>
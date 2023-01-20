<script lang="ts">
// export interface FieldProps {// extends HTMLProps<HTMLInputElement> {
//     nome: string;
//     label?: string;
//     labelCentered?: boolean;
//     // fieldSize?: FieldSize;
//     // theme?: FormTheme;
//     isSubmitting?: boolean;
//     selectedValue?: string;
// }

// export interface Option {
//     label?: string;
//     value: string;
// }
// export interface SelectFieldProps {
//     options: {label?: string;
//     value: string;}[],
//     nome: string,
//     label?: string,
//     labelCentered?: boolean,
//     isSubmitting?: boolean,
//     selectedValue?: string,
//     // fieldSize?: FieldSize;
//     // theme?: FormTheme;
//     modelValue: string | number | boolean

// }

// interface Props extends SelectFieldProps {
// }
</script>
<script setup lang="ts">
import { computed, ref, toRef } from "vue";
// import { SelectFieldProps as SelectFieldPropsSource } from "../../types";

// interface SelectFieldProps extends SelectFieldPropsSource { }





const props = withDefaults(defineProps<{
    options: {
        label?: string;
        value: string;
    }[],
    nome: string,
    label?: string,
    labelCentered?: boolean,
    isSubmitting?: boolean,
    selectedValue?: string,
    // fieldSize?: FieldSize;
    // theme?: FormTheme;
    modelValue?: string | number | boolean

}>(),
    {
        // bootstrap_syncfusion: 'bs',
        // type: 'select',
        // bs_class_wrap: '',
        // bs_class_input: '',
        // bs_class_label: '',
    })
const emit = defineEmits(['update:modelValue'])

const value = computed({
    get() {
        return props.modelValue
    },
    set(value) {
        emit('update:modelValue', value)
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
//   const safeSize = props.fieldSize
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
    <div class="mb-3 text-dark">
        <label :for="nome" class="form-label">{{ label?? nome }}</label>
        <select class="form-select form-select-lg" :name="nome" :id="nome" v-model="value">
            <option v-if="!modelValue" selected value="undefined">Selecione uma opção...</option>
            <option v-for="op in options" :value="op.value">{{ op.label ?? op.value }}</option>
        </select>
    </div>

</template>

<script setup lang="ts">
// import { FieldProps } from '../../types';

export interface FieldProps {// extends HTMLProps<HTMLInputElement> {
    nome: string;
    label?: string;
    labelCentered?: boolean;
    //   fieldSize?: FieldSize;
    //   theme?: FormTheme;
    isSubmitting?: boolean;
    selectedValue?: string;
}
export interface NumberFieldProps extends FieldProps {
    placeholder: string,
    step: number,
    nome: string;
    label?: string;
    // labelCentered?: boolean;
    //   fieldSize?: FieldSize;
    //   theme?: FormTheme;
    // isSubmitting?: boolean;
    // selectedValue?: string;

    
}

const props = defineProps<NumberFieldProps>(
    //     {
    //     name,µ
    //     theme,
    //     placeholder = ' ',
    //     step = 1,
    //     ...rest
    // }
)
// const safeFieldSize = fieldSizeMap.get(fieldSize) ? fieldSize : 'md';
// if (!fieldSizeMap.get(fieldSize)) {
//     const fieldSizeValues = Array.from(fieldSizeMap.keys());
//     console.warn(
//         `Problem in NumberField: fieldSize '${fieldSize}' is unknown, fieldSize is set to default : '${safeFieldSize}' (Possible fieldSize are : '${fieldSizeValues.join(
//             `', '`
//         )}')`
//     );
// }



</script>
<template>

    <!-- <FieldWithError // name={ name } // fieldSize={ safeFieldSize } // theme={ theme } // {...rest }> -->
    <!-- className={ -->
    <!-- `${fieldStyle} ${focusBorderColorMap.get( -->
    <!-- theme?.color -->
    <!-- )} ${fieldSizeMap.get(safeFieldSize)}` -->
    <!-- } -->
    <input type='number' :id="nome" :name="nome" :placeholder="placeholder" :step="step" />
    <!-- < /FieldWithError> -->

</template>
<script setup lang="ts">
import { ref } from 'vue';
// import { FieldProps } from '../types';
// import { TextAreaFieldProps,FieldProps } from '../types';

export interface FieldProps {// extends HTMLProps<HTMLInputElement> {
  name: string;
  label?: string;
  labelCentered?: boolean;
  //   fieldSize?: FieldSize;
  //   theme?: FormTheme;
  isSubmitting?: boolean;
  selectedValue?: string;
}

export interface TextAreaFieldProps extends FieldProps {
  fieldSize: '2xl' | string,
  placeholder: string,
  rows: number,
  cols: number,
  //   {...rest}


  name: string;
  label?: string;
  labelCentered?: boolean;
  //   fieldSize?: FieldSize;
  //   theme?: FormTheme;
  isSubmitting?: boolean;
  selectedValue?: string;


}

const props = defineProps<TextAreaFieldProps>()

//   const safeFieldSize = fieldSizeMap.get(fieldSize) ? fieldSize : '2xl';
// if (!fieldSizeMap.get(fieldSize)) {
//     const fieldSizeValues = Array.from(fieldSizeMap.keys());
//     console.warn(
//         `Problem in TextAreaField: fieldSize '${fieldSize}' is unknown, fieldSize is set to default : '${safeFieldSize}' (Possible fieldSize are : '${fieldSizeValues.join(
//             `', '`
//         )}')`
//     );





</script>
<template>

  <!-- <FieldWithError -->
  <!-- fieldSize={{safeFieldSize}} -->
  <!-- theme={{theme}} -->
  <!-- {...rest}> -->
  <!-- <label :for="name">{{ label }}
    <textarea :name="name" :id="name" :placeholder="placeholder" :cols="cols" :rows="rows"></textarea>
  </label> -->
  <div class="form-floating">
    <textarea class="form-control" :name="name" :id="name" :placeholder="placeholder" :cols="cols"
      :rows="rows"></textarea>
    <label :for="name">{{ label }}</label>
  </div>
  <!-- // className={`${fieldStyle} ${focusBorderColorMap.get( -->
  <!-- // theme?.color -->
  <!-- // )} ${fieldSizeMap.get(safeFieldSize)} focus:h-32`} -->

  <!-- // {...rest} -->
  <!-- // </FieldWithError> -->

</template>


<!-- <template>
  <div id ='wrap'>
      <div id ='input-container'>
          <div>
              <input class="e-input" type="text" placeholder="Enter Date" />
          </div>
      </div>
  </div>
  </template>
  <script>
  import Vue from 'vue';
  export default {
    name: 'wrap',
  }
  </script> -->
<script lang="ts">

export interface FieldProps {// extends HTMLProps<HTMLInputElement> {
    nome: string;
    label?: string;
    labelCentered?: boolean;
    //   fieldSize?: FieldSize;
    //   theme?: FormTheme;
    // isSubmitting?: boolean;
}

export interface CheckBoxFieldProps {// extends FieldProps {
    // labelCentered?: boolean;
    // isSubmitting?: boolean;
    //   fieldSize?: FieldSize;
    //   theme?: FormTheme;
    nome: string;
    label?: string;
    disabled?: boolean;
    cssSFClass?: string | "e-primary" | "e-success" | "e-info" | "e-warning" | "e-danger";
    bs_class_wrap?: string;
    bs_class_input?: string;
    bs_class_label?: string;
    bootstrap_syncfusion?: 'bs' | 'sf';
}

interface Props extends CheckBoxFieldProps {
    modelValue: boolean
}

</script>
<script setup lang="ts">
import { ref, computed } from "vue";



// const props = defineProps<CheckBoxFieldProps>()
const props = withDefaults(defineProps<Props>(),
    {
        bs_class: "m-1 p-1", bootstrap_syncfusion: 'bs', cssSFClass: "e-primary", disabled: false
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

const cssSFClass = computed(
    () => props.cssSFClass ? props.cssSFClass.trim().replace(/ +(?= )/g, '') : 'e-primary'
    //a regex -> https://stackoverflow.com/questions/3286874/remove-all-multiple-spaces-in-javascript-and-replace-with-single-space
)
const safeFieldSize = ref('md');//fieldSizeMap.get(fieldSize) ? fieldSize : 'md';
// if (!fieldSizeMap.get(fieldSize)) {
//     const fieldSizeValues = Array.from(fieldSizeMap.keys());
//     console.warn(
//         `Problem in CheckboxField: fieldSize '${fieldSize}' is unknown, fieldSize is set to default : '${safeFieldSize}' (Possible fieldSize are : '${fieldSizeValues.join(
//             `', '`ffd4544
//         )}')`
//     );
// }


</script>
<template>

    <div v-if="bootstrap_syncfusion === 'bs'" class="form-check" :class="bs_class_wrap">
        <input class="form-check-input" :class="bs_class_input" v-model="value" type='checkbox' :id="nome" :name="nome"
            :disabled="disabled">
        <label class="form-check-label" :class="bs_class_label" :for="nome">{{ label }}</label>
    </div>

    <div v-else :class="bs_class_wrap">
        <ejs-checkbox :label='label' :class="bs_class_input" :cssClass='cssSFClass' v-model="value"
            :disabled="disabled"></ejs-checkbox>
    </div>

    <!-- <FieldWithError    ''
        name= { name }
fieldSize = { safeFieldSize }  
theme = { theme }
labelCentered = { true}
{...rest }> -->
    <!-- <div
        data - testid={ `${name}-div` }
className = {`relative p-3 flex justify-center ${fieldSizeMap.get(
    safeFieldSize
)}`
}> -->
    <!-- <div>
        <label :for="name">{{ label }}
            <input v-model="data" type='checkbox' :id="name" :name="name">
        </label>
    </div>
-->
    <!-- <Field
            className={ `${accentColorMap.get(theme?.color)} ${checkboxStyle}` }
type = 'checkbox'
id = { name }
name = { name }
{...rest }
/> -->
    <!-- < /FieldWithError> -->

    <!-- novo: -->

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
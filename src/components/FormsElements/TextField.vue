<script lang="ts">
// export interface FieldProps {
//     label?: string;
//     labelCentered?: boolean;
//     //   fieldSize?: FieldSize;
//     //   theme?: FormTheme;
//     isSubmitting?: boolean;
//     selectedValue?: string;
// }

// export interface TextFieldProps {// extends FieldProps {
//     nome: string;
//     placeholder: string;
//     bs_class_wrap?: string;
//     bs_class_input?: string;
//     bs_class_label?: string;
//     // labelCentered?: boolean;
//     //   fieldSize?: FieldSize;
//     //   theme?: FormTheme;
//     // isSubmitting?: boolean;
//     bootstrap_syncfusion?: 'bs' | 'sf';
//     // text area
//     rows?: string;
//     // sf:
//     floatLabelType?: "Auto" | "Always" | "Never";
//     is_text_area?: boolean;
//     cssclass?:string //Specifies the CSS class value that is appended to wrapper of Textbox.
//     modelValue: string

// }
// https://ej2.syncfusion.com/vue/documentation/api/textbox
// interface Props extends TextFieldProps {
//     modelValue: string
// }
</script>
<script setup lang="ts">
import { computed, withDefaults } from "vue";

const props = withDefaults(defineProps<{// extends FieldProps {
    nome: string;
    placeholder: string;
    bs_class_wrap?: string;
    bs_class_input?: string;
    bs_class_label?: string;
    // labelCentered?: boolean;
    //   fieldSize?: FieldSize;
    //   theme?: FormTheme;
    // isSubmitting?: boolean;
    bootstrap_syncfusion?: 'bs' | 'sf';
    // text area
    rows?: string;
    // sf:
    floatLabelType?: "Auto" | "Always" | "Never";
    is_text_area?: boolean;
    cssclass?: string //Specifies the CSS class value that is appended to wrapper of Textbox.
    modelValue: string

}>(),
    {
        bs_class: 'mb-3', bootstrap_syncfusion: 'bs', cssSFClass: "e-primary", disabled: false,
        is_text_area: false,
        floatLabelType: "Auto",
        rows: '30'
    })
const emit = defineEmits(['update:modelValue'])
const text_area_height = computed(() => { return { height: (parseFloat(props.rows) + 3.0) + 'em' } })
const value = computed({
    get() {
        console.log(typeof props.modelValue);

        return props.modelValue
    },
    set(value) {
        emit('update:modelValue', value)
    }
})
// ) => {
// const safeFieldSize = fieldSizeMap.get(fieldSize) ? fieldSize : 'full';
// if (!fieldSizeMap.get(fieldSize)) {
//     const fieldSizeValues = Array.from(fieldSizeMap.keys());
//     console.warn(
//         `Problem in TextField: fieldSize '${fieldSize}' is unknown, fieldSize is set to default : '${safeFieldSize}' (Possible fieldSize are : '${fieldSizeValues.join(
//             `', '`
//         )}')`
//     );
// }

</script>
<template>
    <div v-if="bootstrap_syncfusion === 'bs'" class="form-floating" :class="bs_class_wrap">
        <input v-if="!is_text_area" type="text" class="form-control" :id="nome" :name="nome" :class="bs_class_input"
            placeholder="any placeholder to make floating label work, vide bs5 docs" v-model="value">

        <textarea v-else class="form-control" :id="nome" :name="nome" :class="bs_class_input"
            placeholder="any placeholder to make floating label work, vide bs5 docs" :style="text_area_height"
            v-model="value"></textarea>

        <label :class="bs_class_label" :for="nome">{{ placeholder? placeholder: nome }}</label>
    </div>
    <div v-else :class="bs_class_wrap">
        <ejs-textbox :cssclass="bs_class_input" :name='nome' :multiline="is_text_area"
            :placeholder="placeholder ? placeholder : nome" v-model="value"
            :floatLabelType="floatLabelType"></ejs-textbox>
    </div>
    <!-- props: {{ props }} -->
    <!-- <FieldWithError
name= { name }
fieldSize = { safeFieldSize }
theme = { theme }
{...rest }>
className={
    `${fieldStyle} ${focusBorderColorMap.get(
        theme?.color
        )} ${fieldSizeMap.get(safeFieldSize)}`
    }
-->
    <!-- <input type='text' :id="name" :name="name" :placeholder="placeholder" /> -->

    <!-- < /FieldWithError> -->


</template>
<style>
#input-container .e-input-group {
    /* csslint allow: adjoining-classes */
    margin: 30px 0;
}

#input-container .e-float-input {
    /* csslint allow: adjoining-classes */
    margin: 30px 0;
}

.e-float-input.e-success label.e-float-text {
    /* csslint allow: adjoining-classes */
    color: #22b24b;
}

.e-float-input.e-success input:focus~label.e-float-text {
    /* csslint allow: adjoining-classes */
    color: #22b24b;
}

.e-float-input.e-success input:valid~label.e-float-text {
    /* csslint allow: adjoining-classes */
    color: #22b24b;
}

.e-float-input.e-warning label.e-float-text {
    /* csslint allow: adjoining-classes */
    color: #ffca1c;
}

.e-float-input.e-warning input:focus~label.e-float-text {
    /* csslint allow: adjoining-classes */
    color: #ffca1c;
}

.e-float-input.e-warning input:valid~label.e-float-text {
    /* csslint allow: adjoining-classes */
    color: #ffca1c;
}
</style>
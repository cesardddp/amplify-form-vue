<script lang="ts">

// export interface InputFieldProps {
//     nome: string;
//     label: string;
//     disabled?: boolean;
//     bs_class_wrap?: string;
//     bs_class_input?: string;
//     bs_class_label?: string;
//     // bootstrap_syncfusion?: 'bs' | 'sf';
//     placeholder?: string,
//     modelValue: string[]// string //| number | boolean
// }

// interface Props extends InputFieldProps {
//     modelValue: string[]// string //| number | boolean
// }

</script>
<script setup lang="ts">
import { ref, computed, watch } from "vue";






const props = withDefaults(defineProps<{
    nome: string;
    label: string;
    disabled?: boolean;
    bs_class_wrap?: string;
    bs_class_input?: string;
    bs_class_label?: string;
    // bootstrap_syncfusion?: 'bs' | 'sf';
    placeholder?: string,
    modelValue: string[]// string //| number | boolean
}>(),
    {
        bootstrap_syncfusion: 'bs',
        bs_class_wrap: '',
        bs_class_input: '',
        bs_class_label: '',
        placeholder: 'Novo item',
    })
const emit = defineEmits(['update:modelValue'])

// const itens_raw = ref<string[]>(['a'])

const itens_raw = computed({
    get() {
        return props.modelValue ?? ['']
    },
    set(value) {
        console.log(value);

        emit('update:modelValue', value ?? [''])

    }
})
</script>
<template>
    <section class="border rounded p-1">
        <label :class="bs_class_label">{{ label }}</label>
        <div v-for="item, index in itens_raw" :key="index" :class="bs_class_wrap" class="row w-100">
            <div class="col">
                <input @input="(e) => itens_raw[index] = (e.target as HTMLInputElement).value" class="form-control"
                    :class="bs_class_input" :disabled="disabled" :value="item" type='text' :placeholder="placeholder">
            </div>
            <div class="align-middle col-1 d-flex align-items-center text-6">
                <button @click="itens_raw.splice(index, 1)" type="button" class="btn-close"
                    :disabled="disabled"></button>
            </div>
        </div>

        <div class="text-end">
            <i @click="itens_raw.push('')" type="button"
                class="border rounded bg-success border-success text-center text-light bi bi-plus m-2 me-3 px-2"
                :disabled="disabled"></i>
        </div>
    </section>
</template>

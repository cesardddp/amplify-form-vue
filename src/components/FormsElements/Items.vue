<script lang="ts">

import { ref, computed, watch, PropType, defineComponent, defineEmits, inject, Ref } from "vue";



export type ItemsProps = {
    entity: string;
    nome: string;
    label: string;
    disabled?: boolean;
    bs_class_wrap?: string;
    bs_class_input?: string;
    bs_class_label?: string;
    // bootstrap_syncfusion?: 'bs' | 'sf';
    placeholder?: string,
    // modelValue: string[]// string //| number | boolean
}

export default defineComponent({
    props: {
        cpn_props: {
            type: Object as PropType<ItemsProps>,
            default:
            {
                bootstrap_syncfusion: 'bs',
                bs_class_wrap: '',
                bs_class_input: '',
                bs_class_label: '',
                placeholder: 'Novo item',
            }
        }
    },
    emits: ['update:modelValue'],
    setup(props, ctx) {
        const reactive_items_data = inject(props.cpn_props.entity + '_' + props.cpn_props.nome) as Ref<string[]>
        console.log('injected: ' + props.cpn_props.entity + '_' + props.cpn_props.nome);
        if (!reactive_items_data?.value || typeof reactive_items_data?.value != 'object' || reactive_items_data.value.length < 1)
            throw new Error("erro no valor padrão fornecido para itens");

        return {
            reactive_items_data,
            // set_item,
            label: props.cpn_props.label,
            disabled: props.cpn_props.disabled,
            placeholder: props.cpn_props.placeholder,
            bs_class_input: props.cpn_props.bs_class_input,
            bs_class_label: props.cpn_props.bs_class_label,
            bs_class_wrap: props.cpn_props.bs_class_wrap,
        }
    }
})


</script>
<template>
    <section class="border rounded p-1">
        <label :class="bs_class_label">{{ label }}</label>
        <div v-for="item, index in reactive_items_data" :key="index" :class="bs_class_wrap" class="row w-100">
            <div class="col">
                <input @input="(e) => { reactive_items_data[index] = (e.target as HTMLInputElement).value }"
                    class="form-control" :key="index" :class="bs_class_input" :disabled="disabled" :value="item"
                    type='text' :placeholder="placeholder">
            </div>
            <div class="align-middle col-1 d-flex align-items-center text-6">
                <button @click="reactive_items_data.splice(index, 1)" type="button" class="btn-close"
                    :disabled="disabled"></button>
            </div>
        </div>

        <div class="text-end">
            <i @click="reactive_items_data.push('')" type="button"
                class="border rounded bg-success border-success text-center text-light bi bi-plus m-2 me-3 px-2"
                :disabled="disabled"></i>
        </div>
    </section>
</template>

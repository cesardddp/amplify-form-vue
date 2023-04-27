<script setup lang="ts">

import { ref, inject, reactive, markRaw, computed } from "vue";
import { FormStateHandler } from "../formStorage";
import type { ItemsProps } from "./elementsTypes";

const props = withDefaults(defineProps<ItemsProps>(), {
    bootstrap_syncfusion: 'bs',
    bs_class_wrap: '',
    bs_class_input: '',
    bs_class_label: '',
    placeholder: 'Novo item',
})

const global_form_state_handler = (inject('form_state_handler') as FormStateHandler)

const items = computed(() => {
    return [...global_form_state_handler.state_as_Map.keys()]
        .filter(key => key.startsWith(props.introspect_caminho!))
        .map(key => global_form_state_handler.state_as_Map.get(key)!)
})
const ultimo_item_component = computed(
    () => items.value.length
        ? { //define diferenças de cada props de cada elemento interno
            is: markRaw(props.inner_component.is),
            props: {
                ...props.inner_component.props,
                // nome: props.inner_component.props.nome + '-' + ,
                label: `${length}: `,
                // description: 'enter para add e shift+del para apagar',
                description: '',
                introspect_caminho: `${props.introspect_caminho}.${items.value.length - 1}`,
                focus_on_mount: true,
            }
        } satisfies ItemsProps['inner_component']
        : null
)

function add_item() {
    const current_index = items.value.length - 1;
    const current_value = items.value[current_index]
    if (
        current_value != undefined
        && (
            !current_value.value
            || current_index != items.value.findIndex(rfv => rfv.value === current_value.value)
        )
    ) {
        invalid.msg = current_value.value ? 'Item já existe!' : 'Item não pode ser vazio!'
        invalid.show = true, setTimeout(() => {
            invalid.show = false
        }, 2000);
    } else {
        const key = `${props.introspect_caminho}.${items.value.length}`
        const _ref = ref()
        global_form_state_handler.state_as_Map.set(key, _ref)
    }
}
function del_item(global_key?: number) {
    global_form_state_handler.state_as_Map.delete(`${props.introspect_caminho}.${global_key ?? items.value.length - 1}`)
}
const invalid = reactive({
    msg: 'Erro!',
    show: false
})


</script>
<template>
    <section class="border rounded p-1 container">
        {{ nome }}: <span v-for="item, index in items" class="badge rounded-pill px-3 bg-primary me-1 position-relative"
            :key="index">
            {{ index + 1 }}: {{ item.value ?? '(vazio)' }}
            <span @click="() => del_item(index)"
                class="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger z-1">
                x
                <span class="visually-hidden">unread messages</span>
            </span>
        </span>

        <div class="row align-items-center mt-1">
            <div class="col-11">
                <component v-if="ultimo_item_component" :ref="ultimo_item_component.props.introspect_caminho"
                    :is="ultimo_item_component.is" v-bind="ultimo_item_component.props" @keyup.enter="add_item"
                    @keyup.shift.delete="del_item()" :key="ultimo_item_component.props.introspect_caminho">
                </component>
                <div class="text-danger" :class="invalid.show ? '' : 'd-none'">
                    {{ invalid.msg }}
                </div>
            </div>
            <div class="col-1">
                <button class="btn btn-outline-success rounded-end btn-sm bi bi-plus" @click="add_item"
                    :disabled="disabled">
                </button>
            </div>
        </div>
    </section>
</template>
<script setup lang="ts">

import { ref, watch, inject, Ref, reactive, markRaw, onUnmounted, toRef, shallowRef, triggerRef, watchEffect, onMounted } from "vue";
import { FormStateHandler } from "../formStorage";
import type { ItemsProps } from "./elementsTypes";
import { computed } from "@vue/reactivity";
import objPath from "object-path";
import { trigger } from "@vue/reactivity";

const props = withDefaults(defineProps<ItemsProps>(), {
    bootstrap_syncfusion: 'bs',
    bs_class_wrap: '',
    bs_class_input: '',
    bs_class_label: '',
    placeholder: 'Novo item',
})

const global_form_state_handler = (inject('form_state_handler') as FormStateHandler)

const [items, updateItem] = function <T>(v: T) {
    const r = shallowRef(v);
    const get = () => r.value
    const set = (v: (i: T) => T | T) => {
        r.value = typeof v === 'function' ? v(r.value) : v
        triggerRef(r)
    }
    return [get, set]
}([] as Ref<unknown[]>[])

const invalid = reactive({
    msg: 'Erro!',
    show: false
})

function add_item(key_valor_existente?: string) {
    updateItem(
        i => {
            const index = i.length;
            const key = `${props.introspect_caminho}.${index}`
            const value = global_form_state_handler.state_as_Map.get(key_valor_existente ?? key)!
            // debugger
            if (!value.value || i.find(rfv => rfv.value === value.value)) {
                invalid.msg = !value.value ? 'Item não pode ser vazio!' : 'Item já existe!'
                invalid.show = true, setTimeout(() => {
                    invalid.show = false
                }, 2000);
            }
            else i.push(value)
            return i
        }
    )
}
for (let k of global_form_state_handler.state_as_Map.keys()) {
    if (k.startsWith(props.introspect_caminho!)) {
        add_item(
            k
        )
    }
}
function del_item(global_key?: number) {
    updateItem(
        i => {
            const n_items = i.length;
            i.splice(global_key ?? i.length - 1, 1)
            i.forEach((v, indice) => {
                const state = global_form_state_handler.state_as_Map
                    .get(`${props.introspect_caminho}.${indice}`)
                state != v
            })
            global_form_state_handler.state_as_Map.delete(
                `${props.introspect_caminho}.${n_items - 1}`
            )
            // triggerRef(i)
            return i
        }
    )
}

const inner_props = computed(() => {
    console.clear()
    console.log('update cmp', items().length);
    const _props = { //define diferenças de cada props de cada elemento interno
        is: markRaw(props.inner_component.is),

        props: {
            ...props.inner_component.props,
            // nome: props.inner_component.props.nome + '-' + ,
            label: '',
            description: 'enter para add e shift+del para apagar',
            introspect_caminho: `${props.introspect_caminho}.${items().length}`,
            input_html_element: shallowRef()
            // reactive({
            //     ir: shallowRef(),
            //     update: function (v) {
            //         this.ir.value = v
            //         console.log(this.ir);
            //         debugger

            //     }
            // })
        }
    } satisfies ItemsProps['inner_component'];
    return _props
})
onMounted(() => {
    watchEffect(() => {
        inner_props.value.props.input_html_element.value?.focus()
    })
})

</script>
<template>
    <section class="border rounded p-1 container">
        Items: <span v-for="item, index in items()" class="badge rounded-pill px-3 bg-primary me-1 position-relative">
            {{ item.value }}
            <span @click="() => del_item(index)"
                class="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger z-1">
                x
                <span class="visually-hidden">unread messages</span>
            </span>
        </span>

        <div class="row align-items-center mt-1">
            <div class="col">
                <component :ref="inner_props.props.introspect_caminho" :is="inner_props.is" v-bind="inner_props.props"
                    @keyup.enter="() => add_item()" @keyup.shift.delete="del_item()"
                    :key="inner_props.props.introspect_caminho">
                </component>
                <div class="text-danger" :class="invalid.show ? '' : 'd-none'">
                    {{ invalid.msg }}
                </div>


            </div>

            <i @click="() => add_item()" type="button"
                class="border rounded-end border-success text-center fs-2 text-success my-auto bi bi-plus col-1"
                :disabled="disabled"></i>
        </div>
    </section>
</template>
<script setup lang="ts">

import { ref, watch, inject, Ref, reactive, markRaw, onUnmounted, toRef } from "vue";
import { FormStateHandler } from "../formStorage";
import type { ItemsProps } from "./elementsTypes";




const props = withDefaults(defineProps<ItemsProps>(), {
    bootstrap_syncfusion: 'bs',
    bs_class_wrap: '',
    bs_class_input: '',
    bs_class_label: '',
    placeholder: 'Novo item',
})
// três storages são manipulados aqui:
// - `store_form.state_as_Map` o Map global com referencias às refs de todos os campos do formulário
//      -> como Input.vue e SelectField.vue só pegam a `ref` injetando o Map
//      global, então Items.vue precisa desponibilizar cada item-ref lá.
// - `Items_ref` a `ref` DESTE componente (Items.vue) onde fica a
//      array de valores de cada item
//      -> os item-componentes, quando criados tem sua `ref` assistida por um `watch`
//      e modificam um posição especifica da `Items_ref` indexada por uma `index_key`.
// - `inner_components_handler.map`. `inner_components_handler` é uma "classe" 
//      cujo o atributo(storage) .map é onde ficam guardados props de cada item-componente
//      necessárias pra criar um Input.vue ou SelectField.vue.
//      -> `inner_components_handler` também possui métodos pra adicionar um novo
//      item-componente, adcionando suas referencias em `store_form.state_as_Map` e `Items_ref`
//      e também para deleta-los.
//
// obs: para não perder a referecia de `index_key`, que mantem a ligação entre o valor
// dentro de `Items_ref` e cada item-componente, um valor de `Items_ref` nunca é deletado
// ele é na vdd, anulado, se transformando em `null` eqto o componente-item e suas referencias
// são sim excluidas. E para não criar uma array gigantesca de `null`s, quando um novo item é
// é adicionado, após a exclusão de um anterior, uma posição existente que está preenchida por
// `null` é utilizada, em vez de criar um novo item na array e uma nova refência.

console.log('injecting: ' + props.introspect_caminho + '_' + props.nome + '_items');
if (!props.introspect_caminho)
    throw new Error(`introspect_caminho em ${props.nome} invalido: ${props.introspect_caminho} `);


const global_form_state_handler = (inject('form_state_handler') as FormStateHandler)
const Items_ref = global_form_state_handler.state_as_Map.get(props.introspect_caminho) ??
    global_form_state_handler.addRef(props.introspect_caminho, false)

    if (props.form_fields_gbl_state_unseters)
    // props.unset_from_global_state.list_unset.push(
    props.form_fields_gbl_state_unseters.push(
        () => {
            global_form_state_handler.state_as_Map.delete(`${props.introspect_caminho}`)
        }
    )
if (!Items_ref) throw new Error("ref inject não encontrado: " + props.introspect_caminho);
if (!Array.isArray(Items_ref.value)) Items_ref.value = [];

if (!Items_ref?.value || typeof Items_ref?.value != 'object' || Items_ref.value.length < 1)
    Items_ref.value = [];// adicionar um lista como valor padrão do _ref.value
// throw new Error("erro no valor padrão fornecido para itens");

const inner_components_handler = {
    map: reactive(new Map()),
    items: [] as unknown[],
    inner_component_name(index_key: number) {
        return props.inner_component.props.nome + '-' + index_key;
    },
    novo_item(default_value?: unknown) {
        const last_item = default_value ?? null;

        let index_key = this.items.indexOf(last_item)
        if (index_key === -1) {
            this.items.push(last_item)
            index_key = this.items.indexOf(last_item);// length - 1;
        }

        const _prop = { //define diferenças de cada props de cada elemento interno
            is: markRaw(props.inner_component.is),
            props: {
                ...props.inner_component.props,
                nome: this.inner_component_name(index_key),
                label: '',
                introspect_caminho: `${props.introspect_caminho}.${index_key}.item`
            }
        } satisfies ItemsProps['inner_component'];

        this.map.set(index_key, _prop);
        const inner_ref = ref(last_item)

        global_form_state_handler.state_as_Map.set(
            `${props.introspect_caminho}.${index_key}.item`,
            inner_ref
        )
        watch(
            global_form_state_handler.state_as_Map.get(
                `${props.introspect_caminho}.${index_key}.item`
            )!,
            (new_v, old_v) => {
                // pra itens iguais(ou inválidos) pensar em uma lista temporária pra guardar até deixar de ser inválido
                this.items[index_key] = new_v
                Items_ref.value = this.items.filter(i => i)
            })
    },
    remove_item(index_key: number) {
        global_form_state_handler.state_as_Map.get(
            `${props.introspect_caminho}.${index_key}.item`
        )!.value = null;//anula primeiro para chamar o watcher e anular na referencia interna
        global_form_state_handler.state_as_Map.delete(
            `${props.introspect_caminho}.${index_key}.item`
        ) // retira da referencia global
        this.map.delete(index_key); //tiro do map de items
    }
}
Items_ref.value.forEach(
    (v:unknown) => inner_components_handler.novo_item(v)
)

inner_components_handler.novo_item()// adiciona o primeiro campo vazio

onUnmounted(() => {
    for (let k of inner_components_handler.map.keys()) {
        global_form_state_handler.state_as_Map.delete(
            `${props.introspect_caminho}.${k}.item`
        ) // tira do map de _refs global que está no inject
        inner_components_handler.map.delete(k); //tiro do map de items
    }
})




</script>
<template>
    <section class="border rounded p-1">
        <label :class="bs_class_label">{{ label }}</label>
        <div v-for="_key, index in inner_components_handler.map.keys()" :key="index" :class="bs_class_wrap"
            class="row w-100">
            <div class="col">
                <!-- cpt props:{{ inner_cpt_props.get(_key).props }} -->
                <component :is="inner_components_handler.map.get(_key).is" :key="_key"
                    v-bind="inner_components_handler.map.get(_key).props"
                    @keyup.enter="() => inner_components_handler.novo_item()">
                </component>
                <!-- o @@keyup.enter aqui tem uma função encapsulando -->
                <!-- pq por algum motivo ele chama inner_components_handler.novo_item -->
                <!-- de alguma forma diferente de modo que o metodo .novo_item perde a referencia this -->
                <!-- TODO fazer um stack overflow disso -->
                <!-- TODO abrir uma issue disso -->

            </div>
            <div class="align-middle col-1 d-flex align-items-center text-6">
                <button @click="() => inner_components_handler.remove_item(_key)" type="button" class="btn-close"
                    :disabled="disabled"></button>
            </div>
        </div>
        <div class="text-end">
            <i @click="() => inner_components_handler.novo_item()" type="button"
                class="border rounded bg-success border-success text-center text-light bi bi-plus m-2 me-3 px-2"
                :disabled="disabled"></i>
        </div>
    </section>
</template>

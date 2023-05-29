<script lang="ts">
import { IntrospectionSchema } from "../introspectionSchemaInterface";
import { defineComponent, provide, type PropType, onMounted, watch, ref, watchEffect, computed, triggerRef } from "vue";
import IntrospectionParser, { getEnityInputType } from "./parse-introspection";
import { FormStateHandler, FormStylingHandler } from "./formStorage";
import FormHandler from "./FormHandler.vue";
import dot from 'dot-object';

export default defineComponent({
    props: {
        introspectionSchema: { type: Object as PropType<IntrospectionSchema>, required: true },
        entity_name: { type: String, required: true },
        modelValue: { type: Object, required: true }
    },
    emits: ['form_types', 'update:modelValue'],
    components: {
        FormHandler
    },
    setup(props,
        { emit }
    ) {

        const form_state_handler = new FormStateHandler(emit)// inicializa o gerenciador de estado global do amplify form

        const form_types = IntrospectionParser(
            props.entity_name,
            props.introspectionSchema,
        )

        emit('form_types', Object.fromEntries(form_types.entries()))

        provide("form_state_handler", form_state_handler)
        provide("form_types", form_types)
        provide("form_styling_handler", new FormStylingHandler())


        const root = { root: props.modelValue }
        const modelValueKeys = dot.dot(root);
        for (let k of Object.keys(modelValueKeys)) {
            const nv = modelValueKeys[k]
            if (!form_state_handler.state_as_Map.has(k))
                form_state_handler.addRef(k, Array.isArray(nv));
            form_state_handler.state_as_Map.get(k)!.value = nv;
        }

        const state = computed(() => {
            const dotObject = {
                ...Object.fromEntries(form_state_handler.state_as_Map.entries()),
            };
            const json = dot.object(dotObject) as any;
            emit('update:modelValue', json.root)
        })

        return {
            input_nome: form_types.keys().next().value,
            state
        }
    }
})
</script>
<template>
    <div class="d-none">{{ state }}</div>
    <FormHandler :introspection_caminho="'root'" :form_name="input_nome" :field_name="input_nome"
        :is_multipleform_item="false" />
</template>
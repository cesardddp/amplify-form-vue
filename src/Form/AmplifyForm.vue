<script lang="ts">
import { IntrospectionSchema } from "../introspectionSchemaInterface";
import { defineComponent, provide, type PropType, watch } from "vue";
import IntrospectionParser, { getEnityInputType } from "./parse-introspection";
import { FormStateHandler } from "./formStorage";
import FormHandler from "./FormHandler.vue";

export default defineComponent({
    props: {
        introspectionSchema: { type: Object as PropType<IntrospectionSchema>, required: true },
        entity_name: { type: String, required: true }
    },
    emits: ['form_result', 'field_value_update', 'form_types','json_result'],
    components: {
        FormHandler
    },
    setup(props,
        { emit }
    ) {

        const form_state_handler = new FormStateHandler(emit)// inicializa o gerenciador de estado global do amplify form
        emit('json_result', form_state_handler.get_final_json())
        emit('form_result', form_state_handler)

        const form_types = IntrospectionParser(
            props.entity_name,
            props.introspectionSchema,
            form_state_handler
        )

        emit('form_types', Object.fromEntries(form_types.entries()))

        provide("form_state_handler", form_state_handler)
        provide("form_types", form_types)

        return {
            input_nome: form_types.keys().next().value
        }
    }
})
</script>
<template>
    <FormHandler :introspection_caminho="'root'" :form_name="input_nome" :field_name="input_nome" :is_multipleform_item="false" />
</template>
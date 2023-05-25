<script lang="ts">
import { IntrospectionSchema } from "../introspectionSchemaInterface";
import { defineComponent, provide, type PropType, onMounted } from "vue";
import IntrospectionParser, { getEnityInputType } from "./parse-introspection";
import { FormStateHandler, FormStylingHandler } from "./formStorage";
import FormHandler from "./FormHandler.vue";

export default defineComponent({
    props: {
        introspectionSchema: { type: Object as PropType<IntrospectionSchema>, required: true },
        entity_name: { type: String, required: true },
        modelValue: { type: Object, required: true }
    },
    emits: ['form_result', 'field_value_update', 'form_types', 'json_result', 'update:modelValue'],
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
        provide("form_styling_handler", new FormStylingHandler())

        // inicializa v-model somente após o form_state_handler estar pronto, sou seja, após cada campo ter sido inicializado,
        // o que é necessário pq os campos que inicializam o form_state_handler
        // e o vmodel modifical o form_state_handler
        onMounted(() => {
            form_state_handler.inicializador_vmodelresult(
                props.modelValue
            )
        })

        return {
            input_nome: form_types.keys().next().value
        }
    }
})
</script>
<template>
    <FormHandler :introspection_caminho="'root'" :form_name="input_nome" :field_name="input_nome"
        :is_multipleform_item="false" />
</template>
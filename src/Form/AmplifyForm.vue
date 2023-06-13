<script lang="ts">
import { IntrospectionSchema } from "../introspectionSchemaInterface";
import { defineComponent, provide, type PropType, reactive, ref, watch, computed } from "vue";
import IntrospectionParser from "./parse-introspection";
import { FormStateHandler, FormStylingHandler } from "./formStorage";
import FormHandler from "./FormHandler.vue";
import { Validacao } from "./formTypes";

export default defineComponent({
    props: {
        introspectionSchema: { type: Object as PropType<IntrospectionSchema>, required: true },
        entity_name: { type: String, required: true },
        modelValue: {
            type: Object, default: () => ({}),
        },
        validar: { type: Boolean }
    },
    emits: ['form_types', 'update:modelValue', 'validado'],
    components: {
        FormHandler
    },
    setup(props,
        { emit }
    ) {

        const form_state_handler = new FormStateHandler(
            emit,
            reactive({ root: props.modelValue }))// inicializa o gerenciador de estado global do amplify form

        const form_types = IntrospectionParser(
            props.entity_name,
            props.introspectionSchema
        )

        emit('form_types', Object.fromEntries(form_types.entries()))

        provide("form_state_handler", form_state_handler)
        provide("form_types", form_types)
        provide("form_styling_handler", new FormStylingHandler())

        const validacao = reactive<Validacao>({
            trigger_validacao: computed(() => props.validar),
            validado: true,
            validacoes: []
        })
        provide("validacao", validacao)
        watch(
            validacao,
            () => {
                if (validacao.validado) {
                    emit('validado', validacao.validado)
                }
            }
        )


        return {
            input_nome: form_types.keys().next().value,
        }
    }
})
</script>
<template>
    <FormHandler :introspection_caminho="'root'" :form_name="input_nome" :field_name="input_nome"
        :is_multipleform_item="false" />
</template>
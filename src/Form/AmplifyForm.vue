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
        validar: { type: Boolean },
        form_id: { type: String }
    },
    emits: ['update:modelValue', 'validado'],
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

        const status = ref<'parado' | 'atualizando' | 'erro' | 'sucesso'>('parado')
        const status_form_style = {
            set_status:(status_: 'parado' | 'atualizando' | 'erro' | 'sucesso') =>{
                status.value = status_
                status.value != 'atualizando' && setTimeout(() => {
                    status.value = 'parado'
                }, 2000)
            },
        }


        provide("form_state_handler", form_state_handler)
        provide("form_types", form_types)
        provide("form_styling_handler", new FormStylingHandler(props.form_id!, status_form_style.set_status))

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
            input_nome: form_types.keys().next().value, status_form_style,status
        }
    }
})
</script>
<template>
    <section v-if="!(status === 'parado')" style="font-size:small">
        <span v-if="status === 'atualizando'" class="text-info text-opacity-75">
            <div class="spinner-grow spinner-grow-sm " role="status">
                <span class="visually-hidden">Loading...</span>
            </div>Atualizando form...
        </span>
        <span v-else-if="status === 'erro'" class="text-danger text-opacity-75">
            <i class="bi bi-exclamation-circle-fill"></i>
            Erro ao atualizar form!
        </span>
        <span v-else-if="status === 'sucesso'" class="text-success text-opacity-75">
            <i class="bi bi-check-circle-fill"></i>
            Form atualizado com sucesso!
        </span>
    </section>
    <FormHandler :introspection_caminho="'root'" :form_name="input_nome" :field_name="input_nome"
        :is_multipleform_item="false" />
</template>
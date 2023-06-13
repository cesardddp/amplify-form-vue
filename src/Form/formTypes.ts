import { ComputedRef } from "vue";
import { FormSchema } from "./parse-introspection";

export interface FormProps {
    form_type: FormSchema
    introspection_caminho: string
    form_name: string
    is_multipleform_item: boolean
    
}

export interface FormHandlerProps {
    form_name: string
    field_name: string
    introspection_caminho: string
    is_multipleform_item: boolean
}

export interface Validacao{
        trigger_validacao: ComputedRef<boolean>,
        validado: boolean,
        validacoes: {
            elemento: string,
            erros: string[]
        }[]
}
import { FormSchema } from "./parse-introspection";

export type Unset_from_global_state = (Function|Unset_from_global_state)[]
// {
//     list_unset: unknown[],
//     execute: Function
// }


export interface FormProps {
    form_type: FormSchema
    introspection_caminho: string
    form_name: string
    is_multipleform_item: boolean
    form_fields_gbl_state_unseters?: Unset_from_global_state
}

export interface FormHandlerProps {
    form_name: string
    field_name:string
    introspection_caminho: string
    is_multipleform_item: boolean
    form_fields_gbl_state_unseters?: Unset_from_global_state
}
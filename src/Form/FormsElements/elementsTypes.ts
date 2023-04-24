import SelectField from "./SelectField.vue";
import Items from "./Items.vue";
import Input from "./Input.vue";
import { Unset_from_global_state } from "../formTypes";
import { ShallowRef } from "vue";

export type OpcoesValidacoes = '' | 'required' | `minLength:${number}` | `maxLength:${number}`;

type BaseComponent = {
    nome: string;
    label?: string;
    description?:string
    placeholder?: string;
    disabled?: boolean;
    bs_class_wrap?: string;
    bs_class_input?: string;
    bs_class_label?: string;
    introspect_caminho?: string;
    validacoes?: OpcoesValidacoes[];
    unset_form_field_from_state_when_component_unmount?: boolean //Unset_from_global_state;
    input_html_element?:ShallowRef<HTMLInputElement|undefined>;
}

type InnerComponent = {
    is: typeof SelectField | typeof Input | typeof Items
    props: InputProps | SelectProps | ItemsProps
}

export type Validacoes = {
    required: boolean;
    minlength?: number;
    maxlength?: number;
}

export interface ItemsProps extends BaseComponent {
    disabled?: boolean;
    inner_component: InnerComponent
    // bootstrap_syncfusion?: 'bs' | 'sf';
    // modelValue: string[]// string //| number | boolean
}

export interface InputProps extends BaseComponent {
    type?: 'text' | 'number' | 'checkbox',
    bootstrap_syncfusion?: 'bs' | 'sf';
    // checkbox
    //sf
    cssSFClass?: string | "e-primary" | "e-success" | "e-info" | "e-warning" | "e-danger";
    //number
    step?: string,
    //sf
    currency?: 'BRL' | 'EUR' | 'USD', // TODO adicionar mais opções https://pt.wikipedia.org/wiki/ISO_4217
    //
    //sf 
    is_text_area?: boolean,
    floatLabelType?: "Auto" | "Always" | "Never";
    // default: string | number | boolean;
    // modelValue: any// string //| number | boolean
}

export interface SelectProps extends BaseComponent {
    options: {
        label?: string;
        value: string;
    }[],
    labelCentered?: boolean,
    isSubmitting?: boolean,
    selectedValue?: string,
    // fieldSize?: FieldSize;
    // theme?: FormTheme;
    // modelValue?: Ref<string | number | boolean>,
}

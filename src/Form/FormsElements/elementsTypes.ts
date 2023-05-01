import SelectField from "./SelectField.vue";
import Items from "./Items.vue";
import Input from "./Input.vue";

export type OpcoesValidacoes = '' | 'required' | `minLength:${number}` | `maxLength:${number}`;

export type FormFieldStyle = {
    bs_class_wrap: string,
    bs_class_label: string,
    bs_class_input: string,
    esconder: boolean,
    nao_usar: boolean,
}

type BaseComponent = {
    nome: string;
    label?: string;
    description?:string
    placeholder?: string;
    disabled?: boolean;
    introspect_caminho?: string;
    validacoes?: OpcoesValidacoes[];
    focus_on_mount?:boolean;
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

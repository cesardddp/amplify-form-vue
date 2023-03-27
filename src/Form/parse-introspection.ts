import { Arg, Field, IntrospectionSchema, Kind, OfTypeClass, Type, TypeElement } from "../introspectionSchemaInterface";
// import { OpcoesValidacoes } from "../../merm-schema/custom-types";
import Input from "./FormsElements/Input.vue";
import Items from "./FormsElements/Items.vue";
import SelectField from "./FormsElements/SelectField.vue";
import { markRaw, Ref, ref, shallowRef, watch } from "vue";
import { FormStateHandler } from "./formStorage";
import type { InputProps, ItemsProps, SelectProps } from './FormsElements/elementsTypes'

export type OpcoesValidacoes = '' | 'required' | `minLength:${number}` | `maxLength:${number}`;


type InputComponent = {
    is: typeof Input,
    props: InputProps,
}
type SelectFieldComponent = {
    is: typeof SelectField,
    props: SelectProps,
}
type ItemsComponent = {
    is: typeof Items,
    props: ItemsProps,
}

const debuggMode = false;

export function getTypesFromSchema(introspectionSchema: IntrospectionSchema) {
    const types = introspectionSchema.data.__schema.types.filter(
        type => type.kind === 'INPUT_OBJECT'
    )
    return types
}
export function parseNonScalar(type: OfTypeClass) {
    //não é esperado scalar aqui
    let is_list = false;
    let is_non_null = false; // cobre o caso field: Type! e list_field: [Type]!
    let is_list_item_non_null = false; // cobre o caso field: [Type!]
    const recursion = (_type: OfTypeClass): OfTypeClass => {
        switch (_type.kind) {
            case 'NON_NULL':
                if (!is_list) {
                    is_non_null = true
                } else {
                    is_list_item_non_null = true
                }
                return recursion(_type.ofType!);
            case 'LIST':
                is_list = true;
                if (_type.ofType?.kind !== 'SCALAR') {
                    return recursion(_type.ofType!)
                } else {
                    debugger
                    throw new Error("");
                }
            case 'INPUT_OBJECT':
                return _type!;
            case 'ENUM':
                // lista de enums, como `validadores`
                return _type!;
            default:
                debugger
                throw new Error("o que fazer");
        }
    }
    const type_scalar: OfTypeClass = recursion(type);
    return { ...type_scalar, is_list, is_non_null, is_list_item_non_null }
}
export function getEnityInputType(
    entity_full_name: string,
    introspectionSchema: IntrospectionSchema
) {
    // pega o type na lista de types no introspectioSchema.data.__schema.types
    // estoura um erro se o type não for encontrado
    const type = introspectionSchema.data.__schema.types.find(
        type => type.name.toLowerCase() === entity_full_name.toLowerCase()
    )
    if (!type) { debugger; throw new Error("Type não encontrado, schema inválido"); }
    return type;
}

//// PARSE para MAP que mapaeia os relacionanemtos entre os tipos INPUT para gerar formularios para cada INPUT sem perder a relação entre pai->sub_forms
function getFieldsFromType(field: TypeElement) {
    if (field.kind === 'INPUT_OBJECT') return field.inputFields!;
    else if (field.kind === 'OBJECT') return field.fields!;
    else {
        throw new Error("kind com fields desconhecidos: " + field.kind);
    }
}
function parseScalar(type: OfTypeClass) {
    // se o `type` for um Scalar, retorna a scalar informando se é NON_NULL e se é LIST
    // sendo LIST, retorna também se cada elemente na list é ou não NON_NULL
    // caso `type` não seja Scalar, retorna false
    let type_scalar: false | OfTypeClass = false;
    let is_list = false;
    let is_non_null = false; // cobre o caso field: Type! e list_field: [Type]!
    let is_list_item_non_null = false; // cobre o caso field: [Type!]
    const recursion = (_type: OfTypeClass) => {
        switch (_type.kind) {
            case 'NON_NULL':
                if (!is_list) is_non_null = true;
                else is_list_item_non_null = true;
                recursion(_type.ofType!);
                break;
            case 'LIST':
                is_list = true;
                _type.ofType ? recursion(_type.ofType) : false;
                break;
            case 'INPUT_OBJECT':
                break; return false;
            case 'SCALAR':
            case 'ENUM':
                type_scalar = _type;
                return true;
            default:
                break; return false;
        }
    }
    recursion(type)
    return type_scalar ? { ...type_scalar as OfTypeClass, is_list, is_non_null, is_list_item_non_null } : false;
}
function addSubForms(
    input_fields: Arg[],
    // introspect_caminho:string
    ) {
    return input_fields
        .filter(iptf => !parseScalar(iptf.type))
        .map(
            iptf => {
                const type = parseNonScalar(iptf.type);
                return {
                    name: iptf.name,
                    type: type.name!,
                    required: type.is_non_null,
                    multiple: type.is_list,
                    // introspect_caminho:`${introspect_caminho}.${iptf.name}${type.is_list?'.0':''}`
                }
            }
        )
}
function getFormElementFromScalar(
    name: string, type: OfTypeClass, 
    // introspect_caminho: string, 
    multiple_field: boolean, disabled: boolean, required: boolean, list_item_required: boolean, schema: IntrospectionSchema
): InputComponent | SelectFieldComponent | ItemsComponent {

    if (!parseScalar(type)) { debugger; throw new Error("tipo não é um scalar") }

    const validacoes: OpcoesValidacoes[] = []
    if (required) validacoes.push('required');

    if (multiple_field) {
        const inner = getFormElementFromScalar(
            name, type, 
            // introspect_caminho,
             false, disabled, list_item_required, false, schema
        );
        const _item = {
            is: markRaw( Items),
            props: {
                // introspect_caminho,
                nome: name,
                label: name,
                disabled,
                inner_component: {
                    is: markRaw(inner.is),
                    props: inner.props
                }
            },
        } satisfies ItemsComponent;
        return _item;
    }

    if (type.kind === 'ENUM') {
        // enums tem type próprio, precisam ser pegos no types[] no introspection
        const enumType = getEnityInputType(type.name!, schema as IntrospectionSchema);
        return {
            is:markRaw( SelectField),
            props: {
                // introspect_caminho: introspect_caminho,
                nome: name,
                validacoes,
                options: enumType.enumValues!.map(enumValue => { return { value: enumValue.name } }),
                label: name,
            }
        } satisfies SelectFieldComponent
    }

    switch (type.name) {

        case 'String':
            return {
                is:markRaw( Input),
                props: {
                    nome: name,
                    // label: field.label,
                    label: name,
                    type: 'text',
                    bootstrap_syncfusion: 'bs',
                    validacoes: validacoes,
                    // modelValue: elementOptions.refs[explicitName],
                    // theme:  theme ,
                    // bs_class_wrap: field.kind === 'relationship' ? 'd-none' : undefined,
                    // introspect_caminho: introspect_caminho,
                },
            } satisfies InputComponent;

        case 'Int':
        case 'Float':
            return {
                is:markRaw( Input),
                props: {
                    nome: name,
                    // label: elementOptions.formSchema.label,
                    label: name,
                    type: 'number',
                    bootstrap_syncfusion: 'bs',
                    validacoes: validacoes,
                    // modelValue: elementOptions.refs[explicitName],
                    // introspect_caminho: introspect_caminho
                    // theme:  theme ,
                },
            } satisfies InputComponent;

        case 'Boolean':
            return {
                is:markRaw( Input),
                props: {
                    nome: name,
                    // label: elementOptions.formSchema.label,
                    label: name,
                    type: 'checkbox',
                    bootstrap_syncfusion: 'bs',
                    validacoes: validacoes,
                    // modelValue: elementOptions.refs[explicitName],
                    // introspect_caminho: introspect_caminho
                    // theme:  theme ,
                },
            } satisfies InputComponent;

        case null:
        default:
            if (type.name?.toLowerCase() === 'id' || name.toLowerCase() === 'id') {
                return {
                    is:markRaw( Input),
                    props: {
                        nome: name,
                        // label: field.label,
                        label: name,
                        type: 'text',
                        bootstrap_syncfusion: 'bs',
                        validacoes: validacoes,
                        // modelValue: elementOptions.refs[explicitName],
                        // theme:  theme ,
                        bs_class_wrap: 'd-none',
                        // introspect_caminho: introspect_caminho
                    },
                } satisfies InputComponent;;
            } else {
                throw new Error("não sei o que fazer com esse kind: " + name)
            }
        // case 'TEXTAREA':
        // return {
        //     is: 'Input',
        //     props: {
        //       nome: explicitName,
        //       label: label,
        //       type: 'text',
        //       is_text_area:true,
        //       bootstrap_syncfusion: 'bs',
        //       validacoes: validacoes,
        //       modelValue: elementOptions.refs[explicitName],
        //       // theme:  theme ,
        //     },
        //     elementOptions.disabled
        //   } satisfies InputComponent;


        // case 'relationship': // id
        // listFields.add(explicitName);
        //       <SelectField
        //           name={ explicitName }
        //   label = { ''}
        //   options = { options! }
        //   selectLabel = { select }
        //   theme = { theme }
        //   required = { required }
        //   {...props }
        //   />
        //     < /FieldSet>
        //     );
        // }

        //     case 'file')
        //   return (
        //     <FilesDropField
        //           name= { explicitName }
        //   label = { label }
        //   theme = { theme }
        //   required = { required }
        //   {...props }> </FilesDropField>
        //       );
        // }
    }
};

export type FormSchemaValue = {
    sub_forms: {
        name: string
        type: string
        required: boolean
        multiple: boolean,
        // introspect_caminho:string
    }[],
    form_fields: {
        nome: string,
        kind: Kind,
        form_component_info: SelectFieldComponent | ItemsComponent | InputComponent,
        // required:Boolean
    }[],
    nome_campo: string,
    multiple?: boolean
}
export type FormSchema = Map<
    string,
    FormSchemaValue
>;

export default function (entity_name: string, introspectionSchema: IntrospectionSchema, form_state: FormStateHandler) {

    const form_schema: FormSchema = new Map();


    const entityType = getEnityInputType(
        'Create' + entity_name + 'Input',
        introspectionSchema
    );

    form_schema.set(
        entityType.name,
        {
            sub_forms: addSubForms(
                entityType.inputFields!,
                // entityType.name
                ),
            form_fields: [],
            nome_campo:'root'
        });
''
    const mapeia = (typeElement: TypeElement,
        // caminho_do_campo: string,
        is_multiple: boolean) => {
        //typeElemente é o tipo da lista de types do schema
        // caminho_do_campo é o camoinho dentro do schema até o campo tipado com typeElement, exemplo:
        // modulo: Modulo -> "modulo" é o "campo folha" e "Modulo" é o nome do tipo e "CreateModuloInput" é typeElement pra criar um novo "Modulo"

        getFieldsFromType(typeElement).forEach(
            (f) => {
                // testa antes se é scalar, mais facil pra abordar o cenário descrito aqui https://stackoverflow.com/questions/59127467/get-required-non-null-field-on-introspection
                // console.clear()
                const scalar_type = parseScalar(f.type);

                debuggMode && console.table(f);

                // o propblema de dizer se é multiple(list) e required tá aqui, isso porque is scalar ignora tudo isso
                // uma forma de contornar é retonrar isso do is scalar e transformar ele num parseScalar
                if (scalar_type) {
                    // const _caminho_do_campo = `${caminho_do_campo}.${f.name}`// alterando Items, posso usar o modo debaixo
                    // const _caminho_do_campo = `${caminho_do_campo}.${f.name}${scalar_type.is_list ? '.0' : ''}`
                    const form_component_info = getFormElementFromScalar(
                        f.name,
                        scalar_type,
                        scalar_type.is_list,
                        false,
                        scalar_type.is_non_null,
                        scalar_type.is_list_item_non_null,
                        introspectionSchema
                    );
                    form_schema.get(typeElement.name)!.form_fields.push(
                        {
                            nome: f.name,
                            kind: f.type.kind,
                            form_component_info
                        }
                    );
                    // add a ref to that value - bind variable for each field
                        
                    // newStoreForm(
                    //     _caminho_do_campo,
                    //     f,
                    //     scalar_type.is_list
                    // )
                } else if (f.type.kind === 'INPUT_OBJECT') {// é subform
                    if (!f.type.name) debugger
                    const type = getEnityInputType(
                        f.type.name!,
                        introspectionSchema as IntrospectionSchema
                    );
                    const info_type = parseNonScalar(
                        f.type
                    )

                    // const _caminho_do_campo = `${caminho_do_campo}.${f.name}${info_type.is_list ? '.0' : ''}`;

                    if (typeElement.name === info_type.name) {
                        debuggMode && console.log("Refencia circular identificada, break");
                        console.log("Refencia circular identificada, break");
                        console.log(typeElement.name)
                        return;
                    }
                    // coloca cada INPUT_OBJECT (navbar and formLogin no form_schema)
                    form_schema.set(
                        type.name,
                        {
                            // pai: typeElement.name,
                            sub_forms: addSubForms(
                                type.inputFields!,
                                // _caminho_do_campo
                                ),
                            form_fields: [],
                            nome_campo:f.type.name!
                        }
                    )
                    mapeia(
                        type,
                        // _caminho_do_campo,
                         info_type.is_list
                    )
                } else if (f.type.kind === 'NON_NULL') {
                    // NON null tem a seguinte caracteristica que pode combinar com LIST
                    // https://stackoverflow.com/questions/59127467/get-required-non-null-field-on-introspection
                    // e aqui (doc oficial)
                    // https://graphql.org/learn/introspection/
                    // parece que apenas NON_NULL e LIST tem o campo ofType

                    const info_type = parseNonScalar(f.type);
                    if (!info_type) debugger;


                    const type = getEnityInputType(
                        info_type.name!,
                        introspectionSchema as IntrospectionSchema
                    );
                    if (!type.name) {
                        // debug teste
                        debuggMode && console.log(type);
                        debuggMode && console.log(info_type);
                        debugger
                    }


                    if (typeElement.name === info_type.name) {
                        debuggMode && console.log("Refencia circular identificada, break");
                        console.log("Refencia circular identificada, break");
                        console.log(typeElement.name)
                        return;
                    }
                    // const _caminho_do_campo = `${caminho_do_campo}.${f.name}${info_type.is_list ? '.0' : ''}`;
                    form_schema.set(
                        type.name,
                        {
                            // pai: typeElement.name,
                            sub_forms: addSubForms(
                                type.inputFields!,
                                // _caminho_do_campo
                                ),
                            form_fields: [],
                            nome_campo:f.type.name!,
                            multiple: info_type.is_list
                        }
                    )
                    if (f.type.ofType) {

                        mapeia(
                            type, 
                            // _caminho_do_campo,
                             info_type.is_list
                        )

                    } else {
                        //teste
                        console.log('nonnull sem oftype'); debugger
                    }
                } else if (f.type.kind === 'OBJECT') {
                    // aparentemtente não aparece nunca tratrando input types
                    debugger
                } else if (f.type.kind === 'LIST') {
                    if (f.type.ofType?.kind === 'INPUT_OBJECT') {
                        if (!f.type.ofType.name) { debugger; throw new Error("") }
                        const type = getEnityInputType(
                            f.type.ofType.name,
                            introspectionSchema as IntrospectionSchema
                        );
                        const info_type = parseNonScalar(
                            f.type
                        )

                        if (typeElement.name === info_type.name) {
                            debuggMode && console.log("Refencia circular identificada, break");
                            console.log("Refencia circular identificada, break");
                            console.log(typeElement.name)
                            return;
                        }
                        // const _caminho_do_campo = `${caminho_do_campo}.${f.name}${info_type.is_list ? '.0' : ''}`;
                        form_schema.set(
                            type.name,
                            {
                                // pai: typeElement.name,
                                sub_forms: addSubForms(
                                    type.inputFields!,
                                    // _caminho_do_campo
                                    ),
                                form_fields: [],
                                nome_campo:f.type.name!,
                                multiple: info_type.is_list
                            }
                        )
                        mapeia(
                            type,
                            //  _caminho_do_campo,
                              info_type.is_list
                        )
                    } else if (f.type.ofType?.kind === 'NON_NULL') {
                        const info_type = parseNonScalar(
                            f.type
                        )

                        if (info_type.name === null) { debugger; throw new Error("NonScalar sem nome"); }

                        const type = getEnityInputType(info_type.name, introspectionSchema as IntrospectionSchema);

                        if (typeElement.name === info_type.name) {
                            debuggMode && console.log("Refencia circular identificada, break");
                            console.log("Refencia circular identificada, break");
                            console.log(typeElement.name)
                            return;
                        }
                        // const _caminho_do_campo = `${caminho_do_campo}.${f.name}${info_type.is_list ? '.0' : ''}`;
                        form_schema.set(
                            type.name,
                            {
                                // pai: typeElement.name,
                                sub_forms: addSubForms(
                                    type.inputFields!,
                                    // _caminho_do_campo
                                    ),
                                nome_campo:f.type.name!,
                                form_fields: [],
                                multiple: info_type.is_list,
                            }
                        )

                        mapeia(
                            type,
                            //  _caminho_do_campo,
                              info_type.is_list
                        )
                    } else {
                        console.log("ofType de LIST não resolvido"); debugger
                    }
                } else {
                    console.log('não é InptObjc nem NONnull'); console.log(f.name, f.type.kind); debugger;
                }
            }
        )
    }
    mapeia(entityType, false);
    return form_schema;
}

import { computed, markRaw, reactive, Ref, shallowRef, watch, WritableComputedRef } from 'vue';
import { API, Cache } from 'aws-amplify';
import dot from 'dot-object';
import { UpdateCampoFormEstiloMutation, CampoFormEstilo, ListCampoFormEstilosQuery, ListCampoFormEstilosQueryVariables, CreateCampoFormEstiloInput, CreateCampoFormEstiloMutation, CreateCampoFormEstiloMutationVariables, GetCampoFormEstiloQuery, GetCampoFormEstiloQueryVariables, ModelCampoFormEstiloFilterInput, UpdateCampoFormEstiloMutationVariables, UpdateCampoFormEstiloInput } from '../../merm-schema/merm-types';
import { getCampoFormEstilo, listCampoFormEstilos } from '../../merm-schema/graphql/queries';
import { createCampoFormEstilo, updateCampoFormEstilo } from '../../merm-schema/graphql/mutations';
import { GraphQLResult } from '@aws-amplify/api';
import debounce from "lodash.debounce";

export class FormStateHandler {
    public state_as_json: WritableComputedRef<object> | undefined;
    constructor(
        public emit: Function,
        public state: Object
    ) { }

    get(introspection_caminho: string) {
        return dot.pick(introspection_caminho, this.state)
    }

    set(introspection_caminho: string, value: any) {
        dot.set(introspection_caminho, value, this.state)
        return value
    }
    delete(introspection_caminho: string) {
        dot.delete(introspection_caminho, this.state)
    }
    getField(introspection_caminho: string) {
        return computed({
            get: () => {
                return this.get(introspection_caminho)
            },
            set: (value) => {
                this.set(introspection_caminho, value)
            }
        })
    }
    addRef(introspection_caminho: string, multiple: boolean) {
        return this.set(
            introspection_caminho,
            multiple ? [] : undefined
        )
    }

}

export class FormStylingHandler {

    private cacheKeyPrefix = "style."
    private erro_reportado = false;

    style_state_as_Map = reactive(new Map<string, Ref<CampoFormEstilo>>())

    constructor(public form_id: string, private set_status: (status: 'parado' | 'atualizando' | 'erro' | 'sucesso') => void) {
        // Cache.clear()
        const cache_keys = (Cache.getAllKeys() as string[]).filter(k => k.startsWith(this.cacheKeyPrefix));
        for (let k of cache_keys) {
            this.style_state_as_Map.set(
                k,
                shallowRef<CampoFormEstilo>(Cache.getItem(k))
            )
        }
    }

    async graphql_pega(id: string, graphql_query?: string) {
        const result = await (API.graphql({
            query: getCampoFormEstilo,
            variables: { id } satisfies GetCampoFormEstiloQueryVariables,
            authMode: "AMAZON_COGNITO_USER_POOLS"
        }) as Promise<GraphQLResult<GetCampoFormEstiloQuery>>);
        // if (!this.erro_reportado) {
        //     debugger
        //     alert("Não foi possível conectar no banco de dados, trabalhando apenas com cache local");
        //     console.log(e);
        //     this.erro_reportado = true;
        // }
        return result.data!.getCampoFormEstilo

    }
    async graphql_cria(campoFormEstilo: CreateCampoFormEstiloInput) {
        const result = await (API.graphql({
            query: createCampoFormEstilo,
            variables: { input: { ...campoFormEstilo, amplifyFormVueEstilosCamposId: this.form_id } } satisfies CreateCampoFormEstiloMutationVariables,
            authMode: "AMAZON_COGNITO_USER_POOLS"
        }) as Promise<GraphQLResult<CreateCampoFormEstiloMutation>>);
        return result.data!.createCampoFormEstilo!
    }
    async graphql_lista(introspection_caminho: string) {
        const result = await (API.graphql({
            query: listCampoFormEstilos,
            variables: {
                filter: {

                    amplifyFormVueEstilosCamposId: { eq: this.form_id },
                    introspection_caminho: { eq: introspection_caminho }
                }
            } satisfies ListCampoFormEstilosQueryVariables,
            authMode: "AMAZON_COGNITO_USER_POOLS"
        }) as Promise<GraphQLResult<ListCampoFormEstilosQuery>>);
        return result.data!.listCampoFormEstilos?.items.pop()

    }
    private graphql_atualiza = debounce(
        this.graphql_atualiza_,
        1000, { leading: false, trailing: true }
    )
    async graphql_atualiza_(campoFormEstilo: CampoFormEstilo) {
        this.set_status('atualizando')
        const payload = {
            bs_class_input: campoFormEstilo.bs_class_input,
            bs_class_label: campoFormEstilo.bs_class_label,
            bs_class_wrap: campoFormEstilo.bs_class_wrap,
            esconder: campoFormEstilo.esconder,
            nao_usar: campoFormEstilo.nao_usar,
            mask: campoFormEstilo.mask,
            id: campoFormEstilo.id,
        } satisfies UpdateCampoFormEstiloInput;

        try {
            const result = await (API.graphql({
                query: updateCampoFormEstilo,
                variables: { input: payload } satisfies UpdateCampoFormEstiloMutationVariables,
                authMode: "AMAZON_COGNITO_USER_POOLS"
            }) as Promise<GraphQLResult<UpdateCampoFormEstiloMutation>>);
            this.set_status('sucesso')
            return result.data!.updateCampoFormEstilo!
        } catch (e) {
            console.log(JSON.stringify(e));
            this.set_status('erro')
            if (!this.erro_reportado) {
                debugger
                alert("Não foi possível conectar no banco de dados, trabalhando apenas com cache local");
                console.log(e);
                this.erro_reportado = true;
            }
        }

    }

    async get_field_references(introspection_caminho: string) {
        const key = this.cacheKeyPrefix + introspection_caminho;

        if (!this.style_state_as_Map.has(key)) {
            let new_v
            try {
                new_v = await this.graphql_lista(
                    introspection_caminho
                )
            } catch (e) {
                console.log(e);
                if (!this.erro_reportado) {
                    alert("Não foi possível conectar no banco de dados, trabalhando apenas com cache local");
                    this.erro_reportado = true;
                }
            }

            if (!new_v) {
                console.log("estilo não encontrado, criando...");

                try {

                    new_v = await this.graphql_cria(
                        {
                            bs_class_wrap: "",
                            bs_class_label: "",
                            bs_class_input: "",
                            esconder: false,
                            nao_usar: false,
                            mask: "",
                            introspection_caminho,
                        }
                    )
                } catch (e) {
                    console.log(e); console.log(e);
                    new_v = {
                        bs_class_wrap: "",
                        bs_class_label: "",
                        bs_class_input: "",
                        esconder: false,
                        nao_usar: false,
                        mask: "",
                        introspection_caminho,
                        __typename: "CampoFormEstilo",
                        id: "",
                        createdAt: "",
                        updatedAt: ""
                    } as CampoFormEstilo
                }

            }
            this.style_state_as_Map.set(
                key,
                shallowRef(new_v)
            )
            Cache.setItem(
                key,
                new_v
            )
        }


        const bs_class_label = computed({
            get: () => this.style_state_as_Map.get(key)!.value.bs_class_label,
            set:
                async (value) => {
                    this.style_state_as_Map.get(key)!.value = {
                        ...this.style_state_as_Map.get(key)!.value,
                        bs_class_label: value
                    }
                    this.graphql_atualiza(
                        this.style_state_as_Map.get(key)!.value
                    )

                    Cache.setItem(
                        key,
                        this.style_state_as_Map.get(key)!.value
                    )
                }

        })
        const bs_class_input = computed({
            get: () => this.style_state_as_Map.get(key)!.value.bs_class_input,
            set: async (value) => {
                this.style_state_as_Map.get(key)!.value = {
                    ...this.style_state_as_Map.get(key)!.value,
                    bs_class_input: value
                }

                await this.graphql_atualiza(
                    this.style_state_as_Map.get(key)!.value
                )
                Cache.setItem(
                    key,
                    this.style_state_as_Map.get(key)!.value
                )
            }
        })
        const bs_class_wrap = computed({
            get: () => this.style_state_as_Map.get(key)!.value.bs_class_wrap,
            set: async (value) => {
                this.style_state_as_Map.get(key)!.value = {
                    ...this.style_state_as_Map.get(key)!.value,
                    bs_class_wrap: value
                }
                await this.graphql_atualiza(
                    this.style_state_as_Map.get(key)!.value
                )
                Cache.setItem(
                    key,
                    this.style_state_as_Map.get(key)!.value
                )
            }

        })

        const clear_style = () => {
            this.style_state_as_Map.get(key)!.value = {
                ...this.style_state_as_Map.get(key)!.value,
                bs_class_wrap: "",
                bs_class_label: "",
                bs_class_input: "",
                esconder: false,
                nao_usar: false,

            }
            Cache.setItem(
                key,
                {
                    bs_class_wrap: "",
                    bs_class_label: "",
                    bs_class_input: ""
                }
            )
        }

        return {
            bs_class_label,
            bs_class_input,
            bs_class_wrap,
            clear_style,
            esconder: computed({
                get: () => this.style_state_as_Map.get(key)!.value.esconder,
                set: async (value) => {
                    this.style_state_as_Map.get(key)!.value = {
                        ...this.style_state_as_Map.get(key)!.value,
                        esconder: value
                    }
                    await this.graphql_atualiza(
                        this.style_state_as_Map.get(key)!.value
                    )
                    Cache.setItem(
                        key,
                        this.style_state_as_Map.get(key)!.value
                    )
                }
            }),
            nao_usar: computed({
                get: () => this.style_state_as_Map.get(key)!.value.nao_usar,
                set: async (value) => {
                    this.style_state_as_Map.get(key)!.value = {
                        ...this.style_state_as_Map.get(key)!.value,
                        nao_usar: value
                    }
                    await this.graphql_atualiza(
                        this.style_state_as_Map.get(key)!.value
                    )
                    Cache.setItem(
                        key,
                        this.style_state_as_Map.get(key)!.value
                    )
                }
            }),
            mask: computed({
                get: () => this.style_state_as_Map.get(key)!.value.mask,
                set: async (value) => {
                    this.style_state_as_Map.get(key)!.value = {
                        ...this.style_state_as_Map.get(key)!.value,
                        mask: value
                    }
                    await this.graphql_atualiza(
                        this.style_state_as_Map.get(key)!.value
                    )
                    Cache.setItem(
                        key,
                        this.style_state_as_Map.get(key)!.value
                    )
                }
            })

        }
    }
}

export class FormsValidation {

    public state = reactive(new Map<string, {
        validar: boolean,
        erros: string[],
        validado: boolean,
        formElement: HTMLFormElement
    }>()
    )

    get valido() {
        return [...this.state.values()].every(v => v.validado)
    }
    get erros() {
        return [...this.state.values()].flatMap(v => v.erros)
    }
    validar() {
        this.state.forEach(v => {
            v.validar = true
            v.validado = v.formElement.checkValidity()
            v.erros = Object.values(v.formElement.elements)
                .filter(i => (i instanceof HTMLInputElement) && !i.validity.valid)
                .map(i => {
                    console.log(`Campo ${i.localName}: ${(i as HTMLInputElement).validationMessage}`);
                    const input = i as HTMLInputElement
                    return `Campo ${input.name}: ${input.validationMessage}`
                })
            v.formElement
        })
        return this.valido
    }

}
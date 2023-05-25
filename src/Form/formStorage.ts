import { computed, ComputedRef, markRaw, reactive, Ref, shallowRef, watch, WritableComputedRef } from 'vue';
import objPath from "object-path";
import _ from 'lodash';
import { Cache } from 'aws-amplify';
import { FormFieldStyle } from './FormsElements/elementsTypes';


export class FormStateHandler {
    public state_as_Map = reactive(new Map<string, Ref | Ref<unknown[]>>())
    public inicializador_vmodelresult: (vModelValue: object) => void

    public state_as_json: WritableComputedRef<object> | undefined
    constructor(
        public emit: Function,
    ) {
        this.emit = emit

        // disponibiliza a function para inicializar vmodel 
        this.inicializador_vmodelresult = (vModelValue: object) => {
            const this_class = this;

            const root = { root: { ...vModelValue } }
            
            // carrega valor do parent no state
            const load_vmodel = () => {
                for (let k of this.state_as_Map.keys()) {
                    this.state_as_Map.get(k)!.value = objPath.get(root, k)
                }
            }
            load_vmodel()
            this.state_as_json = computed({
                get() {
                    load_vmodel()
                    return root
                },

                set(data_object) {
                    this_class.emit('update:modelValue', data_object.root)

                }
            })
        }
    }

    addRef(introspection_caminho: string, multiple: boolean) {
        this.state_as_Map.set(
            introspection_caminho,
            markRaw(multiple ? shallowRef([]) : shallowRef())
        )
        watch(
            this.state_as_Map.get(introspection_caminho)!,
            () => {
                this.emit(
                    'field_value_update',
                    {
                        name: introspection_caminho,
                        value: this.state_as_Map.get(introspection_caminho)
                    }
                )
            },
            { deep: multiple }
        );
        return this.state_as_Map.get(introspection_caminho)!

    }

    get_final_json() {
        return computed(() => {
            const json = {};
            for (let k of this.state_as_Map.keys()) {
                objPath.set(
                    json,
                    k,
                    this.state_as_Map.get(k)?.value
                )
            }
            if (this.state_as_json) this.state_as_json.value = json
            return json
        })
    }

    tt_final_json() {
        return _.throttle(
            () => this.get_final_json(),
            1000
        )()
    }
}



export class FormStylingHandler {

    private cacheKeyPrefix = "style."

    style_state_as_Map = reactive(new Map<string, Ref<FormFieldStyle>>())

    constructor() {
        // Cache.clear()
        const cache_keys = (Cache.getAllKeys() as string[]).filter(k => k.startsWith(this.cacheKeyPrefix));
        for (let k of cache_keys) {
            this.style_state_as_Map.set(
                k,
                shallowRef<FormFieldStyle>(Cache.getItem(k))
            )
        }
    }

    get_field_references(introspection_caminho: string) {
        const key = this.cacheKeyPrefix + introspection_caminho;

        if (!this.style_state_as_Map.has(key)) {
            const new_v = {
                bs_class_wrap: "",
                bs_class_label: "",
                bs_class_input: "",
                esconder: false,
                nao_usar: false,
            } satisfies FormFieldStyle;
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
            set: (value) => {
                this.style_state_as_Map.get(key)!.value = {
                    ...this.style_state_as_Map.get(key)!.value,
                    bs_class_label: value
                }
                Cache.setItem(
                    key,
                    this.style_state_as_Map.get(key)!.value
                )
            }
        })
        const bs_class_input = computed({
            get: () => this.style_state_as_Map.get(key)!.value.bs_class_input,
            set: (value) => {
                this.style_state_as_Map.get(key)!.value = {
                    ...this.style_state_as_Map.get(key)!.value,
                    bs_class_input: value
                }
                Cache.setItem(
                    key,
                    this.style_state_as_Map.get(key)!.value
                )
            }
        })
        const bs_class_wrap = computed({
            get: () => this.style_state_as_Map.get(key)!.value.bs_class_wrap,
            set: (value) => {
                this.style_state_as_Map.get(key)!.value = {
                    ...this.style_state_as_Map.get(key)!.value,
                    bs_class_wrap: value
                }
                Cache.setItem(
                    key,
                    this.style_state_as_Map.get(key)!.value
                )
            }

        })

        const clear_style = () => {
            Cache.setItem(
                key,
                {
                    bs_class_wrap: "",
                    bs_class_label: "",
                    bs_class_input: ""
                }
            )
            this.style_state_as_Map.get(key)!.value = {
                bs_class_wrap: "",
                bs_class_label: "",
                bs_class_input: "",
                esconder: false,
                nao_usar: false
            }
        }

        return {
            bs_class_label,
            bs_class_input,
            bs_class_wrap,
            clear_style,
            esconder: computed({
                get: () => this.style_state_as_Map.get(key)!.value.esconder,
                set: (value) => {
                    this.style_state_as_Map.get(key)!.value = {
                        ...this.style_state_as_Map.get(key)!.value,
                        esconder: value
                    }
                    Cache.setItem(
                        key,
                        this.style_state_as_Map.get(key)!.value
                    )
                }
            }),
            nao_usar: computed({
                get: () => this.style_state_as_Map.get(key)!.value.nao_usar,
                set: (value) => {
                    this.style_state_as_Map.get(key)!.value = {
                        ...this.style_state_as_Map.get(key)!.value,
                        nao_usar: value
                    }
                    Cache.setItem(
                        key,
                        this.style_state_as_Map.get(key)!.value
                    )
                }
            }),

        }
    }
}
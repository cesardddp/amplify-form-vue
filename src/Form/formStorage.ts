import { computed, markRaw, reactive, Ref, shallowRef, watch } from 'vue';
import objPath from "object-path";
import _ from 'lodash';
import { Cache } from 'aws-amplify';
import { FormFieldStyle } from './FormsElements/elementsTypes';


export class FormStateHandler {
    public state_as_Map = reactive(new Map<string, Ref | Ref<unknown[]>>())


    constructor(
        public emit: Function,
    ) {
        this.emit = emit
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

    private style_state_as_Map = reactive(new Map<string, Ref<FormFieldStyle>>())

    constructor() {
        const cache_keys = (Cache.getAllKeys() as string[]).filter(k => k.startsWith(this.cacheKeyPrefix));
        for (let k of cache_keys) {
            this.style_state_as_Map.set(
                k,
                shallowRef<FormFieldStyle>(Cache.getItem(k, ))
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
            clear_style

        }
    }
}
import { computed, markRaw, reactive, Ref, shallowRef, watch, WritableComputedRef } from 'vue';
import _ from 'lodash';
import { Cache } from 'aws-amplify';
import { FormFieldStyle } from './FormsElements/elementsTypes';


export class FormStateHandler {
    public state_as_Map = reactive(new Map<string, Ref | Ref<unknown[]>>())
    // public get state_as_Map(){
    //     return this._state_as_Map
    // }

    public state_as_json: WritableComputedRef<object> | undefined;
    constructor(
        public emit: Function,
    ) {
        this.emit = emit
    }

    addRef(introspection_caminho: string, multiple: boolean) {
        this.state_as_Map.set(
            introspection_caminho,
            multiple ? shallowRef([]) : shallowRef()
        )
        // watch(
        //     this.state_as_Map.get(introspection_caminho)!,
        //     () => {}, { deep: multiple }
        // );
        return this.state_as_Map.get(introspection_caminho)!

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
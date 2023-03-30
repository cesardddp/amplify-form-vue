import { markRaw, reactive, Ref, shallowRef, watch } from 'vue';
import objPath from "object-path";
import _ from 'lodash';


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
        const json = {};
        for (let k of this.state_as_Map.keys()) {
            objPath.set(
                json,
                k,
                this.state_as_Map.get(k)?.value
            )
        }
        return json
    }

    tt_final_json() {
        return _.throttle(
            () => this.get_final_json(),
            1000
        )()
    }
}



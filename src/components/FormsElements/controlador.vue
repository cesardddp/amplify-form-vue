<script setup lang="ts">
import { Ref, computed, reactive, ref, toRef, toRefs, watchEffect } from 'vue';


const slot_props = defineProps<{
    component: {
        nome: string;
        cpnt: any;
        test: any;
        comentarios: string;
        createdAt: string;
        props: {
            [k: string]: any;
        }
    },
    css_props: string[]
}>(
    // [
    // 'padrao',
    // 'nome',
    // 'cpnt',
    // 'test',
    // 'comentarios',
    // 'createdAt',
    // 'props',
    // ]
);



// NÃO USADO MAS PODE SER ÚTIL
// const nome = slot_props.component?.nome  //"NumberFieldSF";
// const cpnt = slot_props.component?.cpnt  //'Input';
// const test = slot_props.component?.test  //0;
// const comentarios = slot_props.component?.comentarios  //'';
// const createdAt = slot_props.component?.createdAt  //'';

// type css_areas = slot_props.css_props;
if (slot_props.css_props.length < 1) throw new Error("Informe quais props são CSSs strings");
const props_com_css_bs_classes = ref(slot_props.css_props.at(2) ?? '')
const component = toRef(slot_props, 'component')
const posicao_selecionada = ref<'p' | 'm'>('m') //margin padding

const css_areas = slot_props.css_props;//['wrap', 'label', 'input']

// SELEÇÃO DO TAMANHO DE MARGEM E PADDING
const get_computed = (posicao: 's' | 'e' | 't' | 'b') => {

    return computed({
        get() {
            const regex_pos_pos = new RegExp(`\\b[${posicao_selecionada.value}][${posicao}]+-\\d`, "g");
            return component.value.props[
                props_com_css_bs_classes.value
            ]?.match(regex_pos_pos)?.pop()?.at(3) ?? '0'
        },
        set(value) {
            if (value > 5 || value < 0) return;
            const regex_pos_pos = new RegExp(`\\b[${posicao_selecionada.value}][${posicao}]+-\\d`, "g");
            let bs_class: string = component.value.props[
                props_com_css_bs_classes.value
            ]
            const matchs = bs_class.match(regex_pos_pos)
            matchs?.forEach((m: string) => {
                bs_class = bs_class.replace(m, '').trim()
            });
            component.value.props[
                props_com_css_bs_classes.value
            ] = bs_class + (value != "" ? ` ${posicao_selecionada.value}${posicao}-${value}` : "")
        }
    })
}
const top = get_computed('t')
const start = get_computed('s');
const end = get_computed('e');
const bottom = get_computed('b');

// SELEÇÃO DO ESQUEMA DE CORES
const cores = [
    "primary",
    "secondary",
    "success",
    "danger",
    "warning",
    "info",
    "light",
    "dark",
    "white",
    ""
]
function get_computed_color(txt_bg: 'text-bg-' | 'text-') {
    return computed({
        get() {
            const regex_pos_pos = new RegExp(`${txt_bg}(${cores.filter(p => p).join('|')})`, "g");
            const a = component.value.props[
                props_com_css_bs_classes.value
            ]?.match(regex_pos_pos)?.pop().replace(`${txt_bg}`, '') ?? ''

            return a
        },
        set(value: string) {
            const regex_pos_pos = new RegExp(`${txt_bg}(${cores.filter(p => p).join('|')})`, "g");
            // console.log(regex_pos_pos);

            let bs_class: string = component.value.props[
                props_com_css_bs_classes.value
            ]
            const matchs = bs_class.match(regex_pos_pos)
            matchs?.forEach((m: string) => {
                bs_class = bs_class.replace(m, '').trim()
            });

            component.value.props[
                props_com_css_bs_classes.value
            ] = bs_class + (value ? ` ${txt_bg}${value}` : '')
        }
    })
}
const text_color = get_computed_color('text-')
const bg_color = get_computed_color('text-bg-')

// SELEÇÃO TAMANHO FONTE
const fs = [
    1, 2, 3, 4, 5, 6
].reverse()
function get_computed_size(txt_bg: 'fs-') {
    return computed({
        get() {
            const regex_pos_pos = new RegExp(`${txt_bg}(${fs.filter(p => p).join('|')})`, "g");
            const a = component.value.props[
                props_com_css_bs_classes.value
            ]?.match(regex_pos_pos)?.pop().replace(`${txt_bg}`, '') ?? ''

            return a
        },
        set(value: string) {
            const regex_pos_pos = new RegExp(`${txt_bg}(${fs.filter(p => p).join('|')})`, "g");
            // console.log(regex_pos_pos);

            let bs_class: string = component.value.props[
                props_com_css_bs_classes.value
            ]
            const matchs = bs_class.match(regex_pos_pos)
            matchs?.forEach((m: string) => {
                bs_class = bs_class.replace(m, '').trim()
            });

            component.value.props[
                props_com_css_bs_classes.value
            ] = bs_class + (value ? ` ${txt_bg}${value}` : '')
        }
    })
}
const text_size = get_computed_size('fs-')


// SELEÇÃO POSICAO FONTE
const text_posicoes = [
    "start",
    "center",
    "end",
]
function get_computed_posicao(txt_bg: 'text-') {
    return computed({
        get() {
            const regex_pos_pos = new RegExp(`${txt_bg}(${text_posicoes.filter(p => p).join('|')})`, "g");
            const a = component.value.props[
                props_com_css_bs_classes.value
            ]?.match(regex_pos_pos)?.pop().replace(`${txt_bg}`, '') ?? ''

            return a
        },
        set(value: string) {
            const regex_pos_pos = new RegExp(`${txt_bg}(${text_posicoes.filter(p => p).join('|')})`, "g");
            // console.log(regex_pos_pos);

            let bs_class: string = component.value.props[
                props_com_css_bs_classes.value
            ]
            const matchs = bs_class.match(regex_pos_pos)
            matchs?.forEach((m: string) => {
                bs_class = bs_class.replace(m, '').trim()
            });

            component.value.props[
                props_com_css_bs_classes.value
            ] = bs_class + ` ${txt_bg}${value}`
        }
    })
}
const text_posicao = get_computed_posicao('text-')



/////
const props = computed(
    () => {

        const bs_classes = (Object.fromEntries(css_areas.map(css_area => {
            const bs_class = component.value.props[css_area];
            return [
                css_area,
                bs_class
            ]
        })))
        return {
            ...slot_props.component?.props,
            ...bs_classes.value
        }
    } //
)

</script>
<template>
    <nav id="nav" class="row p-1 m-1">
        <ul class="nav nav-tabs" id="navId" role="tablist">

            <span class="my-2 text-primary"> Editando:
                <strong class="text-danger"></strong></span>
            <li class="nav-item dropdown">
                <a class="nav-link dropdown-toggle text-danger" data-bs-toggle="dropdown" href="#" role="button"
                    aria-haspopup="true" aria-expanded="false"> <strong>
                        {{ props_com_css_bs_classes }}
                    </strong></a>
                <div class="dropdown-menu">
                    <a v-for="prop in slot_props.css_props" @click="props_com_css_bs_classes = prop"
                        class="dropdown-item">{{ prop }}</a>
                </div>
            </li>
            <li class="nav-item dropdown">
                <a class="nav-link dropdown-toggle text-danger" data-bs-toggle="dropdown" href="#" role="button"
                    aria-haspopup="true" aria-expanded="false"> <strong>
                        {{ posicao_selecionada=== 'm' ? "Margem" : "Preenchimento" }}
                    </strong></a>
                <div class="dropdown-menu">
                    <a @click="posicao_selecionada = 'm'" class="nav-link text-success active"
                        data-bs-toggle="tab">Margem</a>
                    <a @click="posicao_selecionada = 'p'" class="nav-link text-success"
                        data-bs-toggle="tab">Preenchimento</a>
                </div>
            </li>
        </ul>
    </nav>
    <div id="color" class="row text-primary">
        <div class="col-3">
            <label for="bg_color" class="form-label">Cor do background</label>
            <select v-model="bg_color" :class="'text-bg-' + bg_color"
                class="form-select form-select-sm border border-primary" name="bg_color" id="bg_color">
                <option v-for="cor in cores" :value="cor">{{ cor?cor: '(nenhum)' }}</option>
            </select>
        </div>
        <div class="col-3">
            <label for="text_color" class="form-label">Cor do texto</label>
            <select v-model="text_color" :class="'text-bg-' + text_color"
                class="form-select form-select-sm border border-primary" name="text_color" id="text_color">
                <option v-for="cor in cores" :value="cor">{{ cor?cor: '(nenhum)' }}</option>
            </select>
        </div>
        <div class="col-3">
            <label for="text_color" class="form-label">Tamanho do texto</label>
            <select v-model="text_size" class="form-select form-select-sm border border-primary" name="text_color"
                id="text_color">
                <option v-for="size in fs" :class="'fs-' + size" :value="size">{{ size }}</option>
            </select>
        </div>
        <div class="col-3">
            <label for="text_posicao" class="form-label">Posicao do texto</label>
            <select v-model="text_posicao" class="form-select form-select-sm border border-primary" name="text_posicao"
                id="text_posicao">
                <option v-for="posic in text_posicoes" :class="'fs-' + posic" :value="posic">{{ posic }}</option>
            </select>
        </div>
    </div>
    <div id="controler" class="row mt-1 ">
        <div class="col-12 row justify-content-center ">
            <!-- <input v-model="top" class="col-2" type="number" min="0" max="5"> -->
            <button @click="top = parseInt(top) + 1" type="button"
                class="btn col-1 btn-outline-primary btn-sm bi bi-arrow-bar-up"></button>
            <span class="text-center"> {{ top }}</span>
            <button @click="top = parseInt(top) - 1" type="button"
                class="btn col-1 btn-outline-primary btn-sm bi bi-arrow-bar-down"></button>
        </div>
        <div class="col-2 row align-items-center">
            <!-- <input v-model="start" class="w-100" type="number" min="0" max="5"> -->
            <button @click="start = parseInt(start) + 1" type="button"
                class="btn  btn-outline-primary btn-sm bi bi-arrow-bar-right"></button>
            <span class="text-center"> {{ start }}</span>
            <button @click="start = parseInt(start) - 1" type="button"
                class="btn  btn-outline-primary btn-sm bi bi-arrow-bar-left"></button>
        </div>

            <slot :props="props">

            </slot>

        <div class="col-2 row d-flex flex-row align-items-center">
            <!-- <input v-model="end" class="w-100" type="number" min="0" max="5"> -->
            <span @click="end = parseInt(end) + 1" type="button"
                class="btn  btn-outline-primary btn-sm bi bi-arrow-bar-right"></span>
            <span class="text-center "> {{ end }}</span>
            <i @click="end = parseInt(end) - 1" type="button"
                class="btn  btn-outline-primary btn-sm bi bi-arrow-bar-left"></i>
        </div>

        <div class="col-12  row justify-content-center ">
            <!-- <input v-model="bottom" class="col-2" type="number" min="0" max="5"> -->
            <button @click="bottom = parseInt(bottom) + 1" type="button"
                class="btn col-1 btn-outline-primary btn-sm bi bi-arrow-bar-up"></button>
            <span class="text-center"> {{ bottom }}</span>
            <button @click="bottom = parseInt(bottom) - 1" type="button"
                class="btn col-1 btn-outline-primary btn-sm bi bi-arrow-bar-down"></button>
        </div>
    </div>
</template>
<!-- <style>
select option{
    color:{{text_color}};
}
</style> -->
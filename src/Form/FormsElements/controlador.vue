<script setup lang="ts">
import { Ref, computed, reactive, ref, toRef, toRefs, watchEffect, inject } from 'vue';
import { FormStylingHandler } from '../formStorage';
import { InputProps, SelectProps, ItemsProps } from "./elementsTypes";

const slot_props = defineProps<{
    introspect_caminho: string
}>(
);

const props_com_css_bs_classes = ref<'bs_class_wrap' | 'bs_class_label' | 'bs_class_input'>('bs_class_input')
const posicao_selecionada = ref<'p' | 'm'>('m') //margin padding



const formStylingHandler = (inject("form_styling_handler") as FormStylingHandler).get_field_references(slot_props.introspect_caminho!);

// SELEÇÃO DO TAMANHO DE MARGEM E PADDING
const get_computed = (posicao: 's' | 'e' | 't' | 'b') => {

    return computed({
        get() {
            const regex_pos_pos = new RegExp(`\\b[${posicao_selecionada.value}][${posicao}]+-\\d`, "g");
            return formStylingHandler[
                props_com_css_bs_classes.value
            ].value.match(regex_pos_pos)?.pop()?.at(3) ?? '0'
        },
        set(value) {
            if (value > '5' || value < '0') return;
            const regex_pos_pos = new RegExp(`\\b[${posicao_selecionada.value}][${posicao}]+-\\d`, "g");

            let bs_class = formStylingHandler[
                props_com_css_bs_classes.value
            ]

            const matchs = bs_class.value.match(regex_pos_pos)
            matchs?.forEach((m: string) => {
                bs_class.value = bs_class.value.replace(m, '').trim()
            });

            bs_class.value = bs_class.value + (value ? ` ${posicao_selecionada.value}${posicao}-${value}` : "")

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
            const a = formStylingHandler[
                props_com_css_bs_classes.value
            ].value.match(regex_pos_pos)?.pop()?.replace(`${txt_bg}`, '') ?? ''

            return a
        },
        set(value: string) {
            const regex_pos_pos = new RegExp(`${txt_bg}(${cores.filter(p => p).join('|')})`, "g");
            // console.log(regex_pos_pos);

            let bs_class = formStylingHandler[
                props_com_css_bs_classes.value
            ]
            const matchs = bs_class.value.match(regex_pos_pos)
            matchs?.forEach((m: string) => {
                bs_class.value = bs_class.value.replace(m, '').trim()
            });
            bs_class.value = bs_class.value + (value ? ` ${txt_bg}${value}` : '')
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
            const a = formStylingHandler[
                props_com_css_bs_classes.value
            ].value.match(regex_pos_pos)?.pop()?.replace(`${txt_bg}`, '') ?? ''

            return a
        },
        set(value: string) {
            const regex_pos_pos = new RegExp(`${txt_bg}(${fs.filter(p => p).join('|')})`, "g");
            // console.log(regex_pos_pos);

            let bs_class = formStylingHandler[
                props_com_css_bs_classes.value
            ]
            const matchs = bs_class.value.match(regex_pos_pos)
            matchs?.forEach((m: string) => {
                bs_class.value = bs_class.value.replace(m, '').trim()
            });


            bs_class.value + (value ? ` ${txt_bg}${value}` : '')

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
            const a = formStylingHandler[
                props_com_css_bs_classes.value
            ].value.match(regex_pos_pos)?.pop()?.replace(`${txt_bg}`, '') ?? ''

            return a
        },
        set(value: string) {
            const regex_pos_pos = new RegExp(`${txt_bg}(${text_posicoes.filter(p => p).join('|')})`, "g");
            // console.log(regex_pos_pos);

            let bs_class = formStylingHandler[
                props_com_css_bs_classes.value
            ]
            const matchs = bs_class.value.match(regex_pos_pos)
            matchs?.forEach((m: string) => {
                bs_class.value = bs_class.value.replace(m, '').trim()
            });


            bs_class.value + ` ${txt_bg}${value}`

        }
    })
}
const text_posicao = get_computed_posicao('text-')
const ocultar = computed({
    get(){
        return formStylingHandler.bs_class_wrap.value.includes('d-none')
    },
    set(v){
        if(v){
            formStylingHandler.bs_class_wrap.value = formStylingHandler.bs_class_wrap.value + ' d-none'
        }else{
            formStylingHandler.bs_class_wrap.value = formStylingHandler.bs_class_wrap.value.replace('d-none', '').trim()
        }
        
    }
})
</script>
<template>
    <nav id="nav" class="row p-1 m-1">
        <ul class="nav nav-tabs" id="navId" role="tablist">

            <span class="my-2 text-primary"> Editando: </span>
            <li class="nav-item dropdown">
                <a class="nav-link dropdown-toggle text-danger" data-bs-toggle="dropdown" role="button" aria-haspopup="true"
                    aria-expanded="false">
                    <strong>{{ props_com_css_bs_classes }}</strong>
                </a>
                <div class="dropdown-menu">
                    <a @click="props_com_css_bs_classes = 'bs_class_wrap'" class="dropdown-item">bs_class_wrap</a>
                    <a @click="props_com_css_bs_classes = 'bs_class_input'" class="dropdown-item">bs_class_input</a>
                    <a @click="props_com_css_bs_classes = 'bs_class_label'" class="dropdown-item">bs_class_label</a>
                </div>
            </li>
            <li class="nav-item dropdown">
                <a class="nav-link dropdown-toggle text-danger" data-bs-toggle="dropdown" role="button" aria-haspopup="true"
                    aria-expanded="false">
                    <strong>
                        {{ posicao_selecionada === 'm' ? "Margem" : "Preenchimento" }}
                    </strong>
                </a>
                <div class="dropdown-menu">
                    <a @click="posicao_selecionada = 'm'" class="nav-link text-success active"
                        data-bs-toggle="tab">Margem</a>
                    <a @click="posicao_selecionada = 'p'" class="nav-link text-success"
                        data-bs-toggle="tab">Preenchimento</a>
                </div>
            </li>
            <li class="">
                <a @click="formStylingHandler.clear_style" class="nav-link text-success"
                    data-bs-toggle="tab">clear_style</a>
            </li>
        </ul>
    </nav>
    <div class="row row-cols-4 text-primary">
        <div class="col">
            <label for="bg_color" class="form-label">Cor do background</label>
            <select v-model="bg_color" :class="'text-bg-' + bg_color"
                class="form-select form-select-sm border border-primary" name="bg_color" id="bg_color">
                <option v-for="cor in cores" :value="cor">{{ cor ? cor : '(nenhum)' }}</option>
            </select>
        </div>
        <div class="col">
            <label for="text_color" class="form-label">Cor do texto</label>
            <select v-model="text_color" :class="'text-bg-' + text_color"
                class="form-select form-select-sm border border-primary" name="text_color" id="text_color">
                <option v-for="cor in cores" :value="cor">{{ cor ? cor : '(nenhum)' }}</option>
            </select>
        </div>
        <div class="col">
            <label for="text_color" class="form-label">Tamanho do texto</label>
            <select v-model="text_size" class="form-select form-select-sm border border-primary" name="text_color"
                id="text_color">
                <option v-for="size in fs" :class="'fs-' + size" :value="size">{{ size }}</option>
            </select>
        </div>
        <div class="col">
            <label for="text_posicao" class="form-label">Posicao do texto</label>
            <select v-model="text_posicao" class="form-select form-select-sm border border-primary" name="text_posicao"
                id="text_posicao">
                <option v-for="posic in text_posicoes" :class="'fs-' + posic" :value="posic">{{ posic }}</option>
            </select>
        </div>
        <div class="col">
            <label for="ocultar" class="form-label">Ocultar</label>
            <input type="checkbox" v-model="ocultar" name='ocultar'>
        </div>
        <div class="col">
                <label for="nao_usar" class="form-label">Não Usar</label>
            <input type="checkbox" v-model="formStylingHandler.nao_usar.value" name="nao_usar">
        </div>
        <div class="col">
                <label for="mask" class="form-label">Máscara</label>
            <input type="text" v-model="formStylingHandler.mask.value" name="mask">
        </div>

    </div>
    <label class="text-primary" > classe atual
        <input type="text" class="form-control" v-model="formStylingHandler[props_com_css_bs_classes].value">
    </label>
    <div id="controler" class="row mt-1 ">
        <div class="col-12 row justify-content-center ">
            <!-- <input v-model="top" class="col-2" type="number" min="0" max="5"> -->
            <button @click="top = (Number(top) + 1).toString()" type="button"
                class="btn col-1 btn-outline-primary btn-sm bi bi-arrow-bar-up"></button>
            <span class="text-center"> {{ top }}</span>
            <button @click="top = (Number(top) - 1).toString()" type="button"
                class="btn col-1 btn-outline-primary btn-sm bi bi-arrow-bar-down"></button>
        </div>
        <div class="col-2 row align-items-center">
            <!-- <input v-model="start" class="w-100" type="number" min="0" max="5"> -->
            <button @click="start = (Number(start) + 1).toString()" type="button"
                class="btn  btn-outline-primary btn-sm bi bi-arrow-bar-right"></button>
            <span class="text-center"> {{ start }}</span>
            <button @click="start = (Number(start) - 1).toString()" type="button"
                class="btn  btn-outline-primary btn-sm bi bi-arrow-bar-left"></button>
        </div>
        <div class="col-8 border border-primary d-grid align-items-center">
            <slot />

        </div>
        <div class="col-2 row d-flex flex-row align-items-center">
            <!-- <input v-model="end" class="w-100" type="number" min="0" max="5"> -->
            <span @click="end = (Number(end) + 1).toString()" type="button"
                class="btn  btn-outline-primary btn-sm bi bi-arrow-bar-right"></span>
            <span class="text-center "> {{ end }}</span>
            <i @click="end = (Number(end) - 1).toString()" type="button"
                class="btn  btn-outline-primary btn-sm bi bi-arrow-bar-left"></i>
        </div>

        <div class="col-12  row justify-content-center ">
            <!-- <input v-model="bottom" class="col-2" type="number" min="0" max="5"> -->
            <button @click="bottom = (Number(bottom) + 1).toString()" type="button"
                class="btn col-1 btn-outline-primary btn-sm bi bi-arrow-bar-up"></button>
            <span class="text-center"> {{ bottom }}</span>
            <button @click="bottom = (Number(bottom) - 1).toString()" type="button"
                class="btn col-1 btn-outline-primary btn-sm bi bi-arrow-bar-down"></button>
        </div>
    </div>
</template>
<!-- <style>
select option{
    color:{{text_color}};
}
</style> -->
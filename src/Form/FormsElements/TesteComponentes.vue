<script setup lang="ts" >
import SubmitButton, { SubmitButtonProps } from "./SubmitButton.vue";
import SelectField from "./SelectField.vue";
import Items from "./Items.vue";
import { ref, reactive, markRaw, watch, watchEffect } from "vue";
import Input from "./Input.vue";
import Controlador from "./controlador.vue";
import _ from "lodash";
// import { SubmitButtonProps } from "../types";

const baseFieldProps = {
    nome: 'base',
    label: 'base label',
    disabled: false,
    bs_class_wrap: 'ms-4 mt-4 mb-4 me-4 text-danger',
    bs_class_input: 'ms-0 mt-0 mb-0 me-0 pt-1',
    bs_class_label: 'ms-1 mt-0 mb-0 me-0 pe-0 pt-0 pb-0 pe-0',
    placeholder: 'base placeholder',
}

const checkboxProps = {
    ...baseFieldProps,
    nome: 'checkNome',
    label: "label checkBs",
    bootstrap_syncfusion: 'bs',
    type: 'checkbox',
    // bs_class
}
const checkboxPropsSF = {
    ...checkboxProps, bootstrap_syncfusion: 'sf', cssSFClass: 'e-success', label: "label checkSF", nome: 'checkSFNome'
};

const numberFieldProps = {
    ...baseFieldProps,
    nome: "number",
    label: "number label",
    placeholder: "number placeholder",
    type: 'number',
    bootstrap_syncfusion: 'bs',
    step: '0.2',
};
const numberFieldSFProps = {
    ...numberFieldProps,
    nome: "number sf",
    label: "number label sf",
    placeholder: "number placeholder sf",
    type: 'number',
    bootstrap_syncfusion: 'sf',
    step: '0.2',
    currency: 'BRL'
};

const textFieldProps = {
    ...baseFieldProps,
    nome: "textField",
    label: "textField label",
    bs_class_wrap: '',
    bs_class_input: '',
    bs_class_label: '',
    // rows: '30',

    // placeholder: "TextAreaFieldProps placeholder",
    // labelCentered: true,
    // fieldSize: "FieldSize",
    // theme: {
    //     color: "orange",
    //     branding: 'basic'
    // },
    // isSubmitting: false,
    // selectedValue: "selectLabel",
};
const textFieldSyncFusionProps = {
    ...textFieldProps,
    label: 'label textFieldSyncFusio',
    floatLabelType: "Auto",
    is_text_area: false,
    bootstrap_syncfusion: 'sf',
    cssclass: ''
}
const textAreaFieldProps = {
    ...textFieldProps,
    nome: "textArea",
    label: "textArea label",
    // theme: {
    //     color: "orange",
    //     branding: 'basic'
    // },
    is_text_area: true,
    rows: '10',
    // cols: 30,
    placeholder: "TextAreaField placeholder"
};
const textAreaFieldSFProps = {
    ...textFieldProps,
    nome: 'textArea SF',
    placeholder: 'textArea SF',
    label: 'label textFieldSyncFusio',
    bootstrap_syncfusion: 'sf',
    // text area
    rows: '',
    // sf:
    floatLabelType: "Auto",
    is_text_area: true,
    cssclass: ''
};
const submitButtonProps: SubmitButtonProps = {
    // theme: {
    //     color: "green",
    //     branding: 'basic'
    // },
    title: "Submit button",
    btn_theme: "btn-warning",
    bootstrap_syncfusion: 'bs',
    disabled: false,
    //   theme?: FormTheme;
    bs_class_wrap: '',
    bs_class_input: '',
    bs_class_label: '',
    iconCss: 'bi bi-balloon', iconPosition: "Right"
};
// const selectField: SelectField = {};
// const numberField: NumberField = {};
const selectFieldProps = {
    nome: "select",
    label: "select label",
    selectedValue: "value1",
    options: [
        {
            label: "label1",
            value: "value1",
        },
        {
            label: "label2",
            value: "value2",
        },
        {
            value: "value3",
        },
        {
            label: "labelteste",
            value: "vlor teste",
        },
    ]
}

const submitButtonFSProps: SubmitButtonProps = { ...submitButtonProps, title: "Submit button", bootstrap_syncfusion: 'sf', fs_isPrimary: true, }

const itensProps = {
    nome: "Itens",
    label: "Itens Label",
    disabled: false,
    bs_class_wrap: '',
    bs_class_input: '',
    bs_class_label: '',
    // bootstrap_syncfusion?: 'bs' | 'sf';
    placeholder: '',
}

// const cache = new Cache()

// function get_Cache(nome: string, props_padrão: any) {
//     const item = Cache.getItem(nome);
//     if (item) return item
//     else {
//         Cache.setItem(nome, props_padrão);
//         return props_padrão
//     }
// }
// const save_Cache = _.debounce(
//     (nome: string, new_props: any) => {
//         console.log('salvo');
//         Cache.setItem(nome, new_props);
//         return true
//     },
//     2000
// )


const componentes = ref<{
    nome: string,
    cpnt: any,
    test: any,
    comentarios: string,
    createdAt: string,
    props: { [k: string]: any },
}[]>([
    { nome: "Items", cpnt: markRaw(Items), test: ['1'], props: reactive(itensProps), comentarios: '', createdAt: '' },
    { nome: "CheckboxField", cpnt: markRaw(Input), test: false, props: reactive(checkboxProps), comentarios: '', createdAt: '' },
    { nome: "CheckboxFieldSF", cpnt: markRaw(Input), test: false, props: reactive(checkboxPropsSF), comentarios: '', createdAt: '' },
    { nome: "NumberField", cpnt: markRaw(Input), test: 0, props: reactive(numberFieldProps), comentarios: '', createdAt: '' },
    { nome: "NumberFieldSF", cpnt: markRaw(Input), test: 0, props: reactive(numberFieldSFProps), comentarios: '', createdAt: '' },
    { nome: "TextField", cpnt: markRaw(Input), test: ref(""), props: reactive(textFieldProps), comentarios: '', createdAt: '' },
    { nome: "TextAreaFieldSyncFusion", cpnt: markRaw(Input), test: '', props: reactive(textAreaFieldSFProps), comentarios: '', createdAt: '' },
    { nome: "SubmitButton", cpnt: markRaw(SubmitButton), test: () => alert('fui clicado'), props: reactive(submitButtonProps), comentarios: '', createdAt: '' },
    { nome: "SubmitButtonFS", cpnt: markRaw(SubmitButton), test: '', props: reactive(submitButtonFSProps), comentarios: '', createdAt: '' },
    { nome: "SelectField", cpnt: markRaw(SelectField), test: selectFieldProps.selectedValue, props: reactive(selectFieldProps), comentarios: '', createdAt: '' },
])

let first = true
const test = componentes.value.map(cp =>
    watch(cp,
        (val) => {
            if (!first) {
                console.log('salvando...');
                // save_Cache(cp.nome, cp.props)
                return;
            }
            else {
                first = false
                cp.props.salvo = true
                // cp.props = get_Cache(cp.nome, cp.props)
                console.log("cache carregado");
            }
        }
        , { deep: true })

)


function retun_form_type(value: any): string {
    const tipo = typeof value;

    switch (tipo) {
        case 'string':
            return 'text';
        case 'boolean':
            return 'checkbox'

        default:
            return ''
            break;
    }
}

const envia_comentario = (cp: any) => {
    if (cp.createdAt) {
        atualiza_comentario(cp);
        return
    }

    // const payload: CreateComentariosMutationVariables = {
    //     input: {
    //         id: cp.nome,
    //         text: cp.comentarios
    //     }
    // };


    // (API.graphql({
    //     query: createComentarios,
    //     variables: payload,
    // }) as Promise<GraphQLResult<CreateComentariosMutation>>).then(x => {
    //     cp.createdAt = x.data?.createComentarios?.createdAt
    //     alert('sucesso\n' + x.data?.createComentarios?.text)
    // })

}
const atualiza_comentario = (cp: any) => {

    // const payload: UpdateComentariosMutationVariables = {
    //     input: {
    //         id: cp.nome,
    //         text: cp.comentarios
    //     }
    // };


    // (API.graphql({
    //     query: updateComentarios,
    //     variables: payload,
    // }) as Promise<GraphQLResult<UpdateComentariosMutation>>).then(x => {
    //     cp.comentarios = x.data?.updateComentarios?.text
    //     alert('sucesso\n' + x.data?.updateComentarios?.text)
    // })

}
// const pega_comentario = async (id: string) => {
//     // return;
//     const result = await (API.graphql({
//         query: getComentarios,
//         variables: { id, },
//     }) as Promise<GraphQLResult<GetComentariosQuery>>)//.then(x => { 'debugger' })
//     return result
// }

// componentes.value.forEach(cp => {
//     return pega_comentario(cp.nome).then((r) => {
//         cp.comentarios = r.data?.getComentarios?.text ?? '';
//         cp.createdAt = r.data?.getComentarios?.createdAt ?? '';
//     })
// })


</script>
<template>
    <ul>
        <span class="fs-5"> // TODO</span>
        <li>substituir os components html nativos por componentes BS5 e SyncFusion <i
                class="bi bi-check fs-3 text-success"></i></li>
        <li>Adequar código de pré-preenchimento (react->vue) (pra update)</li>
        <li>Alterar código para adicionar validção do BS5 e SyncFusion</li>
    </ul>
    <div v-for="c in componentes" class="container mx-auto teste m-1 p-1">

        <div class="accordion" :id="`accordion-components-${c.nome}`">
            <div class="accordion-item">
                <h2 class="accordion-header" :id="`heading-components-${c.nome}`">
                    <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse"
                        :data-bs-target="`#collapse-components-${c.nome}`" aria-expanded="true"
                        :aria-controls="`collapse-components-${c.nome}`">
                        <h4>{{ c.nome }}</h4>
                    </button>
                </h2>
                <div :id="`collapse-components-${c.nome}`" class="accordion-collapse collapse"
                    :aria-labelledby="`heading-components-${c.nome}`" :data-bs-parent="`#accordion-components-${c.nome}`">
                    <div class="accordion-body row">

                        <ul class="list-group list-group-flush col-lg-3 col-sm-12 d-flex flex-column">
                            <b>props: </b>
                            <li v-for='v, k in c.props' class="list-group-item">
                                <label>
                                    <code><strong>{{ k }}</strong></code>:
                                    <!-- {{ v }} -->
                                    <input :type="retun_form_type(v)" v-model="c.props[k]" />
                                </label>
                            </li>
                        </ul>

                        <section class="col-lg-9 col-sm-12">
                            <b>componente: </b>
                            <!-- <Controlador v-slot="slotProps" :component="c"
                                :css_props="['bs_class_input', 'bs_class_label', 'bs_class_wrap']">
                                <div class="col-8 border border-primary d-grid align-items-center">
                                    <component :is="c.cpnt" v-bind="slotProps.props" v-model="c.test" :key="c.nome" />
                                </div>
                            </Controlador> -->
                            <div class="alert alert-info w-50" role="alert">
                                Teste: <span class="bg-warning text-dark p-2"> {{ c.test }} </span>
                            </div>
                            <div class="w-100 mt-3 border border-success rounded p-1">
                                <h3>Insira Comentários aqui Luiz!!!</h3>
                                <div class="form-floating">
                                    <textarea class="form-control" v-model="c.comentarios" :name="c.nome"
                                        style="height: 10em;" :id="c.nome"></textarea>
                                    <label for="c.nome">Comentários</label>
                                </div>
                                <div class="w-100 d-flex justify-content-center mt-2">

                                    <button type="submit" class="btn btn-primary col-3"
                                        @click.prevent="() => envia_comentario(c)">Atualizar</button>
                                </div>
                            </div>
                        </section>
                    </div>
                </div>
            </div>
        </div>

    </div>


    <!-- <CheckboxField v-bind="checkboxProps" /> -->
    <!--  <CheckboxFieldSF v-bind="checkboxPropsSF" v-model="tests.CheckboxField"/> -->
    <!-- <TextField v-bind="textFieldProps" /> -->
    <!-- <TextFieldSyncFusion v-bind="textFieldSyncFusionProps"  /> -->
    <!-- <TextAreaField v-bind="textAreaFieldProps" /> -->
    <!-- <SubmitButton v-bind="submitButtonProps" /> -->
    <!-- <SubmitButton v-bind="{title: "Submit button",bootstrap_syncfusion:'sf'}/> -->
    <!-- <SelectField v-bind="selectFieldProps" /> -->
    <!-- <NumberField v-bind="numberField" /> -->
</template>
<style>
.teste {
    background-color: rgba(255, 0, 0, 0.1);
    border-radius: 10px;
}
</style>
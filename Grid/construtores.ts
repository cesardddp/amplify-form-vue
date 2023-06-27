import { Query } from "@syncfusion/ej2-data";
import {
    editTypes,
    ColunaConfigs,
    OnEditColuna,
    Validadores,
    OpcoesTabela,
    editSettingsMode,
    toolBarOptions
} from "../../merm-schema/merm-types";

import { cpf, cnpj } from "cpf-cnpj-validator";





export class Coluna {
    editavel: Boolean;
    edit?: OnEditColuna;
    validationRules?: AddValidacao
    valor_padrao?: Function
    editType: editTypes | null | undefined;

    private async configura_propriedade_Syncfusion__edit__() {

        if (!this.configs.editando) throw new Error(`Configurações de edição do campo ${this.configs.nome} vazias`);

        let edit_result: {
            params: {
                dataSource?: unknown,
                query?: Query,
                fields?: unknown,
                value?: Date | unknown
            }
        }

        switch (this.configs.editando.editType) {
            case 'dropdownedit':
                // if (this.configs.editando.fonte_dados === 'api') {
                //     throw new Error("precisa de implementação");

                //     const api_name = this.configs.editando.api?.nome
                //     if (!api_name) throw new Error(`Nome da api da fonte de dados do campo ${this.configs.nome} está vazio!`);

                //     let cache = Cache.getItem(api_name)

                //     /// TODO valores fixos pra generalizar depois /////////////////////////
                //     type typeAtv = {                                                     //
                //         tmp: string,                                                       //
                //         idserver: string,                                                  //
                //         descricao: string                                                  //
                //     }                                                                    //
                //     const CAMPO_CHAVE = 'descricao';                                     //
                //     const CAMPO_VALOR = 'idserver';                                     //
                //     const API_BODY = { idserver: "" };                                   //
                //     const MUTATION_RESPONSE = 'Get' + api_name + 'Mutation';             //
                //     const DURACAO_CACHE_LOCAL_DIAS = 1;                                  //
                //     ///////////////////////////////////////////////////////////////////////

                //     if (!cache) {
                //         const resposta = (await API.graphql(
                //             {
                //                 query: (mutations as any)[api_name],
                //                 variables: { body: API_BODY },
                //             },
                //         )) as GraphQLResult<any>;
                //         const tipoAtvs: typeAtv[] = JSON.parse(resposta.data[api_name]);

                //         const today = new Date()
                //         let expires_day = new Date()
                //         expires_day.setDate(today.getDate() + DURACAO_CACHE_LOCAL_DIAS)

                //         Cache.setItem(
                //             api_name,
                //             tipoAtvs,
                //             { expires: expires_day.getTime() }
                //         );

                //         cache = tipoAtvs
                //     }
                //     edit_result.params.dataSource = cache
                //     edit_result.params.fields = { text: CAMPO_CHAVE, value: CAMPO_VALOR }
                //     edit_result.params.allowFiltering = this.configs.editando.allowFiltering ?? false
                // }
                // else if (this.configs.editando.fonte_dados === 'estático') {
                edit_result = {

                    params: {
                        dataSource: this.configs.editando.static,
                        query: new Query()
                    }
                }

                // }
                break;
            case 'datepickeredit':
                edit_result = {

                    params: {
                        value: new Date()
                    }
                }
                break;
            case 'stringedit':
                return undefined;
            default:
                return undefined;
        }
        return edit_result
    }

    private configura_filtro() {

    }
    constructor(
        public configs: ColunaConfigs
    ) {

        this.editavel = configs.editando?.editavel ?? true;
        if (configs.editando) {
            this.editType = configs.editando.editType
            this.configura_propriedade_Syncfusion__edit__()
                .then(cfg => {
                    this.edit = cfg as any // TODO GAMBIARRA
                })
        };
        if (configs.validadores) {
            this.validationRules = new AddValidacao(configs.validadores)
        };

        if (configs.valor_padrao) {
            const op = configs.valor_padrao.split(":")
            switch (op[0]) {
                case "date":
                    if (op[1] === 'now') this.valor_padrao = () => new Date()

                    break;
                case "text":
                    if (!op[1]) throw new Error("Valor padrão vazio!");
                    this.valor_padrao = () => op[1]

                    break;

                default:
                    break;
            }
        }
        configs.allowFiltering = configs.allowFiltering ?? false
        // if (configs.valor_padrao) this.valor_padrão = () => this.valor_padrão


    }
}

export const opcoes_default = {
    titulo: { visibilidade: true, css_class: '',__typename: 'Titulo' },
    desabilitar_extensoes: [],
    paginacaoOpcoes: {
        allowPaging: true,
        pageSettings: {
            pageSize: 5,
            __typename: 'PageSettings'
        },
        __typename: 'PaginacaoOpcoes'
    },
    ordenacaoOpcoes: {
        allowSorting: true,
        sortSettings: {
            columns: [""],
            __typename: 'SortSettings'
        },
        __typename: 'OrdenacaoOpcoes'
    },
    editOpcoes: {
        allowEditing: true,
        allowAdding: true,
        allowDeleting: true,
        mode: editSettingsMode.Dialog,
        __typename: 'EditOpcoes'
    },
    estiloOpcoes: {
        allowResizing: true,
        __typename: 'EstiloOpcoes'
    },
    buscaOpcoes: {
        __typename: 'BuscaOpcoes',
        fields: [],
        operator: "contains",
        key: "",
        ignoreCase: true,
    },
    filtroOpcoes: {
        __typename: 'FiltroOpcoes',
        allowFiltering: false,
    },
    exportacaoOpcoes: {
        __typename: 'ExportacaoOpcoes',
        allowPdfExport: false,
    },
    toolbar: [
        toolBarOptions.Add,
        toolBarOptions.Edit,
        toolBarOptions.Delete,
        toolBarOptions.Update,
        toolBarOptions.Cancel,
        toolBarOptions.Print,
        toolBarOptions.Search
    ],
    dialog_header: {
        __typename: 'Dialog_header',
        beginEditTitulo: "Editando",
        addingTitulo: "Novo registro",
    },
    __typename: 'OpcoesTabela'
} satisfies OpcoesTabela;

export class AddValidacao {
    constructor(public validadores: Validadores[]) {
        let rules = Object.create({});

        this.validadores.forEach(v => {
            let validador = ["cep"].includes(v) ? 'regex' : v
            rules[
                validador.includes(":") ? validador.split(":")[0] : validador
            ] = this.pegaValidador(v)
        })
        return rules
    }

    private pegaValidador(validador: Validadores) {


        const tmp = validador.split(":")
        let v_ = ''
        let com_valor = "0";
        if (tmp && tmp.length === 2) {
            com_valor = tmp[1]
            const v = tmp[0]
            v_ = com_valor && v ? v as Validadores : validador
        } else {
            v_ = validador
        };
        const isCPForCNPJ = (cnpj_cpf: string) => cpf.isValid(cnpj_cpf) || cnpj.isValid(cnpj_cpf);
        return {
            "cnpj_cpf": [(cpf: any) => isCPForCNPJ(cpf.value), "Insira um CPF/CNPJ válido!"],
            "cep": ["/^[0-9]{5}-[0-9]{3}$/", "Insira um CEP válido!"],
            "required": [true, "Este campo não pode ficar vazio!"],
            "number": [true, "Digite um número!"],
            "email": [true, "Insira um email válido!"],
            "minLength": [parseInt(com_valor), `O campo precisar ter no mínimo ${com_valor} caracteres!`],
            "maxLength": [parseInt(com_valor), `O campo pode ter no máximo ${com_valor} caracteres!`]
        }[v_]

    }
}
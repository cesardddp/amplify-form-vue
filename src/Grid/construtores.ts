import { editTypes, ColunaConfigs,  Validadores, OpcoesTabela  } from "../../merm-schema/merm-types";

// import { cpf, cnpj } = require("cpf-cnpj-validator");

export class Coluna {
    editavel: Boolean;
    editType?: editTypes; // formType;
    edit?: any;//SyncFusionEditConfig;
    validationRules?: AddValidacao
    valor_padrao?: Function

    private async configura_propriedade_Syncfusion__edit__() {

        if (!this.configs.editando) throw new Error(`Configurações de edição do campo ${this.configs.nome} vazias`);

        let edit_result: any={//} SyncFusionEditConfig = {
            params: {
                dataSource: undefined,
                query:undefined// new Query()
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
                edit_result.params.dataSource = this.configs.editando.static
                edit_result.params.fields = undefined

                // }
                break;
            case 'datepickeredit':
                edit_result.params.value = new Date();
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
            // this.editType = configs.editando.editType
            this.configura_propriedade_Syncfusion__edit__()
                .then(cfg => {
                    this.edit = cfg
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

export const opcoes_default = () => ({
    titulo: { visibilidade: true },
    desabilitar_extensoes: [],
    paginacaoOpcoes: {
        allowPaging: true,
        pageSettings: {
            pageSize: 5,
        },
    },
    ordenacaoOpcoes: {
        allowSorting: true,
        sortSettings: {
            columns: [""],
        },
    },
    editOpcoes: {
        allowEditing: true,
        allowAdding: true,
        allowDeleting: true,
        mode: "Dialog" as const,
    },
    estiloOpcoes: {
        allowResizing: true,
    },
    buscaOpcoes: {
        fields: [],
        operator: "contains",
        key: "",
        ignoreCase: true,
    },
    filtroOpcoes: {
        allowFiltering: false,

    },
    exportacaoOpcoes: {
        allowPdfExport: false,
    },
    toolbar: [
        "Add",
        "Edit",
        "Delete",
        "Update",
        "Cancel",
        "Print",
        "Search"],
    dialog_header: {
        beginEdit: {
            titulo: { prefix: 'Editando', campo: 'id', posfix: '' }
        },
        adding: {
            titulo: "Novo registro"
        },
    }
} satisfies OpcoesTabela)

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
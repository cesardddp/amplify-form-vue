<script lang="ts">
// vue
import { ref, computed, inject, watchEffect, defineComponent } from 'vue';
// import { provide } from '@vue/runtime-core';


//syncfusion
import { Page, Sort, Filter, PdfExport, Edit, Toolbar, Resize, Search } from "@syncfusion/ej2-vue-grids";
// import { L10n, setCulture } from '@syncfusion/ej2-base';
import { DataManager, Query } from '@syncfusion/ej2-data';
import { Dialog } from '@syncfusion/ej2-popups';
import { TextBox } from '@syncfusion/ej2-inputs';

//amplify
import { GraphQLResult, GRAPHQL_AUTH_MODE } from '@aws-amplify/api';
import { Auth, API, Cache as AmplifyCache } from 'aws-amplify';
// import * as queries from "../graphql/queries";
// import * as mutations from "../graphql/mutations";

// merm
import cogListUser, { cogUser } from './cogUser';
import { Api, Modulo } from '../merm-types/merm_empresa_types';
// import { novo_log } from '../services/log';
import { opcoes_default } from "../merm-types/tabela/construtores";
// import { ativarCognitoUser, atualizaUsuario, createUsuario, deleteCognitoUser, desativarCognitoUser, listCognitoUsers } from '../services/coginitoApi';
import { PropType } from "vue";
import { OpcoesTabela } from '../merm-types/tabela/types';
import { ConfigColunasGrid,GridTypes } from "../merm-types/tabela";

export default defineComponent({
  props: {
    queries: Object,
    mutations: Object,
    opcoes: { type: Object as PropType<OpcoesTabela>, required: true },
    colunas: { type: Object as PropType<GridTypes.ColunaConfigs[]>, required: true },
    api: {
      type: Object as PropType<Api>, required: true
    },
    nome_tela: String, filter: String, user: Object, groups: Array<String>,
    // temColunaAcoes: { type: Boolean, default: false },
    acoes: Array as PropType<{
      nome: string,
      acao: Function
    }[]>,
    carregaDados:Function
  },
  provide: {
    grid: [Page, Edit, Toolbar, Resize, Search, PdfExport, Sort, Filter]
  },
  // emits:['recarregarTabela'],
  setup(props) {

    // const props = defineProps<{ tela: string, filter: string, user: any, groups: string[] }>()
    const pageSize = ref(10)
    const customFiltro = ref('')
    const carregando_dados = ref(true) // as vezes um request retorna no meio de dialog aberto alterando o actio chamado, isso vai impedir um action de ser executado durante outro
    const atualizaPagina = () => {console.log('ué');
     ;carregar_dados()} //TODO tirar isso aqui;
    // const atualizaPagina = () =>  location.reload() //TODO tirar isso aqui


    // const modulo = inject<Modulo>("modulo")
    // if (!modulo) throw new Error("Modulo vazia em tabela!");

    // const tela = computed(() => {
    //   const tela_ = modulo.view.telas
    //     .find(
    //       (tela: any) => tela.nome === props.tela
    //     )
    //   if (tela_ === undefined) throw new Error("Tela vazia em tabela!");
    //   return tela_
    // })

    // const api = computed(() => {
    //   const api_ = modulo.api
    //     .find(
    //       a => a.nome === tela.value?.fonte_dados
    //     )
    //   if (api_ === undefined) { throw new Error("API não encontrada em Tabela"); }
    //   return api_
    // })
// function carregaDadosExterno() {
//   carregaDados
// }
    const opcoes = computed(
      () => {
        let op = {
          ...opcoes_default(), ...props.opcoes
        }
        op.paginacaoOpcoes.pageSettings.pageSize = pageSize.value;
        return op
      }
    )
    const colunas = computed(() => props.colunas.map(
      col => new ConfigColunasGrid(
        { ...col }
      )).sort((e1, e2) => e1.configs.posicao - e2.configs.posicao)
    )

    // const temColunaAcoes = ref(['Tabela Chamados', 'Usuários de Suporte', 'Tabela Clientes', 'Meus Chamados'].includes(props.tela))

    const grid = ref();

    //// transofrmações das colunas entre listagem <-> edição //////////
    function actionBegin(args: any) {

      try {
        let columns = grid.value.getColumns()
        if ((args.requestType === 'beginEdit' || args.requestType === 'add')) {

          // seta as colunas como visiveis se forem visieis 'on edit' ou 'on add'
          // p/ cada coluna conhecida pelo MERM trocar visibilidade para dialog
          colunas.value.forEach(mermCol => {

            const col = columns.find((c: any) => props.nome_tela + mermCol.configs.nome === c.key)

            try {

              // col.visible = ;
              //verifica se usuario esta no grupo de auth de edição do campo
              col.visible = mermCol.editavel && (
                mermCol.configs.editando?.auth?.some(
                  e => props.groups?.includes(e)) ?? true
              )

              // col.index = mermCol.configs.posicao;
              col.allowEditing = (mermCol.configs.allowEditing ?? true) || args.requestType === 'add';

            } catch (error: any) {
              // console.log('error: ', error);
              if (error.toString() === "TypeError: col is undefined") return;

              alert(error.toString())

            } finally {
            }
          })
          // if (temColunaAcoes.value) {
          const actionCol = columns.find((c: any) => 'acoes' === c.key);
          actionCol.visible = false
          // }
        }
      }
      // catch (error) {

      // }
      finally {
      }
    }

    const actionComplete = (args: any) => {
      

      const reqType: 'beginEdit' | 'add' = args.requestType;
      const header = opcoes.value.dialog_header;

      const colunasOps = colunas.value;
      let columns = grid.value.getColumns();

      try {
        switch (reqType) {
          case 'beginEdit':


            let dialog: Dialog = args.dialog;
            // dialog.height = 900;
            // dialog.getButtons()

            if (typeof header.beginEdit.titulo != 'string') {
              args.dialog.header = `${header.beginEdit.titulo.prefix ?? ''}${args.rowData[header.beginEdit.titulo.campo]}${header.beginEdit.titulo.posfix ?? ''}`
            } else {
              args.dialog.header = header.beginEdit.titulo
            }
            break;
          case 'add':
            args.dialog.header = header.adding.titulo
            break;

          default:
            break;
        }
        if (args.requestType === 'save') {
          switch (args.action) {
            case 'edit':
              edita(args.data)
              break;
            case 'add':
              // emit("addCallback", action.data)
              cria(args.data)
              break;
          }
        } else if (args.requestType === 'delete') {
          if (!confirm("Tem cereteza que deseja deletar?")) return
          args.data.forEach((element: any) => {
            // emit("deletaCallback", element)
            deleta(element)
          });
        }

        // seta as colunas para visiblidade original configurada
        colunasOps.forEach(mermCol => {
          const col = columns.find((c: any) => props.nome_tela + mermCol.configs.nome === c.key)


          let visivel = mermCol.configs?.visivel ?? true;
          //verifica se usuario esta no grupo de auth de edição do campo
          col.visible = visivel
          // && (mermCol.configs.editando?.auth?.reduce(
          //   (previousValue: boolean, grp: string) => props.groups.includes(grp) && previousValue,
          //   true
          // ) ?? true)

          // if (v != col.visible){ console.log(col.field, v, '->', col.visible);}

        })

        // set coluna de ações
        // if (temColunaAcoes.value) {
        // const visible = temColunaAcoes.value
        const colAction = columns.find((c: any) => 'acoes' === c.key)
        colAction.visible = true;
        // }

      } finally {
      }
    }

    ////////////////////////////////// CRUD OPERATIONS
    // LIST
    const rawdata = ref()

    const getcogAtribute = (atribute: string, User: cogUser) => User.Attributes.find(a => a.Name === atribute)?.Value

    async function listar(): Promise<{ data: any, requeridor: string }> {

      const resposta: { data: any, requeridor: string } = { data: undefined, requeridor: props.api.nome }
      const nome_grupo_model = props.api.nome_entidade

      if (props.api.tipoApi === "GraphQL") {
        const variables =  {
          filter: props.api.listOptions?.filter 
        }
        try {


          const options = {
            query: (props.queries as any)['list' + nome_grupo_model + 's'],
            authMode: GRAPHQL_AUTH_MODE.AMAZON_COGNITO_USER_POOLS,
            variables
          }
          const t = await (
            API.graphql(options) as Promise<any>);

          resposta.data = t.data["list" + nome_grupo_model + 's']?.items

          // novo_log(
          //   {
          //     username: props.user.username,
          //     modulo: tela.value.nome,
          //     acao: "Listagem ok!"
          //   }
          // )

          return resposta;


        } catch (error: any) { // TODO tira isso
          console.log(`erro listar ${nome_grupo_model} `);
          const result = undefined
          throw new Error(error);
        }




      }
      // else if (props.api.tipoApi === 'Cognito') {
      //   const t: cogListUser = await listCognitoUsers(
      //     nome_grupo_model
      //   )

      //   if (tela.value.log) {

      //   }
      //   // novo_log(
      //   //   {
      //   //     username: props.user.username,
      //   //     modulo: tela.value.nome,
      //   //     acao: "Listagem ok!"
      //   //   }
      //   // )
      //   resposta.data = t.Users.map(u => {
      //     let ultAces = getcogAtribute("custom:ultimo_acesso", u)

      //     return {
      //       // id: getcogAtribute('sub', u),
      //       // 'custom:id_server': getcogAtribute('custom:id_server', u),
      //       id: getcogAtribute('custom:id_server', u),
      //       username: u.Username,
      //       nome_fantasia: getcogAtribute('custom:nome_fantasia', u),
      //       cnpj_cpf: getcogAtribute('custom:cnpj_cpf', u),
      //       razao_social: getcogAtribute('custom:razao_social', u),
      //       email: getcogAtribute('email', u),
      //       status: u.Enabled ? {
      //         "CONFIRMED": "Ativo",
      //         'FORCE_CHANGE_PASSWORD': "Aguardando primeiro login"
      //       }[u.UserStatus] : 'Desativado',
      //       tipo: getcogAtribute('tipo', u),
      //       ultimo_acesso: ultAces ? new Date(ultAces as string).toLocaleString() : "Não ocorreu",
      //     }
      //   });
      //   return resposta
      // }
      else {


        const now = new Date()
        let now_90 = new Date()
        now_90 = new Date(now_90.setDate(now.getDate() - 90))
        const variables: any = {};

        if (props.nome_tela === 'Tabela Chamados' || props.nome_tela === 'Meus Chamados') {
          variables.body = {

            idcliente: props.filter ? props.filter : props.user?.attributes['custom:id_server'],
            idserver: '',
            dataemissaoinicial: now_90.toISOString().split('T')[0].split('-').reverse().join('/'),
            dataemissaofinal: now.toISOString().split('T')[0].split('-').reverse().join('/'),
          }
        }
        // else if (tela.value.nome === 'Financeiro') {
        //   variables.input = { idserver: props.user?.attributes['custom:id_server'] }
        // }
        try {
          const t = await (
            API.graphql({
              query: (props.mutations as any)[nome_grupo_model],
              // authMode: GRAPHQL_AUTH_MODE.AMAZON_COGNITO_USER_POOLS,
              variables: variables,
            }) as Promise<any>);

          try {
            const result = JSON.parse(t.data[nome_grupo_model])
            resposta.data = result.map((x: any) => {
              if (props.nome_tela === 'Tabela Chamados' || props.nome_tela === 'Meus Chamados') {
                return {
                  datahora: x.dataemissao + '|' + x.horaemissao.split(' ')[1],
                  // horaemissao: x.horaemissao,
                  descricao: x.descricao,
                  status: x.dataexecucao ? 'Finalizado' : 'Pendente',
                  idserver: x.idserver,
                  idcliente: props.filter
                }
              }
              else if (props.nome_tela === 'Financeiro') {
                return {
                  FID: x.fields.FID,
                  FObs: x.fields.FObs,
                  FValor: x.fields.FValor,
                  FVencimento: x.fields.FVencimento,
                  FPagamento: x.fields.FPagamento,
                }
              }
            })

            // novo_log(
            //   {
            //     username: props.user.username,
            //     modulo: tela.value.nome,
            //     acao: "Listagem ok!"
            //   }
            // )
            return resposta
          } catch (error: any) { // TODO tira isso

            const result = undefined
            throw new Error(error);

          }

        } catch (error: any) {
          const result = undefined
          throw new Error(error);// TODO tira isso
        }
      }
    }
    const carregar_dados = async () => {
      // const DURACAO_CACHE_LOCAL_DIAS = 1
      carregando_dados.value = true
      const cache = AmplifyCache.getItem(props.api.nome + props.api.nome_entidade + props.filter)

      rawdata.value = new DataManager(cache);
      try {
        const result = await listar()
        if (
          result.requeridor === props.api.nome
        ) {
          rawdata.value = new DataManager(result.data)
          AmplifyCache.setItem(
            props.api.nome + props.api.nome_entidade + props.filter,
            result.data,
            // { expires: expires_day.getTime() }
          );
        }
      } catch (error) {
        console.log('error: ', error);
        alert("Não foi possível recuperar os registros, exibindo cache local.")
      } finally {
        console.log('carregando_dados: ', carregando_dados.value);

        carregando_dados.value = false
      }
    }
    const dados_na_tabela = computed(() => {
      let data = rawdata.value
      const customFiltroOps = opcoes.value.customFiltroOpcoes;
      if (customFiltroOps && customFiltro.value) {
        data = rawdata.value.executeLocal(
          new Query()
          .where(customFiltroOps.coluna, 'equal', customFiltro.value)
          )
        }
        console.log(data.dataSource.json);
        return data.dataSource.json;
    })
    // custom fields /////////////////////////////////////////////////////////////////////////////////
    let tbElem: any = undefined;
    let textEditor: any = undefined;

    function createShipAddressFn() {
      tbElem = document.createElement("textarea");
      return tbElem;
      return;
    }
    function destroyShipAddressFn() {
      textEditor.destroy();
    }
    function readShipAddressFn() {
      return textEditor.value;
    }
    function writeShipAddressFn(args: any) {
      textEditor = new TextBox({
        multiline: true,
        value: args.rowData[args.column.field],
        floatLabelType: "Auto",
      });
      textEditor.appendTo(tbElem);
    }
    const textArea = {
      create: createShipAddressFn,
      destroy: destroyShipAddressFn,
      read: readShipAddressFn,
      write: writeShipAddressFn,
    };

    /// crud operations //////////////////////////////////////////////////////////////////////////////
    // CREATE
    const cria = async (data: any) => {

      if (props.api.tipoApi === "GraphQL") {
        colunas.value?.forEach(coluna => {
          if (coluna.valor_padrao && !data[coluna.configs.nome]) {
            data[coluna.configs.nome] = coluna.valor_padrao()
          }
        })

        const options = {
          query: (props.mutations as any)['create' + props.api.nome_entidade],
          variables: { input: data },
          authMode: GRAPHQL_AUTH_MODE.AMAZON_COGNITO_USER_POOLS,
        }
        try {
          const result = await (API.graphql(options) as Promise<any>);
          alert("hum")
        } catch (error: any) {
          console.log('error: ', error);
          alert(error.tostring())
        } finally {
          atualizaPagina()
        }
        // novo_log(
        //   {
        //     username: props.user.username,
        //     modulo: tela.value.nome,
        //     acao: "Criação ok!"
        //   }
        // )
        // return result.data["create" + props.api.nome_entidade] //?? null}

      }
      //  else if (props.api.tipoApi === 'Cognito') {
      //   try {
      //     const result = await createUsuario(
      //       props.api.nome_entidade,
      //       data.email,
      //       data.password,
      //       [
      //         {
      //           Name: "email",
      //           Value: data.email
      //         },
      //         {
      //           Name: "custom:cnpj_cpf",
      //           Value: data.cnpj_cpf.match(/\d/g).join("")
      //         },
      //         {
      //           Name: "custom:nome_fantasia",
      //           Value: data.nome_fantasia
      //         },
      //         {
      //           Name: "custom:razao_social",
      //           Value: data.razao_social ?? data.nome_fantasia
      //         }],

      //     )

      //     data.id = result.Username
      //     data.status = result.UserStatus === 'FORCE_CHANGE_PASSWORD' ? "Aguardando primeiro login" : ''
      //     novo_log({ username: props.user.username, modulo: tela.value.nome, acao: "Criação ok!" })
      //     alert("Criado com sucesso")
      //   } catch (error: any) {
      //     console.log('error: ', error);
      //     alert(error.tostring())
      //   } finally {
      //     atualizaPagina()
      //   }
      // }
      // else if (tela.value.gatilho) {
      //   const api_name = tela.value.gatilho.nome
      //   const bodyTransform = tela.value.gatilho.body
      //   const body = {}
      //   for (let field in bodyTransform) {
      //     const op = (bodyTransform as any)[field].split(":")
      //     switch (op[0]) {
      //       case 'datetime':

      //         const now = new Date();

      //         const so_data = (date: Date) => date.toLocaleString().split(" ")[0]
      //         const so_hora = (date: Date) => date.toLocaleString().split(" ")[1]

      //         if (op[1] === 'date') {
      //           if (op[2] === 'now') (body as any)[field] = so_data(now);
      //           else if (op[2] === 'interval') (body as any)[field] = so_data(
      //             new Date(now.setDate(now.getDate() + parseInt(op[3])))
      //           );
      //         }
      //         else if (op[1] === 'time') {
      //           if (op[2] === 'now') (body as any)[field] = so_hora(now)
      //         }

      //         break;
      //       case 'tabela':
      //         if (op[1] === 'descricao') {
      //           (body as any)[field] = data[op[1]]// + '\n' + data['arquivo']
      //         }
      //         else if (op[1] === 'tipo') {
      //           (body as any)[field] = { idserver: '330' }
      //         }
      //         else { (body as any)[field] = data[op[1]] }
      //         break;
      //       case 'padrao':
      //         if (op[1] === 'string') {
      //           if (field === 'criadopor') (body as any)[field] = { idserver: op[2] }
      //           else (body as any)[field] = op[2];
      //         }
      //         else if (op[1] === 'int') (body as any)[field] = parseInt(data[op[2]])
      //         break;
      //       case 'user':
      //         if (op[1] === 'custom') {
      //           (body as any)[field] = { idserver: props.user?.attributes['custom:' + op[2]] }
      //         } else {
      //         }
      //         break;
      //       default:
      //         break;
      //     }
      //   }
      //   try {
      //     const resposta = (await API.graphql(
      //       {
      //         query: (props.mutations as any)[api_name],
      //         variables: { body: body },
      //       },
      //     )) as GraphQLResult<any>;

      //     alert("Criado!")
      //   } catch (error: any) {
      //     console.log('error: ', error);
      //     alert(error.tostring())
      //   } finally {
      //     atualizaPagina()
      //   }
      //   // novo_log(
      //   //   {
      //   //     username: props.user.username,
      //   //     modulo: tela.value.nome,
      //   //     acao: "Criação ok!"
      //   //   }
      //   // )
      // }
    };
    // UPDATE
    async function edita(data: any) {
      let input = Object.create({});
      colunas.value?.forEach(c => {
        input[c.configs.nome] = data[c.configs.nome]
      }
      )
      // 
      // beneficio.valor = beneficio.valor ? beneficio.valor * 100 : 0;
      if (props.api.tipoApi === "GraphQL") {
        const result = (await API.graphql({
          query: (props.mutations as any)['update' + props.api.nome_entidade],
          variables: { input: input },
          authMode: GRAPHQL_AUTH_MODE.AMAZON_COGNITO_USER_POOLS,
        })) as Promise<any>;
        // novo_log(
        //   {
        //     username: props.user.username,
        //     modulo: tela.value.nome,
        //     acao: "Update ok!"
        //   }
        // )
      }
      else {
        let att_list = []
        att_list.push(
          {
            "Name": "email",
            "Value": data.email
          })
        att_list.push(
          {
            "Name": "custom:cnpj_cpf",
            "Value": data.cnpj_cpf.match(/\d/g).join("")
          })
        att_list.push(
          {
            "Name": "custom:nome_fantasia",
            "Value": data.nome_fantasia
          })
        att_list.push(
          {
            "Name": "custom:razao_social",
            "Value": data.razao_social ?? data.nome_fantasia,
          })

        // atualizaUsuario(data.email, att_list)
        //   .then(r => {
        //     alert("Atualizado com sucesso!")
        //     atualizaPagina()
        //     novo_log(
        //       {
        //         username: props.user.username,
        //         modulo: tela.value.nome,
        //         acao: "Atualização ok!"
        //       }
        //     )
        //   })
        //   .catch(e => alert("Erro ao atualizar " + e))
      }

    }
    // READ
    // DESATIVAR
    // async function ativaDesativaCog(data: any) {
    //   // const loga_desativacao = () => novo_log(
    //   //   {
    //   //     username: props.user.username,
    //   //     modulo: tela.value.nome,
    //   //     acao: `Desativação ${data.username} ok!`
    //   //   }
    //   // )

    //   if (data.status !== 'Desativado') desativarCognitoUser(data.username)
    //     .then(x => {
    //       loga_desativacao()
    //       atualizaPagina()
    //     }
    //     ).catch((reason: any) => {
    //       alert("Não foi possível recuperar os registros, exibindo cache local.")
    //     })
    //   else if (data.status === 'Desativado') ativarCognitoUser(data.username).then(x => {
    //     loga_desativacao()
    //     atualizaPagina()
    //   }
    //   ).catch((reason: any) => {
    //     alert("Não foi possível recuperar os registros, exibindo cache local.")
    //   })
    // }
    // DELETE
    async function deleta(data: any) {
      // 
      if (props.api.tipoApi === "GraphQL") {
        const result = await (API.graphql({
          query: (props.mutations as any)['delete' + props.api.nome_entidade],
          variables: { input: { id: data.id } },
          authMode: "AMAZON_COGNITO_USER_POOLS"
        }) as Promise<any>);

        console.log(" deletado");
        atualizaPagina()
        // novo_log(
        //   {
        //     username: props.user.username,
        //     modulo: tela.value.nome,
        //     acao: `Exclução ${data.id} ok!`
        //   }
        // )
        return result.data["delete" + props.api.nome_entidade]
      }
      else {
        // deleteCognitoUser(data.username)
        //   .then(r => {
        //     novo_log(
        //       {
        //         username: props.user.username,
        //         modulo: tela.value.nome,
        //         acao: `Exclução ${data.cnpj_cpf} ok!`
        //       }
        //     )
        //     alert("Deletado com sucesso!")
        //     atualizaPagina()
        //   }).catch((reason: any) => {
        //     alert("Não foi possível recuperar os registros, exibindo cache local.")
        //   })
      }
    }
    // watchEffect(() => {
    // })
    carregar_dados()
    
    return {
      nome_tela: props.nome_tela,
      dados_na_tabela,
      opcoes,
      colunas,
      pageSize,
      customFiltro, grid,
      carregando_dados,
      actionComplete,
      actionBegin,
      temColunaAcoes: !(props.acoes === undefined),
      acoes: props.acoes
    }

    // TODO internacionalização

    // tradução/internacionalização
    // https://ej2.syncfusion.com/vue/documentation/grid/global-local/#localization
    // setCulture('pt-BR');
    // L10n.load({
    //   'pt-BR': {
    //     'grid': {
    //       'EmptyRecord': 'Nada encontrado!',
    //       // 'GroupDropArea': 'Ziehen Sie einen Spaltenkopf hier, um die Gruppe ihre Spalte',
    //       // 'UnGroup': 'Klicken Sie hier, um die Gruppierung aufheben',
    //       // 'EmptyDataSourceError': 'DataSource darf bei der Erstauslastung nicht leer sein, da Spalten aus der dataSource im AutoGenerate Spaltenraster',
    //       'Add': 'Criar',
    //       'Edit': "Editar",
    //       "Cancel": "Cancelar",
    //       "Update": "Salvar",
    //       "Delete": "Apagar",
    //       "Print": "Imprimir",
    //       "Search": "Buscar"

    //     },
    //     'pager': {
    //       'currentPageInfo': '{0} de {1} página(s)',
    //       'totalItemsInfo': '({0} items)',
    //       'firstPageTooltip': 'Pular para primeira página',
    //       'lastPageTooltip': 'Pular para última página',
    //       'nextPageTooltip': 'Próxima página',
    //       'previousPageTooltip': 'Última página',
    //       // 'nextPagerTooltip': 'Gehen Sie zu den nächsten Pager-Elementen',
    //       // 'previousPagerTooltip': 'Gehen Sie zu vorherigen Pager-Elementen'
    //     }
    //   }
    // });
  }
})
</script>

<template>
  <h1 v-if="opcoes.titulo.visibilidade"  class="text-center my-4" :class="opcoes.titulo.css_class">{{ nome_tela }}</h1>
  <div class="row justify-content-center">

    <div v-if="opcoes.paginacaoOpcoes.allowPaging" class="col-sm-4 col-md-2 align-self-top d-flex flex-column h-100 justify-content-center">
      <label for="pagesize" class="form-label ">
        Mostrar
        <select class="form-select form-select-sm" name="pagesize" id="pagesize" v-model="pageSize">
          <option value="10" selected>10</option>
          <option value="25">25</option>
          <option value="50">50</option>
          <option value="100">100</option>
        </select>
        Items
      </label>
    </div>
    <div class="col-sm-4 col-md-2 align-self-top d-flex flex-column h-100 justify-content-center">
      <label v-if="opcoes.customFiltroOpcoes" for="filtro" class="form-label">
        Filtrar por:
        <select name="filtro" class="form-select form-select-sm" id="filtro" v-model="customFiltro">
          <option v-for="op in opcoes.customFiltroOpcoes?.listaOpcoes" :value="op.value">{{ op.label }}</option>
        </select>
      </label>
    </div>

    <div class="col-md-6 col-sm-12 align-self-center">
      <!-- <div v-if="groups.includes('Clientes')" class="alert alert-danger alert-dismissible fade show" role="alert">
        <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
        <strong>Os chamados a seguir estarão disponíveis para pesquisa por 180 dias.</strong>
        Qualquer dúvida, entrar em contato com o Suporte
      </div> -->
    </div>
    <div class="col-sm-4 col-md-2 align-self-center">
      <!-- <button @click="grid.addRecord()" type="button" class="btn btn-primary"
        :class="!carregando_dados ? '' : 'disabled'"
        v-if="'Meus Chamados' === props.tela || ('Tabela Chamados' === props.tela && props.filter)">+Novo
        Chamado</button>
      <button @click="grid.addRecord()" type="button" class="btn btn-outline-primary"
        :class="!carregando_dados ? '' : 'disabled'" v-if="'Usuários de Suporte' === props.tela">+Adicionar
        Usuário</button> -->
    </div>


  </div>
  <ejs-grid ref="grid" locale='pt-BR' :dataSource="dados_na_tabela" :allowPaging="opcoes.paginacaoOpcoes?.allowPaging"
    :allowSorting="opcoes.ordenacaoOpcoes?.allowSorting" :allowFiltering="opcoes.filtroOpcoes?.allowFiltering"
    :allowPdfExport="true" :pageSettings="opcoes.paginacaoOpcoes?.pageSettings" :editSettings="opcoes.editOpcoes"
    :toolbar="opcoes.toolbar" :allowResizing="opcoes.estiloOpcoes?.allowResizing" :searchSettings="opcoes.buscaOpcoes"
    :actionComplete="actionComplete" :actionBegin='actionBegin'>
    <e-columns>
      <e-column v-for="coluna in colunas" :key="nome_tela + coluna.configs.nome" :field="coluna.configs.nome"
        :headerText="coluna.configs.label" :textAlign="coluna.configs.textAlign" :format="coluna.configs.format"
        :width="coluna.configs.width" :visible='coluna.configs.visivel' :editType="coluna.editType" :edit="coluna.edit"
        :validationRules='coluna.validationRules'>
      </e-column>
      <!-- <e-column v-if="['Tabela Chamados','Meus Chamados'].includes(props.tela)" field='descricao' headerText='Descrição'
        type='string' :edit='textArea' width=180></e-column> -->

      <e-column :key='"acoes"' headerText="Ações" :textAlign="'center'" :width="'150'" :template="'cTemplate'"
        :visible="temColunaAcoes">
      </e-column>
      <template v-slot:cTemplate="{ data }">
        <div class="d-flex justify-content-center">
          <button @click="()=>ac.acao(data)" v-for="ac in acoes" type="button" class="btn btn-outline-success">{{ ac.nome }}</button>

          <!-- <a v-if="props.tela === 'Tabela Clientes'" :href="'/#/tabela/Tabela Chamados/' + data.id"
            class="btn btn-info text-light px-1 nav-link">Chamados</a>
          <a v-if="props.tela === 'Tabela Chamados' || props.tela === 'Meus Chamados'"
            :href="'/#/chat/' + data.idserver" class="btn btn-info text-light px-1 nav-link">Detalhes</a>
          <button v-if="props.tela === 'Usuários de Suporte'" @click="ativaDesativaCog(data)"
            class="btn btn-success text-light px-1 nav-link">
            {{ data.status === 'Desativado' ? 'Ativar' : 'Desativar' }}</button> -->
        </div>
      </template>
    </e-columns>
  </ejs-grid>
  <!-- {{opcoes}} -->
  <!-- {{opcoes.customFiltroOpcoes}} -->
  <!-- 
    {{props.tela==='Meus Chamados'}}
    {{props.tela}}
  {{props.tela==='Tabela Usuários'}} -->
  <div v-for="coluna in colunas" :field="coluna.configs.nome" :headerText="coluna.configs.label">
    <!-- {{coluna}} -->
  </div>
  <!-- {{colunas}} -->
  <!-- {{dados}} -->
</template>

<style>

</style>
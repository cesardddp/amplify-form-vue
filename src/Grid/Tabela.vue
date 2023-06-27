<script lang="ts" setup>
import { ref, computed, inject, watchEffect, provide } from 'vue';

//syncfusion
import { Page, Sort, Filter, PdfExport, Edit, Toolbar, Resize, Search } from "@syncfusion/ej2-vue-grids";
// import { L10n, setCulture } from '@syncfusion/ej2-base';
import { Dialog } from '@syncfusion/ej2-popups';

// import { DataManager, Query } from '@syncfusion/ej2-data';
// import { TextBox } from '@syncfusion/ej2-inputs';

// merm

import { opcoes_default, Coluna } from "./construtores";
import { TabelaSyncFusion } from '../../merm-schema/merm-types';

interface TabelaProps {
  dados?: any[]
  opcoes?: TabelaSyncFusion['opcoes']
  colunas: TabelaSyncFusion['colunas']
  nome_entidade: string
}
provide("grid", [
  Toolbar,
  Page,
  Edit,
  Resize,
  Search,
  PdfExport,
  Sort,
  Filter
])
const props = withDefaults(defineProps<TabelaProps>(), {
  opcoes: () => { return { ...opcoes_default } },
})



const pageSize = ref(10)
const allowPaging = ref(true)
const customFiltro = ref('')
const carregando_dados = ref(true) // as vezes um request retorna no meio de dialog aberto alterando o actio chamado, isso vai impedir um action de ser executado durante outro


const opcoes = computed(
  () => {
    let op = {
      ...opcoes_default,
      ...props.opcoes
    }

    op.paginacaoOpcoes.pageSettings.pageSize = pageSize.value;
    op.paginacaoOpcoes.allowPaging = allowPaging.value;
    return op
  }
)
const colunas = computed(() => props.colunas.map(
  col => new Coluna(
    { ...col }
  )).sort((e1, e2) => e1.configs.posicao - e2.configs.posicao)
)

const grid = ref();

//// transofrmações das colunas entre listagem <-> edição //////////
const actionBegin = (args: any) => {

  try {
    let columns = grid.value.getColumns()
    if ((args.requestType === 'beginEdit' || args.requestType === 'add')) {

      // seta as colunas como visiveis se forem visieis 'on edit' ou 'on add'
      // p/ cada coluna conhecida pelo MERM trocar visibilidade para dialog
      colunas.value.forEach(mermCol => {

        // const col = columns.find((c: any) => tela.value.nome + mermCol.configs.nome === c.key)

        // try {

        //   // col.visible = ;
        //   //verifica se usuario esta no grupo de auth de edição do campo
        //   col.visible = mermCol.editavel && (
        //     mermCol.configs.editando?.auth?.some(
        //       e => props.groups.includes(e)) ?? true
        //   )

        //   // col.index = mermCol.configs.posicao;
        //   col.allowEditing = (mermCol.configs.allowEditing ?? true) || args.requestType === 'add';
        //   // console.log(col.key);
        //   // console.log('visible', visible + ' -> ' + col.visible);
        //   // console.log('index', index + ' -> ' + col.index);
        //   // console.log('allowEditing', allowEditing + ' -> ' + col.allowEditing);

        // } catch (error: any) {
        //   // console.log('error: ', error);
        //   if (error.toString() === "TypeError: col is undefined") return;

        //   alert(error.toString())

        // } finally {
        // }
      })
      // if (temColunaAcoes.value) {
      // const actionCol = columns.find((c: any) => 'acoes' === c.key);
      // actionCol.visible = false
      // }
    }
  }
  // catch (error) {

  // }
  finally {
  }
}


const create = inject('create') as Function
const update = inject('update') as Function
const del  = inject('delete') as Function
const read = inject('read') as Function
const list = inject('list') as Function

const actionComplete = (args: any) => {


  const reqType: 'beginEdit' | 'add' = args.requestType;
  const header = opcoes.value!.dialog_header;

  const colunasOps = colunas.value;
  let columns = grid.value.getColumns();

  try {
    switch (reqType) {
      case 'beginEdit':


        let dialog: Dialog = args.dialog;
        // dialog.height = 900;
        // dialog.getButtons()

        // if (typeof header.beginEditTitulo != 'string') {
        //   args.dialog.header = `${header.beginEdit.titulo.prefix ?? ''}${args.rowData[header.beginEdit.titulo.campo]}${header.beginEdit.titulo.posfix ?? ''}`
        // } else {
        // }
        args.dialog.header = header.beginEditTitulo
        break;
      case 'add':
        args.dialog.header = header.addingTitulo
        break;

      default:
        break;
    }
    if (args.requestType === 'save') {
      switch (args.action) {
        case 'edit':
          // alert("edita nao implementado")
          update(args.data, args.rowIndex)
          break;
        case 'add':
          // emit("addCallback", action.data)
          // alert("cria nao implementado")
          create(args.data)
          break;
      }
    } else if (args.requestType === 'delete') {
      if (!confirm("Tem cereteza que deseja deletar?")) return
      args.data.forEach((element: any) => {
        // emit("deletaCallback", element)
        // deleta(element)
        alert("deletando nao implementado")
      });
    }

    // seta as colunas para visiblidade original configurada
    colunasOps.forEach(mermCol => {
      // const col = columns.find((c: any) => tela.value.nome + mermCol.configs.nome === c.key)


      // let visivel = mermCol.configs?.visivel ?? true;
      // //verifica se usuario esta no grupo de auth de edição do campo
      // col.visible = visivel
      // // && (mermCol.configs.editando?.auth?.reduce(
      // //   (previousValue: boolean, grp: string) => props.groups.includes(grp) && previousValue,
      // //   true
      // // ) ?? true)

      // // if (v != col.visible){debugger; console.log(col.field, v, '->', col.visible);}

    })

    // set coluna de ações
    // if (temColunaAcoes.value) {
    // const visible = temColunaAcoes.value
    // const colAction = columns.find((c: any) => 'acoes' === c.key)
    // colAction.visible = true;
    // }

  } finally {
  }
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
</script>

<template>
  {{ colunas }}
  <!-- <h1 class="text-center my-4">{{ tela.nome }}</h1> -->
  <div class="row justify-content-center">
    {{ pageSize }}
    <div class="col-sm-4 col-md-2 align-self-top d-flex flex-column h-100 justify-content-center">
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
    <!-- <div class="col-sm-4 col-md-2 align-self-center">
      <button @click="grid.addRecord()" type="button" class="btn btn-primary" :class="!carregando_dados ? '' : 'disabled'"
        v-if="'Meus Chamados' === props.tela || ('Tabela Chamados' === props.tela && props.filter)">+Novo Chamado</button>
      <button @click="grid.addRecord()" type="button" class="btn btn-outline-primary"
        :class="!carregando_dados ? '' : 'disabled'" v-if="'Usuários de Suporte' === props.tela">+Adicionar Usuário</button>
    </div> -->


  </div>

  <!-- TODO GAMBIARARR PRA ATUALIZAR PAGE SIZE USANDO PAGESIZE COMO :KEY -->
  <ejs-grid :key="pageSize" ref="grid" locale='pt-BR' :dataSource="dados"
    :allowPaging="opcoes.paginacaoOpcoes?.allowPaging" :allowSorting="opcoes.ordenacaoOpcoes?.allowSorting"
    :allowFiltering="opcoes.filtroOpcoes?.allowFiltering" :allowPdfExport="true"
    :pageSettings="opcoes.paginacaoOpcoes?.pageSettings" :editSettings="opcoes.editOpcoes" :toolbar="opcoes.toolbar"
    :allowResizing="opcoes.estiloOpcoes?.allowResizing" :searchSettings="opcoes.buscaOpcoes"
    :actionComplete="actionComplete" :actionBegin='actionBegin'>
    <!-- 
    -->
    <e-columns>
      <e-column v-for="coluna in colunas" :field="coluna.configs.nome" :headerText="coluna.configs.label"
        :textAlign="coluna.configs.textAlign" :format="coluna.configs.format" :width="coluna.configs.width"
        :visible='coluna.configs.visivel' :editType="coluna.editType" :edit="coluna.edit"
        :validationRules='coluna.validationRules'>
      </e-column>
      <!-- 
      
      :key="coluna.configs.nome"
        -->
      <!-- <e-column v-if="['Tabela Chamados','Meus Chamados'].includes(props.tela)" field='descricao' headerText='Descrição'
        type='string' :edit='textArea' width=180></e-column> -->

      <!-- <e-column :key='"acoes"' headerText="Ações" :textAlign="'center'" :width="'150'" :template="'cTemplate'"
        :visible="temColunaAcoes">
      </e-column> -->
      <!-- <template v-slot:cTemplate="{ data }">
        <div class="d-flex justify-content-center">
          <a v-if="props.tela === 'Tabela Clientes'" :href="'/#/tabela/Tabela Chamados/' + data.id"
            class="btn btn-info text-light px-1 nav-link">Chamados</a>
          <a v-if="props.tela === 'Tabela Chamados' || props.tela === 'Meus Chamados'" :href="'/#/chat/' + data.idserver"
            class="btn btn-info text-light px-1 nav-link">Detalhes</a>
          <button v-if="props.tela === 'Usuários de Suporte'" @click="ativaDesativaCog(data)"
            class="btn btn-success text-light px-1 nav-link">
            {{ data.status === 'Desativado' ? 'Ativar' : 'Desativar' }}</button>
        </div>
      </template> -->
    </e-columns>
  </ejs-grid>
</template>
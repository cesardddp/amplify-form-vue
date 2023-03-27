/* tslint:disable */
/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const getCampo = /* GraphQL */ `
  query GetCampo($id: ID!) {
    getCampo(id: $id) {
      nome
      label
      tipo
      visivel
      editavel
      listavel
      descricacao
      mascara
      tamanho
      posicao
      chave_primaria
      chave_extrangeira
      obrigatorio
      comentario
      unique
      maxLength
      minLength
      formType
      items
      default
      campogenerico
      id
      createdAt
      updatedAt
      modelCamposId
      owner
    }
  }
`;
export const listCampos = /* GraphQL */ `
  query ListCampos(
    $filter: ModelCampoFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listCampos(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        nome
        label
        tipo
        visivel
        editavel
        listavel
        descricacao
        mascara
        tamanho
        posicao
        chave_primaria
        chave_extrangeira
        obrigatorio
        comentario
        unique
        maxLength
        minLength
        formType
        items
        default
        campogenerico
        id
        createdAt
        updatedAt
        modelCamposId
        owner
      }
      nextToken
    }
  }
`;
export const getTela = /* GraphQL */ `
  query GetTela($id: ID!) {
    getTela(id: $id) {
      nome
      tipo
      fonte_dados
      formulario
      converter_para_exibir_na_tabela
      tabela {
        colunas {
          nome
          visivel
          allowEditing
          valor_padrao
          format
          allowFiltering
          dataSource
          label
          textAlign
          width
          tipo
          posicao
          editando {
            editavel
            editType
            fonte_dados
            api
            static
            auth
            allowFiltering
          }
          validadores
          minLength
          maxLength
          filtrando {
            allowFiltering
            listaOpcoes {
              label
              value
            }
          }
        }
        opcoes {
          dialog_header {
            adding {
              titulo
            }
          }
          toolbar
          exportacaoOpcoes {
            allowPdfExport
          }
          filtroOpcoes {
            allowFiltering
            listaOpcoes {
              label
              value
            }
          }
          buscaOpcoes {
            operator
            key
            ignoreCase
            fields
          }
          estiloOpcoes {
            allowResizing
          }
          editOpcoes {
            allowEditing
            allowAdding
            allowDeleting
            mode
          }
          ordenacaoOpcoes {
            allowSorting
            sortSettings {
              columns
            }
          }
          paginacaoOpcoes {
            allowPaging
            pageSettings {
              pageSize
            }
          }
          desabilitar_extensoes
        }
      }
      gatilho {
        nome
      }
      id
      createdAt
      updatedAt
      viewTelasId
      owner
    }
  }
`;
export const listTelas = /* GraphQL */ `
  query ListTelas(
    $filter: ModelTelaFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listTelas(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        nome
        tipo
        fonte_dados
        formulario
        converter_para_exibir_na_tabela
        tabela {
          colunas {
            nome
            visivel
            allowEditing
            valor_padrao
            format
            allowFiltering
            dataSource
            label
            textAlign
            width
            tipo
            posicao
            editando {
              editavel
              editType
              fonte_dados
              api
              static
              auth
              allowFiltering
            }
            validadores
            minLength
            maxLength
            filtrando {
              allowFiltering
            }
          }
          opcoes {
            toolbar
            exportacaoOpcoes {
              allowPdfExport
            }
            filtroOpcoes {
              allowFiltering
            }
            buscaOpcoes {
              operator
              key
              ignoreCase
              fields
            }
            estiloOpcoes {
              allowResizing
            }
            editOpcoes {
              allowEditing
              allowAdding
              allowDeleting
              mode
            }
            ordenacaoOpcoes {
              allowSorting
            }
            paginacaoOpcoes {
              allowPaging
            }
            desabilitar_extensoes
          }
        }
        gatilho {
          nome
        }
        id
        createdAt
        updatedAt
        viewTelasId
        owner
      }
      nextToken
    }
  }
`;
export const getApi = /* GraphQL */ `
  query GetApi($id: ID!) {
    getApi(id: $id) {
      nome
      tipoApi
      nome_grupo_model
      caminho
      dominio
      headers {
        key
        value
      }
      id
      createdAt
      updatedAt
      moduloApisId
      owner
    }
  }
`;
export const listApis = /* GraphQL */ `
  query ListApis(
    $filter: ModelApiFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listApis(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        nome
        tipoApi
        nome_grupo_model
        caminho
        dominio
        headers {
          key
          value
        }
        id
        createdAt
        updatedAt
        moduloApisId
        owner
      }
      nextToken
    }
  }
`;
export const getModel = /* GraphQL */ `
  query GetModel($id: ID!) {
    getModel(id: $id) {
      id
      nome
      campos {
        items {
          nome
          label
          tipo
          visivel
          editavel
          listavel
          descricacao
          mascara
          tamanho
          posicao
          chave_primaria
          chave_extrangeira
          obrigatorio
          comentario
          unique
          maxLength
          minLength
          formType
          items
          default
          campogenerico
          id
          createdAt
          updatedAt
          modelCamposId
          owner
        }
        nextToken
      }
      tipoApi
      createdAt
      updatedAt
      moduloModelsId
      owner
    }
  }
`;
export const listModels = /* GraphQL */ `
  query ListModels(
    $filter: ModelModelFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listModels(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        nome
        campos {
          items {
            nome
            label
            tipo
            visivel
            editavel
            listavel
            descricacao
            mascara
            tamanho
            posicao
            chave_primaria
            chave_extrangeira
            obrigatorio
            comentario
            unique
            maxLength
            minLength
            formType
            items
            default
            campogenerico
            id
            createdAt
            updatedAt
            modelCamposId
            owner
          }
          nextToken
        }
        tipoApi
        createdAt
        updatedAt
        moduloModelsId
        owner
      }
      nextToken
    }
  }
`;
export const getView = /* GraphQL */ `
  query GetView($id: ID!) {
    getView(id: $id) {
      telas {
        items {
          nome
          tipo
          fonte_dados
          formulario
          converter_para_exibir_na_tabela
          tabela {
            colunas {
              nome
              visivel
              allowEditing
              valor_padrao
              format
              allowFiltering
              dataSource
              label
              textAlign
              width
              tipo
              posicao
              validadores
              minLength
              maxLength
            }
            opcoes {
              toolbar
              desabilitar_extensoes
            }
          }
          gatilho {
            nome
          }
          id
          createdAt
          updatedAt
          viewTelasId
          owner
        }
        nextToken
      }
      nav_bar {
        botoes {
          nome
          to
          is_just_a_link
          auth
        }
        brand {
          is_home
          logo
          height
          width
        }
      }
      form_login {
        logo
        background
        cadastro {
          mensagem
          link
        }
      }
      id
      createdAt
      updatedAt
      owner
    }
  }
`;
export const listViews = /* GraphQL */ `
  query ListViews(
    $filter: ModelViewFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listViews(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        telas {
          items {
            nome
            tipo
            fonte_dados
            formulario
            converter_para_exibir_na_tabela
            gatilho {
              nome
            }
            id
            createdAt
            updatedAt
            viewTelasId
            owner
          }
          nextToken
        }
        nav_bar {
          botoes {
            nome
            to
            is_just_a_link
            auth
          }
          brand {
            is_home
            logo
            height
            width
          }
        }
        form_login {
          logo
          background
          cadastro {
            mensagem
            link
          }
        }
        id
        createdAt
        updatedAt
        owner
      }
      nextToken
    }
  }
`;
export const getModulo = /* GraphQL */ `
  query GetModulo($id: ID!) {
    getModulo(id: $id) {
      id
      nome
      models {
        items {
          id
          nome
          campos {
            items {
              nome
              label
              tipo
              visivel
              editavel
              listavel
              descricacao
              mascara
              tamanho
              posicao
              chave_primaria
              chave_extrangeira
              obrigatorio
              comentario
              unique
              maxLength
              minLength
              formType
              items
              default
              campogenerico
              id
              createdAt
              updatedAt
              modelCamposId
              owner
            }
            nextToken
          }
          tipoApi
          createdAt
          updatedAt
          moduloModelsId
          owner
        }
        nextToken
      }
      view {
        telas {
          items {
            nome
            tipo
            fonte_dados
            formulario
            converter_para_exibir_na_tabela
            gatilho {
              nome
            }
            id
            createdAt
            updatedAt
            viewTelasId
            owner
          }
          nextToken
        }
        nav_bar {
          botoes {
            nome
            to
            is_just_a_link
            auth
          }
          brand {
            is_home
            logo
            height
            width
          }
        }
        form_login {
          logo
          background
          cadastro {
            mensagem
            link
          }
        }
        id
        createdAt
        updatedAt
        owner
      }
      apis {
        items {
          nome
          tipoApi
          nome_grupo_model
          caminho
          dominio
          headers {
            key
            value
          }
          id
          createdAt
          updatedAt
          moduloApisId
          owner
        }
        nextToken
      }
      createdAt
      updatedAt
      moduloViewId
      owner
    }
  }
`;
export const listModulos = /* GraphQL */ `
  query ListModulos(
    $filter: ModelModuloFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listModulos(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        nome
        models {
          items {
            id
            nome
            campos {
              nextToken
            }
            tipoApi
            createdAt
            updatedAt
            moduloModelsId
            owner
          }
          nextToken
        }
        view {
          telas {
            items {
              nome
              tipo
              fonte_dados
              formulario
              converter_para_exibir_na_tabela
              id
              createdAt
              updatedAt
              viewTelasId
              owner
            }
            nextToken
          }
          nav_bar {
            botoes {
              nome
              to
              is_just_a_link
              auth
            }
            brand {
              is_home
              logo
              height
              width
            }
          }
          form_login {
            logo
            background
            cadastro {
              mensagem
              link
            }
          }
          id
          createdAt
          updatedAt
          owner
        }
        apis {
          items {
            nome
            tipoApi
            nome_grupo_model
            caminho
            dominio
            headers {
              key
              value
            }
            id
            createdAt
            updatedAt
            moduloApisId
            owner
          }
          nextToken
        }
        createdAt
        updatedAt
        moduloViewId
        owner
      }
      nextToken
    }
  }
`;

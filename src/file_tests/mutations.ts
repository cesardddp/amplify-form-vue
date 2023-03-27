/* tslint:disable */
/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const createCampo = /* GraphQL */ `
  mutation CreateCampo(
    $input: CreateCampoInput!
    $condition: ModelCampoConditionInput
  ) {
    createCampo(input: $input, condition: $condition) {
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
export const updateCampo = /* GraphQL */ `
  mutation UpdateCampo(
    $input: UpdateCampoInput!
    $condition: ModelCampoConditionInput
  ) {
    updateCampo(input: $input, condition: $condition) {
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
export const deleteCampo = /* GraphQL */ `
  mutation DeleteCampo(
    $input: DeleteCampoInput!
    $condition: ModelCampoConditionInput
  ) {
    deleteCampo(input: $input, condition: $condition) {
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
export const createTela = /* GraphQL */ `
  mutation CreateTela(
    $input: CreateTelaInput!
    $condition: ModelTelaConditionInput
  ) {
    createTela(input: $input, condition: $condition) {
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
export const updateTela = /* GraphQL */ `
  mutation UpdateTela(
    $input: UpdateTelaInput!
    $condition: ModelTelaConditionInput
  ) {
    updateTela(input: $input, condition: $condition) {
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
export const deleteTela = /* GraphQL */ `
  mutation DeleteTela(
    $input: DeleteTelaInput!
    $condition: ModelTelaConditionInput
  ) {
    deleteTela(input: $input, condition: $condition) {
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
export const createApi = /* GraphQL */ `
  mutation CreateApi(
    $input: CreateApiInput!
    $condition: ModelApiConditionInput
  ) {
    createApi(input: $input, condition: $condition) {
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
export const updateApi = /* GraphQL */ `
  mutation UpdateApi(
    $input: UpdateApiInput!
    $condition: ModelApiConditionInput
  ) {
    updateApi(input: $input, condition: $condition) {
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
export const deleteApi = /* GraphQL */ `
  mutation DeleteApi(
    $input: DeleteApiInput!
    $condition: ModelApiConditionInput
  ) {
    deleteApi(input: $input, condition: $condition) {
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
export const createModel = /* GraphQL */ `
  mutation CreateModel(
    $input: CreateModelInput!
    $condition: ModelModelConditionInput
  ) {
    createModel(input: $input, condition: $condition) {
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
export const updateModel = /* GraphQL */ `
  mutation UpdateModel(
    $input: UpdateModelInput!
    $condition: ModelModelConditionInput
  ) {
    updateModel(input: $input, condition: $condition) {
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
export const deleteModel = /* GraphQL */ `
  mutation DeleteModel(
    $input: DeleteModelInput!
    $condition: ModelModelConditionInput
  ) {
    deleteModel(input: $input, condition: $condition) {
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
export const createView = /* GraphQL */ `
  mutation CreateView(
    $input: CreateViewInput!
    $condition: ModelViewConditionInput
  ) {
    createView(input: $input, condition: $condition) {
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
export const updateView = /* GraphQL */ `
  mutation UpdateView(
    $input: UpdateViewInput!
    $condition: ModelViewConditionInput
  ) {
    updateView(input: $input, condition: $condition) {
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
export const deleteView = /* GraphQL */ `
  mutation DeleteView(
    $input: DeleteViewInput!
    $condition: ModelViewConditionInput
  ) {
    deleteView(input: $input, condition: $condition) {
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
export const createModulo = /* GraphQL */ `
  mutation CreateModulo(
    $input: CreateModuloInput!
    $condition: ModelModuloConditionInput
  ) {
    createModulo(input: $input, condition: $condition) {
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
export const updateModulo = /* GraphQL */ `
  mutation UpdateModulo(
    $input: UpdateModuloInput!
    $condition: ModelModuloConditionInput
  ) {
    updateModulo(input: $input, condition: $condition) {
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
export const deleteModulo = /* GraphQL */ `
  mutation DeleteModulo(
    $input: DeleteModuloInput!
    $condition: ModelModuloConditionInput
  ) {
    deleteModulo(input: $input, condition: $condition) {
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

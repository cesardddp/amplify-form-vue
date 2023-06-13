import { Ref } from "vue";
import old_schema from "../../file_tests/old_schema.json";
import schema from "../../file_tests/schema_24_02_com_modulos_e_grupos.json";
import { Arg, IntrospectionSchema, OfTypeClass, TypeElement } from "../../introspectionSchemaInterface";
import { FormStateHandler } from "../formStorage";
import IntrospectionParser, { getEnityInputType, parseNonScalar, getTypesFromSchema } from "../parse-introspection";

function testeGetTypeFromSchema() {

    const expected = {
        "kind": "INPUT_OBJECT",
        "name": "CreateViewInput",
        "description": null,
        "fields": null,
        "inputFields": [
            {
                "name": "nav_bar",
                "description": null,
                "type": {
                    "kind": "INPUT_OBJECT",
                    "name": "NavBarInput",
                    "ofType": null
                },
                "defaultValue": null
            },
            {
                "name": "form_login",
                "description": null,
                "type": {
                    "kind": "INPUT_OBJECT",
                    "name": "FormLoginInput",
                    "ofType": null
                },
                "defaultValue": null
            },
            {
                "name": "id",
                "description": null,
                "type": {
                    "kind": "SCALAR",
                    "name": "ID",
                    "ofType": null
                },
                "defaultValue": null
            }
        ],
        "interfaces": null,
        "enumValues": null,
        "possibleTypes": null
    }
    const test_result = getEnityInputType(
        "CreateViewInput",
        old_schema as IntrospectionSchema
    )
    const [str_expected, str_test_result] = [JSON.stringify(test_result), JSON.stringify(expected)]
    const test_get_entity = () => console.assert(
        str_expected === str_test_result,
        `Entidade não foi extraida com sucesso.
    Esperado:${expected}
    Obtido:${test_result}
    `);
    return test_get_entity;
}
//////////////////////////////////////////////
const oldEntitysToTest = [
    'Campo',
    'Tela',
    'Api',
    'Model',
    'View',
    'Modulo',
]
// const test_parse_schema = (entitys_list: string[], _schema: IntrospectionSchema) => {
//     const result = entitys_list.map(entity_name => {
//         const store_form = new FormStateHandler(
//             (...params: any[]) => {
//                 console.log(...params);
//             }
//         )
//         const mapped = IntrospectionParser(
//             entity_name,
//             _schema as IntrospectionSchema
//         )
//         console.log(Object.fromEntries(mapped.entries()));

//         // debugger;
//         return mapped
//     })
//     const mapped_json = result.map(
//         m => Object.fromEntries(m.entries())
//     )

//     return mapped_json;
// }

const entitysToTest = [
    "CreateModuloInput",
    "CreateApiInput",
    "CreateAppInput",
    "CreateModelInput",
    "CreateCampoInput",
    "CreateTelaInput"
]
function testeGetTypesFromSchema() {
    const all_types = getTypesFromSchema(schema as IntrospectionSchema)
    console.log(all_types);
    return all_types
}

export default {
    testeGetTypeFromSchema: () => testeGetTypeFromSchema(),
    // test_old_schema: () => test_parse_schema(oldEntitysToTest, old_schema as IntrospectionSchema),
    // test_parse_schema: () => test_parse_schema(entitysToTest, schema as IntrospectionSchema),
    testeGetTypesFromSchema: () => testeGetTypesFromSchema()
};
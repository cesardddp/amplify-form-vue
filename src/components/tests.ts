import formSchemaFor from "./AmplifyForm/form-schema";
    import graphqlJSONSchema from "../example/schema.json";
// import { Campos, Empresa } from "../models";
import { GraphQLJSONSchema } from "./types_generated";

type entitys = "Campo" | "Tela" | "Model" | "View" | "Api" | "Modulo";
const entity: entitys[] = ["Campo", "Tela", "Model", "View", "Api", "Modulo"]

const testa_para_campo_Modulo = (entity: entitys) => console.log(
    entity, formSchemaFor(graphqlJSONSchema as GraphQLJSONSchema, entity, "create")
);

export function tests() {
    return entity.map(testa_para_campo_Modulo)
    return false
}

export function test_retorna_para_gerar_compontes() {
    return entity.map(
        (entity: entitys) => {
            return {
                ent: entity,
                schema: formSchemaFor(graphqlJSONSchema as GraphQLJSONSchema, entity, "create")
                }
        }
    )
}
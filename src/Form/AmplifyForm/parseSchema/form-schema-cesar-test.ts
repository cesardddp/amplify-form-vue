import { formSchemaFor } from "./form-schema-cesar";
import schema from "../../../example/schema.json";
import { graphql_schema } from "../../../merm-types/generated_amplify_graphql_schema_interfaces";

formSchemaFor(
    schema as graphql_schema,
    "View",
    'create'
)



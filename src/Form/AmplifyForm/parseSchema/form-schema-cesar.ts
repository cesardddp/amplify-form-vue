import { Option, Field } from '../../types';
import capitalize from 'lodash/capitalize';
import { Arg, TypeElement, Type, graphql_schema, OfTypeClass } from "../../../merm-types/generated_amplify_graphql_schema_interfaces";
import { FormSchema, FormSchemaField, SubForm } from "../../../merm-types/cesar_novos_types_vue_form";

const getTypesFor = (graphqlJSONSchema: graphql_schema): TypeElement[] => {
    try {
        return graphqlJSONSchema.data.__schema.types;
        // const types: Type[] | undefined = graphqlJSONSchema?.data.__schema?.types;
        // return types;
    } catch (error) {
        throw Error(`Invalid GraphQL JSON Schema`);
    }
};

const getLabel = (name: string, labelMap?: Map<string, string>) =>
    capitalize(labelMap?.get(name) || name).replaceAll('_', ' ');

export const getEnumValues = (
    name: string,
    types: Field[],
    labelMap?: Map<string, string>
): Option[] => {
    const field = types.find(type => type.name == name && type.kind == 'ENUM');
    if (!field) throw Error(`Unable to find enum ${name}`);
    return field.enumValues!.map(value => {
        return {
            label: getLabel(value.name, labelMap),
            value: value.name,
        };
    });
};

export function formSchemaFor(
    graphqlJSONSchema: graphql_schema,
    entity: string,
    mutation: 'create' | 'update',
    // labelMap?: Map<string, string>
): FormSchema {
    // essa funão vai pegar o schema do INPUT da entidade entity
    // mais especificamente, vai pegar o create(usado até agora) input dessa entidade
    // full name é pra montar esse nome
    // types são todos os types possiveis para as entididades deifinidas no graphqlschema
    // isto é, dada uma entidade Campo, ela tem seus respectivos "Campo", "getCampo", "listCampos", "updateCampo", "deleteCampo", "createCampo", "getCampoInput",etc...

    const fullname = mutation + entity + 'Input'; // pega o full name, como 'createCampoInput'
    // const fullname =  entity + 'Input';
    const types = getTypesFor(graphqlJSONSchema); // pega todos os tipos do schema (do schema.data.__schema.types)

    const getFormSchemaFields = (fullEntity: string): (FormSchemaField | SubForm)[] => {
        const baseField = types.find(
            type => type.name.toLowerCase() == fullEntity.toLowerCase()
        );
        if (!baseField) throw Error(`Unable to find '${capitalize(entity)}' in the schema (looking for '${fullEntity}')`);



        // const fields =
        // baseField.kind == 'INPUT_OBJECT'
        //   ? baseField.inputFields!
        //   : baseField.fields;
        // if (!fields) throw Error(`Unable to find fields for ${fullEntity}`);
        // debugger
        if (baseField.inputFields === null) throw Error(`Unable to find fields for ${fullEntity}`);

        function fieldFrom(type: OfTypeClass): Omit<FormSchemaField, 'name'> | (FormSchemaField | SubForm)[] {
            console.log('type: ', type);

            switch (type.kind) {
                case 'SCALAR':
                    if (type.name == 'ID') return { kind: 'relationship' };
                    else return { kind: type.name!.toLocaleUpperCase() as OfTypeClass['name'] };

                case 'LIST':
                    const field = {
                        kind: 'LIST',
                        of: { kind: 'unhandled' },
                        multiple: true,
                    };
                    const ofFormSchema = fieldFrom(type.ofType!);
                    // if(ofFormSchema.kind) debugger
                    // if (ofFormSchema.kind == 'SELECT')
                    field.of = ofFormSchema;
                    return field;

                case 'ENUM':
                    return {
                        kind: 'SELECT',
                        options: getEnumValues(type.name!, types)//, labelMap),
                    };
                case 'NON_NULL':
                    // TODO PAREI AQUI ORA VER QUEM É NON NULL?? VER ISSO NO VIEW
                    // PAREI AQUI
                    {
                        const field = fieldFrom(type.ofType!)!;
                        field.required = true;
                        return field;
                    }
                case 'INPUT_OBJECT':
                case 'OBJECT':
                    const k = getFormSchemaFields(type.name!);
                    return k;
                default:
                    throw new Error("kind desconhecido: " + type.kind);
            }
        };

        const formSchema: any = [];
        // fields.forEach(field => {
        // debugger
        baseField.inputFields.forEach(arg => {
            if (arg.name == 'id') return;
            console.log(arg);

            return
            const fieldSchema = fieldFrom(arg.type!);
            // fieldSchema.defaultValue = field.defaultValue;
            // fieldSchema.label = getLabel(field.name, labelMap);
            // fieldSchema.nome = field.name; //cesar add
            // debugger
            if (fieldSchema.kind) { formSchema.push({ name: arg.name, ...fieldSchema } satisfies FormSchemaField) }
            else { formSchema.push({ name: arg.name, fields: fieldSchema } satisfies SubForm); }
            // console.log(fieldSchema);
            // console.log(formSchema);
            // debugger
        });
        // debugger

        return formSchema;
    };

    return { formName: fullname, fields: getFormSchemaFields(fullname) };
};

export default formSchemaFor;
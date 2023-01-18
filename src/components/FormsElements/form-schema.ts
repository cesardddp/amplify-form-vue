import { FormSchema, Option, Type, Field, GraphQLJSONSchema } from '../types';
import { GraphQLJSONSchema as GraphQLJSONSchema2 } from "../types_generated";
import capitalize from 'lodash/capitalize';

const getTypesFor = (graphqlJSONSchema: GraphQLJSONSchema) => {
  try {
    const types: Field[] | undefined = graphqlJSONSchema?.data.__schema?.types;
    return types;
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

const formSchemaFor = (
  graphqlJSONSchema: GraphQLJSONSchema2,
  entity: string,
  mutation?: 'create' | 'update',
  labelMap?: Map<string, string>
) => {
  const fullname = (mutation || '') + entity + 'Input';
  const types = getTypesFor(graphqlJSONSchema);

  const formSchemaForTypes = (fullEntity: string) => {
    const baseField = types.find(
      type => type.name.toLowerCase() == fullEntity.toLowerCase()
    );
    if (!baseField)
      throw Error(
        `Unable to find '${capitalize(
          entity
        )}' in the schema (looking for '${fullEntity}')`
      );

    const fields =
      baseField.kind == 'INPUT_OBJECT'
        ? baseField.inputFields!
        : baseField.fields;
    if (!fields) throw Error(`Unable to find fields for ${fullEntity}`);

    const fieldFrom: (type: Type) => FormSchema = type => {
      switch (type.kind) {
        case 'NON_NULL':
          {
            const field = fieldFrom(type.ofType!)!;
            field.required = true;
            return field;
          }

        case 'SCALAR':
          if (type.name == 'ID') return { kind: 'relationship' };
          else return { kind: type.name!.toLocaleUpperCase() as FormSchema["kind"] };

        case 'LIST':
          const field: FormSchema = {
            kind: 'LIST',
            of: { kind: 'unhandled' },
            multiple: true,
          };
          const ofFormSchema = fieldFrom(type.ofType!)!;
          if (ofFormSchema.kind == 'SELECT') field.of = ofFormSchema;
          return field;

        case 'ENUM':
          return {
            kind: 'SELECT',
            options: getEnumValues(type.name!, types, labelMap),
          };

        case 'INPUT_OBJECT':
          return formSchemaForTypes(type.name!);
        case 'OBJECT':
          return formSchemaForTypes(type.name!);
        default:
          throw new Error("kind desconhecido: " + type.kind);
      }

    };

    const formSchema: FormSchema = {};
    fields.forEach(field => {
      if (field.name == 'id') return;
      const fieldSchema = fieldFrom(field.type!);
      fieldSchema.defaultValue = field.defaultValue;
      fieldSchema.label = getLabel(field.name, labelMap);
      formSchema[field.name] = fieldSchema;
    });
    return formSchema;
  };

  return formSchemaForTypes(fullname);
};

export default formSchemaFor;
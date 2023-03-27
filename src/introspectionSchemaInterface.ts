export interface IntrospectionSchema {
    data: Data;
}

export interface Data {
    __schema: Schema;
}

export interface Schema {
    queryType: Type;
    mutationType: Type;
    subscriptionType: Type;
    types: TypeElement[];
    directives: Directive[];
}

export interface Directive {
    name: string;
    description: null | string;
    locations: string[];
    args: Arg[];
    onOperation: boolean;
    onFragment: boolean;
    onField: boolean;
}

export interface Arg {
    name: string;
    description: null | string;
    type: OfTypeClass;
    defaultValue: null | string;
}

export interface OfTypeClass {
    kind: Kind;
    name: null | Name;
    ofType: OfTypeClass | null;
}

export type Name = "AWSDate" | "AWSDateTime" | "AWSEmail" | "AWSIPAddress" | "AWSJSON" | "AWSPhone" | "AWSTime" | "AWSTimestamp" | "AWSURL" | "Boolean" | "Float" | "ID" | "Int" | "String";

export type Kind = "NON_NULL" | "LIST" | "SCALAR" | "INPUT_OBJECT" | "ENUM" | "OBJECT";

export interface Type {
    name: string;
}

export interface TypeElement {
    kind: Kind;
    name: string;
    description: null | string;
    fields: Field[] | null;
    inputFields: Arg[] | null;
    interfaces: any[] | null;
    enumValues: EnumValue[] | null;
    possibleTypes: null;
}

export interface EnumValue {
    name: string;
    description: null | string;
    isDeprecated: boolean;
    deprecationReason: null;
}

export interface Field {
    name: string;
    description: null | string;
    args: Arg[];
    type: OfTypeClass;
    isDeprecated: boolean;
    deprecationReason: null | string;
}

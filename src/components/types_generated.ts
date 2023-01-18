export interface GraphQLJSONSchema {
    data: Data;
}

export interface Data {
    __schema: Schema;
}

export interface Schema {
    queryType:        Type;
    mutationType:     Type;
    subscriptionType: Type;
    types:            TypeElement[];
    directives:       Directive[];
}

export interface Directive {
    name:        string;
    description: null | string;
    locations:   string[];
    args:        Arg[];
    onOperation: boolean;
    onFragment:  boolean;
    onField:     boolean;
}

export interface Arg {
    name:         string;
    description:  null | string;
    type:         OfTypeClass;
    defaultValue: null | string;
}

export interface OfTypeClass {
    kind:   Kind;
    name:   null | string;
    ofType: OfTypeClass | null;
}

export type Kind = "NON_NULL" | "SCALAR" | "LIST" | "INPUT_OBJECT" | "OBJECT" | "ENUM";

export interface Type {
    name: string;
}

export interface TypeElement {
    kind:          Kind;
    name:          string;
    description:   null | string;
    fields:        Field[] | null;
    inputFields:   Arg[] | null;
    interfaces:    any[] | null;
    enumValues:    EnumValue[] | null;
    possibleTypes: null;
}

export interface EnumValue {
    name:              string;
    description:       null | string;
    isDeprecated:      boolean;
    deprecationReason: null;
}

export interface Field {
    name:              string;
    description:       null | string;
    args:              Arg[];
    type:              OfTypeClass;
    isDeprecated:      boolean;
    deprecationReason: null | string;
}

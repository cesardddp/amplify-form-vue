// import { HTMLProps } from 'react';
// import { FormikHelpers } from 'formik';
// import { fieldSizeMap, textColorMap } from './utils/theme-maps';

export type Value =
  | string
  | number
  | boolean
  | string[]
  | Option[]
  | FileWithSize
  | FileWithSize[];

export interface FormTheme {
  color?: Color;
  branding?: 'basic' | 'full';
}

// TODO : Limit to map values
export type FieldSize = string;

// TODO : Limit to map values
export type Color = string;

export interface FormValues {
  [k: string]: Value | FormValues | undefined;
}

export interface Relationship {
  entity: string;
  path?: string;
  items: any[];
  labelField: string;
  label?: string;
  size?: FieldSize;
}

export interface Messages {
  invalidError?: string;
  required?: string;
  select?: string;
  submitAction?: string;
  creating?: string;
}
export interface FileWithSize extends File {
  label?: string;
  preview?: string;
  width?: number;
  height?: number;
}

export interface FileWithStorageKey extends Omit<FileWithSize, 'preview'> {
  storageKey: string;
}

export interface FileFieldProps {
  fileType?: string;
  text?: string;
}

export type FileFields = string[] | Record<string, FileFieldProps>;

export type TextAreas =
  | string[];
// | Record<string>;//, HTMLProps<HTMLTextAreaElement>>;

export interface FieldsSize {
  [k: string]: FieldSize;
}

export interface StorageConfig {
  storagePrefix?: string;
  storageLevel?: 'public' | 'protected' | 'private';
}

export type FieldsProps = Record<
  string,
  Record<string, string | number | boolean>
>;

export interface AmplifyFormProps {
  graphQLJSONSchema: any;
  entity: string;
  onSubmit: (values: FormValues) => void;
  label?: string;
  // textAreas?: TextAreas;
  fileFields?: FileFields;
  imageFields?: FileFields;
  storageConfig?: StorageConfig;
  relationships?: Relationship[];
  fieldsSize?: FieldsSize;
  fieldsProps?: FieldsProps;
  theme?: FormTheme;
  labelMap?: Map<string, string>;
  textAreas?: TextAreas;
}

export interface FilesDropInputProps
// extends Omit<HTMLProps<HTMLInputElement>, 'defaultValue'>
{
  text?: string;
  theme?: FormTheme;
  fileType?: string;
  thumbnailSize?: {
    width: number;
    height: number;
  };
  setValue: (files: FileWithSize[]) => void;
  defaultValue?: File[];
}

export interface FormComponentProps {
  name: string;
  label: string;
  formSchema: FormSchema;
  onSubmit?: (
    values: FormValues,
    // formikHelpers: FormikHelpers<FormValues>
  ) => void;
  relationships?: Relationship[];
  theme?: FormTheme;
  messages?: Messages;
}

export interface FieldProps {// extends HTMLProps<HTMLInputElement> {
  name: string;
  label?: string;
  labelCentered?: boolean;
  fieldSize?: FieldSize;
  theme?: FormTheme;
  isSubmitting?: boolean;
  selectedValue?: string;
}

export interface FormSchema {
  label?: string;
  // kind?: string//"SCALAR" | "OBJECT" | "NON_NULL" | "INPUT_OBJECT" | "ENUM" | "LIST"|"BOOLEAN"|"INT"|"SELECT"|"STRING";
  // kind?: 'ENUM' | 'INPUT_OBJECT' | 'LIST' | 'NON_NULL' | 'OBJECT' | 'SCALAR';
  // https://docs.aws.amazon.com/appsync/latest/devguide/scalars.html
  kind?: "ID" | "STRING" | "INT" | "FLOAT" | "BOOLEAN" | "AWSDATE" | "AWSTIME" | "AWSDATETIME" | "AWSTIMESTAMP" | "AWSEMAIL" | "AWSJSON" | "AWSPHONE" | "AWSURL" | "AWSIPADDRESS" | 'relationship' | 'LIST' | 'unhandled' | 'SELECT';
  options?: Option[];
  of?: FormSchema;
  fileType?: string;
  text?: string;
  required?: boolean;
  multiple?: boolean;
  readOnly?: boolean;
  defaultValue?: Value;
  [k: string]: Value | FormSchema | undefined;
}

export interface Type {
  // kind: string;
  kind: 'ENUM' | 'INPUT_OBJECT' | 'LIST' | 'NON_NULL' | 'OBJECT' | 'SCALAR';
  name?: string | null; //alterado pra add null;;
  ofType?: Type | null; //alterado pra add null;
}

export interface EnumValue {
  name: string;
  description?: string | null; //alterado pra add null
  isDeprecated?: boolean;
  deprecationReason?: string | null; //alterado pra add null;
}

export interface Field {
  kind?: string;
  name: string;
  description?: string | null; //alterado pra add null
  args?: any[];
  type?: Type;
  fields?: Field[] | null; //alterado pra add null
  inputFields?: Field[] | null; //alterado pra add null
  interfaces?: any;
  enumValues?: EnumValue[] | null; //alterado pra add null
  isDeprecated?: boolean;
  deprecationReason?: string | null; //alterado pra add null;
  defaultValue?: any;
  possibleTypes?: any;
}

export interface GraphQLJSONSchema {
  data: {
    __schema: {
      queryType: any;
      mutationType: any;
      subscriptionType: any;
      types: Field[];
      directives: any[];
    };
  };
}

export interface Option {
  label?: string;
  value: string;
}
export interface SelectFieldProps extends FieldProps {
  options: Option[];
}

export interface FilesDropFieldProps
  extends Omit<FieldProps, 'defaultValue'>,
  Omit<FilesDropInputProps, 'setValue'> {
  name: string;
}

export interface SubmitButtonProps {//extends HTMLProps<HTMLButtonElement> {
  title?: string;
  // theme?: FormTheme;
  bootstrap_syncfusion?: 'bs' | 'sf';
  fs_isPrimary?: boolean;
  btn_theme: "btn-primary" | "btn-secondary" | "btn-success" | "btn-danger" | "btn-warning" | "btn-info" | "btn-light" | "btn-dark";
  //   theme?: FormTheme;
  disabled?: boolean;
  bs_class_wrap?: string;
  bs_class_input?: string;
  bs_class_label?: string;

  //fs props
  iconCss?: string;
  iconPosition?: "Left" | "Right";
}

export interface ObjectWithKey {
  [key: string]: ObjectWithKey | any;
}

export interface CheckBoxFieldProps extends FieldProps {
  onSelect: Function

}
// export interface Files
export interface TextAreaFieldProps extends FieldProps {
  fieldSize: '2xl' | string,
  placeholder: string,
  rows: number,
  cols: number,
  //   {...rest}
}
export interface TextFieldProps extends FieldProps {
  placeholder: string,
}

export interface NumberFieldProps extends FieldProps {
  placeholder: string, step: number
}
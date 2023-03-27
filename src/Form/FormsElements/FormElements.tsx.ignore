// import { FC, VFC, Fragment } from 'react';
// import { ErrorMessage, Field, useField } from 'formik';
// import ReactSelect, { MultiValue, StylesConfig } from 'react-select';
// import FilesDropInput from '../FilesDropInput';
// import chroma from 'chroma-js';
import {
  // FieldProps,
  // SelectFieldProps,
  Option,
  // FilesDropFieldProps,
  FileWithSize,
  // SubmitButtonProps,
  FormValues,
} from './types';
// import {
//   accentColorMap,
//   bgColorMap,
//   bgLightColorMap,
//   borderColorMap,
//   fieldSizeMap,
//   focusBorderColorMap,
//   optionColorMap,
//   peerFocusTextColorMap,
//   textColorMap,
// } from '../../utils/theme-maps';
import capitalize from 'lodash/capitalize';

const fieldSetStyle =
  'flex flex-wrap flex-row justify-start border-2 p-4 gap-3 w-full';
const legendStyle = 'font-black text-lg px-2';
const labelStyle =
  'text-gray-400 px-2 absolute left-0 -top-3.5 text-sm transition-all peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-placeholder-shown:top-2 peer-focus:-top-3.5 peer-focus:text-sm';
const fieldStyle =
  'bg-transparent border-gray-300 text-gray-600 peer h-10 border-0 border-b-2 placeholder-transparent focus:outline-none focus:ring-0';
const checkboxStyle =
  'bg-transparent border-gray-300 rounded border-2 w-5 h-5 focus:ring-0';
const selectStyle = 'border-gray-300 border-0 border-b-2 relative';
const errorStyle = 'text-red-700 text-xs';
const submitButtonStyle =
  'hover:opacity-90 w-min my-4 px-14 py-2 text-center text-xl font-bold rounded shadow-xl';

// COMPONENTE
export const FieldWithError: FC<FieldProps> = ({
  name,
  label,
  labelCentered,
  fieldSize = 'full',
  theme,
  children,
}) => {
  const safeFieldSize = fieldSizeMap.get(fieldSize) ? fieldSize : 'full';
  if (!fieldSizeMap.get(fieldSize)) {
    const fieldSizeValues = Array.from(fieldSizeMap.keys());
    console.warn(
      `Problem in FieldWithError: fieldSize '${fieldSize}' is unknown, fieldSize is set to default : '${safeFieldSize}' (Possible fieldSize are : '${fieldSizeValues.join(
        `', '`
      )}')`
    );
  }
  return (
    <Fragment>
      <div className='py-2'>
        <div className='relative'>
          {children}
          {label && (
            <label
              className={`${labelStyle} ${peerFocusTextColorMap.get(
                theme?.color
              )} ${labelCentered ? 'text-center' : ''} ${fieldSizeMap.get(
                safeFieldSize
              )}`}
              htmlFor={name}>
              {label}
            </label>
          )}
        </div>
        <ErrorMessage
          name={name}
          render={msg => (
            <div className={`${errorStyle} ${fieldSizeMap.get(safeFieldSize)}`}>
              {msg}
            </div>
          )}
        />
      </div>
    </Fragment>
  );
};

// COMPONENTE FieldSet


// COMPONENTE TextField


// COMPONENTE TextAreaField


// COMPONENTE NumberField


// COMPONENTE CheckboxField


// COMPONENTE SelectField


// COMPONENTE FilesDropField


// COMPONENTE SubmitButtonProps


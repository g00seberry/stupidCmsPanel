// editPropsSchemas.ts
import { z } from 'zod';
import {
  zEditCheckbox,
  zEditCheckboxGroup,
  zEditDatePicker,
  zEditDatePickerList,
  zEditDateTimePicker,
  zEditDateTimePickerList,
  zEditInputNumber,
  zEditInputNumberList,
  zEditInputText,
  zEditInputTextList,
  zEditJsonArray,
  zEditJsonObject,
  zEditMediaField,
  zEditRefField,
  zEditSelect,
  zEditSelectMultiple,
  zEditTextarea,
  zEditTextareaList,
  type ZEditComponent,
} from '../schemaForm/ZComponent';

// Имя компонента (дискриминатор)
export type EditComponentName = ZEditComponent['name'];

// Мапа: name → schema.props
export const propsSchemasByName = {
  inputText: zEditInputText.shape.props,
  textarea: zEditTextarea.shape.props,
  inputNumber: zEditInputNumber.shape.props,
  checkbox: zEditCheckbox.shape.props,
  datePicker: zEditDatePicker.shape.props,
  dateTimePicker: zEditDateTimePicker.shape.props,
  select: zEditSelect.shape.props,
  jsonObject: zEditJsonObject.shape.props,
  inputTextList: zEditInputTextList.shape.props,
  textareaList: zEditTextareaList.shape.props,
  inputNumberList: zEditInputNumberList.shape.props,
  checkboxGroup: zEditCheckboxGroup.shape.props,
  datePickerList: zEditDatePickerList.shape.props,
  dateTimePickerList: zEditDateTimePickerList.shape.props,
  selectMultiple: zEditSelectMultiple.shape.props,
  jsonArray: zEditJsonArray.shape.props,
  refField: zEditRefField.shape.props,
  mediaField: zEditMediaField.shape.props,
} as const satisfies Record<EditComponentName, z.ZodObject<any>>;

export const getPropsSchemaByName = (name: EditComponentName) => propsSchemasByName[name];

// Удобный тип: по имени компонента получить тип его props
export type EditComponentPropsByName<N extends EditComponentName> = z.infer<
  (typeof propsSchemasByName)[N]
>;

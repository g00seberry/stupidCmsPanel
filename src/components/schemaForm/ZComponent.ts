import z from 'zod';

/**
 * Проверяет, что формат даты содержит необходимые токены (YYYY, MM, DD).
 * Используется для валидации формата даты в компонентах datePicker.
 * @param format Формат даты для проверки (например, 'YYYY-MM-DD').
 * @returns `true`, если формат содержит необходимые токены для года, месяца и дня.
 * @example
 * isValidDateFormat('YYYY-MM-DD'); // true
 * isValidDateFormat('DD/MM/YYYY'); // true
 * isValidDateFormat('MM-DD'); // false (нет года)
 */
const isValidDateFormat = (format: string): boolean => {
  const hasYear = /YYYY|YY/.test(format);
  const hasMonth = /MM|M/.test(format);
  const hasDay = /DD|D/.test(format);
  return hasYear && hasMonth && hasDay;
};

/**
 * Проверяет, что формат даты и времени содержит необходимые токены (YYYY, MM, DD, HH, mm, ss).
 * Используется для валидации формата даты и времени в компонентах dateTimePicker.
 * @param format Формат даты и времени для проверки (например, 'YYYY-MM-DD HH:mm:ss').
 * @returns `true`, если формат содержит необходимые токены для даты и времени.
 * @example
 * isValidDateTimeFormat('YYYY-MM-DD HH:mm:ss'); // true
 * isValidDateTimeFormat('DD/MM/YYYY HH:mm'); // true
 * isValidDateTimeFormat('YYYY-MM-DD'); // false (нет времени)
 */
const isValidDateTimeFormat = (format: string): boolean => {
  const hasDate = isValidDateFormat(format);
  const hasHour = /HH|H|hh|h/.test(format);
  const hasMinute = /mm|m/.test(format);
  const hasSecond = /ss|s/.test(format);
  return hasDate && hasHour && hasMinute && hasSecond;
};

/**
 * Базовые props компонента формы редактирования.
 * Содержит обязательное поле label.
 */
const zBaseProps = z.object({
  label: z.string().describe('Label|Название поля|Введите label'),
});

/**
 * Расширение базовых props с опциональным placeholder.
 */
const zWithPlaceholder = zBaseProps.extend({
  placeholder: z
    .string()
    .optional()
    .describe('Placeholder|Подсказка в поле ввода|Введите placeholder'),
});

/**
 * Расширение props с опциональным количеством строк.
 */
const zWithRows = zWithPlaceholder.extend({
  rows: z
    .number()
    .min(1, 'Минимум 1')
    .optional()
    .describe('Rows|Количество строк|Количество строк'),
});

/**
 * Расширение props с опциональными min, max и step для числовых полей.
 */
const zWithMinMaxStep = zWithPlaceholder.extend({
  min: z.number().optional().describe('Min|Минимальное значение|Минимальное значение'),
  max: z.number().optional().describe('Max|Максимальное значение|Максимальное значение'),
  step: z.number().optional().describe('Step|Шаг изменения значения|Шаг'),
});

/**
 * Расширение props с опциональным форматом даты.
 */
const zWithDateFormat = zWithPlaceholder.extend({
  format: z
    .string()
    .optional()
    .refine(val => !val || isValidDateFormat(val), {
      message: 'Формат даты должен содержать YYYY (или YY), MM (или M) и DD (или D)',
    })
    .describe('Format|Формат даты|Формат даты (например, YYYY-MM-DD)'),
});

/**
 * Расширение props с опциональным форматом даты и времени и флагом showTime.
 */
const zWithDateTimeFormat = zWithPlaceholder.extend({
  format: z
    .string()
    .optional()
    .refine(val => !val || isValidDateTimeFormat(val), {
      message:
        'Формат даты и времени должен содержать YYYY (или YY), MM (или M), DD (или D), HH (или H), mm (или m) и ss (или s)',
    })
    .describe('Format|Формат даты и времени|Формат даты и времени (например, YYYY-MM-DD HH:mm:ss)'),
  showTime: z.boolean().optional().describe('Show Time|Показывать время|Показывать выбор времени'),
});

/**
 * Расширение props с опциональным флагом showSearch для компонентов выбора.
 */
const zWithShowSearch = zWithPlaceholder.extend({
  showSearch: z.boolean().optional().describe('Show Search|Включить поиск|Показывать поле поиска'),
});

/**
 * Схема валидации компонента ввода текста (Input).
 * Используется для полей типа 'string'.
 */
export const zEditInputText = z.object({
  name: z.literal('inputText'),
  props: zWithPlaceholder,
});

export type ZEditInputText = z.infer<typeof zEditInputText>;

/**
 * Схема валидации компонента ввода многострочного текста (TextArea).
 * Используется для полей типа 'text'.
 */
export const zEditTextarea = z.object({
  name: z.literal('textarea'),
  props: zWithRows,
});

export type ZEditTextarea = z.infer<typeof zEditTextarea>;

/**
 * Схема валидации компонента ввода числа (InputNumber).
 * Используется для полей типа 'int' и 'float'.
 */
export const zEditInputNumber = z.object({
  name: z.literal('inputNumber'),
  props: zWithMinMaxStep,
});

export type ZEditInputNumber = z.infer<typeof zEditInputNumber>;

/**
 * Схема валидации компонента чекбокса (Checkbox).
 * Используется для полей типа 'bool'.
 */
export const zEditCheckbox = z.object({
  name: z.literal('checkbox'),
  props: zBaseProps,
});

export type ZEditCheckbox = z.infer<typeof zEditCheckbox>;

/**
 * Схема валидации компонента выбора даты (DatePicker).
 * Используется для полей типа 'datetime' (может использоваться только с датой без времени).
 */
export const zEditDatePicker = z.object({
  name: z.literal('datePicker'),
  props: zWithDateFormat,
});

export type ZEditDatePicker = z.infer<typeof zEditDatePicker>;

/**
 * Схема валидации компонента выбора даты и времени (DatePicker с showTime).
 * Используется для полей типа 'datetime'.
 */
export const zEditDateTimePicker = z.object({
  name: z.literal('dateTimePicker'),
  props: zWithDateTimeFormat,
});

export type ZEditDateTimePicker = z.infer<typeof zEditDateTimePicker>;

/**
 * Схема валидации компонента выбора из списка (Select).
 * Используется для полей типа 'ref'.
 */
export const zEditSelect = z.object({
  name: z.literal('select'),
  props: zWithShowSearch,
});

export type ZEditSelect = z.infer<typeof zEditSelect>;

/**
 * Схема валидации компонента списка текстовых полей (Input для массива).
 * Используется для полей типа 'string' с кардинальностью 'many'.
 */
export const zEditInputTextList = z.object({
  name: z.literal('inputTextList'),
  props: zWithPlaceholder,
});

export type ZEditInputTextList = z.infer<typeof zEditInputTextList>;

/**
 * Схема валидации компонента списка многострочных текстовых полей (TextArea для массива).
 * Используется для полей типа 'text' с кардинальностью 'many'.
 */
export const zEditTextareaList = z.object({
  name: z.literal('textareaList'),
  props: zWithRows,
});

export type ZEditTextareaList = z.infer<typeof zEditTextareaList>;

/**
 * Схема валидации компонента списка числовых полей (InputNumber для массива).
 * Используется для полей типа 'int' и 'float' с кардинальностью 'many'.
 */
export const zEditInputNumberList = z.object({
  name: z.literal('inputNumberList'),
  props: zWithMinMaxStep,
});

export type ZEditInputNumberList = z.infer<typeof zEditInputNumberList>;

/**
 * Схема валидации компонента группы чекбоксов (Checkbox для массива).
 * Используется для полей типа 'bool' с кардинальностью 'many'.
 */
export const zEditCheckboxGroup = z.object({
  name: z.literal('checkboxGroup'),
  props: zBaseProps,
});

export type ZEditCheckboxGroup = z.infer<typeof zEditCheckboxGroup>;

/**
 * Схема валидации компонента списка полей выбора даты (DatePicker для массива).
 * Используется для полей типа 'datetime' с кардинальностью 'many' (может использоваться только с датой без времени).
 */
export const zEditDatePickerList = z.object({
  name: z.literal('datePickerList'),
  props: zWithDateFormat,
});

export type ZEditDatePickerList = z.infer<typeof zEditDatePickerList>;

/**
 * Схема валидации компонента списка полей выбора даты и времени (DatePicker с showTime для массива).
 * Используется для полей типа 'datetime' с кардинальностью 'many'.
 */
export const zEditDateTimePickerList = z.object({
  name: z.literal('dateTimePickerList'),
  props: zWithDateTimeFormat,
});

export type ZEditDateTimePickerList = z.infer<typeof zEditDateTimePickerList>;

/**
 * Схема валидации компонента множественного выбора из списка (Select с mode="multiple").
 * Используется для полей типа 'ref' с кардинальностью 'many'.
 */
export const zEditSelectMultiple = z.object({
  name: z.literal('selectMultiple'),
  props: zWithShowSearch,
});

export type ZEditSelectMultiple = z.infer<typeof zEditSelectMultiple>;

/**
 * Схема валидации компонента JSON объекта.
 * Используется для полей типа 'json'.
 */
export const zEditJsonObject = z.object({
  name: z.literal('jsonObject'),
  props: zBaseProps,
});

export type ZEditJsonObject = z.infer<typeof zEditJsonObject>;

/**
 * Схема валидации компонента массива JSON объектов.
 * Используется для полей типа 'json' с кардинальностью 'many'.
 */
export const zEditJsonArray = zEditJsonObject.extend({
  name: z.literal('jsonArray'),
});

export type ZEditJsonArray = z.infer<typeof zEditJsonArray>;

/**
 * Схема валидации конфигурации компонента формы редактирования.
 * Определяет все доступные типы компонентов и их свойства.
 * @example
 * const component: ZEditComponent = {
 *   name: 'inputText',
 *   props: { label: 'Заголовок', placeholder: 'Введите заголовок' }
 * };
 */
export const zEditComponent = z.discriminatedUnion('name', [
  zEditInputText,
  zEditTextarea,
  zEditInputNumber,
  zEditCheckbox,
  zEditDatePicker,
  zEditDateTimePicker,
  zEditSelect,
  zEditJsonObject,
  zEditInputTextList,
  zEditTextareaList,
  zEditInputNumberList,
  zEditCheckboxGroup,
  zEditDatePickerList,
  zEditDateTimePickerList,
  zEditSelectMultiple,
  zEditJsonArray,
]);

/**
 * Тип конфигурации компонента формы редактирования.
 * Представляет один из доступных типов компонентов с его настройками.
 */
export type ZEditComponent = z.infer<typeof zEditComponent>;

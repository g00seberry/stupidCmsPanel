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
 * Схема валидации компонента ввода текста (Input).
 * Используется для полей типа 'string'.
 */
export const zEditInputText = z.object({
  name: z.literal('inputText'),
  props: z.object({
    label: z.string().describe('Label|Название поля|Введите label'),
    placeholder: z
      .string()
      .optional()
      .describe('Placeholder|Подсказка в поле ввода|Введите placeholder'),
  }),
});

export type ZEditInputText = z.infer<typeof zEditInputText>;

/**
 * Схема валидации компонента ввода многострочного текста (TextArea).
 * Используется для полей типа 'text'.
 */
export const zEditTextarea = z.object({
  name: z.literal('textarea'),
  props: z.object({
    label: z.string().describe('Label|Название поля|Введите label'),
    placeholder: z
      .string()
      .optional()
      .describe('Placeholder|Подсказка в поле ввода|Введите placeholder'),
    rows: z
      .number()
      .min(1, 'Минимум 1')
      .optional()
      .describe('Rows|Количество строк|Количество строк'),
  }),
});

export type ZEditTextarea = z.infer<typeof zEditTextarea>;

/**
 * Схема валидации компонента ввода числа (InputNumber).
 * Используется для полей типа 'int' и 'float'.
 */
export const zEditInputNumber = z.object({
  name: z.literal('inputNumber'),
  props: z.object({
    label: z.string().describe('Label|Название поля|Введите label'),
    placeholder: z
      .string()
      .optional()
      .describe('Placeholder|Подсказка в поле ввода|Введите placeholder'),
    min: z.number().optional().describe('Min|Минимальное значение|Минимальное значение'),
    max: z.number().optional().describe('Max|Максимальное значение|Максимальное значение'),
    step: z.number().optional().describe('Step|Шаг изменения значения|Шаг'),
  }),
});

export type ZEditInputNumber = z.infer<typeof zEditInputNumber>;

/**
 * Схема валидации компонента чекбокса (Checkbox).
 * Используется для полей типа 'bool'.
 */
export const zEditCheckbox = z.object({
  name: z.literal('checkbox'),
  props: z.object({
    label: z.string().describe('Label|Название поля|Введите label'),
  }),
});

export type ZEditCheckbox = z.infer<typeof zEditCheckbox>;

/**
 * Схема валидации компонента выбора даты (DatePicker).
 * Используется для полей типа 'date'.
 */
export const zEditDatePicker = z.object({
  name: z.literal('datePicker'),
  props: z.object({
    label: z.string().describe('Label|Название поля|Введите label'),
    placeholder: z
      .string()
      .optional()
      .describe('Placeholder|Подсказка в поле ввода|Введите placeholder'),
    format: z
      .string()
      .optional()
      .refine(
        (val) => !val || isValidDateFormat(val),
        {
          message: 'Формат даты должен содержать YYYY (или YY), MM (или M) и DD (или D)',
        }
      )
      .describe('Format|Формат даты|Формат даты (например, YYYY-MM-DD)'),
  }),
});

export type ZEditDatePicker = z.infer<typeof zEditDatePicker>;

/**
 * Схема валидации компонента выбора даты и времени (DatePicker с showTime).
 * Используется для полей типа 'datetime'.
 */
export const zEditDateTimePicker = z.object({
  name: z.literal('dateTimePicker'),
  props: z.object({
    label: z.string().describe('Label|Название поля|Введите label'),
    placeholder: z
      .string()
      .optional()
      .describe('Placeholder|Подсказка в поле ввода|Введите placeholder'),
    format: z
      .string()
      .optional()
      .refine(
        (val) => !val || isValidDateTimeFormat(val),
        {
          message:
            'Формат даты и времени должен содержать YYYY (или YY), MM (или M), DD (или D), HH (или H), mm (или m) и ss (или s)',
        }
      )
      .describe(
        'Format|Формат даты и времени|Формат даты и времени (например, YYYY-MM-DD HH:mm:ss)'
      ),
    showTime: z
      .boolean()
      .optional()
      .describe('Show Time|Показывать время|Показывать выбор времени'),
  }),
});

export type ZEditDateTimePicker = z.infer<typeof zEditDateTimePicker>;

/**
 * Схема валидации компонента выбора из списка (Select).
 * Используется для полей типа 'ref'.
 */
export const zEditSelect = z.object({
  name: z.literal('select'),
  props: z.object({
    label: z.string().describe('Label|Название поля|Введите label'),
    placeholder: z
      .string()
      .optional()
      .describe('Placeholder|Подсказка в поле ввода|Введите placeholder'),
    showSearch: z
      .boolean()
      .optional()
      .describe('Show Search|Включить поиск|Показывать поле поиска'),
  }),
});

export type ZEditSelect = z.infer<typeof zEditSelect>;

/**
 * Схема валидации компонента JSON объекта.
 * Используется для полей типа 'json'.
 */
export const zEditJsonObject = z.object({
  name: z.literal('jsonObject'),
  props: z.object({
    label: z.string().describe('Label|Название поля|Введите label'),
  }),
});

export type ZEditJsonObject = z.infer<typeof zEditJsonObject>;

/**
 * Схема валидации компонента списка текстовых полей (Input для массива).
 * Используется для полей типа 'string' с кардинальностью 'many'.
 */
export const zEditInputTextList = z.object({
  name: z.literal('inputTextList'),
  props: z.object({
    label: z.string().describe('Label|Название поля|Введите label'),
    placeholder: z
      .string()
      .optional()
      .describe('Placeholder|Подсказка в поле ввода|Введите placeholder'),
  }),
});

export type ZEditInputTextList = z.infer<typeof zEditInputTextList>;

/**
 * Схема валидации компонента списка многострочных текстовых полей (TextArea для массива).
 * Используется для полей типа 'text' с кардинальностью 'many'.
 */
export const zEditTextareaList = z.object({
  name: z.literal('textareaList'),
  props: z.object({
    label: z.string().describe('Label|Название поля|Введите label'),
    placeholder: z
      .string()
      .optional()
      .describe('Placeholder|Подсказка в поле ввода|Введите placeholder'),
    rows: z
      .number()
      .min(1, 'Минимум 1')
      .optional()
      .describe('Rows|Количество строк|Количество строк'),
  }),
});

export type ZEditTextareaList = z.infer<typeof zEditTextareaList>;

/**
 * Схема валидации компонента списка числовых полей (InputNumber для массива).
 * Используется для полей типа 'int' и 'float' с кардинальностью 'many'.
 */
export const zEditInputNumberList = z.object({
  name: z.literal('inputNumberList'),
  props: z.object({
    label: z.string().describe('Label|Название поля|Введите label'),
    placeholder: z
      .string()
      .optional()
      .describe('Placeholder|Подсказка в поле ввода|Введите placeholder'),
    min: z.number().optional().describe('Min|Минимальное значение|Минимальное значение'),
    max: z.number().optional().describe('Max|Максимальное значение|Максимальное значение'),
    step: z.number().optional().describe('Step|Шаг изменения значения|Шаг'),
  }),
});

export type ZEditInputNumberList = z.infer<typeof zEditInputNumberList>;

/**
 * Схема валидации компонента группы чекбоксов (Checkbox для массива).
 * Используется для полей типа 'bool' с кардинальностью 'many'.
 */
export const zEditCheckboxGroup = z.object({
  name: z.literal('checkboxGroup'),
  props: z.object({
    label: z.string().describe('Label|Название поля|Введите label'),
  }),
});

export type ZEditCheckboxGroup = z.infer<typeof zEditCheckboxGroup>;

/**
 * Схема валидации компонента списка полей выбора даты (DatePicker для массива).
 * Используется для полей типа 'date' с кардинальностью 'many'.
 */
export const zEditDatePickerList = z.object({
  name: z.literal('datePickerList'),
  props: z.object({
    label: z.string().describe('Label|Название поля|Введите label'),
    placeholder: z
      .string()
      .optional()
      .describe('Placeholder|Подсказка в поле ввода|Введите placeholder'),
    format: z
      .string()
      .optional()
      .refine(
        (val) => !val || isValidDateFormat(val),
        {
          message: 'Формат даты должен содержать YYYY (или YY), MM (или M) и DD (или D)',
        }
      )
      .describe('Format|Формат даты|Формат даты (например, YYYY-MM-DD)'),
  }),
});

export type ZEditDatePickerList = z.infer<typeof zEditDatePickerList>;

/**
 * Схема валидации компонента списка полей выбора даты и времени (DatePicker с showTime для массива).
 * Используется для полей типа 'datetime' с кардинальностью 'many'.
 */
export const zEditDateTimePickerList = z.object({
  name: z.literal('dateTimePickerList'),
  props: z.object({
    label: z.string().describe('Label|Название поля|Введите label'),
    placeholder: z
      .string()
      .optional()
      .describe('Placeholder|Подсказка в поле ввода|Введите placeholder'),
    format: z
      .string()
      .optional()
      .refine(
        (val) => !val || isValidDateTimeFormat(val),
        {
          message:
            'Формат даты и времени должен содержать YYYY (или YY), MM (или M), DD (или D), HH (или H), mm (или m) и ss (или s)',
        }
      )
      .describe(
        'Format|Формат даты и времени|Формат даты и времени (например, YYYY-MM-DD HH:mm:ss)'
      ),
    showTime: z
      .boolean()
      .optional()
      .describe('Show Time|Показывать время|Показывать выбор времени'),
  }),
});

export type ZEditDateTimePickerList = z.infer<typeof zEditDateTimePickerList>;

/**
 * Схема валидации компонента множественного выбора из списка (Select с mode="multiple").
 * Используется для полей типа 'ref' с кардинальностью 'many'.
 */
export const zEditSelectMultiple = z.object({
  name: z.literal('selectMultiple'),
  props: z.object({
    label: z.string().describe('Label|Название поля|Введите label'),
    placeholder: z
      .string()
      .optional()
      .describe('Placeholder|Подсказка в поле ввода|Введите placeholder'),
    showSearch: z
      .boolean()
      .optional()
      .describe('Show Search|Включить поиск|Показывать поле поиска'),
  }),
});

export type ZEditSelectMultiple = z.infer<typeof zEditSelectMultiple>;

/**
 * Схема валидации компонента массива JSON объектов.
 * Используется для полей типа 'json' с кардинальностью 'many'.
 */
export const zEditJsonArray = z.object({
  name: z.literal('jsonArray'),
  props: z.object({
    label: z.string().describe('Label|Название поля|Введите label'),
  }),
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

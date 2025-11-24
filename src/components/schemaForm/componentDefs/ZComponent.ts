import z from 'zod';

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
    format: z.string().optional().describe('Format|Формат даты|Формат даты (например, YYYY-MM-DD)'),
  }),
});

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
      .describe(
        'Format|Формат даты и времени|Формат даты и времени (например, YYYY-MM-DD HH:mm:ss)'
      ),
    showTime: z
      .boolean()
      .optional()
      .describe('Show Time|Показывать время|Показывать выбор времени'),
  }),
});

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
]);

/**
 * Тип конфигурации компонента формы редактирования.
 * Представляет один из доступных типов компонентов с его настройками.
 */
export type ZEditComponent = z.infer<typeof zEditComponent>;

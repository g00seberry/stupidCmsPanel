import type { ZEditComponent } from './ZComponent';

/**
 * Реестр доступных компонентов для каждого типа данных и кардинальности.
 * Ключ - тип данных из схемы blueprint, значение - объект с массивами компонентов для 'one' и 'many'.
 */
const componentsOptionsRegistry: Record<
  string,
  Record<'one' | 'many', ZEditComponent['name'][]>
> = {
  /** Строковые поля. */
  string: {
    one: ['inputText'],
    many: ['inputTextList'],
  },
  /** Многострочные текстовые поля. */
  text: {
    one: ['textarea'],
    many: ['textareaList'],
  },
  /** Целочисленные поля. */
  int: {
    one: ['inputNumber'],
    many: ['inputNumberList'],
  },
  /** Числа с плавающей точкой. */
  float: {
    one: ['inputNumber'],
    many: ['inputNumberList'],
  },
  /** Булевы поля. */
  bool: {
    one: ['checkbox'],
    many: ['checkboxGroup'],
  },
  /** Поля даты и времени. */
  datetime: {
    one: ['dateTimePicker'],
    many: ['dateTimePickerList'],
  },
  /** Ссылочные поля (ref). */
  ref: {
    one: ['select'],
    many: ['selectMultiple'],
  },
  /** JSON объекты. */
  json: {
    one: ['jsonObject'],
    many: ['jsonArray'],
  },
  /** Числовые поля (устаревший тип, используйте 'int' или 'float'). */
  number: {
    one: ['inputNumber'],
    many: ['inputNumberList'],
  },
};

/**
 * Получает список доступных компонентов для типа данных и кардинальности.
 * @param dataType Тип данных из схемы blueprint (например, 'string', 'int', 'datetime').
 * @param cardinality Кардинальность ('one' или 'many').
 * @returns Массив доступных компонентов или пустой массив, если тип данных не поддерживается.
 * @example
 * getAllowedComponents('string', 'one'); // ['inputText']
 * getAllowedComponents('int', 'one'); // ['inputNumber']
 * getAllowedComponents('datetime', 'many'); // ['dateTimePickerList']
 */
export const getAllowedComponents = (
  dataType: string,
  cardinality: 'one' | 'many'
): ZEditComponent['name'][] => {
  const typeConfig = componentsOptionsRegistry[dataType];
  if (!typeConfig) {
    return [];
  }
  return typeConfig[cardinality] || [];
};

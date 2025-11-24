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
    many: ['inputText'],
  },
  /** Многострочные текстовые поля. */
  text: {
    one: ['textarea'],
    many: ['textarea'],
  },
  /** Целочисленные поля. */
  int: {
    one: ['inputNumber'],
    many: ['inputNumber'],
  },
  /** Числа с плавающей точкой. */
  float: {
    one: ['inputNumber'],
    many: ['inputNumber'],
  },
  /** Булевы поля. */
  bool: {
    one: ['checkbox'],
    many: ['checkbox'],
  },
  /** Поля даты. */
  date: {
    one: ['datePicker'],
    many: ['datePicker'],
  },
  /** Поля даты и времени. */
  datetime: {
    one: ['dateTimePicker'],
    many: ['dateTimePicker'],
  },
  /** Ссылочные поля (ref). */
  ref: {
    one: ['select'],
    many: ['select'],
  },
  /** Числовые поля (устаревший тип, используйте 'int' или 'float'). */
  number: {
    one: ['inputNumber'],
    many: ['inputNumber'],
  },
};

/**
 * Получает список доступных компонентов для типа данных и кардинальности.
 * @param dataType Тип данных из схемы blueprint (например, 'string', 'int', 'date').
 * @param cardinality Кардинальность ('one' или 'many').
 * @returns Массив доступных компонентов или пустой массив, если тип данных не поддерживается.
 * @example
 * getAllowedComponents('string', 'one'); // ['inputText']
 * getAllowedComponents('int', 'one'); // ['inputNumber']
 * getAllowedComponents('date', 'many'); // ['datePicker']
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

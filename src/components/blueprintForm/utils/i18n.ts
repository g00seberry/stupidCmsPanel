/**
 * Словарь переводов для системы форм Blueprint.
 * Ключи - это ключи локализации, значения - переведённые строки.
 */
type Translations = Record<string, string>;

/**
 * Дефолтные переводы (русский язык).
 */
const defaultTranslations: Translations = {
  'blueprint.addItem': 'Добавить',
  'blueprint.removeItem': 'Удалить',
  'blueprint.field.required': 'Поле "{field}" обязательно для заполнения',
  'blueprint.field.enter': 'Введите',
  'blueprint.field.select': 'Выберите',
  'blueprint.field.add': 'Добавить',
  'blueprint.field.maxLength': 'Максимум {max} символов',
  'blueprint.field.minLength': 'Минимум {min} символов',
  'blueprint.field.mustBeInteger': 'Должно быть целым числом',
  'blueprint.field.mustBeNumber': 'Должно быть числом',
  'blueprint.field.invalidFormat': 'Неверный формат',
  'blueprint.field.minValue': 'Минимум {min}',
  'blueprint.field.maxValue': 'Максимум {max}',
  'blueprint.field.minItems': 'Минимум {min} элементов',
  'blueprint.field.maxItems': 'Максимум {max} элементов',
  'blueprint.field.invalidDate': 'Неверный формат даты (YYYY-MM-DD)',
  'blueprint.field.invalidDateTime': 'Неверный формат даты и времени',
  'blueprint.entry.select': 'Выберите Entry',
};

/**
 * Текущий словарь переводов.
 */
let currentTranslations: Translations = defaultTranslations;

/**
 * Устанавливает словарь переводов.
 * @param translations Новый словарь переводов.
 * @example
 * setTranslations({
 *   'blueprint.addItem': 'Add',
 *   'blueprint.removeItem': 'Remove'
 * });
 */
export const setTranslations = (translations: Translations): void => {
  currentTranslations = { ...defaultTranslations, ...translations };
};

/**
 * Получает перевод по ключу.
 * Если перевод не найден, возвращает сам ключ.
 * @param key Ключ локализации.
 * @param params Параметры для подстановки в строку (пока не поддерживается).
 * @returns Переведённая строка.
 * @example
 * t('blueprint.addItem') // 'Добавить'
 * t('blueprint.field.enter', { field: 'title' }) // 'Введите title' (если поддерживается)
 */
export const t = (key: string, params?: Record<string, string>): string => {
  let translation = currentTranslations[key] || key;

  // Простая подстановка параметров (если нужно)
  if (params) {
    for (const [paramKey, paramValue] of Object.entries(params)) {
      translation = translation.replace(`{${paramKey}}`, paramValue);
    }
  }

  return translation;
};

/**
 * Получает перевод с дефолтным значением, если ключ не найден.
 * @param key Ключ локализации.
 * @param defaultValue Дефолтное значение, если ключ не найден.
 * @returns Переведённая строка или дефолтное значение.
 * @example
 * tWithDefault('blueprint.addItem', 'Add') // 'Добавить' или 'Add', если ключ не найден
 */
export const tWithDefault = (key: string, defaultValue: string): string => {
  return currentTranslations[key] || defaultValue;
};


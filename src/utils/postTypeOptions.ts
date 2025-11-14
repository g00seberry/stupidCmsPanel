import type { ZPostTypeOptions } from '@/types/postTypes';
import type { ZId } from '@/types/ZId';

/**
 * Утилиты для работы с options_json типа контента.
 * Предоставляет функции для извлечения и обновления списка разрешённых таксономий.
 */

/**
 * Получает массив разрешённых таксономий из options_json.
 * @param optionsJson Объект options_json типа контента.
 * @returns Массив slug'ов таксономий. Пустой массив, если таксономии не указаны или options_json некорректен.
 * @example
 * const options = { taxonomies: ['categories', 'tags'] };
 * const taxonomies = getTaxonomiesFromOptions(options);
 * console.log(taxonomies); // ['categories', 'tags']
 */
export const getTaxonomiesFromOptions = (
  optionsJson: ZPostTypeOptions | undefined | null
): ZId[] => {
  if (!optionsJson || typeof optionsJson !== 'object') {
    return [];
  }

  const taxonomies = optionsJson.taxonomies;
  if (!Array.isArray(taxonomies)) {
    return [];
  }

  return taxonomies;
};

/**
 * Обновляет массив таксономий в options_json.
 * Создаёт новый объект options_json с обновлённым массивом таксономий, сохраняя остальные поля.
 * Удаляет поле taxonomies из существующего optionsJson перед добавлением нового, чтобы избежать проблем с типами.
 * @param optionsJson Текущий объект options_json или null/undefined.
 * @param taxonomySlugs Массив slug'ов таксономий для установки.
 * @returns Новый объект options_json с обновлённым массивом таксономий.
 * @example
 * const options = { otherField: 'value' };
 * const updated = setTaxonomiesInOptions(options, ['categories', 'tags']);
 * console.log(updated); // { otherField: 'value', taxonomies: ['categories', 'tags'] }
 */
export const setTaxonomiesInOptions = (
  optionsJson: ZPostTypeOptions | undefined | null,
  taxonomySlugs: ZId[]
): ZPostTypeOptions => {
  const options = optionsJson || {};
  return {
    ...options,
    taxonomies: taxonomySlugs,
  };
};

/**
 * Получает значения по умолчанию для options_json.
 * @returns Объект options_json с значениями по умолчанию.
 * @example
 * const options = getDefaultOptions();
 * console.log(options); // { taxonomies: [] }
 */
export const getDefaultOptions = (): ZPostTypeOptions => {
  return {
    taxonomies: [],
  };
};

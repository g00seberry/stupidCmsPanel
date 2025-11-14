import type { ZPostTypeOptions } from '@/types/postTypes';
import type { ZId } from '@/types/ZId';

/**
 * Утилиты для работы с options_json типа контента.
 * Предоставляет функции для извлечения и обновления списка разрешённых таксономий.
 */

/**
 * Получает массив разрешённых таксономий из options_json.
 * @param optionsJson Объект options_json типа контента.
 * @returns Массив ID таксономий. Пустой массив, если таксономии не указаны или options_json некорректен.
 * @example
 * const options = { taxonomies: [1, 2] };
 * const taxonomies = getTaxonomiesFromOptions(options);
 * console.log(taxonomies); // [1, 2]
 */
export const getTaxonomiesFromOptions = (
  optionsJson: ZPostTypeOptions | undefined | null
): ZId[] => {
  return optionsJson?.taxonomies ?? [];
};

/**
 * Обновляет массив таксономий в options_json.
 * Создаёт новый объект options_json с обновлённым массивом таксономий, сохраняя остальные поля.
 * Удаляет поле taxonomies из существующего optionsJson перед добавлением нового, чтобы избежать проблем с типами.
 * @param optionsJson Текущий объект options_json или null/undefined.
 * @param taxonomyIds Массив ID таксономий для установки.
 * @returns Новый объект options_json с обновлённым массивом таксономий.
 * @example
 * const options = { otherField: 'value' };
 * const updated = setTaxonomiesInOptions(options, [1, 2]);
 * console.log(updated); // { otherField: 'value', taxonomies: [1, 2] }
 */
export const setTaxonomiesInOptions = (
  optionsJson: ZPostTypeOptions | undefined | null,
  taxonomyIds: ZId[]
): ZPostTypeOptions => {
  const options = optionsJson || {};
  return {
    ...options,
    taxonomies: taxonomyIds,
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

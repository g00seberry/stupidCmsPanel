import type { ZPath } from '@/types/path';

/**
 * Сегмент пути в объекте.
 * Может быть строковым ключом объекта или числовым индексом массива.
 */
export type PathSegment = string | number;

/**
 * Получить значение из объекта по пути.
 * Рекурсивно обходит объект по сегментам пути и возвращает значение.
 * @param obj Объект для обхода.
 * @param path Массив сегментов пути (строки для ключей объектов, числа для индексов массивов).
 * @returns Значение по пути или `undefined`, если путь не существует.
 * @example
 * const obj = { user: { name: 'John', tags: ['admin', 'user'] } };
 * getValueByPath(obj, ['user', 'name']); // 'John'
 * getValueByPath(obj, ['user', 'tags', 0]); // 'admin'
 * getValueByPath(obj, ['user', 'age']); // undefined
 */
export const getValueByPath = (obj: any, path: PathSegment[]): any => {
  return path.reduce((acc, seg) => (acc == null ? acc : acc[seg]), obj);
};

/**
 * Установить значение в объект по пути.
 * Создаёт промежуточные объекты и массивы при необходимости.
 * @param obj Объект для изменения.
 * @param path Массив сегментов пути.
 * @param value Значение для установки.
 * @example
 * const obj = {};
 * setValueByPath(obj, ['user', 'name'], 'John');
 * // obj = { user: { name: 'John' } }
 * setValueByPath(obj, ['user', 'tags', 0], 'admin');
 * // obj = { user: { name: 'John', tags: ['admin'] } }
 */
export const setValueByPath = (obj: any, path: PathSegment[], value: any): void => {
  if (!path.length) return;
  const last = path[path.length - 1];
  const parent = path.slice(0, -1).reduce((acc, seg) => {
    if (acc[seg] == null) {
      acc[seg] = typeof seg === 'number' ? [] : {};
    }
    return acc[seg];
  }, obj);
  parent[last] = value;
};

/**
 * Преобразовать путь в строковое представление.
 * Форматирует путь для отображения в UI и ключей ошибок валидации.
 * @param path Массив сегментов пути.
 * @returns Строковое представление пути (например, "user.tags[0]" или "rrrr[0].eeee[1]").
 * @example
 * pathToString(['user', 'name']); // 'user.name'
 * pathToString(['user', 'tags', 0]); // 'user.tags[0]'
 * pathToString(['rrrr', 0, 'eeee', 1]); // 'rrrr[0].eeee[1]'
 */
export const pathToString = (path: PathSegment[]): string => {
  return path
    .map((seg, idx) => (typeof seg === 'number' ? `[${seg}]` : idx === 0 ? seg : `.${seg}`))
    .join('')
    .replace('.[', '[');
};

/**
 * Найти путь в дереве по ID.
 * Рекурсивно обходит дерево путей и возвращает узел с указанным ID.
 * @param paths Дерево путей для поиска.
 * @param pathId Идентификатор искомого пути.
 * @returns Найденный узел или `undefined`, если не найден.
 * @example
 * const path = findPathInTree(pathStore.paths, 5);
 * if (path) {
 *   console.log(path.name); // 'fieldName'
 * }
 */
export const findPathInTree = (paths: ZPath[], pathId: number): ZPath | undefined => {
  for (const path of paths) {
    if (path.id === pathId) return path;
    if (path.children) {
      const found = findPathInTree(path.children, pathId);
      if (found) return found;
    }
  }
  return undefined;
};

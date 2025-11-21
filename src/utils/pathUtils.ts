import type { ZPathTreeNode } from '@/types/path';

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
export const findPathInTree = (
  paths: ZPathTreeNode[],
  pathId: number
): ZPathTreeNode | undefined => {
  for (const path of paths) {
    if (path.id === pathId) return path;
    if (path.data_type === 'json' && path.children) {
      const found = findPathInTree(path.children, pathId);
      if (found) return found;
    }
  }
  return undefined;
};

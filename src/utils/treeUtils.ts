/**
 * Интерфейс узла дерева с рекурсивной структурой.
 * Узел может содержать дочерние узлы того же типа.
 */
export interface TreeNode<T extends TreeNode<T> = TreeNode<never>> {
  /** Дочерние узлы (опционально). */
  children?: T[] | null;
  /** Дополнительные данные узла. */
  [key: string]: unknown;
}

/**
 * Находит узел в дереве по значению указанного поля.
 * Выполняет рекурсивный поиск по всему дереву, включая вложенные узлы.
 *
 * @param tree Массив узлов дерева для поиска.
 * @param value Значение поля для поиска.
 * @param keyField Имя поля для поиска (по умолчанию 'key').
 * @returns Найденный узел или `undefined`, если узел не найден.
 * @example
 * // Поиск по полю 'key'
 * const tree1 = [
 *   { key: '1', title: 'Node 1', children: [{ key: '1-1', title: 'Node 1-1' }] },
 *   { key: '2', title: 'Node 2' }
 * ];
 * const node1 = findInTree(tree1, '1-1'); // { key: '1-1', title: 'Node 1-1' }
 *
 * // Поиск по полю 'id'
 * const tree2 = [
 *   { id: 1, name: 'Node 1', children: [{ id: 2, name: 'Node 1-1' }] },
 *   { id: 3, name: 'Node 2' }
 * ];
 * const node2 = findInTree(tree2, 2, 'id'); // { id: 2, name: 'Node 1-1' }
 */
export function findInTree<T extends TreeNode<T>>(
  tree: T[],
  value: string | number,
  keyField: string = 'key'
): T | undefined {
  for (const node of tree) {
    if (node[keyField] === value) {
      return node;
    }

    if (node.children && node.children.length > 0) {
      const found = findInTree(node.children, value, keyField);
      if (found) {
        return found;
      }
    }
  }

  return undefined;
}

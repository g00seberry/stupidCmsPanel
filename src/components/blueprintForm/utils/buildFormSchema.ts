import type { ZPath } from '@/types/path';
import type { FieldNode } from '../types/formField';
import { getFieldLabel } from './getFieldLabel';

/**
 * Преобразует имя поля в массив сегментов пути.
 * @param fullPath Полный путь поля (например, "author.contacts.email").
 * @returns Массив сегментов пути.
 * @example
 * parseFullPath('author.contacts.email')
 * // ['author', 'contacts', 'email']
 */
const parseFullPath = (fullPath: string): string[] => {
  return fullPath.split('.').filter(Boolean);
};

/**
 * Строит форменную модель из дерева Path.
 * Преобразует ZPathTreeNode[] в FieldNode[] с нормализацией данных.
 * @param paths Дерево полей Path.
 * @param parentPath Опциональный путь родительского поля для построения fullPath.
 * @returns Массив узлов полей формы.
 * @example
 * const fieldNodes = buildFormSchema(paths);
 * // [{ id: 1, name: 'title', fullPath: ['title'], dataType: 'string', ... }, ...]
 */
export const buildFormSchema = (paths: ZPath[], parentPath: string[] = []): FieldNode[] => {
  // Сортируем по sort_order без мутации исходного массива
  const sortedPaths = [...paths].sort((a, b) => a.sort_order - b.sort_order);

  return sortedPaths.map(path => {
    // Рассчитываем fullPath
    const fullPath =
      parentPath.length > 0 ? [...parentPath, path.name] : parseFullPath(path.full_path);

    // Применяем дефолты
    const label = getFieldLabel(path);
    const required = path.is_required;
    const readonly = path.is_readonly;
    const helpText = undefined; // TODO: добавить поддержку helpText из Path, если появится

    // Нормализуем правила валидации
    const validationRules = path.validation_rules
      ? path.validation_rules.map(rule => {
          if (typeof rule === 'string') {
            // Старый формат: "type:value"
            const parts = rule.split(':');
            const type = parts[0];
            const value = parts[1];
            switch (type) {
              case 'min':
              case 'max':
                return { type, value: Number(value) || 0 };
              case 'pattern':
              case 'regex':
                return { type: 'regex', pattern: value || '' };
              default:
                return { type, value };
            }
          }
          // Новый формат уже является объектом
          return rule as { type: string; [key: string]: unknown };
        })
      : undefined;

    // Создаём узел поля
    const fieldNode: FieldNode = {
      id: path.id,
      name: path.name,
      fullPath,
      dataType: path.data_type,
      cardinality: path.cardinality,
      label,
      required,
      readonly,
      helpText,
      validationRules,
      sortOrder: path.sort_order,
    };

    // Для json типов рекурсивно строим children
    if (path.data_type === 'json' && path.children && path.children.length > 0) {
      fieldNode.children = buildFormSchema(path.children, fullPath);
    }

    return fieldNode;
  });
};

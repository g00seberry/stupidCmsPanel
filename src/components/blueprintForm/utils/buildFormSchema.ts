import type { ZPathTreeNode, ZValidationRule } from '@/types/path';
import type { BaseFieldNode, FieldNode, JsonFieldNode, ScalarFieldNode } from '../types/formField';
import type { FieldUIConfig } from '../types/uiConfig';
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
 * Нормализует правила валидации из старого формата (строки) в новый (объекты).
 * Преобразует строки вида "type:value" в объекты с типизированной структурой.
 * @param validationRules Правила валидации (могут быть строками или объектами).
 * @returns Нормализованные правила валидации или null.
 */
const normalizeValidationRules = (validationRules: ZValidationRule[] | null): Array<{ type: string; [key: string]: unknown }> | null => {
  if (!validationRules || !Array.isArray(validationRules)) {
    return null;
  }

  return validationRules.map(rule => {
    if (typeof rule === 'string') {
      // Старый формат: "type:value" или "type:value1:value2"
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
    return rule;
  });
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
export const buildFormSchema = (paths: ZPathTreeNode[], parentPath: string[] = []): FieldNode[] => {
  // Сортируем по sort_order без мутации исходного массива
  const sortedPaths = [...paths].sort((a, b) => a.sort_order - b.sort_order);

  return sortedPaths.map(path => {
    // Рассчитываем fullPath
    const fullPath = parentPath.length > 0 ? [...parentPath, path.name] : parseFullPath(path.full_path);

    // Применяем дефолты
    const label = getFieldLabel(path);
    const required = path.is_required;
    const readonly = path.is_readonly;
    const helpText = undefined; // TODO: добавить поддержку helpText из Path, если появится

    // Нормализуем условные поля
    const validationRules = normalizeValidationRules(path.validation_rules);
    
    // Строим UI-конфигурацию
    const ui: FieldUIConfig | undefined = (() => {
      const baseUI: FieldUIConfig = {};
      
      // Добавляем validationRules, если есть
      if (validationRules) {
        baseUI.validationRules = validationRules;
      }
      
      // Если в Path есть дополнительные UI-настройки, добавляем их
      // TODO: добавить поддержку ui из Path, когда появится в API
      
      // Возвращаем ui только если есть хотя бы одно свойство
      return Object.keys(baseUI).length > 0 ? baseUI : undefined;
    })();

    // Базовые свойства
    const baseNode: Omit<BaseFieldNode, 'dataType' | 'children'> = {
      id: path.id,
      name: path.name,
      fullPath,
      cardinality: path.cardinality,
      label,
      required,
      readonly,
      helpText,
      ui,
      sortOrder: path.sort_order,
    };

    // Создаём узел в зависимости от типа данных
    if (path.data_type === 'json') {
      // Для json обязательны children
      if (!path.children || path.children.length === 0) {
        // Если children отсутствуют, создаём пустой массив
        const jsonNode: JsonFieldNode = {
          ...baseNode,
          dataType: 'json',
          children: [],
        };
        return jsonNode;
      }

      // Рекурсивно строим children
      const children = buildFormSchema(path.children, fullPath);
      const jsonNode: JsonFieldNode = {
        ...baseNode,
        dataType: 'json',
        children,
      };
      return jsonNode;
    }

    // Для скалярных типов children отсутствуют
    const scalarNode: ScalarFieldNode = {
      ...baseNode,
      dataType: path.data_type,
    };
    return scalarNode;
  });
};


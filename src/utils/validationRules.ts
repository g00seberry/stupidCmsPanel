import type { ZValidationRules, ZConditionalRule, ZUniqueRule, ZExistsRule } from '@/types/path';

/**
 * Преобразует validation_rules из формата API в формат формы.
 * Обрабатывает null, пустые объекты и нормализует структуру данных.
 * @param rules Правила валидации из API (могут быть null или объектом).
 * @returns Нормализованные правила валидации для формы или undefined, если правила пустые.
 * @example
 * const apiRules = { min: 5, max: 500, required_if: 'is_published' };
 * const formRules = normalizeValidationRulesForForm(apiRules);
 * // { min: 5, max: 500, required_if: 'is_published' }
 *
 * const apiRulesNull = null;
 * const formRulesNull = normalizeValidationRulesForForm(apiRulesNull);
 * // undefined
 */
export const normalizeValidationRulesForForm = (
  rules: ZValidationRules | null | undefined
): ZValidationRules | undefined => {
  if (!rules || typeof rules !== 'object') {
    return undefined;
  }

  // Проверяем, есть ли хотя бы одно непустое поле
  const hasAnyValue = Object.values(rules).some(value => {
    if (value === null || value === undefined) return false;
    if (typeof value === 'object' && Object.keys(value).length === 0) return false;
    return true;
  });

  if (!hasAnyValue) {
    return undefined;
  }

  // Возвращаем правила как есть (они уже в правильном формате)
  return rules;
};

/**
 * Преобразует validation_rules из формата формы в формат API.
 * Удаляет undefined поля, нормализует условные правила, unique и exists.
 * @param rules Правила валидации из формы (могут быть undefined или объектом).
 * @returns Нормализованные правила валидации для API или null, если правила пустые.
 * @example
 * const formRules = { min: 5, max: 500, required_if: 'is_published' };
 * const apiRules = normalizeValidationRulesForApi(formRules);
 * // { min: 5, max: 500, required_if: 'is_published' }
 *
 * const formRulesEmpty = { min: undefined, max: undefined };
 * const apiRulesEmpty = normalizeValidationRulesForApi(formRulesEmpty);
 * // null
 */
export const normalizeValidationRulesForApi = (
  rules: ZValidationRules | null | undefined
): ZValidationRules | null => {
  if (!rules || typeof rules !== 'object') {
    return null;
  }

  // Создаем новый объект без undefined полей
  const cleaned: Partial<ZValidationRules> = {};

  // Обрабатываем простые поля
  if (rules.min !== undefined && rules.min !== null) {
    cleaned.min = rules.min;
  }
  if (rules.max !== undefined && rules.max !== null) {
    cleaned.max = rules.max;
  }
  if (rules.pattern !== undefined && rules.pattern !== null && rules.pattern.trim() !== '') {
    cleaned.pattern = rules.pattern.trim();
  }

  // Обрабатываем правила для массивов
  if (rules.array_min_items !== undefined && rules.array_min_items !== null) {
    cleaned.array_min_items = rules.array_min_items;
  }
  if (rules.array_max_items !== undefined && rules.array_max_items !== null) {
    cleaned.array_max_items = rules.array_max_items;
  }
  if (rules.array_unique !== undefined && rules.array_unique !== null) {
    cleaned.array_unique = rules.array_unique;
  }

  // Обрабатываем условные правила
  if (rules.required_if !== undefined && rules.required_if !== null) {
    cleaned.required_if = normalizeConditionalRule(rules.required_if);
  }
  if (rules.prohibited_unless !== undefined && rules.prohibited_unless !== null) {
    cleaned.prohibited_unless = normalizeConditionalRule(rules.prohibited_unless);
  }
  if (rules.required_unless !== undefined && rules.required_unless !== null) {
    cleaned.required_unless = normalizeConditionalRule(rules.required_unless);
  }
  if (rules.prohibited_if !== undefined && rules.prohibited_if !== null) {
    cleaned.prohibited_if = normalizeConditionalRule(rules.prohibited_if);
  }

  // Обрабатываем unique
  if (rules.unique !== undefined && rules.unique !== null) {
    cleaned.unique = normalizeUniqueRule(rules.unique);
  }

  // Обрабатываем exists
  if (rules.exists !== undefined && rules.exists !== null) {
    cleaned.exists = normalizeExistsRule(rules.exists);
  }

  // Обрабатываем field_comparison
  if (rules.field_comparison !== undefined && rules.field_comparison !== null) {
    const comparison = normalizeFieldComparison(rules.field_comparison);
    if (comparison) {
      cleaned.field_comparison = comparison;
    }
  }

  // Если объект пустой, возвращаем null
  if (Object.keys(cleaned).length === 0) {
    return null;
  }

  return cleaned as ZValidationRules;
};

/**
 * Нормализует условное правило.
 * Если правило - строка, возвращает её как есть.
 * Если правило - объект, проверяет и нормализует его структуру.
 * @param rule Условное правило (строка или объект).
 * @returns Нормализованное условное правило.
 * @example
 * normalizeConditionalRule('is_published')
 * // 'is_published'
 *
 * normalizeConditionalRule({ field: 'is_published', value: true, operator: '==' })
 * // { field: 'is_published', value: true, operator: '==' }
 */
const normalizeConditionalRule = (rule: ZConditionalRule): ZConditionalRule => {
  if (typeof rule === 'string') {
    return rule.trim() || '';
  }

  if (typeof rule === 'object' && rule !== null) {
    const normalized: any = {};

    if (rule.field && typeof rule.field === 'string' && rule.field.trim()) {
      normalized.field = rule.field.trim();
    }

    if (rule.value !== undefined && rule.value !== null) {
      normalized.value = rule.value;
    }

    if (rule.operator && ['==', '!=', '>', '<', '>=', '<='].includes(rule.operator)) {
      normalized.operator = rule.operator;
    }

    // Если есть только field, можно вернуть строку
    if (normalized.field && !normalized.value && !normalized.operator) {
      return normalized.field;
    }

    return normalized;
  }

  return rule;
};

/**
 * Нормализует правило уникальности.
 * Если правило - строка, преобразует в объект с table.
 * Если правило - объект, нормализует его структуру.
 * @param rule Правило уникальности (строка или объект).
 * @returns Нормализованное правило уникальности.
 * @example
 * normalizeUniqueRule('entries')
 * // { table: 'entries' }
 *
 * normalizeUniqueRule({ table: 'entries', column: 'slug' })
 * // { table: 'entries', column: 'slug' }
 */
const normalizeUniqueRule = (rule: ZUniqueRule): ZUniqueRule => {
  if (typeof rule === 'string') {
    const trimmed = rule.trim();
    return trimmed || '';
  }

  if (typeof rule === 'object' && rule !== null) {
    const normalized: any = {};

    if (rule.table && typeof rule.table === 'string' && rule.table.trim()) {
      normalized.table = rule.table.trim();
    } else {
      // Если нет table, возвращаем как есть (может быть ошибка)
      return rule;
    }

    if (rule.column && typeof rule.column === 'string' && rule.column.trim()) {
      normalized.column = rule.column.trim();
    }

    if (rule.except && typeof rule.except === 'object' && rule.except !== null) {
      if (
        rule.except.column &&
        typeof rule.except.column === 'string' &&
        rule.except.column.trim() &&
        rule.except.value !== undefined &&
        rule.except.value !== null
      ) {
        normalized.except = {
          column: rule.except.column.trim(),
          value: rule.except.value,
        };
      }
    }

    if (rule.where && typeof rule.where === 'object' && rule.where !== null) {
      if (
        rule.where.column &&
        typeof rule.where.column === 'string' &&
        rule.where.column.trim() &&
        rule.where.value !== undefined &&
        rule.where.value !== null
      ) {
        normalized.where = {
          column: rule.where.column.trim(),
          value: rule.where.value,
        };
      }
    }

    // Если только table, можно вернуть строку
    if (normalized.table && !normalized.column && !normalized.except && !normalized.where) {
      return normalized.table;
    }

    return normalized;
  }

  return rule;
};

/**
 * Нормализует правило существования.
 * Если правило - строка, преобразует в объект с table.
 * Если правило - объект, нормализует его структуру.
 * @param rule Правило существования (строка или объект).
 * @returns Нормализованное правило существования.
 * @example
 * normalizeExistsRule('categories')
 * // { table: 'categories' }
 *
 * normalizeExistsRule({ table: 'categories', column: 'id' })
 * // { table: 'categories', column: 'id' }
 */
const normalizeExistsRule = (rule: ZExistsRule): ZExistsRule => {
  if (typeof rule === 'string') {
    const trimmed = rule.trim();
    return trimmed || '';
  }

  if (typeof rule === 'object' && rule !== null) {
    const normalized: any = {};

    if (rule.table && typeof rule.table === 'string' && rule.table.trim()) {
      normalized.table = rule.table.trim();
    } else {
      // Если нет table, возвращаем как есть (может быть ошибка)
      return rule;
    }

    if (rule.column && typeof rule.column === 'string' && rule.column.trim()) {
      normalized.column = rule.column.trim();
    }

    if (rule.where && typeof rule.where === 'object' && rule.where !== null) {
      if (
        rule.where.column &&
        typeof rule.where.column === 'string' &&
        rule.where.column.trim() &&
        rule.where.value !== undefined &&
        rule.where.value !== null
      ) {
        normalized.where = {
          column: rule.where.column.trim(),
          value: rule.where.value,
        };
      }
    }

    // Если только table, можно вернуть строку
    if (normalized.table && !normalized.column && !normalized.where) {
      return normalized.table;
    }

    return normalized;
  }

  return rule;
};

/**
 * Нормализует правило сравнения полей.
 * Проверяет, что указано либо field, либо value.
 * @param rule Правило сравнения полей.
 * @returns Нормализованное правило сравнения или null, если правило невалидно.
 * @example
 * normalizeFieldComparison({ operator: '>=', field: 'content_json.start_date' })
 * // { operator: '>=', field: 'content_json.start_date' }
 *
 * normalizeFieldComparison({ operator: '>=', value: '2024-01-01' })
 * // { operator: '>=', value: '2024-01-01' }
 */
const normalizeFieldComparison = (
  rule: any
): { operator: '==' | '!=' | '>' | '<' | '>=' | '<='; field?: string; value?: any } | null => {
  if (!rule || typeof rule !== 'object') {
    return null;
  }

  if (!rule.operator || !['>=', '<=', '>', '<', '==', '!='].includes(rule.operator)) {
    return null;
  }

  const normalized: { operator: '==' | '!=' | '>' | '<' | '>=' | '<='; field?: string; value?: any } = {
    operator: rule.operator as '==' | '!=' | '>' | '<' | '>=' | '<=',
  };

  if (rule.field && typeof rule.field === 'string' && rule.field.trim()) {
    normalized.field = rule.field.trim();
  }

  if (rule.value !== undefined && rule.value !== null) {
    normalized.value = rule.value;
  }

  // Должно быть указано либо field, либо value
  if (!normalized.field && normalized.value === undefined) {
    return null;
  }

  return normalized;
};


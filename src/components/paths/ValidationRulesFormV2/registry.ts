import type { ZDataType, ZCardinality } from '@/types/path';
import type { RuleKey, RuleConfig, RuleCategory } from './types';
import { RequiredRuleRenderer } from './renderers/basic/RequiredRuleRenderer';
import { MinMaxRuleRenderer } from './renderers/basic/MinMaxRuleRenderer';
import { PatternRuleRenderer } from './renderers/basic/PatternRuleRenderer';
import { ArrayUniqueRuleRenderer } from './renderers/array/ArrayUniqueRuleRenderer';
import { ConditionalRuleRenderer } from './renderers/conditional/ConditionalRuleRenderer';
import { FieldComparisonRuleRenderer } from './renderers/complex/FieldComparisonRuleRenderer';

/**
 * Регистр всех правил валидации.
 * Содержит конфигурацию каждого правила: метаданные и компонент рендеринга.
 */
export const validationRuleRegistry: Record<RuleKey, RuleConfig> = {
  required: {
    key: 'required',
    meta: {
      label: 'Обязательное поле',
      description: 'Поле обязательно к заполнению',
      category: 'basic',
    },
    renderer: RequiredRuleRenderer,
  },
  min: {
    key: 'min',
    meta: {
      label: 'Минимальное значение/длина',
      description: 'Минимальное значение для чисел или минимальная длина для строк',
      category: 'basic',
      dataTypes: ['string', 'text', 'int', 'float'],
    },
    renderer: MinMaxRuleRenderer,
  },
  max: {
    key: 'max',
    meta: {
      label: 'Максимальное значение/длина',
      description: 'Максимальное значение для чисел или максимальная длина для строк',
      category: 'basic',
      dataTypes: ['string', 'text', 'int', 'float'],
    },
    renderer: MinMaxRuleRenderer,
  },
  pattern: {
    key: 'pattern',
    meta: {
      label: 'Регулярное выражение',
      description: 'Регулярное выражение для валидации строки',
      category: 'basic',
      dataTypes: ['string', 'text'],
    },
    renderer: PatternRuleRenderer,
  },
  distinct: {
    key: 'distinct',
    meta: {
      label: 'Уникальность элементов',
      description: 'Требовать уникальность всех элементов в массиве',
      category: 'array',
      cardinality: ['many'],
    },
    renderer: ArrayUniqueRuleRenderer,
  },
  required_if: {
    key: 'required_if',
    meta: {
      label: 'Обязательно, если',
      description: 'Поле становится обязательным, если указанное условие выполнено',
      category: 'conditional',
    },
    renderer: ConditionalRuleRenderer,
  },
  prohibited_unless: {
    key: 'prohibited_unless',
    meta: {
      label: 'Запрещено, если не',
      description: 'Поле запрещено, если указанное условие не выполнено',
      category: 'conditional',
    },
    renderer: ConditionalRuleRenderer,
  },
  required_unless: {
    key: 'required_unless',
    meta: {
      label: 'Обязательно, если не',
      description: 'Поле становится обязательным, если указанное условие не выполнено',
      category: 'conditional',
    },
    renderer: ConditionalRuleRenderer,
  },
  prohibited_if: {
    key: 'prohibited_if',
    meta: {
      label: 'Запрещено, если',
      description: 'Поле запрещено, если указанное условие выполнено',
      category: 'conditional',
    },
    renderer: ConditionalRuleRenderer,
  },
  field_comparison: {
    key: 'field_comparison',
    meta: {
      label: 'Сравнение полей',
      description: 'Сравнение значения поля с другим полем или константой',
      category: 'comparison',
    },
    renderer: FieldComparisonRuleRenderer,
  },
};

/**
 * Получает конфигурацию правила по ключу.
 * @param ruleKey Ключ правила.
 * @returns Конфигурация правила или undefined, если правило не найдено.
 */
export const getRuleConfig = (ruleKey: RuleKey): RuleConfig | undefined => {
  return validationRuleRegistry[ruleKey];
};

/**
 * Получает метаданные правила по ключу.
 * @param ruleKey Ключ правила.
 * @returns Метаданные правила или undefined, если правило не найдено.
 */
export const getRuleMeta = (ruleKey: RuleKey) => {
  return validationRuleRegistry[ruleKey]?.meta;
};

/**
 * Проверяет, доступно ли правило для указанного типа данных и кардинальности.
 * @param ruleKey Ключ правила.
 * @param dataType Тип данных.
 * @param cardinality Кардинальность.
 * @returns true, если правило доступно.
 */
export const isRuleAvailable = (
  ruleKey: RuleKey,
  dataType?: ZDataType,
  cardinality?: ZCardinality
): boolean => {
  const config = validationRuleRegistry[ruleKey];
  if (!config) return false;

  const meta = config.meta;

  if (meta.dataTypes && dataType && !meta.dataTypes.includes(dataType)) {
    return false;
  }

  if (meta.cardinality && cardinality && !meta.cardinality.includes(cardinality)) {
    return false;
  }

  return true;
};

/**
 * Получает список доступных правил для указанного типа данных и кардинальности.
 * @param dataType Тип данных.
 * @param cardinality Кардинальность.
 * @returns Массив ключей доступных правил.
 */
export const getAvailableRules = (dataType?: ZDataType, cardinality?: ZCardinality): RuleKey[] => {
  return (Object.keys(validationRuleRegistry) as RuleKey[]).filter(key =>
    isRuleAvailable(key, dataType, cardinality)
  );
};

/**
 * Получает правила, сгруппированные по категориям.
 * @param dataType Тип данных.
 * @param cardinality Кардинальность.
 * @returns Объект с правилами, сгруппированными по категориям.
 */
export const getRulesByCategory = (
  dataType?: ZDataType,
  cardinality?: ZCardinality
): Record<RuleCategory, RuleKey[]> => {
  const available = getAvailableRules(dataType, cardinality);
  const grouped: Record<RuleCategory, RuleKey[]> = {
    basic: [],
    array: [],
    conditional: [],
    comparison: [],
  };

  available.forEach(key => {
    const meta = getRuleMeta(key);
    if (meta) {
      grouped[meta.category].push(key);
    }
  });

  return grouped;
};

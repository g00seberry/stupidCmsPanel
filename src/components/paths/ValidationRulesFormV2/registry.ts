import type { ZDataType, ZCardinality } from '@/types/path';
import type { RuleKey, RuleConfig, RuleCategory } from './types';
import { RequiredRuleRenderer } from './renderers/RequiredRuleRenderer';
import { MinMaxRuleRenderer } from './renderers/MinMaxRuleRenderer';
import { PatternRuleRenderer } from './renderers/PatternRuleRenderer';
import { ArrayItemsRuleRenderer } from './renderers/ArrayItemsRuleRenderer';
import { ArrayUniqueRuleRenderer } from './renderers/ArrayUniqueRuleRenderer';
import { ConditionalRuleRenderer } from './renderers/ConditionalRuleRenderer';
import { UniqueRuleRenderer } from './renderers/UniqueRuleRenderer';
import { ExistsRuleRenderer } from './renderers/ExistsRuleRenderer';
import { FieldComparisonRuleRenderer } from './renderers/FieldComparisonRuleRenderer';

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
    renderer: {
      component: RequiredRuleRenderer,
    },
  },
  min: {
    key: 'min',
    meta: {
      label: 'Минимальное значение/длина',
      description: 'Минимальное значение для чисел или минимальная длина для строк',
      category: 'basic',
    },
    renderer: {
      component: MinMaxRuleRenderer,
      dependencies: {
        dataTypes: ['string', 'text', 'int', 'float'],
      },
    },
  },
  max: {
    key: 'max',
    meta: {
      label: 'Максимальное значение/длина',
      description: 'Максимальное значение для чисел или максимальная длина для строк',
      category: 'basic',
    },
    renderer: {
      component: MinMaxRuleRenderer,
      dependencies: {
        dataTypes: ['string', 'text', 'int', 'float'],
      },
    },
  },
  pattern: {
    key: 'pattern',
    meta: {
      label: 'Регулярное выражение',
      description: 'Регулярное выражение для валидации строки',
      category: 'basic',
    },
    renderer: {
      component: PatternRuleRenderer,
      dependencies: {
        dataTypes: ['string', 'text'],
      },
    },
  },
  array_min_items: {
    key: 'array_min_items',
    meta: {
      label: 'Минимальное количество элементов',
      description: 'Минимальное количество элементов в массиве',
      category: 'array',
    },
    renderer: {
      component: ArrayItemsRuleRenderer,
      dependencies: {
        cardinality: ['many'],
      },
    },
  },
  array_max_items: {
    key: 'array_max_items',
    meta: {
      label: 'Максимальное количество элементов',
      description: 'Максимальное количество элементов в массиве',
      category: 'array',
    },
    renderer: {
      component: ArrayItemsRuleRenderer,
      dependencies: {
        cardinality: ['many'],
      },
    },
  },
  array_unique: {
    key: 'array_unique',
    meta: {
      label: 'Уникальность элементов',
      description: 'Требовать уникальность всех элементов в массиве',
      category: 'array',
    },
    renderer: {
      component: ArrayUniqueRuleRenderer,
      dependencies: {
        cardinality: ['many'],
      },
    },
  },
  required_if: {
    key: 'required_if',
    meta: {
      label: 'Обязательно, если',
      description: 'Поле становится обязательным, если указанное условие выполнено',
      category: 'conditional',
    },
    renderer: {
      component: ConditionalRuleRenderer,
    },
  },
  prohibited_unless: {
    key: 'prohibited_unless',
    meta: {
      label: 'Запрещено, если не',
      description: 'Поле запрещено, если указанное условие не выполнено',
      category: 'conditional',
    },
    renderer: {
      component: ConditionalRuleRenderer,
    },
  },
  required_unless: {
    key: 'required_unless',
    meta: {
      label: 'Обязательно, если не',
      description: 'Поле становится обязательным, если указанное условие не выполнено',
      category: 'conditional',
    },
    renderer: {
      component: ConditionalRuleRenderer,
    },
  },
  prohibited_if: {
    key: 'prohibited_if',
    meta: {
      label: 'Запрещено, если',
      description: 'Поле запрещено, если указанное условие выполнено',
      category: 'conditional',
    },
    renderer: {
      component: ConditionalRuleRenderer,
    },
  },
  unique: {
    key: 'unique',
    meta: {
      label: 'Правило уникальности',
      description: 'Проверка уникальности значения в таблице',
      category: 'unique',
    },
    renderer: {
      component: UniqueRuleRenderer,
    },
  },
  exists: {
    key: 'exists',
    meta: {
      label: 'Правило существования',
      description: 'Проверка существования значения в таблице',
      category: 'exists',
    },
    renderer: {
      component: ExistsRuleRenderer,
    },
  },
  field_comparison: {
    key: 'field_comparison',
    meta: {
      label: 'Сравнение полей',
      description: 'Сравнение значения поля с другим полем или константой',
      category: 'comparison',
    },
    renderer: {
      component: FieldComparisonRuleRenderer,
    },
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

  const deps = config.renderer.dependencies;
  if (!deps) return true;

  if (deps.dataTypes && dataType && !deps.dataTypes.includes(dataType)) {
    return false;
  }

  if (deps.cardinality && cardinality && !deps.cardinality.includes(cardinality)) {
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
    unique: [],
    exists: [],
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

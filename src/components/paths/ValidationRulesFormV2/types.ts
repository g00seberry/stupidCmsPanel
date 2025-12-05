import type { ZDataType, ZCardinality, ZValidationRules } from '@/types/path';
import type { ReactNode } from 'react';
import type { ValidationRulesStore } from './ValidationRulesStore';

/**
 * Ключ правила валидации.
 */
export type RuleKey = keyof ZValidationRules;

/**
 * Категория правила валидации.
 */
export type RuleCategory = 'basic' | 'array' | 'conditional' | 'comparison';

/**
 * Метаданные правила валидации.
 */
export type RuleMeta = {
  /** Отображаемое название правила. */
  label: string;
  /** Описание правила. */
  description: string;
  /** Категория правила. */
  category: RuleCategory;
  /** Иконка правила (опционально). */
  icon?: ReactNode;
  /** Типы данных, для которых правило доступно. Если не указано, доступно для всех. */
  dataTypes?: ZDataType[];
  /** Кардинальность, для которой правило доступно. Если не указано, доступно для всех. */
  cardinality?: ZCardinality[];
};

/**
 * Пропсы компонента рендеринга правила.
 */
export type RuleRendererProps = {
  /** Store для управления правилами валидации. */
  store: ValidationRulesStore;
  /** Ключ правила. */
  ruleKey: RuleKey;
  /** Флаг только для чтения. */
  isReadonly?: boolean;
};

/**
 * Конфигурация правила в регистре.
 */
export type RuleConfig = {
  /** Ключ правила. */
  key: RuleKey;
  /** Метаданные правила. */
  meta: RuleMeta;
  /** Компонент для рендеринга формы правила. */
  renderer: React.FC<RuleRendererProps>;
};

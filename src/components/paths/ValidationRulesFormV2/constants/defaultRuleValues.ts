import type { RuleKey } from '../types';
import type { ZValidationRules } from '@/types/path';

/**
 * Маппинг значений по умолчанию для правил валидации.
 * Используется при добавлении нового правила для установки начального значения.
 */
export const defaultRuleValues: Record<RuleKey, ZValidationRules[RuleKey]> = {
  required: false,
  min: undefined,
  max: undefined,
  pattern: undefined,
  distinct: false,
  required_if: { field: '', operator: '==' },
  prohibited_unless: { field: '', operator: '==' },
  required_unless: { field: '', operator: '==' },
  prohibited_if: { field: '', operator: '==' },
  field_comparison: { operator: '==' },
};

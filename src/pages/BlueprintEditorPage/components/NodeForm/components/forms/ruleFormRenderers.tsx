import type React from 'react';
import type { PathValidationRule, RuleFormRendererProps } from '../types';
import { BooleanRuleForm } from './BooleanRuleForm';
import { NumberRuleForm } from './NumberRuleForm';
import { StringRuleForm } from './StringRuleForm';
import { ConditionalRuleForm } from './ConditionalRuleForm';
import { FieldComparisonRuleForm } from './FieldComparisonRuleForm';

export const ruleFormRenderers: Record<PathValidationRule['type'], React.FC<RuleFormRendererProps>> = {
  required: ({ rule, onSave, onCancel }) => (
    <BooleanRuleForm
      rule={rule as Extract<PathValidationRule, { type: 'required' }>}
      title="Редактирование: Обязательное поле"
      label="Обязательное поле"
      onSave={onSave}
      onCancel={onCancel}
    />
  ),
  min: ({ rule, onSave, onCancel }) => (
    <NumberRuleForm
      rule={rule as Extract<PathValidationRule, { type: 'min' }>}
      title="Редактирование: Минимум"
      label="Минимальное значение"
      onSave={onSave}
      onCancel={onCancel}
    />
  ),
  max: ({ rule, onSave, onCancel }) => (
    <NumberRuleForm
      rule={rule as Extract<PathValidationRule, { type: 'max' }>}
      title="Редактирование: Максимум"
      label="Максимальное значение"
      onSave={onSave}
      onCancel={onCancel}
    />
  ),
  pattern: ({ rule, onSave, onCancel }) => (
    <StringRuleForm
      rule={rule as Extract<PathValidationRule, { type: 'pattern' }>}
      title="Редактирование: Паттерн"
      label="Регулярное выражение"
      placeholder="/^[A-Z]/"
      onSave={onSave}
      onCancel={onCancel}
    />
  ),
  distinct: ({ rule, onSave, onCancel }) => (
    <BooleanRuleForm
      rule={rule as Extract<PathValidationRule, { type: 'distinct' }>}
      title="Редактирование: Уникальные элементы"
      label="Уникальные элементы"
      onSave={onSave}
      onCancel={onCancel}
    />
  ),
  required_if: ({ rule, onSave, onCancel }) => (
    <ConditionalRuleForm
      rule={rule as Extract<PathValidationRule, { type: 'required_if' }>}
      title="Редактирование: Обязательно, если"
      onSave={onSave}
      onCancel={onCancel}
    />
  ),
  prohibited_unless: ({ rule, onSave, onCancel }) => (
    <ConditionalRuleForm
      rule={rule as Extract<PathValidationRule, { type: 'prohibited_unless' }>}
      title="Редактирование: Запрещено, если не"
      onSave={onSave}
      onCancel={onCancel}
    />
  ),
  required_unless: ({ rule, onSave, onCancel }) => (
    <ConditionalRuleForm
      rule={rule as Extract<PathValidationRule, { type: 'required_unless' }>}
      title="Редактирование: Обязательно, если не"
      onSave={onSave}
      onCancel={onCancel}
    />
  ),
  prohibited_if: ({ rule, onSave, onCancel }) => (
    <ConditionalRuleForm
      rule={rule as Extract<PathValidationRule, { type: 'prohibited_if' }>}
      title="Редактирование: Запрещено, если"
      onSave={onSave}
      onCancel={onCancel}
    />
  ),
  field_comparison: ({ rule, onSave, onCancel }) => (
    <FieldComparisonRuleForm
      rule={rule as Extract<PathValidationRule, { type: 'field_comparison' }>}
      title="Редактирование: Сравнение полей"
      onSave={onSave}
      onCancel={onCancel}
    />
  ),
};


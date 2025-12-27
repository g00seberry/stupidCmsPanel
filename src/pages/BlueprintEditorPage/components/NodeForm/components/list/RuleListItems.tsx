import type { PathValidationRule, RuleListRendererProps } from '../types';
import { RuleListItem } from '../RuleListItem';

export const RequiredRuleListItem: React.FC<RuleListRendererProps> = ({ rule, onEdit }) => {
  const booleanRule = rule as Extract<PathValidationRule, { type: 'required' }>;
  return (
    <RuleListItem
      title="Обязательное поле"
      description={`Значение: ${booleanRule.value ? 'Да' : 'Нет'}`}
      onEdit={onEdit}
    />
  );
};

export const MinRuleListItem: React.FC<RuleListRendererProps> = ({ rule, onEdit }) => {
  const numberRule = rule as Extract<PathValidationRule, { type: 'min' }>;
  return <RuleListItem title="Минимум" description={`Значение: ${numberRule.value}`} onEdit={onEdit} />;
};

export const MaxRuleListItem: React.FC<RuleListRendererProps> = ({ rule, onEdit }) => {
  const numberRule = rule as Extract<PathValidationRule, { type: 'max' }>;
  return <RuleListItem title="Максимум" description={`Значение: ${numberRule.value}`} onEdit={onEdit} />;
};

export const PatternRuleListItem: React.FC<RuleListRendererProps> = ({ rule, onEdit }) => {
  const stringRule = rule as Extract<PathValidationRule, { type: 'pattern' }>;
  return (
    <RuleListItem
      title="Паттерн"
      description={`Регулярное выражение: ${stringRule.value}`}
      onEdit={onEdit}
    />
  );
};

export const DistinctRuleListItem: React.FC<RuleListRendererProps> = ({ rule, onEdit }) => {
  const booleanRule = rule as Extract<PathValidationRule, { type: 'distinct' }>;
  return (
    <RuleListItem
      title="Уникальные элементы"
      description={`Значение: ${booleanRule.value ? 'Да' : 'Нет'}`}
      onEdit={onEdit}
    />
  );
};

export const RequiredIfRuleListItem: React.FC<RuleListRendererProps> = ({ rule, onEdit }) => {
  const conditionalRule = rule as Extract<PathValidationRule, { type: 'required_if' }>;
  return (
    <RuleListItem
      title="Обязательно, если"
      description={`Поле: ${conditionalRule.value.field}, Значение: ${String(conditionalRule.value.value)}`}
      onEdit={onEdit}
    />
  );
};

export const ProhibitedUnlessRuleListItem: React.FC<RuleListRendererProps> = ({ rule, onEdit }) => {
  const conditionalRule = rule as Extract<PathValidationRule, { type: 'prohibited_unless' }>;
  return (
    <RuleListItem
      title="Запрещено, если не"
      description={`Поле: ${conditionalRule.value.field}, Значение: ${String(conditionalRule.value.value)}`}
      onEdit={onEdit}
    />
  );
};

export const RequiredUnlessRuleListItem: React.FC<RuleListRendererProps> = ({ rule, onEdit }) => {
  const conditionalRule = rule as Extract<PathValidationRule, { type: 'required_unless' }>;
  return (
    <RuleListItem
      title="Обязательно, если не"
      description={`Поле: ${conditionalRule.value.field}, Значение: ${String(conditionalRule.value.value)}`}
      onEdit={onEdit}
    />
  );
};

export const ProhibitedIfRuleListItem: React.FC<RuleListRendererProps> = ({ rule, onEdit }) => {
  const conditionalRule = rule as Extract<PathValidationRule, { type: 'prohibited_if' }>;
  return (
    <RuleListItem
      title="Запрещено, если"
      description={`Поле: ${conditionalRule.value.field}, Значение: ${String(conditionalRule.value.value)}`}
      onEdit={onEdit}
    />
  );
};

export const FieldComparisonRuleListItem: React.FC<RuleListRendererProps> = ({ rule, onEdit }) => {
  const comparisonRule = rule as Extract<PathValidationRule, { type: 'field_comparison' }>;
  const description = `Оператор: ${comparisonRule.value.operator}, ${
    comparisonRule.value.field
      ? `Поле: ${comparisonRule.value.field}`
      : `Значение: ${String(comparisonRule.value.value)}`
  }`;
  return <RuleListItem title="Сравнение полей" description={description} onEdit={onEdit} />;
};


import { Form, Input, Select } from 'antd';
import { useState } from 'react';
import type { PathValidationRule } from '../types';
import { RuleFormCard } from '../RuleFormCard';

const COMPARISON_OPERATORS = ['>=', '<=', '>', '<', '==', '!='] as const;

type FieldComparisonRuleFormProps = {
  rule: Extract<PathValidationRule, { type: 'field_comparison' }>;
  title: string;
  onSave: (rule: PathValidationRule) => void;
  onCancel: () => void;
};

export const FieldComparisonRuleForm: React.FC<FieldComparisonRuleFormProps> = ({
  rule,
  title,
  onSave,
  onCancel,
}) => {
  const [operator, setOperator] = useState(rule.value.operator);
  const [field, setField] = useState(rule.value.field || '');
  const [value, setValue] = useState(rule.value.value);

  const handleSave = () => {
    onSave({
      type: 'field_comparison',
      value: { operator, field: field || undefined, value: value || undefined },
    } as PathValidationRule);
  };

  return (
    <RuleFormCard title={title} onSave={handleSave} onCancel={onCancel} showCard={false}>
      <Form.Item label="Оператор">
        <Select
          value={operator}
          onChange={setOperator}
          options={COMPARISON_OPERATORS.map(op => ({ label: op, value: op }))}
        />
      </Form.Item>
      <Form.Item label="Поле для сравнения (опционально)">
        <Input
          value={field}
          onChange={e => setField(e.target.value)}
          placeholder="data_json.start_date"
        />
      </Form.Item>
      <Form.Item label="Значение для сравнения (опционально)">
        <Input value={String(value || '')} onChange={e => setValue(e.target.value)} />
      </Form.Item>
    </RuleFormCard>
  );
};


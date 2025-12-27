import { Form, Input, Select } from 'antd';
import { useState } from 'react';
import type { PathValidationRule } from '../types';
import { RuleFormCard } from '../RuleFormCard';

const CONDITIONAL_OPERATORS = ['==', '!=', '>', '<', '>=', '<='] as const;

type ConditionalRuleFormProps = {
  rule: Extract<
    PathValidationRule,
    { type: 'required_if' | 'prohibited_unless' | 'required_unless' | 'prohibited_if' }
  >;
  title: string;
  onSave: (rule: PathValidationRule) => void;
  onCancel: () => void;
};

export const ConditionalRuleForm: React.FC<ConditionalRuleFormProps> = ({
  rule,
  title,
  onSave,
  onCancel,
}) => {
  const [field, setField] = useState(rule.value.field);
  const [operator, setOperator] = useState(rule.value.operator || '==');
  const [value, setValue] = useState(rule.value.value);

  const handleSave = () => {
    onSave({
      type: rule.type,
      value: { field, operator, value },
    } as PathValidationRule);
  };

  return (
    <RuleFormCard title={title} onSave={handleSave} onCancel={onCancel} showCard={false}>
      <Form.Item label="Поле">
        <Input value={field} onChange={e => setField(e.target.value)} placeholder="is_published" />
      </Form.Item>
      <Form.Item label="Оператор">
        <Select
          value={operator}
          onChange={setOperator}
          options={CONDITIONAL_OPERATORS.map(op => ({ label: op, value: op }))}
        />
      </Form.Item>
      <Form.Item label="Значение">
        <Input value={String(value || '')} onChange={e => setValue(e.target.value)} />
      </Form.Item>
    </RuleFormCard>
  );
};


import { Form, InputNumber } from 'antd';
import { useState } from 'react';
import type { PathValidationRule } from '../types';
import { RuleFormCard } from '../RuleFormCard';

type NumberRuleFormProps = {
  rule: Extract<PathValidationRule, { type: 'min' | 'max' }>;
  title: string;
  label: string;
  onSave: (rule: PathValidationRule) => void;
  onCancel: () => void;
};

export const NumberRuleForm: React.FC<NumberRuleFormProps> = ({
  rule,
  title,
  label,
  onSave,
  onCancel,
}) => {
  const [value, setValue] = useState<number | null>(rule.value);

  const handleSave = () => {
    onSave({ type: rule.type, value: value || 0 } as PathValidationRule);
  };

  return (
    <RuleFormCard title={title} onSave={handleSave} onCancel={onCancel} showCard={false}>
      <Form.Item label={label}>
        <InputNumber value={value} onChange={setValue} style={{ width: '100%' }} />
      </Form.Item>
    </RuleFormCard>
  );
};


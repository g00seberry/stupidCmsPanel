import { Form, Input } from 'antd';
import { useState } from 'react';
import type { PathValidationRule } from '../types';
import { RuleFormCard } from '../RuleFormCard';

type StringRuleFormProps = {
  rule: Extract<PathValidationRule, { type: 'pattern' }>;
  title: string;
  label: string;
  placeholder?: string;
  onSave: (rule: PathValidationRule) => void;
  onCancel: () => void;
};

export const StringRuleForm: React.FC<StringRuleFormProps> = ({
  rule,
  title,
  label,
  placeholder,
  onSave,
  onCancel,
}) => {
  const [value, setValue] = useState(rule.value);

  const handleSave = () => {
    onSave({ type: 'pattern', value } as PathValidationRule);
  };

  return (
    <RuleFormCard title={title} onSave={handleSave} onCancel={onCancel} showCard={false}>
      <Form.Item label={label}>
        <Input value={value} onChange={e => setValue(e.target.value)} placeholder={placeholder} />
      </Form.Item>
    </RuleFormCard>
  );
};


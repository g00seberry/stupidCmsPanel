import { Form, Switch } from 'antd';
import { useState } from 'react';
import type { PathValidationRule } from '../types';
import { RuleFormCard } from '../RuleFormCard';

type BooleanRuleFormProps = {
  rule: Extract<PathValidationRule, { type: 'required' | 'distinct' }>;
  title: string;
  label: string;
  onSave: (rule: PathValidationRule) => void;
  onCancel: () => void;
};

export const BooleanRuleForm: React.FC<BooleanRuleFormProps> = ({
  rule,
  title,
  label,
  onSave,
  onCancel,
}) => {
  const [checked, setChecked] = useState(rule.value);

  const handleSave = () => {
    onSave({ type: rule.type, value: checked } as PathValidationRule);
  };

  return (
    <RuleFormCard title={title} onSave={handleSave} onCancel={onCancel} showCard={false}>
      <Form.Item label={label}>
        <Switch
          checked={checked}
          onChange={setChecked}
          checkedChildren="Да"
          unCheckedChildren="Нет"
        />
      </Form.Item>
    </RuleFormCard>
  );
};

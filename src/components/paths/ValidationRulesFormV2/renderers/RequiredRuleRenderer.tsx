import { Form, Switch } from 'antd';
import type { RuleRendererProps } from '../types';

/**
 * Компонент рендеринга правила required.
 * Отображает переключатель для обязательности поля.
 */
export const RequiredRuleRenderer: React.FC<RuleRendererProps> = ({
  form,
  ruleKey,
  isReadonly,
}) => {
  return (
    <Form.Item
      label="Значение"
      name={['validation_rules', ruleKey]}
      valuePropName="checked"
      tooltip="Поле обязательно к заполнению"
    >
      <Switch disabled={isReadonly} />
    </Form.Item>
  );
};

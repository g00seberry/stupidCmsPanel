import { Form, Switch } from 'antd';
import type { RuleRendererProps } from '../../types';

/**
 * Пропсы компонента рендеринга boolean правил.
 */
export type PropsBooleanRuleRenderer = RuleRendererProps & {
  /** Текст подсказки для правила. */
  tooltip?: string;
};

/**
 * Компонент рендеринга boolean правил (required, array_unique).
 * Отображает переключатель для boolean значений.
 */
export const BooleanRuleRenderer: React.FC<PropsBooleanRuleRenderer> = ({
  form,
  ruleKey,
  isReadonly,
  tooltip,
}) => {
  return (
    <Form.Item
      label="Значение"
      name={['validation_rules', ruleKey]}
      valuePropName="checked"
      tooltip={tooltip}
    >
      <Switch disabled={isReadonly} />
    </Form.Item>
  );
};


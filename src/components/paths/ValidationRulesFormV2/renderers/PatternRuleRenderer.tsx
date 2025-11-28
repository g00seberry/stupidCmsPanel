import { Form, Input } from 'antd';
import type { RuleRendererProps } from '../types';

/**
 * Компонент рендеринга правила pattern.
 * Отображает поле ввода для регулярного выражения.
 */
export const PatternRuleRenderer: React.FC<RuleRendererProps> = ({ form, ruleKey, isReadonly }) => {
  return (
    <Form.Item
      label="Регулярное выражение"
      name={['validation_rules', ruleKey]}
      tooltip="Регулярное выражение для валидации строки. Формат: /pattern/flags"
    >
      <Input disabled={isReadonly} placeholder="/^[a-z]+$/i" style={{ fontFamily: 'monospace' }} />
    </Form.Item>
  );
};

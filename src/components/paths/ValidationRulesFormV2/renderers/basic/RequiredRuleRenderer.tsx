import type { RuleRendererProps } from '../../types';
import { BooleanRuleRenderer } from '../shared/BooleanRuleRenderer';

/**
 * Компонент рендеринга правила required.
 * Отображает переключатель для обязательности поля.
 */
export const RequiredRuleRenderer: React.FC<RuleRendererProps> = props => {
  return <BooleanRuleRenderer {...props} tooltip="Поле обязательно к заполнению" />;
};

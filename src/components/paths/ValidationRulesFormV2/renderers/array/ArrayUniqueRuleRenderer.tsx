import type { RuleRendererProps } from '../../types';
import { BooleanRuleRenderer } from '../shared/BooleanRuleRenderer';

/**
 * Компонент рендеринга правила array_unique.
 * Отображает переключатель для требования уникальности элементов массива.
 */
export const ArrayUniqueRuleRenderer: React.FC<RuleRendererProps> = props => {
  return (
    <BooleanRuleRenderer {...props} tooltip="Требовать уникальность всех элементов в массиве" />
  );
};


import { CheckCircleOutlined } from '@ant-design/icons';
import type { RuleCategory, RuleKey } from './types';
import { getCategoryLabel } from './utils';
import { RuleCategorySection } from './RuleCategorySection';

/**
 * Пропсы компонента списка доступных правил.
 */
export type PropsAvailableRulesList = {
  /** Правила, сгруппированные по категориям. */
  rulesByCategory: Record<RuleCategory, RuleKey[]>;
  /** Доступные правила (уже отфильтрованные от активных). */
  availableRules: RuleKey[];
  /** Флаг только для чтения. */
  isReadonly?: boolean;
};

/**
 * Компонент списка доступных правил валидации.
 * Отображает правила, сгруппированные по категориям, с улучшенным пустым состоянием.
 */
export const AvailableRulesList: React.FC<PropsAvailableRulesList> = ({
  rulesByCategory,
  availableRules,
  isReadonly = false,
}) => {
  const categoriesWithRules = Object.entries(rulesByCategory).filter(([, rules]) =>
    rules.some(rule => availableRules.includes(rule))
  );

  if (categoriesWithRules.length === 0 || availableRules.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <CheckCircleOutlined className="text-4xl text-muted-foreground/40 mb-3" />
        <div className="text-muted-foreground text-sm mb-1 font-medium">Все правила добавлены</div>
        <div className="text-muted-foreground/70 text-xs max-w-[240px]">
          Все доступные правила уже используются. Удалите правило из активных, чтобы добавить новое.
        </div>
      </div>
    );
  }

  return (
    <div>
      {categoriesWithRules.map(([category, rules]) => {
        const availableInCategory = rules.filter(rule => availableRules.includes(rule));
        return (
          <RuleCategorySection
            key={category}
            category={category as RuleCategory}
            ruleKeys={availableInCategory}
            isReadonly={isReadonly}
          />
        );
      })}
    </div>
  );
};

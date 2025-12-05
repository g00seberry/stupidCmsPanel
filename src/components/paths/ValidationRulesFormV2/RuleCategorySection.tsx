import type { RuleCategory, RuleKey } from './types';
import { getRuleMeta } from './registry';
import { getCategoryLabel } from './utils';
import { DraggableRuleCardCompact } from './DraggableRuleCardCompact';

/**
 * Пропсы компонента секции категории правил.
 */
export type PropsRuleCategorySection = {
  /** Ключ категории правила. */
  category: RuleCategory;
  /** Ключи правил в категории. */
  ruleKeys: RuleKey[];
  /** Флаг только для чтения. */
  isReadonly?: boolean;
};

/**
 * Компонент секции категории правил.
 * Отображает компактный список правил, принадлежащих одной категории.
 */
export const RuleCategorySection: React.FC<PropsRuleCategorySection> = ({
  category,
  ruleKeys,
  isReadonly = false,
}) => {
  if (ruleKeys.length === 0) {
    return null;
  }

  return (
    <div className="mb-3 last:mb-0">
      <div className="mb-1.5 text-xs font-medium text-muted-foreground uppercase tracking-wide">
        {getCategoryLabel(category)}
      </div>
      <div className="space-y-1.5">
        {ruleKeys.map(ruleKey => {
          const meta = getRuleMeta(ruleKey);
          return meta ? (
            <DraggableRuleCardCompact
              key={ruleKey}
              id={ruleKey}
              ruleKey={ruleKey}
              meta={meta}
              isReadonly={isReadonly}
            />
          ) : null;
        })}
      </div>
    </div>
  );
};

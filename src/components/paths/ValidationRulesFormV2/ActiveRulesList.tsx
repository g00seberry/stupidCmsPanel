import { InboxOutlined } from '@ant-design/icons';
import type { RuleKey } from './types';
import { getRuleMeta } from './registry';
import { ActiveRuleCard } from './ActiveRuleCard';

/**
 * Пропсы компонента списка активных правил.
 */
export type PropsActiveRulesList = {
  /** Ключи активных правил. */
  ruleKeys: RuleKey[];
  /** Обработчик клика на правило. */
  onRuleClick: (ruleKey: RuleKey) => void;
  /** Обработчик удаления правила. */
  onRuleRemove: (ruleKey: RuleKey) => void;
  /** Флаг только для чтения. */
  isReadonly?: boolean;
};

/**
 * Компонент списка активных правил валидации.
 * Отображает компактный список активных правил с возможностью редактирования и удаления.
 */
export const ActiveRulesList: React.FC<PropsActiveRulesList> = ({
  ruleKeys,
  onRuleClick,
  onRuleRemove,
  isReadonly = false,
}) => {
  if (ruleKeys.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <InboxOutlined className="text-4xl text-muted-foreground/40 mb-3" />
        <div className="text-muted-foreground text-sm mb-1 font-medium">
          Нет активных правил
        </div>
        <div className="text-muted-foreground/70 text-xs max-w-[240px]">
          Перетащите правила из левой панели или нажмите на правило для добавления
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-1.5">
      {ruleKeys.map(ruleKey => {
        const meta = getRuleMeta(ruleKey);
        return meta ? (
          <ActiveRuleCard
            key={ruleKey}
            ruleKey={ruleKey}
            meta={meta}
            onClick={() => onRuleClick(ruleKey)}
            onRemove={() => onRuleRemove(ruleKey)}
            isReadonly={isReadonly}
          />
        ) : null;
      })}
    </div>
  );
};


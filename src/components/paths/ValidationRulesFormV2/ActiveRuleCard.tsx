import { CloseOutlined, EditOutlined } from '@ant-design/icons';
import type { RuleKey } from './types';
import type { RuleMeta } from './types';

/**
 * Пропсы компонента компактной карточки активного правила.
 */
export type PropsActiveRuleCard = {
  /** Ключ правила. */
  ruleKey: RuleKey;
  /** Метаданные правила. */
  meta: RuleMeta;
  /** Обработчик клика на карточку. */
  onClick: () => void;
  /** Обработчик удаления правила. */
  onRemove: () => void;
  /** Флаг только для чтения. */
  isReadonly?: boolean;
};

/**
 * Компонент компактной карточки активного правила валидации.
 * Отображает правило в компактном виде с возможностью редактирования и удаления прямо в карточке.
 */
export const ActiveRuleCard: React.FC<PropsActiveRuleCard> = ({
  meta,
  onClick,
  onRemove,
  isReadonly = false,
}) => {
  return (
    <div
      className="group relative flex items-start justify-between gap-3 rounded-md border border-border bg-card p-2.5 transition-all hover:border-primary hover:shadow-sm cursor-pointer"
      onClick={onClick}
    >
      <div className="flex-1 min-w-0">
        <div className="font-medium text-sm mb-0.5 leading-tight">{meta.label}</div>
        <div className="text-muted-foreground text-xs line-clamp-1 leading-tight">
          {meta.description}
        </div>
      </div>
      {!isReadonly && (
        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0">
          <button
            type="button"
            onClick={e => {
              e.stopPropagation();
              onClick();
            }}
            className="p-1 text-muted-foreground hover:text-primary rounded transition-colors"
            title="Редактировать"
          >
            <EditOutlined className="text-sm" />
          </button>
          <button
            type="button"
            onClick={e => {
              e.stopPropagation();
              onRemove();
            }}
            className="p-1 text-muted-foreground hover:text-destructive rounded transition-colors"
            title="Удалить"
          >
            <CloseOutlined className="text-sm" />
          </button>
        </div>
      )}
    </div>
  );
};

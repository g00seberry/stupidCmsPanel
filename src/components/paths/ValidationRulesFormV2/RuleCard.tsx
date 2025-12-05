import { Card } from 'antd';
import { CloseOutlined, EditOutlined } from '@ant-design/icons';
import type { RuleKey } from './types';
import type { RuleMeta } from './types';

/**
 * Пропсы компонента карточки правила.
 */
export type PropsRuleCard = {
  /** ID для drag & drop. */
  id: string;
  /** Ключ правила. */
  ruleKey: RuleKey;
  /** Метаданные правила. */
  meta: RuleMeta;
  /** Флаг активности правила. */
  isActive: boolean;
  /** Обработчик клика на карточку. */
  onClick: () => void;
  /** Обработчик удаления правила. */
  onRemove: () => void;
  /** Флаг только для чтения. */
  isReadonly?: boolean;
};

/**
 * Компонент карточки правила валидации.
 * Отображает правило в виде карточки с возможностью редактирования и удаления.
 */
export const RuleCard: React.FC<PropsRuleCard> = ({
  ruleKey: _ruleKey,
  meta,
  isActive,
  onClick,
  onRemove,
  isReadonly,
}) => {
  return (
    <Card
      size="small"
      className={`transition-all hover:shadow-md ${
        isActive
          ? 'border-primary cursor-pointer'
          : 'border-border cursor-grab active:cursor-grabbing'
      }`}
      onClick={isActive ? onClick : undefined}
      actions={
        isActive && !isReadonly
          ? [
              <EditOutlined
                key="edit"
                onClick={e => {
                  e.stopPropagation();
                  onClick();
                }}
              />,
              <CloseOutlined
                key="remove"
                onClick={e => {
                  e.stopPropagation();
                  onRemove();
                }}
              />,
            ]
          : undefined
      }
    >
      <div>
        <div className="font-medium text-sm mb-1">{meta.label}</div>
        <div className="text-muted-foreground text-xs line-clamp-2">{meta.description}</div>
      </div>
    </Card>
  );
};

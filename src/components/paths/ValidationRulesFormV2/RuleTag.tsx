import { Tag } from 'antd';
import { CloseOutlined } from '@ant-design/icons';
import type { RuleKey } from './types';
import { getRuleMeta } from './registry';

/**
 * Пропсы компонента тега правила.
 */
export type PropsRuleTag = {
  /** Ключ правила. */
  ruleKey: RuleKey;
  /** Обработчик клика на тег. */
  onClick?: () => void;
  /** Обработчик удаления правила. */
  onRemove?: () => void;
  /** Флаг только для чтения. */
  isReadonly?: boolean;
};

/**
 * Компонент тега правила валидации.
 * Отображает правило в виде тега с возможностью редактирования и удаления.
 */
export const RuleTag: React.FC<PropsRuleTag> = ({ ruleKey, onClick, onRemove, isReadonly }) => {
  const meta = getRuleMeta(ruleKey);
  if (!meta) return null;

  return (
    <Tag
      className="cursor-pointer"
      onClick={onClick}
      closable={!isReadonly}
      onClose={e => {
        e.stopPropagation();
        onRemove?.();
      }}
      icon={meta.icon}
    >
      {meta.label}
    </Tag>
  );
};

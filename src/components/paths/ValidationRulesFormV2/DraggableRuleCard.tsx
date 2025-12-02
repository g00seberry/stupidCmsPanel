import { useDraggable } from '@dnd-kit/core';
import { CSS } from '@dnd-kit/utilities';
import type { RuleKey } from './types';
import type { RuleMeta } from './types';
import { RuleCard } from './RuleCard';

/**
 * Пропсы компонента перетаскиваемой карточки правила.
 */
export type PropsDraggableRuleCard = {
  /** ID для drag & drop. */
  id: string;
  /** Ключ правила. */
  ruleKey: RuleKey;
  /** Метаданные правила. */
  meta: RuleMeta;
  /** Флаг только для чтения. */
  isReadonly: boolean;
};

/**
 * Перетаскиваемая карточка правила для доступных правил.
 * Оборачивает RuleCard в функционал drag & drop.
 */
export const DraggableRuleCard: React.FC<PropsDraggableRuleCard> = ({
  id,
  ruleKey,
  meta,
  isReadonly,
}) => {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id,
    disabled: isReadonly,
  });

  if (!meta) return null;

  return (
    <div
      ref={setNodeRef}
      style={{
        transform: CSS.Translate.toString(transform),
        opacity: isDragging ? 0.5 : 1,
        cursor: isReadonly ? 'default' : 'grab',
      }}
      {...attributes}
      {...listeners}
    >
      <RuleCard
        id={id}
        ruleKey={ruleKey}
        meta={meta}
        isActive={false}
        onClick={() => {}}
        onRemove={() => {}}
        isReadonly={isReadonly}
      />
    </div>
  );
};


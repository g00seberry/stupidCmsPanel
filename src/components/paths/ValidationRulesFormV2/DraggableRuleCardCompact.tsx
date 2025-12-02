import { useDraggable } from '@dnd-kit/core';
import { CSS } from '@dnd-kit/utilities';
import type { RuleKey } from './types';
import type { RuleMeta } from './types';

/**
 * Пропсы компонента компактной перетаскиваемой карточки правила.
 */
export type PropsDraggableRuleCardCompact = {
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
 * Компонент компактной перетаскиваемой карточки правила для доступных правил.
 * Отображает правило в компактном виде с поддержкой drag & drop.
 */
export const DraggableRuleCardCompact: React.FC<PropsDraggableRuleCardCompact> = ({
  id,
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
      }}
      className={`rounded-md border border-border bg-card p-2.5 transition-all ${
        isReadonly
          ? 'cursor-default'
          : 'cursor-grab active:cursor-grabbing hover:border-primary/50 hover:shadow-sm'
      }`}
      {...attributes}
      {...listeners}
    >
      <div className="font-medium text-sm mb-0.5 leading-tight">{meta.label}</div>
      <div className="text-muted-foreground text-xs line-clamp-1 leading-tight">
        {meta.description}
      </div>
    </div>
  );
};


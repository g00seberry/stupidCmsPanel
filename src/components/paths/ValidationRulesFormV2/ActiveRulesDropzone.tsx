import { useDroppable } from '@dnd-kit/core';
import type { ReactNode } from 'react';
import { ACTIVE_RULES_DROPZONE_ID } from './constants';

/**
 * Пропсы компонента dropzone для активных правил.
 */
export type PropsActiveRulesDropzone = {
  /** Дочерние элементы. */
  children: ReactNode;
};

/**
 * Компонент dropzone для активных правил.
 * Позволяет перетаскивать правила в эту область.
 */
export const ActiveRulesDropzone: React.FC<PropsActiveRulesDropzone> = ({ children }) => {
  const { setNodeRef, isOver } = useDroppable({
    id: ACTIVE_RULES_DROPZONE_ID,
  });

  return (
    <div
      ref={setNodeRef}
      className={`border rounded-lg p-4 overflow-y-auto transition-colors ${
        isOver ? 'bg-primary/10 border-primary' : 'bg-muted/30'
      }`}
    >
      {children}
    </div>
  );
};


import type { ZCardinality, ZDataType } from '@/types/path';
import type { DragEndEvent, DragStartEvent } from '@dnd-kit/core';
import {
  DndContext,
  DragOverlay,
  PointerSensor,
  useDraggable,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Form, Space } from 'antd';
import type { FormInstance } from 'antd/es/form';
import { useMemo, useState } from 'react';
import { ActiveRulesDropzone } from './ActiveRulesDropzone';
import {
  ACTIVE_RULES_DROPZONE_ID,
  DRAG_ACTIVATION_DISTANCE,
  EDIT_MODAL_OPEN_DELAY,
} from './constants';
import { defaultRuleValues } from './constants/defaultRuleValues';
import { getAvailableRules, getRuleMeta, getRulesByCategory } from './registry';
import { RuleCard } from './RuleCard';
import { RuleEditModal } from './RuleEditModal';
import type { RuleKey } from './types';
import { addRuleToForm, getActiveRules, removeRuleFromForm } from './utils';

/**
 * Пропсы компонента формы настройки правил валидации (версия 2).
 */
export type PropsValidationRulesFormV2 = {
  /** Экземпляр формы Ant Design. Должен содержать поле validation_rules типа ZValidationRules. */
  form: FormInstance<any>;
  /** Тип данных поля. */
  dataType?: ZDataType;
  /** Кардинальность поля (one или many). */
  cardinality?: ZCardinality;
  /** Флаг только для чтения. */
  isReadonly?: boolean;
};

/**
 * Компонент формы для настройки правил валидации поля Path (версия 2).
 * Отображает две области: доступные правила (слева) и активные правила (справа).
 * Поддерживает drag & drop для добавления правил.
 */
export const ValidationRulesFormV2: React.FC<PropsValidationRulesFormV2> = ({
  form,
  dataType,
  cardinality,
  isReadonly = false,
}) => {
  const [activeId, setActiveId] = useState<string | null>(null);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editingRuleKey, setEditingRuleKey] = useState<RuleKey | null>(null);

  const validationRules = Form.useWatch('validation_rules', form);
  const activeRules = useMemo(() => getActiveRules(validationRules), [validationRules]);

  const { availableRules, rulesByCategory } = useMemo(() => {
    const allAvailable = getAvailableRules(dataType, cardinality);
    const available = allAvailable.filter(rule => !activeRules.includes(rule));
    const byCategory = getRulesByCategory(dataType, cardinality);
    return { availableRules: available, rulesByCategory: byCategory };
  }, [dataType, cardinality, activeRules]);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: DRAG_ACTIVATION_DISTANCE,
      },
    })
  );

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveId(null);

    if (!over || isReadonly) return;

    const ruleKey = active.id as RuleKey;
    console.log('ruleKey', ruleKey);
    if (over.id === ACTIVE_RULES_DROPZONE_ID) {
      addRuleToForm(form, ruleKey, defaultRuleValues[ruleKey]);
      setTimeout(() => {
        setEditingRuleKey(ruleKey);
        setEditModalOpen(true);
      }, EDIT_MODAL_OPEN_DELAY);
    }
  };

  const handleCardClick = (ruleKey: RuleKey) => {
    setEditingRuleKey(ruleKey);
    setEditModalOpen(true);
  };

  const handleRemoveRule = (ruleKey: RuleKey) => {
    removeRuleFromForm(form, ruleKey);
  };

  const handleEditSave = () => {
    setEditModalOpen(false);
    setEditingRuleKey(null);
  };

  const handleEditRemove = () => {
    if (editingRuleKey) {
      removeRuleFromForm(form, editingRuleKey);
      setEditModalOpen(false);
      setEditingRuleKey(null);
    }
  };

  const handleEditCancel = () => {
    setEditModalOpen(false);
    setEditingRuleKey(null);
  };

  if (!dataType) {
    return (
      <div className="text-muted-foreground text-sm">
        Выберите тип данных для настройки правил валидации.
      </div>
    );
  }

  const activeRuleMeta = activeId ? getRuleMeta(activeId as RuleKey) : undefined;

  return (
    <DndContext sensors={sensors} onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
      <div className="grid grid-cols-2 gap-4 h-[600px]">
        {/* Левая область: Доступные правила */}
        <div className="border rounded-lg p-4 overflow-y-auto">
          <div className="mb-4 font-medium text-sm">Доступные правила</div>
          <Space direction="vertical" className="w-full" size="small">
            {Object.entries(rulesByCategory)
              .filter(([, rules]) => rules.some(rule => availableRules.includes(rule)))
              .map(([category, rules]) => {
                const availableInCategory = rules.filter(rule => availableRules.includes(rule));

                return (
                  <div key={category}>
                    <div className="mb-2 text-xs font-medium text-muted-foreground uppercase">
                      {category}
                    </div>
                    <Space direction="vertical" className="w-full" size="small">
                      {availableInCategory.map(ruleKey => {
                        const meta = getRuleMeta(ruleKey);
                        return meta ? (
                          <DraggableRuleCard
                            key={ruleKey}
                            id={ruleKey}
                            ruleKey={ruleKey}
                            meta={meta}
                            isReadonly={isReadonly}
                          />
                        ) : null;
                      })}
                    </Space>
                  </div>
                );
              })}
          </Space>
        </div>

        {/* Правая область: Активные правила */}
        <ActiveRulesDropzone>
          <div className="mb-4 font-medium text-sm">Активные правила</div>
          {activeRules.length === 0 ? (
            <div className="text-muted-foreground text-sm text-center py-8">
              Перетащите правила сюда для добавления
            </div>
          ) : (
            <Space direction="vertical" className="w-full" size="small">
              {activeRules.map(ruleKey => {
                const meta = getRuleMeta(ruleKey);
                return meta ? (
                  <RuleCard
                    isActive={true}
                    key={ruleKey}
                    id={ruleKey}
                    ruleKey={ruleKey}
                    meta={meta}
                    onClick={() => handleCardClick(ruleKey)}
                    onRemove={() => handleRemoveRule(ruleKey)}
                    isReadonly={isReadonly}
                  />
                ) : null;
              })}
            </Space>
          )}
        </ActiveRulesDropzone>
      </div>

      <DragOverlay>
        {activeId && activeRuleMeta && (
          <RuleCard
            id={activeId}
            ruleKey={activeId as RuleKey}
            meta={activeRuleMeta}
            isActive={false}
            onClick={() => {}}
            onRemove={() => {}}
            isReadonly={isReadonly}
          />
        )}
      </DragOverlay>

      {editingRuleKey && (
        <RuleEditModal
          open={editModalOpen}
          onCancel={handleEditCancel}
          onSave={handleEditSave}
          onRemove={handleEditRemove}
          ruleKey={editingRuleKey}
          form={form}
          isReadonly={isReadonly}
        />
      )}
    </DndContext>
  );
};

/**
 * Перетаскиваемая карточка правила для доступных правил.
 */
const DraggableRuleCard: React.FC<{
  id: string;
  ruleKey: RuleKey;
  meta: ReturnType<typeof getRuleMeta>;
  isReadonly: boolean;
}> = ({ id, ruleKey, meta, isReadonly }) => {
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

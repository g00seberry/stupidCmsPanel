import { Form, Space } from 'antd';
import { useState, useMemo } from 'react';
import type { FormInstance } from 'antd/es/form';
import type { ZDataType, ZCardinality } from '@/types/path';
import { getActiveRules } from './utils';
import { getRulesByCategory, getRuleMeta, getAvailableRules } from './registry';
import { defaultRuleValues } from './constants/defaultRuleValues';
import type { RuleKey } from './types';
import {
  DndContext,
  DragOverlay,
  PointerSensor,
  useSensor,
  useSensors,
  useDraggable,
} from '@dnd-kit/core';
import type { DragEndEvent, DragStartEvent } from '@dnd-kit/core';
import { SortableContext, useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { RuleCard } from './RuleCard';
import { RuleEditModal } from './RuleEditModal';
import { ActiveRulesDropzone } from './ActiveRulesDropzone';

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

  const availableRules = useMemo(
    () => getAvailableRules(dataType, cardinality).filter(rule => !activeRules.includes(rule)),
    [dataType, cardinality, activeRules]
  );

  const rulesByCategory = useMemo(
    () => getRulesByCategory(dataType, cardinality),
    [dataType, cardinality]
  );

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5,
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
    const overId = over.id as string;

    // Если перетащили в область активных правил
    if (overId === 'active-rules-dropzone') {
      const currentRules = form.getFieldValue('validation_rules') || {};
      const newRules = { ...currentRules };
      newRules[ruleKey] = defaultRuleValues[ruleKey];
      form.setFieldValue('validation_rules', newRules);

      // Автоматически открываем модальное окно для настройки правила
      setTimeout(() => {
        setEditingRuleKey(ruleKey);
        setEditModalOpen(true);
      }, 100);
    }
  };

  const handleCardClick = (ruleKey: RuleKey) => {
    if (activeRules.includes(ruleKey)) {
      setEditingRuleKey(ruleKey);
      setEditModalOpen(true);
    }
  };

  const handleRemoveRule = (ruleKey: RuleKey) => {
    const currentRules = form.getFieldValue('validation_rules') || {};
    const newRules = { ...currentRules };
    delete newRules[ruleKey];

    const remainingRules = Object.keys(newRules).filter(key => {
      const value = newRules[key];
      if (value === undefined || value === null) return false;
      if (typeof value === 'object' && Object.keys(value).length === 0) return false;
      if (typeof value === 'string' && value.trim() === '') return false;
      return true;
    });

    if (remainingRules.length === 0) {
      form.setFieldValue('validation_rules', null);
    } else {
      form.setFieldValue('validation_rules', newRules);
    }
  };

  const handleEditSave = () => {
    setEditModalOpen(false);
    setEditingRuleKey(null);
  };

  const handleEditRemove = () => {
    if (editingRuleKey) {
      handleRemoveRule(editingRuleKey);
      setEditModalOpen(false);
      setEditingRuleKey(null);
    }
  };

  if (!dataType) {
    return (
      <div className="text-muted-foreground text-sm">
        Выберите тип данных для настройки правил валидации.
      </div>
    );
  }

  const activeRuleMeta = activeId ? getRuleMeta(activeId as RuleKey) : null;

  return (
    <DndContext sensors={sensors} onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
      <div className="grid grid-cols-2 gap-4 h-[600px]">
        {/* Левая область: Доступные правила */}
        <div className="border rounded-lg p-4 overflow-y-auto">
          <div className="mb-4 font-medium text-sm">Доступные правила</div>
          <Space direction="vertical" className="w-full" size="small">
            {Object.entries(rulesByCategory).map(([category, rules]) => {
              const availableInCategory = rules.filter(rule => availableRules.includes(rule));
              if (availableInCategory.length === 0) return null;

              return (
                <div key={category}>
                  <div className="mb-2 text-xs font-medium text-muted-foreground uppercase">
                    {category}
                  </div>
                  <Space direction="vertical" className="w-full" size="small">
                    {availableInCategory.map(ruleKey => {
                      const meta = getRuleMeta(ruleKey);
                      if (!meta) return null;
                      return (
                        <DraggableRuleCard
                          key={ruleKey}
                          id={ruleKey}
                          ruleKey={ruleKey}
                          meta={meta}
                          isReadonly={isReadonly}
                        />
                      );
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
            <SortableContext items={activeRules}>
              <Space direction="vertical" className="w-full" size="small">
                {activeRules.map(ruleKey => {
                  const meta = getRuleMeta(ruleKey);
                  if (!meta) return null;
                  return (
                    <SortableRuleCard
                      key={ruleKey}
                      id={ruleKey}
                      ruleKey={ruleKey}
                      meta={meta}
                      onClick={() => handleCardClick(ruleKey)}
                      onRemove={() => handleRemoveRule(ruleKey)}
                      isReadonly={isReadonly}
                    />
                  );
                })}
              </Space>
            </SortableContext>
          )}
        </ActiveRulesDropzone>
      </div>

      <DragOverlay>
        {activeId && activeRuleMeta ? (
          <RuleCard
            id={activeId}
            ruleKey={activeId as RuleKey}
            meta={activeRuleMeta}
            isActive={false}
            onClick={() => {}}
            onRemove={() => {}}
            isReadonly={isReadonly}
          />
        ) : null}
      </DragOverlay>

      {editingRuleKey && (
        <RuleEditModal
          open={editModalOpen}
          onCancel={() => {
            setEditModalOpen(false);
            setEditingRuleKey(null);
          }}
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

  const style = {
    transform: CSS.Translate.toString(transform),
    opacity: isDragging ? 0.5 : 1,
    cursor: isReadonly ? 'default' : 'grab',
  };

  if (!meta) return null;

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className={isDragging ? 'opacity-50' : ''}
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

/**
 * Сортируемая карточка правила для активных правил.
 */
const SortableRuleCard: React.FC<{
  id: string;
  ruleKey: RuleKey;
  meta: ReturnType<typeof getRuleMeta>;
  onClick: () => void;
  onRemove: () => void;
  isReadonly: boolean;
}> = ({ id, ruleKey, meta, onClick, onRemove, isReadonly }) => {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id,
    disabled: isReadonly,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  if (!meta) return null;

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      <RuleCard
        id={id}
        ruleKey={ruleKey}
        meta={meta}
        isActive={true}
        onClick={onClick}
        onRemove={onRemove}
        isReadonly={isReadonly}
      />
    </div>
  );
};

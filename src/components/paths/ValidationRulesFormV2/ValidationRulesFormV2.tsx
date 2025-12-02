import type { ZCardinality, ZDataType } from '@/types/path';
import type { DragEndEvent, DragStartEvent } from '@dnd-kit/core';
import { DndContext, DragOverlay, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { observer } from 'mobx-react-lite';
import { useMemo, useState } from 'react';
import { ActiveRulesDropzone } from './ActiveRulesDropzone';
import { ActiveRulesList } from './ActiveRulesList';
import { AvailableRulesList } from './AvailableRulesList';
import { ACTIVE_RULES_DROPZONE_ID, DRAG_ACTIVATION_DISTANCE } from './constants';
import { defaultRuleValues } from './constants/defaultRuleValues';
import { getAvailableRules, getRuleMeta, getRulesByCategory } from './registry';
import { RuleCard } from './RuleCard';
import { RuleEditModal } from './RuleEditModal';
import type { RuleKey } from './types';
import { ValidationRulesStore } from './ValidationRulesStore';

/**
 * Пропсы компонента формы настройки правил валидации (версия 2).
 */
export type PropsValidationRulesFormV2 = {
  /** Store для управления правилами валидации. */
  store: ValidationRulesStore;
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
export const ValidationRulesFormV2: React.FC<PropsValidationRulesFormV2> = observer(
  ({ store, dataType, cardinality, isReadonly = false }) => {
    const [activeId, setActiveId] = useState<string | null>(null);
    const [editingRuleKey, setEditingRuleKey] = useState<RuleKey | null>(null);

    const activeRules = store.getActiveRules();

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
      if (over.id === ACTIVE_RULES_DROPZONE_ID) {
        store.addRule(ruleKey, defaultRuleValues[ruleKey]);
        setEditingRuleKey(ruleKey);
      }
    };

    const handleCardClick = (ruleKey: RuleKey) => {
      setEditingRuleKey(ruleKey);
    };

    const handleRemoveRule = (ruleKey: RuleKey) => {
      store.removeRule(ruleKey);
    };

    const closeModal = () => {
      setEditingRuleKey(null);
    };

    const handleEditSave = () => {
      setEditingRuleKey(null);
    };

    const handleEditRemove = () => {
      if (editingRuleKey) {
        store.removeRule(editingRuleKey);
      }
      closeModal();
    };

    const handleEditCancel = () => {
      closeModal();
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
            <div className="mb-3 flex items-center justify-between">
              <span className="font-medium text-sm">Доступные правила</span>
              {availableRules.length > 0 && (
                <span className="text-muted-foreground text-xs bg-muted px-2 py-0.5 rounded-full">
                  {availableRules.length}
                </span>
              )}
            </div>
            <AvailableRulesList
              rulesByCategory={rulesByCategory}
              availableRules={availableRules}
              isReadonly={isReadonly}
            />
          </div>

          {/* Правая область: Активные правила */}
          <ActiveRulesDropzone>
            <div className="mb-3 flex items-center justify-between">
              <span className="font-medium text-sm">Активные правила</span>
              {activeRules.length > 0 && (
                <span className="text-muted-foreground text-xs bg-muted px-2 py-0.5 rounded-full">
                  {activeRules.length}
                </span>
              )}
            </div>
            <ActiveRulesList
              ruleKeys={activeRules}
              onRuleClick={handleCardClick}
              onRuleRemove={handleRemoveRule}
              isReadonly={isReadonly}
            />
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
            open={!!editingRuleKey}
            onCancel={handleEditCancel}
            onSave={handleEditSave}
            onRemove={handleEditRemove}
            ruleKey={editingRuleKey}
            store={store}
            isReadonly={isReadonly}
          />
        )}
      </DndContext>
    );
  }
);

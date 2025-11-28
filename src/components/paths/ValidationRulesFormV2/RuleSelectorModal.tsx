import { Modal, Checkbox, Space, Divider } from 'antd';
import { useState, useMemo } from 'react';
import type { RuleKey, RuleCategory } from './types';
import { getRulesByCategory, getRuleMeta } from './registry';
import type { ZDataType, ZCardinality } from '@/types/path';

/**
 * Пропсы компонента модального окна выбора правил.
 */
export type PropsRuleSelectorModal = {
  /** Флаг открытия модального окна. */
  open: boolean;
  /** Обработчик закрытия модального окна. */
  onCancel: () => void;
  /** Обработчик выбора правил. */
  onSelect: (ruleKeys: RuleKey[]) => void;
  /** Тип данных. */
  dataType?: ZDataType;
  /** Кардинальность. */
  cardinality?: ZCardinality;
  /** Уже выбранные правила. */
  selectedRules?: RuleKey[];
};

/**
 * Компонент модального окна выбора правил валидации.
 * Позволяет выбрать одно или несколько правил из списка доступных.
 */
export const RuleSelectorModal: React.FC<PropsRuleSelectorModal> = ({
  open,
  onCancel,
  onSelect,
  dataType,
  cardinality,
  selectedRules = [],
}) => {
  const [checkedRules, setCheckedRules] = useState<RuleKey[]>([]);

  const rulesByCategory = useMemo(
    () => getRulesByCategory(dataType, cardinality),
    [dataType, cardinality]
  );

  const categoryLabels: Record<RuleCategory, string> = {
    basic: 'Базовые правила',
    array: 'Правила для массивов',
    conditional: 'Условные правила',
    unique: 'Правило уникальности',
    exists: 'Правило существования',
    comparison: 'Сравнение полей',
  };

  const handleOk = () => {
    if (checkedRules.length > 0) {
      onSelect(checkedRules);
      setCheckedRules([]);
    }
  };

  const handleCancel = () => {
    setCheckedRules([]);
    onCancel();
  };

  const availableRules = useMemo(() => {
    const all: RuleKey[] = [];
    Object.values(rulesByCategory).forEach(categoryRules => {
      all.push(...categoryRules);
    });
    return all.filter(rule => !selectedRules.includes(rule));
  }, [rulesByCategory, selectedRules]);

  if (availableRules.length === 0) {
    return (
      <Modal
        title="Добавить правило"
        open={open}
        onOk={handleCancel}
        onCancel={handleCancel}
        okText="Закрыть"
        cancelButtonProps={{ style: { display: 'none' } }}
      >
        <div className="text-muted-foreground text-center">Все доступные правила уже добавлены</div>
      </Modal>
    );
  }

  return (
    <Modal
      title="Добавить правило"
      open={open}
      onOk={handleOk}
      onCancel={handleCancel}
      okText="Добавить"
      okButtonProps={{ disabled: checkedRules.length === 0 }}
    >
      <Space direction="vertical" className="w-full" size="middle">
        {Object.entries(rulesByCategory).map(([category, rules]) => {
          if (rules.length === 0) return null;
          const availableInCategory = rules.filter(rule => !selectedRules.includes(rule));
          if (availableInCategory.length === 0) return null;

          return (
            <div key={category}>
              <div className="mb-2 font-medium">{categoryLabels[category as RuleCategory]}</div>
              <Space direction="vertical" size="small">
                {availableInCategory.map(ruleKey => {
                  const meta = getRuleMeta(ruleKey);
                  return (
                    <Checkbox
                      key={ruleKey}
                      checked={checkedRules.includes(ruleKey)}
                      onChange={e => {
                        if (e.target.checked) {
                          setCheckedRules([...checkedRules, ruleKey]);
                        } else {
                          setCheckedRules(checkedRules.filter(r => r !== ruleKey));
                        }
                      }}
                    >
                      <div>
                        <div className="font-medium">{meta?.label}</div>
                        <div className="text-muted-foreground text-xs">{meta?.description}</div>
                      </div>
                    </Checkbox>
                  );
                })}
              </Space>
              <Divider className="my-2" />
            </div>
          );
        })}
      </Space>
    </Modal>
  );
};

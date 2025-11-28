import { Button, Space } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { useState, useMemo } from 'react';
import type { FormInstance } from 'antd/es/form';
import type { ZDataType, ZCardinality } from '@/types/path';
import { RuleTagsList } from './RuleTagsList';
import { RuleSelectorModal } from './RuleSelectorModal';
import { RuleEditModal } from './RuleEditModal';
import { getActiveRules } from './utils';
import type { RuleKey } from './types';

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
 * Отображает правила в виде тегов с возможностью добавления и редактирования через модальные окна.
 */
export const ValidationRulesFormV2: React.FC<PropsValidationRulesFormV2> = ({
  form,
  dataType,
  cardinality,
  isReadonly = false,
}) => {
  const [selectorModalOpen, setSelectorModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editingRuleKey, setEditingRuleKey] = useState<RuleKey | null>(null);

  const validationRules = form.getFieldValue('validation_rules');
  const activeRules = useMemo(() => getActiveRules(validationRules), [validationRules]);

  const handleAddRules = (ruleKeys: RuleKey[]) => {
    const currentRules = form.getFieldValue('validation_rules') || {};
    const newRules = { ...currentRules };

    ruleKeys.forEach(ruleKey => {
      // Устанавливаем значение по умолчанию в зависимости от типа правила
      if (ruleKey === 'required' || ruleKey === 'array_unique') {
        newRules[ruleKey] = false;
      } else if (
        ruleKey === 'min' ||
        ruleKey === 'max' ||
        ruleKey === 'array_min_items' ||
        ruleKey === 'array_max_items'
      ) {
        newRules[ruleKey] = undefined;
      } else if (ruleKey.startsWith('required_') || ruleKey.startsWith('prohibited_')) {
        newRules[ruleKey] = '';
      } else if (ruleKey === 'unique' || ruleKey === 'exists') {
        newRules[ruleKey] = '';
      } else if (ruleKey === 'field_comparison') {
        newRules[ruleKey] = { operator: '==' };
      } else {
        newRules[ruleKey] = undefined;
      }
    });

    form.setFieldValue('validation_rules', newRules);
    setSelectorModalOpen(false);
  };

  const handleTagClick = (ruleKey: RuleKey) => {
    setEditingRuleKey(ruleKey);
    setEditModalOpen(true);
  };

  const handleRemoveRule = (ruleKey: RuleKey) => {
    const currentRules = form.getFieldValue('validation_rules') || {};
    const newRules = { ...currentRules };
    delete newRules[ruleKey];

    // Если правил не осталось, устанавливаем null
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

  return (
    <Space direction="vertical" className="w-full" size="middle">
      <div className="flex items-center justify-between">
        <div className="font-medium">Правила валидации</div>
        {!isReadonly && (
          <Button type="primary" icon={<PlusOutlined />} onClick={() => setSelectorModalOpen(true)}>
            Добавить правило
          </Button>
        )}
      </div>

      <RuleTagsList
        form={form}
        onTagClick={handleTagClick}
        onRemove={handleRemoveRule}
        isReadonly={isReadonly}
      />

      <RuleSelectorModal
        open={selectorModalOpen}
        onCancel={() => setSelectorModalOpen(false)}
        onSelect={handleAddRules}
        dataType={dataType}
        cardinality={cardinality}
        selectedRules={activeRules}
      />

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
    </Space>
  );
};

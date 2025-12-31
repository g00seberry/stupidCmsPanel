import type { ZValidationRules } from '@/types/path/pathValidationRules';
import { observer } from 'mobx-react-lite';
import { useState } from 'react';
import { Button, List, Modal, Space } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import type { PathValidationRule } from './components/types';
import { listValidationRules } from './components/utils';
import { ruleListRenderers } from './components/list/ruleListRenderers';
import { ruleFormRenderers } from './components/forms/ruleFormRenderers';

type PropValidationEditor = {
  value?: ZValidationRules;
  onChange?: (value: ZValidationRules) => void;
};

const AVAILABLE_RULES: Array<{
  type: PathValidationRule['type'];
  label: string;
  description: string;
}> = [
  { type: 'required', label: 'Обязательное поле', description: 'Поле должно быть заполнено' },
  { type: 'min', label: 'Минимум', description: 'Минимальное значение или длина' },
  { type: 'max', label: 'Максимум', description: 'Максимальное значение или длина' },
  { type: 'pattern', label: 'Паттерн', description: 'Регулярное выражение для валидации' },
  {
    type: 'distinct',
    label: 'Уникальные элементы',
    description: 'Требование уникальности элементов массива',
  },
  {
    type: 'required_if',
    label: 'Обязательно, если',
    description: 'Поле обязательно, если условие выполнено',
  },
  {
    type: 'prohibited_unless',
    label: 'Запрещено, если не',
    description: 'Поле запрещено, если условие не выполнено',
  },
  {
    type: 'required_unless',
    label: 'Обязательно, если не',
    description: 'Поле обязательно, если условие не выполнено',
  },
  {
    type: 'prohibited_if',
    label: 'Запрещено, если',
    description: 'Поле запрещено, если условие выполнено',
  },
  {
    type: 'field_comparison',
    label: 'Сравнение полей',
    description: 'Сравнение значения поля с другим полем или константой',
  },
];

const createDefaultRule = (type: PathValidationRule['type']): PathValidationRule => {
  switch (type) {
    case 'required':
    case 'distinct':
      return { type, value: true };
    case 'min':
    case 'max':
      return { type, value: 0 };
    case 'pattern':
      return { type, value: '' };
    case 'required_if':
    case 'prohibited_unless':
    case 'required_unless':
    case 'prohibited_if':
      return { type, value: { field: '', operator: '==', value: undefined } };
    case 'field_comparison':
      return { type, value: { operator: '>=', field: undefined, value: undefined } };
  }
};

export const ValidationEditor = observer(({ value, onChange }: PropValidationEditor) => {
  const activeRules = listValidationRules(value || {});
  const [editingRule, setEditingRule] = useState<PathValidationRule | null>(null);
  const [isAddRuleModalOpen, setIsAddRuleModalOpen] = useState(false);

  const handleEdit = (rule: PathValidationRule) => {
    setEditingRule(rule);
  };

  const handleSave = (updatedRule: PathValidationRule) => {
    if (!onChange) return;

    const currentRules = value || {};
    const newRules = { ...currentRules };

    // Если это редактирование существующего правила, удаляем старое
    if (editingRule && activeRules.some(r => r.type === editingRule.type)) {
      delete newRules[editingRule.type];
    }

    // Добавляем обновленное или новое правило
    (newRules as any)[updatedRule.type] = updatedRule.value;

    onChange(newRules);
    setEditingRule(null);
  };

  const handleCancel = () => {
    setEditingRule(null);
  };

  const handleAddRule = (ruleType: PathValidationRule['type']) => {
    const newRule = createDefaultRule(ruleType);
    setEditingRule(newRule);
    setIsAddRuleModalOpen(false);
  };

  const FormRenderer = editingRule ? ruleFormRenderers[editingRule.type] : null;

  const getModalTitle = (rule: PathValidationRule): string => {
    const isNewRule = !activeRules.some(r => r.type === rule.type);
    const prefix = isNewRule ? 'Добавление' : 'Редактирование';

    const titles: Record<PathValidationRule['type'], string> = {
      required: `${prefix}: Обязательное поле`,
      min: `${prefix}: Минимум`,
      max: `${prefix}: Максимум`,
      pattern: `${prefix}: Паттерн`,
      distinct: `${prefix}: Уникальные элементы`,
      required_if: `${prefix}: Обязательно, если`,
      prohibited_unless: `${prefix}: Запрещено, если не`,
      required_unless: `${prefix}: Обязательно, если не`,
      prohibited_if: `${prefix}: Запрещено, если`,
      field_comparison: `${prefix}: Сравнение полей`,
    };
    return titles[rule.type];
  };

  const activeRuleTypes = new Set(activeRules.map(r => r.type));
  const availableRules = AVAILABLE_RULES.filter(rule => !activeRuleTypes.has(rule.type));

  return (
    <div>
      <Space direction="vertical" style={{ width: '100%' }}>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => setIsAddRuleModalOpen(true)}
          disabled={availableRules.length === 0}
        >
          Добавить правило
        </Button>
        <List
          dataSource={activeRules}
          renderItem={rule => {
            const ListRenderer = ruleListRenderers[rule.type];
            return <ListRenderer rule={rule} onEdit={() => handleEdit(rule)} />;
          }}
        />
      </Space>

      <Modal
        open={isAddRuleModalOpen}
        onCancel={() => setIsAddRuleModalOpen(false)}
        footer={null}
        width={600}
        title="Выберите правило для добавления"
      >
        <List
          dataSource={availableRules}
          renderItem={rule => (
            <List.Item onClick={() => handleAddRule(rule.type)} style={{ cursor: 'pointer' }}>
              <List.Item.Meta title={rule.label} description={rule.description} />
            </List.Item>
          )}
        />
      </Modal>

      {editingRule && FormRenderer && (
        <Modal
          open={!!editingRule}
          onCancel={handleCancel}
          footer={null}
          width={600}
          title={getModalTitle(editingRule)}
        >
          <FormRenderer rule={editingRule} onSave={handleSave} onCancel={handleCancel} />
        </Modal>
      )}
    </div>
  );
});

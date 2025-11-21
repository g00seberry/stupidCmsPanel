import { Form, Select } from 'antd';
import { useEffect, useState } from 'react';
import type React from 'react';
import { listEntries } from '@/api/apiEntries';
import type { ZEntry } from '@/types/entries';
import { onError } from '@/utils/onError';
import { getFieldLabel } from '../utils/getFieldLabel';
import { getFormItemRules } from '../utils/getFormItemRules';
import { isFieldDisabled, getFieldTooltip, createFieldName } from '../utils/pathFieldUtils';
import type { PropsPathFieldBase } from './PathField.types';

/**
 * Компонент поля типа ref (ссылка на другую Entry).
 * Поддерживает cardinality: one и many через mode="multiple".
 */
export const PathRefField: React.FC<PropsPathFieldBase> = ({ path, fieldNamePrefix, readonly }) => {
  const label = getFieldLabel(path);
  const rules = getFormItemRules(path);
  const fieldName = createFieldName(fieldNamePrefix, path.name);
  const disabled = isFieldDisabled(path, readonly);
  const tooltip = getFieldTooltip(path);
  const [entries, setEntries] = useState<ZEntry[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const loadEntries = async () => {
      setLoading(true);
      try {
        const result = await listEntries({ per_page: 100 });
        setEntries(result.data);
      } catch (error) {
        onError(error);
      } finally {
        setLoading(false);
      }
    };
    loadEntries();
  }, []);

  const options = entries.map(entry => ({
    value: entry.id,
    label: entry.title,
  }));

  return (
    <Form.Item name={fieldName} label={label} rules={rules} tooltip={tooltip}>
      <Select
        mode={path.cardinality === 'many' ? 'multiple' : undefined}
        showSearch
        placeholder="Выберите Entry"
        loading={loading}
        disabled={disabled}
        filterOption={(input, option) => (option?.label ?? '').toLowerCase().includes(input.toLowerCase())}
        options={options}
      />
    </Form.Item>
  );
};


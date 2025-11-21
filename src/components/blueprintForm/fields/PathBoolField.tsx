import { Form, Switch } from 'antd';
import type React from 'react';
import { getFieldLabel } from '../utils/getFieldLabel';
import { getFormItemRules } from '../utils/getFormItemRules';
import { isFieldDisabled, getFieldTooltip, createFieldName } from '../utils/pathFieldUtils';
import type { PropsPathFieldBase } from './PathField.types';

/**
 * Компонент поля типа bool (булево значение).
 * Всегда cardinality: one (bool не может быть массивом).
 */
export const PathBoolField: React.FC<PropsPathFieldBase> = ({
  path,
  fieldNamePrefix,
  readonly,
}) => {
  const label = getFieldLabel(path);
  const rules = getFormItemRules(path);
  const fieldName = createFieldName(fieldNamePrefix, path.name);
  const disabled = isFieldDisabled(path, readonly);
  const tooltip = getFieldTooltip(path);

  return (
    <Form.Item
      name={fieldName}
      label={label}
      rules={rules}
      valuePropName="checked"
      tooltip={tooltip}
    >
      <Switch disabled={disabled} />
    </Form.Item>
  );
};

import { DatePicker } from 'antd';
import type React from 'react';
import type { FieldComponentProps } from './fieldRegistry';
import { isFieldDisabled, getFieldPlaceholder } from '../utils/fieldNodeUtils';
import { t } from '../utils/i18n';

/**
 * Компонент поля типа date (дата без времени) для работы с FieldNode.
 * Возвращает только контрол DatePicker, без Form.Item и CardinalityWrapper.
 */
export const PathDateFieldNode: React.FC<FieldComponentProps> = ({ node, readonly }) => {
  if (node.dataType !== 'date') {
    return null;
  }

  const disabled = isFieldDisabled(node, readonly);
  const placeholder = getFieldPlaceholder(node, t('blueprint.field.select'));

  return (
    <DatePicker
      style={{ width: '100%' }}
      format="YYYY-MM-DD"
      placeholder={placeholder}
      disabled={disabled}
    />
  );
};

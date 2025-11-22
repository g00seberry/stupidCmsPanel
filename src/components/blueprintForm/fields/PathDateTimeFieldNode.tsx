import { DatePicker } from 'antd';
import type React from 'react';
import type { FieldComponentProps } from './fieldRegistry';
import { isFieldDisabled, getFieldPlaceholder } from '../utils/fieldNodeUtils';

/**
 * Компонент поля типа datetime (дата и время) для работы с FieldNode.
 * Возвращает только контрол DatePicker, без Form.Item и CardinalityWrapper.
 */
export const PathDateTimeFieldNode: React.FC<FieldComponentProps> = ({ node, readonly }) => {
  if (node.dataType !== 'datetime') {
    return null;
  }

  const disabled = isFieldDisabled(node, readonly);
  const placeholder = getFieldPlaceholder(node, 'Выберите');

  return (
    <DatePicker
      showTime
      style={{ width: '100%' }}
      format="YYYY-MM-DD HH:mm:ss"
      placeholder={placeholder}
      disabled={disabled}
    />
  );
};

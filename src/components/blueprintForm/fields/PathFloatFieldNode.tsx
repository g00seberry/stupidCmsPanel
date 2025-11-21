import { InputNumber } from 'antd';
import type React from 'react';
import type { FieldComponentProps } from './fieldRegistry';
import { isFieldDisabled, getFieldPlaceholder } from '../utils/fieldNodeUtils';

/**
 * Компонент поля типа float (число с плавающей точкой) для работы с FieldNode.
 * Возвращает только контрол InputNumber, без Form.Item и CardinalityWrapper.
 */
export const PathFloatFieldNode: React.FC<FieldComponentProps> = ({ node, readonly }) => {
  if (node.dataType !== 'float') {
    return null;
  }

  const disabled = isFieldDisabled(node, readonly);
  const placeholder = getFieldPlaceholder(node);

  return (
    <InputNumber
      style={{ width: '100%' }}
      step={0.01}
      placeholder={placeholder}
      disabled={disabled}
    />
  );
};

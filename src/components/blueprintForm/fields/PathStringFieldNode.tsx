import { Input } from 'antd';
import type React from 'react';
import type { FieldComponentProps } from './fieldRegistry';
import { isFieldDisabled, getFieldPlaceholder } from '../utils/fieldNodeUtils';

/**
 * Компонент поля типа string для работы с FieldNode.
 * Возвращает только контрол Input, без Form.Item и CardinalityWrapper.
 */
export const PathStringFieldNode: React.FC<FieldComponentProps> = ({ node, readonly }) => {
  if (node.dataType !== 'string') {
    return null;
  }

  const disabled = isFieldDisabled(node, readonly);
  const placeholder = getFieldPlaceholder(node);

  return <Input placeholder={placeholder} disabled={disabled} />;
};

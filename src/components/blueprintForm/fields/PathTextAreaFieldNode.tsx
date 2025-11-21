import { Input } from 'antd';
import type React from 'react';
import type { FieldComponentProps } from './fieldRegistry';
import { isFieldDisabled, getFieldPlaceholder } from '../utils/fieldNodeUtils';

/**
 * Компонент поля типа text (длинный текст) для работы с FieldNode.
 * Возвращает только контрол Input.TextArea, без Form.Item и CardinalityWrapper.
 */
export const PathTextAreaFieldNode: React.FC<FieldComponentProps> = ({ node, readonly }) => {
  if (node.dataType !== 'text') {
    return null;
  }

  const disabled = isFieldDisabled(node, readonly);
  const placeholder = getFieldPlaceholder(node);

  return <Input.TextArea rows={4} placeholder={placeholder} disabled={disabled} />;
};


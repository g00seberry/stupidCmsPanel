import { Switch } from 'antd';
import type React from 'react';
import type { FieldComponentProps } from './fieldRegistry';
import { isFieldDisabled } from '../utils/fieldNodeUtils';

/**
 * Компонент поля типа bool (булево значение) для работы с FieldNode.
 * Всегда cardinality: one (bool не может быть массивом).
 * Возвращает контрол, который должен быть обёрнут в Form.Item на уровне выше.
 */
export const PathBoolFieldNode: React.FC<FieldComponentProps> = ({ node, readonly }) => {
  if (node.dataType !== 'bool') {
    return null;
  }

  const disabled = isFieldDisabled(node, readonly);

  return <Switch disabled={disabled} />;
};

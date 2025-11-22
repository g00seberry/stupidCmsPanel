import { Switch } from 'antd';
import type React from 'react';
import type { FieldComponentProps } from './fieldRegistry';

/**
 * Компонент поля типа bool (булево значение) для работы с FieldNode.
 * Всегда cardinality: one (bool не может быть массивом).
 * Возвращает контрол, который должен быть обёрнут в Form.Item на уровне выше.
 */
export const PathBoolFieldNode: React.FC<FieldComponentProps> = ({ value, ...props }) => {
  return <Switch {...props} value={!!value} />;
};

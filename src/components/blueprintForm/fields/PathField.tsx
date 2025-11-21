import type React from 'react';
import { PathStringField } from './PathStringField';
import { PathTextAreaField } from './PathTextAreaField';
import { PathIntField } from './PathIntField';
import { PathFloatField } from './PathFloatField';
import { PathBoolField } from './PathBoolField';
import { PathDateField } from './PathDateField';
import { PathDateTimeField } from './PathDateTimeField';
import { PathRefField } from './PathRefField';
import { PathJsonGroupField } from './PathJsonGroupField';
import type { PropsPathFieldBase } from './PathField.types';

/**
 * Пропсы базового компонента поля Path.
 */
export type PropsPathField = PropsPathFieldBase;

/**
 * Базовый компонент для рендеринга поля Path.
 * Выбирает соответствующий компонент на основе data_type.
 */
export const PathField: React.FC<PropsPathField> = ({ path, ...props }) => {
  if (path.data_type === 'json') {
    return <PathJsonGroupField path={path} {...props} />;
  }

  switch (path.data_type) {
    case 'string':
      return <PathStringField path={path} {...props} />;
    case 'text':
      return <PathTextAreaField path={path} {...props} />;
    case 'int':
      return <PathIntField path={path} {...props} />;
    case 'float':
      return <PathFloatField path={path} {...props} />;
    case 'bool':
      return <PathBoolField path={path} {...props} />;
    case 'date':
      return <PathDateField path={path} {...props} />;
    case 'datetime':
      return <PathDateTimeField path={path} {...props} />;
    case 'ref':
      return <PathRefField path={path} {...props} />;
    default:
      return <PathStringField path={path} {...props} />;
  }
};

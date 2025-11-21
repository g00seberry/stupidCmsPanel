import { Card } from 'antd';
import type React from 'react';
import type { FieldComponentProps } from './fieldRegistry';
import { PathField } from './PathField';
import { CardinalityWrapper } from '../components/CardinalityWrapper';
import { getLocalizedLabel } from '../utils/fieldNodeUtils';
import { getFormItemRulesFromNode } from '../utils/getFormItemRulesFromNode';

/**
 * Компонент группы полей типа json.
 * Рекурсивно рендерит дочерние поля через PathField.
 * Использует CardinalityWrapper для обработки cardinality на уровне группы.
 */
export const PathJsonGroupField: React.FC<FieldComponentProps> = ({ node, name, readonly }) => {
  if (node.dataType !== 'json') {
    return null;
  }

  if (!node.children || node.children.length === 0) {
    return null;
  }

  // Сортируем children по sortOrder (уже отсортированы в buildFormSchema, но на всякий случай)
  const sortedChildren = [...node.children].sort((a, b) => a.sortOrder - b.sortOrder);

  const label = getLocalizedLabel(node);
  const rules = getFormItemRulesFromNode(node);

  return (
    <Card title={label} className="mb-4">
      <CardinalityWrapper node={node} name={name} readonly={readonly} label={label} rules={rules}>
        {itemName => (
          <>
            {sortedChildren.map(child => (
              <PathField key={child.id} node={child} name={itemName} readonly={readonly} />
            ))}
          </>
        )}
      </CardinalityWrapper>
    </Card>
  );
};

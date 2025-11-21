import { Form } from 'antd';
import type React from 'react';
import type { FieldNode } from '../types/formField';
import { fieldRegistry } from './fieldRegistry';
import type { FieldComponentProps } from './fieldRegistry';
import { getFormItemRulesFromNode } from '../utils/getFormItemRulesFromNode';
import { createFieldName } from '../utils/fieldNodeUtils';
import { CardinalityWrapper } from '../components/CardinalityWrapper';
import type { BlueprintFormStore } from '../stores/BlueprintFormStore';

/**
 * Пропсы компонента поля формы на основе FieldNode.
 */
export interface PropsPathField {
  /** Узел поля формы. */
  node: FieldNode;
  /** Имя поля в форме (массив сегментов пути). */
  name: (string | number)[];
  /** Флаг режима только для чтения. */
  readonly?: boolean;
  /** Store для управления формой. */
  store: BlueprintFormStore;
}

/**
 * Базовый компонент для рендеринга поля формы.
 * Использует реестр типов полей для выбора соответствующего компонента на основе dataType.
 * Проверяет cardinality и оборачивает компонент в CardinalityWrapper при необходимости.
 * Добавляет Form.Item для полей без CardinalityWrapper (bool, ref).
 * @example
 * <PathField node={fieldNode} name={['blueprint_data', 'title']} readonly={false} />
 */
export const PathField: React.FC<PropsPathField> = ({ node, name, readonly, store }) => {
  const def = fieldRegistry[node.dataType];
  if (!def) {
    throw new Error(`Unknown dataType: ${node.dataType}`);
  }

  const props: FieldComponentProps = {
    node,
    name,
    readonly,
    store,
  };

  const label = node.label;
  const rules = getFormItemRulesFromNode(node);
  const fieldName = createFieldName(name, node.name);

  const fieldComponent = <def.Component {...props} />;
  const valuePropName = node.dataType === 'bool' ? 'checked' : undefined;
  // Для полей без CardinalityWrapper (bool, ref) добавляем Form.Item здесь
  if (node.dataType === 'bool' || node.dataType === 'ref') {
    return (
      <Form.Item name={fieldName} label={label} rules={rules} valuePropName={valuePropName}>
        {fieldComponent}
      </Form.Item>
    );
  }

  return (
    <CardinalityWrapper
      node={node}
      name={fieldName}
      readonly={readonly}
      label={label}
      rules={rules}
    >
      {() => fieldComponent}
    </CardinalityWrapper>
  );
};

import type React from 'react';
import { CardinalityWrapper } from '../components/CardinalityWrapper';
import type { SchemaFormStore } from '../SchemaFormStore';
import type { FieldNode } from '../types/formField';
import { createFieldName, getFieldPlaceholder, isFieldDisabled } from '../utils/fieldNodeUtils';
import { getFormItemRulesFromNode } from '../utils/getFormItemRulesFromNode';
import type { FieldComponentProps } from './fieldRegistry';
import { fieldRegistry } from './fieldRegistry';

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
  store: SchemaFormStore;
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

  const label = node.label;
  const rules = getFormItemRulesFromNode(node);
  const fieldName = createFieldName(name, node.name);
  const disabled = isFieldDisabled(node, readonly);
  const placeholder = getFieldPlaceholder(node);

  const props: FieldComponentProps = {
    node,
    name,
    readonly,
    store,
    disabled,
    placeholder,
  };

  const fieldComponent = <def.Component {...props} />;

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

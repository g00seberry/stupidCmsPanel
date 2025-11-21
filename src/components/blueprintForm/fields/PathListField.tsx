import { Form } from 'antd';
import type { Rule } from 'antd/es/form';
import type { FormListFieldData, FormListOperation } from 'antd/es/form/FormList';
import type React from 'react';

/**
 * Пропсы универсального компонента для полей с cardinality: many.
 */
export interface PropsPathListField {
  /** Имя поля в форме. */
  fieldName: string | number | (string | number)[];
  /** Метка поля (отображается только для первого элемента). */
  label: string;
  /** Правила валидации для каждого элемента списка. */
  rules?: Rule[];
  /** Флаг отключения редактирования. */
  disabled?: boolean;
  /** Функция рендера компонента для одного поля списка. */
  renderField: (field: FormListFieldData, disabled: boolean) => React.ReactNode;
  /** Функция рендера компонента для добавления нового элемента. */
  renderAddField: (add: FormListOperation['add']) => React.ReactNode;
}

/**
 * Универсальный компонент для рендеринга полей с множественным значением (cardinality: many).
 * Обеспечивает единообразную логику работы со списками полей через Form.List.
 */
export const PathListField: React.FC<PropsPathListField> = ({
  fieldName,
  label,
  rules,
  disabled = false,
  renderField,
  renderAddField,
}) => {
  return (
    <Form.List name={fieldName}>
      {(fields, { add }) => (
        <>
          {fields.map(({ key, name, ...restField }) => (
            <Form.Item
              key={key}
              {...restField}
              name={name}
              label={key === 0 ? label : ''}
              rules={rules}
              className={key === 0 ? '' : 'mb-2'}
            >
              {renderField({ key, name, ...restField }, disabled)}
            </Form.Item>
          ))}
          {!disabled && <Form.Item>{renderAddField(add)}</Form.Item>}
        </>
      )}
    </Form.List>
  );
};

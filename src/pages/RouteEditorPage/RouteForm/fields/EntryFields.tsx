import { Form, Input } from 'antd';
import type React from 'react';
import { entryIdRules, normalizeNumber } from '../validations';

/**
 * Поля формы для типа действия "entry".
 * Отображаются только когда action_type === 'entry'.
 */
export const EntryFields: React.FC = () => {
  return (
    <Form.Item
      name="entry_id"
      label="ID Entry"
      rules={entryIdRules}
      tooltip="Идентификатор записи CMS, которая будет использоваться для рендеринга маршрута"
      normalize={normalizeNumber}
    >
      <Input type="number" placeholder="5" min={1} />
    </Form.Item>
  );
};


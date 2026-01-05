import { Form, Input, Select } from 'antd';
import type React from 'react';
import { httpMethodOptions } from '../constants';
import { methodsRules, uriRules } from '../validations';

/**
 * Поля формы для типа узла "route" (маршрут).
 * Отображаются только когда kind === 'route'.
 */
export const RouteFields: React.FC = () => {
  return (
    <>
      <Form.Item
        name="uri"
        label="URI"
        rules={uriRules}
        tooltip="Путь маршрута, например: /about, /blog/{id}"
      >
        <Input placeholder="/about" maxLength={255} />
      </Form.Item>

      <Form.Item
        name="methods"
        label="HTTP методы"
        rules={methodsRules}
        tooltip="Выберите HTTP методы, которые будет обрабатывать этот маршрут"
      >
        <Select
          mode="multiple"
          placeholder="Выберите методы"
          options={httpMethodOptions}
          allowClear
        />
      </Form.Item>
    </>
  );
};


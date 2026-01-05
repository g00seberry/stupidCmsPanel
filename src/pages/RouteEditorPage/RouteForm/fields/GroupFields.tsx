import { Form, Input } from 'antd';
import type React from 'react';
import { groupFieldRules } from '../validations';

/**
 * Поля формы для типа узла "group" (группа маршрутов).
 * Отображаются только когда kind === 'group'.
 */
export const GroupFields: React.FC = () => {
  return (
    <>
      <Form.Item
        name="prefix"
        label="Префикс URI"
        rules={groupFieldRules}
        tooltip="Префикс, который будет добавлен к URI дочерних маршрутов"
      >
        <Input placeholder="blog" maxLength={255} />
      </Form.Item>

      <Form.Item
        name="domain"
        label="Домен"
        rules={groupFieldRules}
        tooltip="Домен, для которого будут работать дочерние маршруты"
      >
        <Input placeholder="example.com" maxLength={255} />
      </Form.Item>

      <Form.Item
        name="namespace"
        label="Namespace контроллеров"
        rules={groupFieldRules}
        tooltip="Namespace, который будет применён к контроллерам дочерних маршрутов"
      >
        <Input placeholder="App\\Http\\Controllers\\Admin" maxLength={255} />
      </Form.Item>
    </>
  );
};

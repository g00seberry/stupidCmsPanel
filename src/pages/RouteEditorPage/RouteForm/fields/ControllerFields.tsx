import { Form, Input } from 'antd';
import type React from 'react';
import { actionRules } from '../validations';

/**
 * Поля формы для типа действия "controller".
 * Отображаются только когда action_type === 'controller'.
 */
export const ControllerFields: React.FC = () => {
  return (
    <Form.Item
      name="action"
      label="Действие"
      rules={actionRules}
      tooltip="Формат: App\\Http\\Controllers\\Controller@method, view:pages.about, redirect:/path"
    >
      <Input placeholder="App\\Http\\Controllers\\AboutController@show" maxLength={255} />
    </Form.Item>
  );
};

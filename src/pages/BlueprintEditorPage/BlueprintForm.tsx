import { validateBlueprintCode } from '@/utils/blueprintValidation';
import { Form, Input } from 'antd';
import type { FormInstance } from 'antd/es/form';
import { SlugInput } from '../../components/SlugInput';

/**
 * Пропсы компонента формы Blueprint.
 */
export type PropsBlueprintForm = {
  /** Экземпляр формы Ant Design. */
  form: FormInstance;
  /** Флаг режима редактирования. */
  isEditMode?: boolean;
};

/**
 * Форма создания и редактирования Blueprint.
 * Включает валидацию через Zod схемы и отображение ошибок валидации из API.
 */
export const BlueprintForm: React.FC<PropsBlueprintForm> = ({ form, isEditMode = false }) => {
  const name = Form.useWatch('name', form);
  return (
    <Form form={form} layout="vertical">
      <Form.Item
        label="Название"
        name="name"
        rules={[
          { required: true, message: 'Название обязательно' },
          { max: 255, message: 'Максимум 255 символов' },
        ]}
      >
        <Input placeholder="Введите название Blueprint" />
      </Form.Item>

      <Form.Item
        label="Код"
        name="code"
        rules={[
          { required: true, message: 'Код обязателен' },
          {
            validator: (_rule, value) => {
              if (!value) return Promise.resolve();
              if (!validateBlueprintCode(value)) {
                return Promise.reject(new Error('Только a-z, 0-9 и _ (максимум 255 символов)'));
              }
              return Promise.resolve();
            },
          },
        ]}
        tooltip="Уникальный код Blueprint (URL-friendly строка). Только строчные буквы, цифры и подчёркивание."
      >
        <Input placeholder="Введите код Blueprint" disabled={isEditMode} />
      </Form.Item>

      <Form.Item
        label="Описание"
        name="description"
        rules={[{ max: 1000, message: 'Максимум 1000 символов' }]}
      >
        <Input.TextArea
          placeholder="Описание Blueprint (необязательно)"
          rows={4}
          showCount
          maxLength={1000}
        />
      </Form.Item>
    </Form>
  );
};

import { Form, Input } from 'antd';
import type { ZCreateBlueprintDto, ZUpdateBlueprintDto } from '@/types/blueprint';
import { useEffect } from 'react';
import type { FormInstance } from 'antd/es/form';
import { validateBlueprintCode, formatBlueprintCode } from '@/utils/blueprintValidation';

/**
 * Пропсы компонента формы Blueprint.
 */
export type PropsBlueprintForm = {
  /** Экземпляр формы Ant Design. */
  form: FormInstance<ZCreateBlueprintDto | ZUpdateBlueprintDto>;
  /** Начальные значения формы (для режима редактирования). */
  initialValues?: Partial<ZCreateBlueprintDto | ZUpdateBlueprintDto>;
  /** Обработчик отправки формы. */
  onSubmit?: (values: ZCreateBlueprintDto | ZUpdateBlueprintDto) => void;
  /** Флаг режима редактирования. */
  isEditMode?: boolean;
};

/**
 * Форма создания и редактирования Blueprint.
 * Включает валидацию через Zod схемы и отображение ошибок валидации из API.
 */
export const BlueprintForm: React.FC<PropsBlueprintForm> = ({
  form,
  initialValues,
  onSubmit,
  isEditMode = false,
}) => {
  useEffect(() => {
    if (initialValues) {
      form.setFieldsValue(initialValues);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialValues]);

  const handleFinish = (values: ZCreateBlueprintDto | ZUpdateBlueprintDto) => {
    onSubmit?.(values);
  };

  return (
    <Form form={form} layout="vertical" onFinish={handleFinish} initialValues={initialValues}>
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
          { required: !isEditMode, message: 'Код обязателен' },
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
        <Input
          placeholder="article"
          disabled={isEditMode}
          style={{ fontFamily: 'monospace' }}
          onChange={e => {
            if (!isEditMode) {
              const formatted = formatBlueprintCode(e.target.value);
              if (formatted !== e.target.value) {
                form.setFieldValue('code', formatted);
              }
            }
          }}
        />
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

import { Alert, Button, Form, Select, Space } from 'antd';
import { useForm } from 'antd/es/form/Form';
import { useEffect, useMemo } from 'react';

const filterOption = (input: string, option?: { label?: string; value?: number }) =>
  (option?.label ?? '').toLowerCase().includes(input.toLowerCase());

export type EmbedFormValues = {
  embedded_blueprint_id: number;
};

export type EmbeddableBlueprint = {
  id: number;
  code: string;
  name: string;
};

/**
 * Пропсы компонента формы встраивания Blueprint.
 */
export type PropsEmbedForm = {
  /** Список доступных Blueprint для встраивания. */
  embeddableBlueprints?: ReadonlyArray<EmbeddableBlueprint>;
  /** Обработчик подтверждения встраивания. */
  onOk: (values: EmbedFormValues) => Promise<void> | void;
  /** Обработчик отмены. */
  onCancel: () => void;
  /** Флаг состояния загрузки. */
  loading?: boolean;
};

/**
 * Форма для встраивания Blueprint в структуру Path.
 * Позволяет выбрать Blueprint, который будет встроен как readonly-структура.
 */
export const EmbedForm: React.FC<PropsEmbedForm> = ({
  embeddableBlueprints = [],
  onOk,
  onCancel,
  loading = false,
}) => {
  const [form] = useForm<EmbedFormValues>();
  useEffect(() => {
    form.resetFields();
  }, []);
  const blueprintOptions = useMemo(
    () =>
      embeddableBlueprints.map(bp => ({
        label: `${bp.name} (${bp.code})`,
        value: bp.id,
      })),
    [embeddableBlueprints]
  );

  return (
    <Form form={form} layout="vertical" onFinish={onOk}>
      <Form.Item
        label="Blueprint для встраивания"
        name="embedded_blueprint_id"
        rules={[{ required: true, message: 'Выберите Blueprint для встраивания' }]}
        tooltip="Выберите Blueprint, который нужно встроить как readonly-структуру."
      >
        <Select
          placeholder="Выберите Blueprint"
          showSearch
          filterOption={filterOption}
          options={blueprintOptions}
        />
      </Form.Item>

      <Alert
        message="Как работает встраивание"
        description="Поля встроенного Blueprint управляются только в источнике и становятся readonly. Здесь можно выбрать Blueprint и место встраивания, но редактировать его поля нельзя."
        type="info"
        showIcon
        className="mt-4"
      />

      <div className="mt-6 flex justify-end">
        <Space>
          <Button onClick={onCancel}>Отмена</Button>
          <Button type="primary" loading={loading} htmlType="submit">
            Встроить
          </Button>
        </Space>
      </div>
    </Form>
  );
};

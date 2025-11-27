import { Form, Select, Alert, Card } from 'antd';
import type { FormInstance } from 'antd/es/form';
import { useMemo } from 'react';

/**
 * Пропсы компонента формы встраивания Blueprint.
 */
export type PropsEmbedForm = {
  /** Экземпляр формы Ant Design. */
  form: FormInstance<{ embedded_blueprint_id: number }>;
  /** Список доступных Blueprint для встраивания. */
  embeddableBlueprints?: Array<{ id: number; code: string; name: string }>;
  /** Обработчик изменения выбранного Blueprint. */
  onBlueprintChange?: (blueprintId: number) => void;
};

/**
 * Форма для встраивания Blueprint в структуру Path.
 * Позволяет выбрать Blueprint, который будет встроен как readonly-структура.
 */
export const EmbedForm: React.FC<PropsEmbedForm> = ({
  form,
  embeddableBlueprints = [],
  onBlueprintChange,
}) => {
  const selectedBlueprintId = Form.useWatch<number | undefined>('embedded_blueprint_id', form);

  const selectedBlueprint = useMemo(
    () => embeddableBlueprints.find(bp => bp.id === selectedBlueprintId),
    [embeddableBlueprints, selectedBlueprintId]
  );

  const blueprintOptions = useMemo(
    () => embeddableBlueprints.map(bp => ({ label: `${bp.name} (${bp.code})`, value: bp.id })),
    [embeddableBlueprints]
  );

  const handleBlueprintChange = (value: number) => {
    onBlueprintChange?.(value);
  };

  return (
    <Form form={form} layout="vertical">
      <Form.Item
        label="Blueprint для встраивания"
        name="embedded_blueprint_id"
        rules={[{ required: true, message: 'Выберите Blueprint для встраивания' }]}
        tooltip="Выберите Blueprint, который нужно встроить как readonly-структуру."
      >
        <Select
          placeholder="Выберите Blueprint"
          showSearch
          filterOption={(input, option) =>
            (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
          }
          options={blueprintOptions}
          onChange={handleBlueprintChange}
        />
      </Form.Item>

      {selectedBlueprint && (
        <Card size="small" className="mb-4">
          <div className="text-sm">
            <div>
              <strong>Выбранный Blueprint:</strong> {selectedBlueprint.name}
            </div>
            <div className="text-muted-foreground mt-1">
              Код: <code>{selectedBlueprint.code}</code>
            </div>
          </div>
        </Card>
      )}

      <Alert
        message="Как работает встраивание"
        description="Поля встроенного Blueprint управляются только в источнике и становятся readonly. Здесь можно выбрать Blueprint и место встраивания, но редактировать его поля нельзя."
        type="info"
        showIcon
        className="mt-4"
      />
    </Form>
  );
};


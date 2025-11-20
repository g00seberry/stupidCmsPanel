import { Form, Input, Select, Radio, Checkbox, Alert, Card } from 'antd';
import type { FormInstance } from 'antd/es/form';
import type { ZCreatePathDto, ZUpdatePathDto, ZDataType } from '@/types/path';
import { zDataType } from '@/types/path';
import { useMemo, useCallback } from 'react';
import { validateFieldName } from '@/utils/blueprintValidation';

/**
 * Режим работы формы узла.
 */
export type NodeFormMode = 'create' | 'edit' | 'embed';

/**
 * Пропсы компонента формы узла графа.
 */
export type PropsNodeForm = {
  /** Экземпляр формы Ant Design. */
  form: FormInstance<ZCreatePathDto | ZUpdatePathDto | { embedded_blueprint_id: number }>;
  /** Режим работы формы. */
  mode: NodeFormMode;
  /** Родительский узел (для вычисления full_path). */
  parentPath?: { id: number; full_path: string };
  /** Вычисленный full_path для предпросмотра. */
  computedFullPath?: string;
  /** Флаг readonly узла (для блокировки редактирования). */
  isReadonly?: boolean;
  /** Информация об исходном Blueprint (для readonly узлов). */
  sourceBlueprint?: { id: number; name: string; code: string };
  /** Обработчик изменения имени (для пересчёта full_path). */
  onNameChange?: (name: string) => void;
  /** Список Blueprint, доступных для встраивания (для режима embed). */
  embeddableBlueprints?: Array<{ id: number; code: string; name: string }>;
  /** Обработчик изменения выбранного Blueprint (для режима embed). */
  onBlueprintChange?: (blueprintId: number) => void;
};

/**
 * Форма создания и редактирования узла схемы Blueprint.
 * Поддерживает три режима: создание простого поля, создание JSON группы и встраивание Blueprint.
 */
export const NodeForm: React.FC<PropsNodeForm> = ({
  form,
  mode,
  computedFullPath,
  isReadonly = false,
  sourceBlueprint,
  onNameChange,
  embeddableBlueprints = [],
  onBlueprintChange,
}) => {
  const dataType = Form.useWatch('data_type', form);
  const selectedBlueprintId = Form.useWatch('embedded_blueprint_id', form);

  const dataTypeOptions = useMemo(
    () =>
      zDataType.options.map(type => ({
        label: getDataTypeLabel(type),
        value: type,
      })),
    []
  );

  const selectedBlueprint = useMemo(
    () => embeddableBlueprints.find(bp => bp.id === selectedBlueprintId),
    [embeddableBlueprints, selectedBlueprintId]
  );

  const handleBlueprintChange = useCallback(
    (value: number) => {
      onBlueprintChange?.(value);
    },
    [onBlueprintChange]
  );

  if (isReadonly && mode === 'edit') {
    return (
      <div>
        <Alert
          message="Редактирование недоступно"
          description={
            <div>
              <p>
                Это поле скопировано из Blueprint &quot;{sourceBlueprint?.name || 'Неизвестный'}
                &quot;.
              </p>
              <p className="mt-2">Чтобы изменить структуру, перейдите к исходному Blueprint.</p>
              <p className="mt-2 text-sm text-muted-foreground">
                Примечание: Вы можете записывать данные в это поле, но не можете изменить его тип
                или настройки.
              </p>
            </div>
          }
          type="warning"
          showIcon
        />
      </div>
    );
  }

  return (
    <Form form={form} layout="vertical">
      {mode === 'embed' ? (
        <>
          <Form.Item
            label="Blueprint для встраивания"
            name="embedded_blueprint_id"
            rules={[{ required: true, message: 'Выберите Blueprint для встраивания' }]}
            tooltip="Выберите Blueprint, который будет встроен в текущий Blueprint."
          >
            <Select
              placeholder="Выберите Blueprint"
              showSearch
              filterOption={(input, option) =>
                (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
              }
              options={embeddableBlueprints.map(bp => ({
                label: `${bp.name} (${bp.code})`,
                value: bp.id,
              }))}
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
            message="Внимание"
            description="При встраивании все поля выбранного Blueprint будут скопированы в текущий Blueprint как readonly. Изменить их структуру можно только в исходном Blueprint."
            type="info"
            showIcon
            className="mt-4"
          />
        </>
      ) : (
        <>
          <Form.Item
            label="Имя поля"
            name="name"
            rules={[
              { required: true, message: 'Имя поля обязательно' },
              {
                validator: (_rule, value) => {
                  if (!value) return Promise.resolve();
                  if (!validateFieldName(value)) {
                    return Promise.reject(new Error('Только a-z, 0-9 и _ (максимум 255 символов)'));
                  }
                  return Promise.resolve();
                },
              },
            ]}
            tooltip="Имя поля должно быть уникальным на уровне родительского узла."
          >
            <Input
              placeholder="field_name"
              disabled={isReadonly}
              onChange={e => {
                onNameChange?.(e.target.value);
              }}
              style={{ fontFamily: 'monospace' }}
            />
          </Form.Item>

          {computedFullPath && (
            <div className="mb-4 p-2 bg-muted rounded text-sm">
              <strong>Полный путь:</strong> <code className="font-mono">{computedFullPath}</code>
            </div>
          )}

          <Form.Item
            label="Тип данных"
            name="data_type"
            rules={[{ required: true, message: 'Выберите тип данных' }]}
          >
            <Select
              placeholder="Выберите тип данных"
              options={dataTypeOptions}
              disabled={isReadonly || mode === 'edit'}
            />
          </Form.Item>
        </>
      )}

      {dataType && dataType !== 'json' && (
        <>
          <Form.Item
            label="Мощность"
            name="cardinality"
            initialValue="one"
            tooltip="Определяет, может ли поле содержать одно значение или множество."
          >
            <Radio.Group disabled={isReadonly}>
              <Radio value="one">Одно значение</Radio>
              <Radio value="many">Множество</Radio>
            </Radio.Group>
          </Form.Item>

          <Form.Item
            label="Настройки"
            name="is_required"
            valuePropName="checked"
            initialValue={false}
          >
            <Checkbox disabled={isReadonly}>Обязательное поле</Checkbox>
          </Form.Item>

          <Form.Item name="is_indexed" valuePropName="checked" initialValue={false}>
            <Checkbox disabled={isReadonly}>
              Индексировать для поиска
              <span className="text-xs text-muted-foreground ml-2">
                (создаст индекс для быстрого поиска по этому полю)
              </span>
            </Checkbox>
          </Form.Item>
        </>
      )}

      {dataType === 'json' && (
        <Form.Item
          label="Мощность"
          name="cardinality"
          initialValue="one"
          tooltip="JSON группа может содержать дочерние поля."
        >
          <Radio.Group disabled={isReadonly}>
            <Radio value="one">Одно значение</Radio>
            <Radio value="many">Множество</Radio>
          </Radio.Group>
        </Form.Item>
      )}
    </Form>
  );
};

/**
 * Возвращает человекочитаемое название типа данных.
 */
const getDataTypeLabel = (type: ZDataType): string => {
  const labels: Record<ZDataType, string> = {
    string: 'Строка',
    text: 'Текст',
    int: 'Целое число',
    float: 'Число с плавающей точкой',
    bool: 'Логическое значение',
    date: 'Дата',
    datetime: 'Дата и время',
    json: 'JSON группа',
    ref: 'Ссылка',
  };
  return labels[type];
};

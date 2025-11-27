import { Form, Input, Select, Radio, Checkbox, Alert, Card } from 'antd';
import type { FormInstance } from 'antd/es/form';
import type { ZCreatePathDto, ZUpdatePathDto, ZDataType } from '@/types/path';
import { zDataType } from '@/types/path';
import { useMemo, useCallback } from 'react';
import { validateFieldName } from '@/utils/blueprintValidation';

export type NodeFormMode = 'create' | 'edit' | 'embed';

export type PropsNodeForm = {
  form: FormInstance<ZCreatePathDto | ZUpdatePathDto | { embedded_blueprint_id: number }>;
  mode: NodeFormMode;
  parentPath?: { id: number; full_path: string };
  computedFullPath?: string;
  isReadonly?: boolean;
  sourceBlueprint?: { id: number; name: string; code: string };
  onNameChange?: (name: string) => void;
  embeddableBlueprints?: Array<{ id: number; code: string; name: string }>;
  onBlueprintChange?: (blueprintId: number) => void;
};

const DATA_TYPE_LABELS: Record<ZDataType, string> = {
  string: 'Строка',
  text: 'Текст',
  int: 'Целое число',
  float: 'Число с плавающей точкой',
  bool: 'Булево',
  date: 'Дата',
  datetime: 'Дата и время',
  json: 'JSON-объект',
  ref: 'Ссылка',
};

const CARDINALITY_OPTIONS = [
  { label: 'Одно значение', value: 'one' },
  { label: 'Массив значений', value: 'many' },
];

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
  const dataType = Form.useWatch<ZDataType | undefined>('data_type', form);
  const selectedBlueprintId = Form.useWatch<number | undefined>('embedded_blueprint_id', form);
  const isReadonlyEdit = isReadonly && mode === 'edit';

  const dataTypeOptions = useMemo(
    () =>
      zDataType.options.map(type => ({
        label: DATA_TYPE_LABELS[type],
        value: type,
      })),
    []
  );

  const selectedBlueprint = useMemo(
    () => embeddableBlueprints.find(bp => bp.id === selectedBlueprintId),
    [embeddableBlueprints, selectedBlueprintId]
  );

  const blueprintOptions = useMemo(
    () => embeddableBlueprints.map(bp => ({ label: `${bp.name} (${bp.code})`, value: bp.id })),
    [embeddableBlueprints]
  );

  const handleBlueprintChange = useCallback(
    (value: number) => {
      onBlueprintChange?.(value);
    },
    [onBlueprintChange]
  );

  const renderComputedFullPath = () => {
    if (!computedFullPath) return null;
    return (
      <div className="mb-4 p-2 bg-muted rounded text-sm">
        <strong>Полный путь:</strong> <code className="font-mono">{computedFullPath}</code>
      </div>
    );
  };

  const renderCardinality = () => (
    <Form.Item
      label="Кардинальность"
      name="cardinality"
      initialValue="one"
      tooltip="Определяет, может ли у поля быть одно значение или массив значений."
    >
      <Radio.Group disabled={isReadonly}>
        {CARDINALITY_OPTIONS.map(option => (
          <Radio key={option.value} value={option.value}>
            {option.label}
          </Radio>
        ))}
      </Radio.Group>
    </Form.Item>
  );

  if (isReadonlyEdit) {
    return (
      <div>
        <Alert
          message="Поле доступно только для чтения"
          description={
            <div>
              <p>
                Изменения нужно вносить в исходном Blueprint &quot;
                {sourceBlueprint?.name || 'неизвестно'}&quot;.
              </p>
              <p className="mt-2">
                Здесь поле заблокировано, потому что управляется составным Blueprint.
              </p>
              <p className="mt-2 text-sm text-muted-foreground">
                Обновите структуру в исходном Blueprint и заново встройте его, чтобы увидеть
                изменения.
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
        </>
      ) : (
        <>
          <Form.Item
            label="Имя поля"
            name="name"
            rules={[
              { required: true, message: 'Укажите имя поля' },
              {
                validator: (_rule, value) => {
                  if (!value) return Promise.resolve();
                  if (!validateFieldName(value)) {
                    return Promise.reject(
                      new Error('Допустимы символы a-z, 0-9 и _ (не длиннее 255)')
                    );
                  }
                  return Promise.resolve();
                },
              },
            ]}
            tooltip="Имя поля используется в схемах и API, поэтому допускаются только символы a-z, 0-9 и _."
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

          {renderComputedFullPath()}

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

      {dataType && renderCardinality()}

      {dataType && dataType !== 'json' && (
        <Form.Item name="is_indexed" valuePropName="checked" initialValue={false}>
          <Checkbox disabled={isReadonly}>
            Индексировать поле
            <span className="text-xs text-muted-foreground ml-2">
              (ускоряет поиск, но требует точного значения поля)
            </span>
          </Checkbox>
        </Form.Item>
      )}
    </Form>
  );
};

import { Form, Input, Select, Radio, Checkbox, Alert } from 'antd';
import type { FormInstance } from 'antd/es/form';
import type { ZCreatePathDto, ZUpdatePathDto, ZDataType } from '@/types/path';
import { zDataType } from '@/types/path';
import { useMemo } from 'react';
import { validateFieldName } from '@/utils/blueprintValidation';

export type PropsNodeForm = {
  form: FormInstance<ZCreatePathDto | ZUpdatePathDto>;
  mode: 'create' | 'edit';
  parentPath?: { id: number; full_path: string };
  computedFullPath?: string;
  isReadonly?: boolean;
  sourceBlueprint?: { id: number; name: string; code: string };
  onNameChange?: (name: string) => void;
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
}) => {
  const dataType = Form.useWatch<ZDataType | undefined>('data_type', form);
  const isReadonlyEdit = isReadonly && mode === 'edit';

  const dataTypeOptions = useMemo(
    () =>
      zDataType.options.map(type => ({
        label: DATA_TYPE_LABELS[type],
        value: type,
      })),
    []
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
      <Form.Item
        label="Имя поля"
        name="name"
        rules={[
          { required: true, message: 'Укажите имя поля' },
          {
            validator: (_rule, value) => {
              if (!value) return Promise.resolve();
              if (!validateFieldName(value)) {
                return Promise.reject(new Error('Допустимы символы a-z, 0-9 и _ (не длиннее 255)'));
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

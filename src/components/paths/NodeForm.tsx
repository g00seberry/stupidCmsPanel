import type { ZDataType } from '@/types/path';
import { zDataType } from '@/types/path';
import { validateFieldName } from '@/utils/blueprintValidation';
import { Checkbox, Form, Input, Radio, Select } from 'antd';
import { useMemo } from 'react';

export type PropsNodeForm = {
  mode: 'create' | 'edit';
  dataType?: ZDataType;
  fullPath?: string;
  isReadonly?: boolean;
};

const DATA_TYPE_LABELS: Record<ZDataType, string> = {
  string: 'Строка',
  text: 'Текст',
  int: 'Целое число',
  float: 'Число с плавающей точкой',
  bool: 'Булево',
  datetime: 'Дата и время',
  json: 'JSON-объект',
  ref: 'Ссылка',
};

const CARDINALITY_OPTIONS = [
  { label: 'Одно значение', value: 'one' },
  { label: 'Массив значений', value: 'many' },
];

export const NodeForm: React.FC<PropsNodeForm> = ({
  dataType,
  mode,
  fullPath,
  isReadonly = false,
}) => {
  const dataTypeOptions = useMemo(
    () =>
      zDataType.options.map(type => ({
        label: DATA_TYPE_LABELS[type],
        value: type,
      })),
    []
  );

  const renderComputedFullPath = () => {
    if (!fullPath) return null;
    return (
      <div className="mb-4 p-2 bg-muted rounded text-sm">
        <strong>Полный путь:</strong> <code className="font-mono">{fullPath}</code>
      </div>
    );
  };

  const renderCardinality = () => (
    <Form.Item
      label="Кардинальность"
      name="cardinality"
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

  return (
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
                return Promise.reject(new Error('Допустимы символы a-z, 0-9 и _ (не длиннее 255)'));
              }
              return Promise.resolve();
            },
          },
        ]}
        tooltip="Имя поля используется в схемах и API, поэтому допускаются только символы a-z, 0-9 и _."
      >
        <Input placeholder="field_name" disabled={isReadonly} style={{ fontFamily: 'monospace' }} />
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
        <Form.Item name="is_indexed" valuePropName="checked">
          <Checkbox disabled={isReadonly}>
            Индексировать поле
            <span className="text-xs text-muted-foreground ml-2">
              (ускоряет поиск, но требует точного значения поля)
            </span>
          </Checkbox>
        </Form.Item>
      )}
    </>
  );
};

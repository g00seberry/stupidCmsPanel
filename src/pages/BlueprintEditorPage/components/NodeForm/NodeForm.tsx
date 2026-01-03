import { zDataType, type ZDataType, type ZPath } from '@/types/path/path';
import { validateFieldName } from '@/utils/blueprintValidation';
import { Checkbox, Form, Input, Select, Switch, type FormInstance } from 'antd';
import { observer } from 'mobx-react-lite';
import type React from 'react';
import { useEffect } from 'react';
import { ConstraintsForm } from './components/constraints/ConstraintsForm';
import { ValidationEditor } from './ValidationEditor';

const validateName = (_rule: unknown, value: string) => {
  if (!value) return Promise.resolve();
  if (!validateFieldName(value)) {
    return Promise.reject(new Error('Допустимы символы a-z, 0-9 и _ (не длиннее 255)'));
  }
  return Promise.resolve();
};

const DATA_TYPE_LABELS: Record<ZDataType, string> = {
  string: 'Строка',
  text: 'Текст',
  int: 'Целое число',
  float: 'Число с плавающей точкой',
  bool: 'Булево',
  datetime: 'Дата и время',
  json: 'JSON-объект',
  ref: 'Ссылка на entry',
  media: 'Медиа файл',
};

const dataTypeOptions = zDataType.options.map(type => ({
  label: DATA_TYPE_LABELS[type],
  value: type,
}));

type PropsNodeForm = { path?: ZPath; form: FormInstance };

export const NodeForm: React.FC<PropsNodeForm> = observer(({ path, form }) => {
  const isReadonly = !!path?.source_blueprint_id;
  const dataType = Form.useWatch('data_type', form);
  const isNew = !path;

  useEffect(() => {
    form.setFieldsValue(path);
  }, [path, form]);

  return (
    <Form form={form} layout="vertical">
      <Form.Item
        label="Имя поля"
        name="name"
        rules={[{ required: true, message: 'Укажите имя поля' }, { validator: validateName }]}
        tooltip="Имя поля используется в схемах и API, поэтому допускаются только символы a-z, 0-9 и _."
      >
        <Input placeholder="field_name" disabled={isReadonly} />
      </Form.Item>

      <Form.Item
        label="Тип данных"
        name="data_type"
        rules={isNew ? [{ required: true, message: 'Выберите тип данных' }] : []}
      >
        <Select
          placeholder="Выберите тип данных"
          options={dataTypeOptions}
          disabled={isReadonly || !isNew}
        />
      </Form.Item>

      <ConstraintsForm dataType={dataType} disabled={isReadonly} />

      <Form.Item
        label="Массив"
        name="cardinality"
        valuePropName="checked"
        getValueFromEvent={(checked: boolean) => (checked ? 'many' : 'one')}
        getValueProps={(value: 'one' | 'many') => ({
          checked: value === 'many',
        })}
        tooltip="Включите, если поле должно содержать массив значений, а не одно значение."
      >
        <Switch disabled={isReadonly || !isNew} checkedChildren="Да" unCheckedChildren="Нет" />
      </Form.Item>

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

      <Form.Item label="Правила валидации" name="validation_rules">
        <ValidationEditor />
      </Form.Item>
    </Form>
  );
});

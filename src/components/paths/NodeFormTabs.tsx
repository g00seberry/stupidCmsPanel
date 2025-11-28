import { NodeForm } from '@/components/paths/NodeForm';
import { ReadonlyAlert } from '@/components/paths/ReadonlyAlert';
import { ValidationRulesFormV2 } from '@/components/paths/ValidationRulesFormV2';
import type {
  ZCardinality,
  ZCreatePathDto,
  ZDataType,
  ZPath,
  ZSourceBlueprint,
  ZUpdatePathDto,
} from '@/types/path';
import { Button, Form, Space, Tabs } from 'antd';
import { useMemo } from 'react';

export type PropsNodeFormTabs = {
  /** Режим формы: создание или редактирование. */
  mode: 'create' | 'edit';
  /** Родительский путь (для создания дочернего элемента). */
  wayToRoot?: ZPath[];
  /** Флаг блокировки формы. */
  disabled?: boolean;
  /** Исходный Blueprint (для встроенных полей). */
  sourceBlueprint?: ZSourceBlueprint;
  /** Начальные значения формы. */
  initialValues?: Partial<ZCreatePathDto | ZUpdatePathDto>;
  /** Обработчик сохранения формы. */
  onOk: (values: ZCreatePathDto | ZUpdatePathDto) => Promise<void> | void;
  /** Обработчик отмены. */
  onCancel: () => void;
  /** Флаг состояния загрузки. */
  loading?: boolean;
};

/**
 * Компонент формы редактирования/создания Path с вкладками.
 * Управляет формой внутри и предоставляет интерфейс с вкладками "Основное" и "Валидация".
 */
export const NodeFormTabs: React.FC<PropsNodeFormTabs> = ({
  mode,
  wayToRoot,
  sourceBlueprint,
  initialValues,
  onOk,
  onCancel,
  loading = false,
  disabled = false,
}) => {
  const [form] = Form.useForm<ZCreatePathDto | ZUpdatePathDto>();
  const dataType = Form.useWatch<ZDataType | undefined>('data_type', form);
  const cardinality = Form.useWatch<ZCardinality | undefined>('cardinality', form);
  const name = Form.useWatch<string | undefined>('name', form);
  const isReadonly = mode === 'edit' && sourceBlueprint;

  const fullPath = useMemo(() => {
    const fullWay = wayToRoot?.reverse().map(path => path.name) ?? [];
    if (mode === 'edit') {
      fullWay.pop();
      fullWay.push(name ?? '');
    }
    return fullWay.join('.');
  }, [wayToRoot, mode, name]);

  const handleCancel = () => {
    form.resetFields();
    onCancel();
  };

  const tabItems = useMemo(
    () => [
      {
        key: 'basic',
        label: 'Основное',
        children: (
          <>
            {isReadonly && <ReadonlyAlert sourceBlueprint={sourceBlueprint} />}
            <NodeForm dataType={dataType} mode={mode} fullPath={fullPath} />
          </>
        ),
      },
      {
        key: 'validation',
        label: 'Валидация',
        children: (
          <ValidationRulesFormV2
            form={form}
            dataType={dataType}
            cardinality={cardinality}
            isReadonly={!!isReadonly}
          />
        ),
      },
    ],
    [form, mode, fullPath, sourceBlueprint, dataType, cardinality, isReadonly]
  );

  return (
    <Form
      form={form}
      layout="vertical"
      onFinish={onOk}
      initialValues={initialValues}
      disabled={disabled}
    >
      <Tabs items={tabItems} />
      <div className="mt-6 flex justify-end">
        <Space>
          <Button onClick={handleCancel}>Отмена</Button>
          <Button type="primary" loading={loading} htmlType="submit">
            {mode === 'edit' ? 'Сохранить' : 'Создать'}
          </Button>
        </Space>
      </div>
    </Form>
  );
};

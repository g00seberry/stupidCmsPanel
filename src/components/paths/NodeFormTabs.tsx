import { NodeForm } from '@/components/paths/NodeForm';
import { ValidationRulesForm } from '@/components/paths/ValidationRulesForm';
import type { ZCardinality, ZCreatePathDto, ZDataType, ZPath, ZUpdatePathDto } from '@/types/path';
import { Button, Form, Space, Tabs } from 'antd';
import { useMemo } from 'react';

export type PropsNodeFormTabs = {
  /** Режим формы: создание или редактирование. */
  mode: 'create' | 'edit';
  /** Родительский путь (для создания дочернего элемента). */
  wayToRoot?: ZPath[];

  disabled?: boolean;
  /** Исходный Blueprint (для встроенных полей). */
  sourceBlueprint?: { id: number; name: string; code: string };
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

  const fullPath = useMemo(() => {
    const fullWay = wayToRoot?.reverse().map(path => path.name) ?? [];
    if (mode === 'edit') {
      fullWay.pop();
      fullWay.push(name ?? '');
    }
    return fullWay.join('.');
  }, [wayToRoot, mode, name]);

  const showValidationTab = dataType !== 'json';

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
          <NodeForm
            dataType={dataType}
            mode={mode}
            fullPath={fullPath}
            sourceBlueprint={sourceBlueprint}
          />
        ),
      },
      ...(showValidationTab
        ? [
            {
              key: 'validation',
              label: 'Валидация',
              children: (
                <ValidationRulesForm form={form} dataType={dataType} cardinality={cardinality} />
              ),
            },
          ]
        : []),
    ],
    [form, mode, fullPath, sourceBlueprint, showValidationTab, dataType, cardinality]
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

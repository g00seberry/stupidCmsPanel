import { NodeForm } from '@/components/paths/NodeForm';
import { ValidationRulesForm } from '@/components/paths/ValidationRulesForm';
import type { ZCreatePathDto, ZDataType, ZPath, ZUpdatePathDto } from '@/types/path';
import { setFormValidationErrors } from '@/utils/blueprintFormErrors';
import { Button, Form, Space, Tabs } from 'antd';
import type { AxiosError } from 'axios';
import { useMemo } from 'react';

export type PropsNodeFormTabs = {
  /** Режим формы: создание или редактирование. */
  mode: 'create' | 'edit';
  /** Родительский путь (для создания дочернего элемента). */
  wayToRoot?: ZPath[];
  /** Флаг только для чтения (для встроенных полей). */
  isReadonly?: boolean;
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
  isReadonly = false,
  sourceBlueprint,
  initialValues,
  onOk,
  onCancel,
  loading = false,
}) => {
  const [form] = Form.useForm<ZCreatePathDto | ZUpdatePathDto>();
  const dataType = Form.useWatch<ZDataType | undefined>('data_type', form);
  const cardinality = Form.useWatch<'one' | 'many' | undefined>('cardinality', form);
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
  console.log(wayToRoot);
  const handleFinish = async (values: ZCreatePathDto | ZUpdatePathDto) => {
    try {
      await onOk(values);
    } catch (error: any) {
      if (error && typeof error === 'object' && 'response' in error) {
        setFormValidationErrors(error as AxiosError, form);
      }
      throw error;
    }
  };

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
            isReadonly={isReadonly}
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
                <ValidationRulesForm
                  form={form}
                  dataType={dataType}
                  cardinality={cardinality}
                  isReadonly={isReadonly}
                />
              ),
            },
          ]
        : []),
    ],
    [form, mode, fullPath, isReadonly, sourceBlueprint, showValidationTab, dataType, cardinality]
  );

  return (
    <Form form={form} layout="vertical" onFinish={handleFinish} initialValues={initialValues}>
      <Tabs items={tabItems} />
      <div className="mt-6 flex justify-end">
        <Space>
          <Button onClick={handleCancel}>Отмена</Button>
          <Button
            type="primary"
            loading={loading}
            htmlType="submit"
            disabled={isReadonly && mode === 'edit'}
          >
            {mode === 'edit' ? 'Сохранить' : 'Создать'}
          </Button>
        </Space>
      </div>
    </Form>
  );
};

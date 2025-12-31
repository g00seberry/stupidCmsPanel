import { NodeForm } from '@/components/paths/NodeForm';
import { ReadonlyAlert } from '@/components/paths/ReadonlyAlert';
import { ValidationRulesFormV2 } from '@/components/paths/ValidationRulesFormV2';
import { ValidationRulesStore } from '@/components/paths/ValidationRulesFormV2/ValidationRulesStore';
import type {
  ZCardinality,
  ZCreatePathDto,
  ZDataType,
  ZPath,
  ZSourceBlueprint,
  ZUpdatePathDto,
} from '@/types/path/path';
import { Button, Form, Space, Tabs } from 'antd';
import { observer } from 'mobx-react-lite';
import { useEffect, useMemo, useState } from 'react';

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
export const NodeFormTabs: React.FC<PropsNodeFormTabs> = observer(
  ({
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
    const [validationRulesStore] = useState(() => new ValidationRulesStore());
    const dataType = Form.useWatch<ZDataType | undefined>('data_type', form);
    const cardinality = Form.useWatch<ZCardinality | undefined>('cardinality', form);
    const name = Form.useWatch<string | undefined>('name', form);
    const isReadonly = mode === 'edit' && sourceBlueprint;

    // Инициализация стора из initialValues
    useEffect(() => {
      if (initialValues?.validation_rules) {
        validationRulesStore.init(initialValues.validation_rules);
      }
    }, [initialValues?.validation_rules, validationRulesStore]);

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

    /**
     * Подготавливает данные для сохранения, собирая их из стора и формы.
     * Устанавливает validation_rules из стора в форму перед сохранением.
     */
    const prepareSave = (values: ZCreatePathDto | ZUpdatePathDto) => {
      const validationRules = validationRulesStore.getRulesForSave();
      return {
        ...values,
        validation_rules: validationRules,
      };
    };

    const handleFinish = (values: ZCreatePathDto | ZUpdatePathDto) => {
      const finalValues = prepareSave(values);
      onOk(finalValues);
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
              store={validationRulesStore}
              dataType={dataType}
              cardinality={cardinality}
              isReadonly={!!isReadonly}
            />
          ),
        },
      ],
      [validationRulesStore, mode, fullPath, sourceBlueprint, dataType, cardinality, isReadonly]
    );

    return (
      <Form
        form={form}
        layout="vertical"
        onFinish={handleFinish}
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
  }
);

import { Modal, Button, Form, Tabs } from 'antd';
import type { FormInstance } from 'antd/es/form';
import { useState, useEffect } from 'react';
import { NodeForm, type PropsNodeForm } from './NodeForm';
import { ValidationRulesForm } from './ValidationRulesForm';
import type { ZCreatePathDto, ZUpdatePathDto, ZDataType } from '@/types/path';
import { zCreatePathDto, zUpdatePathDto } from '@/types/path';
import { normalizeValidationRulesForApi } from '@/utils/validationRules';
import { setFormValidationErrors } from '@/utils/blueprintFormErrors';
import { normalizeFormInitialValues, buildFullPath } from '@/components/paths/utils/nodeFormUtils';
import type { AxiosError } from 'axios';

export type PropsNodeFormModal = Omit<PropsNodeForm, 'form' | 'mode'> & {
  open: boolean;
  title?: string;
  mode: 'create' | 'edit';
  onCancel: () => void;
  onOk: (values: ZCreatePathDto | ZUpdatePathDto) => Promise<void> | void;
  initialValues?: Partial<ZCreatePathDto | ZUpdatePathDto>;
  loading?: boolean;
  fullPath?: string;
};

type FormValues = ZCreatePathDto | ZUpdatePathDto;

/**
 * Модальное окно для создания или редактирования поля Path в Blueprint.
 * Содержит вкладки с основной информацией и правилами валидации.
 */
export const NodeFormModal: React.FC<PropsNodeFormModal> = ({
  open,
  title,
  onCancel,
  onOk,
  loading = false,
  mode,
  computedFullPath,
  isReadonly,
  sourceBlueprint,
  onNameChange,
  fullPath,
  parentPath,
  initialValues,
}) => {
  const [form] = Form.useForm<FormValues>();
  const [displayedFullPath, setDisplayedFullPath] = useState<string | undefined>(
    computedFullPath ?? fullPath
  );

  const dataType = Form.useWatch<ZDataType | undefined>('data_type', form);
  const cardinality = Form.useWatch<'one' | 'many' | undefined>('cardinality', form);

  const showValidationTab = dataType !== 'json';

  const normalizedInitialValues = normalizeFormInitialValues(initialValues, mode);

  useEffect(() => {
    if (!open) return;
    form.resetFields();
    form.setFieldsValue(normalizedInitialValues);
    const pathToDisplay =
      mode === 'edit'
        ? (fullPath ?? computedFullPath)
        : buildFullPath((normalizedInitialValues as Partial<ZCreatePathDto>).name, parentPath);
    setDisplayedFullPath(pathToDisplay);
  }, [computedFullPath, form, fullPath, mode, normalizedInitialValues, open, parentPath]);

  const handleNameChange = (name: string) => {
    setDisplayedFullPath(buildFullPath(name, parentPath));
    onNameChange?.(name);
  };

  const handleOk = async () => {
    try {
      const values = await form.validateFields();
      const pathValues = values as ZCreatePathDto | ZUpdatePathDto;
      const normalizedValues = {
        ...pathValues,
        validation_rules: normalizeValidationRulesForApi(pathValues.validation_rules),
      };
      const validatedValues =
        mode === 'edit'
          ? zUpdatePathDto.parse(normalizedValues)
          : zCreatePathDto.parse(normalizedValues);
      await onOk(validatedValues);
      form.resetFields();
      setDisplayedFullPath(mode === 'edit' ? fullPath : undefined);
    } catch (error: any) {
      if (error?.errorFields) return;
      if (error && typeof error === 'object' && 'response' in error) {
        if (setFormValidationErrors(error as AxiosError, form)) return;
      }
      console.error(error);
    }
  };

  const handleCancel = () => {
    form.resetFields();
    setDisplayedFullPath(mode === 'edit' ? fullPath : undefined);
    onCancel();
  };

  const modalTitle = title || (mode === 'edit' ? 'Редактирование поля' : 'Создание поля');
  const buttonText = mode === 'edit' ? 'Сохранить' : 'Создать';

  const tabs = [
    {
      key: 'basic',
      label: 'Основное',
      children: (
        <NodeForm
          form={form as FormInstance<ZCreatePathDto | ZUpdatePathDto>}
          mode={mode}
          parentPath={parentPath}
          computedFullPath={displayedFullPath}
          isReadonly={isReadonly}
          sourceBlueprint={sourceBlueprint}
          onNameChange={handleNameChange}
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
  ];

  return (
    <Modal
      open={open}
      title={modalTitle}
      onCancel={handleCancel}
      footer={[
        <Button key="cancel" onClick={handleCancel}>
          Отмена
        </Button>,
        <Button
          key="submit"
          type="primary"
          loading={loading}
          onClick={() => {
            void handleOk();
          }}
          disabled={isReadonly && mode === 'edit'}
        >
          {buttonText}
        </Button>,
      ]}
      width={600}
    >
      <Tabs items={tabs} />
    </Modal>
  );
};

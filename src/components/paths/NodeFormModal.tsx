import { Modal, Button, Form, Tabs } from 'antd';
import { useState, useEffect } from 'react';
import { NodeForm, type PropsNodeForm } from './NodeForm';
import { ValidationRulesForm } from './ValidationRulesForm';
import type { ZCreatePathDto, ZUpdatePathDto, ZDataType } from '@/types/path';
import { zCreatePathDto, zUpdatePathDto } from '@/types/path';
import { normalizeValidationRulesForApi } from '@/utils/validationRules';
import { setFormValidationErrors } from '@/utils/blueprintFormErrors';
import { normalizeFormInitialValues, buildFullPath } from '@/components/paths/utils/nodeFormUtils';
import type { AxiosError } from 'axios';

export type PropsNodeFormModal = Omit<PropsNodeForm, 'form'> & {
  open: boolean;
  title?: string;
  onCancel: () => void;
  onOk: (
    values: ZCreatePathDto | ZUpdatePathDto | { embedded_blueprint_id: number }
  ) => Promise<void> | void;
  initialValues?: Partial<ZCreatePathDto | ZUpdatePathDto | { embedded_blueprint_id: number }>;
  loading?: boolean;
  fullPath?: string;
};

type FormValues = ZCreatePathDto | ZUpdatePathDto | { embedded_blueprint_id: number };

/**
 * Модальное окно для создания, редактирования или встраивания поля Path в Blueprint.
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
  embeddableBlueprints,
  onBlueprintChange,
  initialValues,
}) => {
  const [form] = Form.useForm<FormValues>();
  const [displayedFullPath, setDisplayedFullPath] = useState<string | undefined>(
    computedFullPath ?? fullPath
  );

  const dataType = Form.useWatch<ZDataType | undefined>('data_type', form);
  const cardinality = Form.useWatch<'one' | 'many' | undefined>('cardinality', form);

  const showValidationTab = mode !== 'embed' && dataType !== 'json';

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
      if (mode === 'embed') {
        await onOk(values as { embedded_blueprint_id: number });
      } else {
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
      }
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

  const modalTitle =
    title ||
    (mode === 'edit'
      ? 'Редактирование поля'
      : mode === 'embed'
        ? 'Встраивание Blueprint'
        : 'Создание поля');
  const buttonText = mode === 'edit' ? 'Сохранить' : mode === 'embed' ? 'Встроить' : 'Создать';

  const tabs = [
    {
      key: 'basic',
      label: 'Основное',
      children: (
        <NodeForm
          form={form}
          mode={mode}
          parentPath={parentPath}
          computedFullPath={displayedFullPath}
          isReadonly={isReadonly}
          sourceBlueprint={sourceBlueprint}
          onNameChange={handleNameChange}
          embeddableBlueprints={embeddableBlueprints}
          onBlueprintChange={onBlueprintChange}
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

import { Modal, Button, Form, Tabs } from 'antd';
import { useState, useEffect, useMemo, useCallback } from 'react';
import { NodeForm, type PropsNodeForm } from './NodeForm';
import { ValidationRulesForm } from './ValidationRulesForm';
import type { ZCreatePathDto, ZUpdatePathDto, ZDataType } from '@/types/path';
import { zCreatePathDto, zUpdatePathDto } from '@/types/path';
import {
  normalizeValidationRulesForApi,
  normalizeValidationRulesForForm,
} from '@/utils/validationRules';
import { setFormValidationErrors } from '@/utils/blueprintFormErrors';
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

const DEFAULT_CREATE_VALUES: Partial<ZCreatePathDto> = {
  cardinality: 'one',
  is_indexed: false,
};

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

  const showValidationTab = useMemo(() => {
    if (mode === 'embed') return false;
    if (dataType === 'json') return false;
    return true;
  }, [mode, dataType]);

  const buildFullPath = useCallback(
    (name?: string) => {
      const trimmed = name?.trim();
      if (!trimmed) return undefined;
      return parentPath?.full_path ? `${parentPath.full_path}.${trimmed}` : trimmed;
    },
    [parentPath]
  );

  const normalizedInitialValues = useMemo<Partial<FormValues>>(() => {
    const baseDefaults = mode === 'create' ? DEFAULT_CREATE_VALUES : {};
    const initial = initialValues || {};

    // Нормализуем validation_rules для формы
    let normalizedValidationRules: any = undefined;
    if (
      'validation_rules' in initial &&
      initial.validation_rules !== null &&
      initial.validation_rules !== undefined
    ) {
      normalizedValidationRules = normalizeValidationRulesForForm(initial.validation_rules as any);
    }

    const result: any = {
      ...baseDefaults,
      ...initial,
    };

    // Устанавливаем validation_rules только если оно есть или было явно передано
    if (normalizedValidationRules !== undefined) {
      result.validation_rules = normalizedValidationRules;
    } else if ('validation_rules' in initial) {
      // Если validation_rules было явно передано как null/undefined, устанавливаем его
      result.validation_rules = initial.validation_rules;
    }

    return result as Partial<FormValues>;
  }, [initialValues, mode]);

  useEffect(() => {
    if (!open) return;
    form.resetFields();
    form.setFieldsValue(normalizedInitialValues);
    if (mode === 'edit' && (fullPath || computedFullPath)) {
      setDisplayedFullPath(fullPath ?? computedFullPath);
      return;
    }
    const initialName = (normalizedInitialValues as Partial<ZCreatePathDto>).name;
    setDisplayedFullPath(buildFullPath(initialName));
  }, [buildFullPath, computedFullPath, form, fullPath, mode, normalizedInitialValues, open]);

  const handleNameChange = useCallback(
    (name: string) => {
      setDisplayedFullPath(buildFullPath(name));
      onNameChange?.(name);
    },
    [buildFullPath, onNameChange]
  );

  const handleOk = async () => {
    try {
      const values = await form.validateFields();
      if (mode === 'embed') {
        await onOk(values as { embedded_blueprint_id: number });
      } else {
        // Нормализуем validation_rules перед отправкой
        const pathValues = values as ZCreatePathDto | ZUpdatePathDto;
        const normalizedValidationRules = normalizeValidationRulesForApi(
          pathValues.validation_rules
        );

        // Создаем объект с нормализованными validation_rules
        const valuesWithNormalizedRules = {
          ...pathValues,
          validation_rules: normalizedValidationRules,
        };

        const validatedValues =
          mode === 'edit'
            ? zUpdatePathDto.parse(valuesWithNormalizedRules)
            : zCreatePathDto.parse(valuesWithNormalizedRules);
        await onOk(validatedValues);
      }
      form.resetFields();
      setDisplayedFullPath(mode === 'edit' ? fullPath : undefined);
    } catch (error: any) {
      // Обработка ошибок валидации формы (от Ant Design)
      if (error?.errorFields) {
        return;
      }

      // Обработка ошибок валидации от API (422)
      if (error && typeof error === 'object' && 'response' in error) {
        const axiosError = error as AxiosError;
        if (setFormValidationErrors(axiosError, form)) {
          // Ошибки валидации установлены в форму, не нужно показывать общую ошибку
          return;
        }
      }

      // Для остальных ошибок просто логируем
      console.error(error);
    }
  };

  const handleCancel = () => {
    form.resetFields();
    setDisplayedFullPath(mode === 'edit' ? fullPath : undefined);
    onCancel();
  };

  const getTitle = () => {
    if (title) return title;
    if (mode === 'edit') return 'Редактирование поля';
    if (mode === 'embed') return 'Встраивание Blueprint';
    return 'Создание поля';
  };

  const getButtonText = () => {
    if (mode === 'edit') return 'Сохранить';
    if (mode === 'embed') return 'Встроить';
    return 'Создать';
  };

  return (
    <Modal
      open={open}
      title={getTitle()}
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
          {getButtonText()}
        </Button>,
      ]}
      width={600}
    >
      {showValidationTab ? (
        <Tabs
          items={[
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
          ]}
        />
      ) : (
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
      )}
    </Modal>
  );
};

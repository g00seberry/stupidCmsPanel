import { Modal, Button, Form } from 'antd';
import { useState, useEffect, useMemo, useCallback } from 'react';
import { NodeForm, type PropsNodeForm } from './NodeForm';
import type { ZCreatePathDto, ZUpdatePathDto } from '@/types/path';
import { zCreatePathDto, zUpdatePathDto } from '@/types/path';

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
  is_required: false,
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

    return {
      ...baseDefaults,
      ...initial,
    };
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
        const validatedValues =
          mode === 'edit' ? zUpdatePathDto.parse(values) : zCreatePathDto.parse(values);
        await onOk(validatedValues);
      }
      form.resetFields();
      setDisplayedFullPath(mode === 'edit' ? fullPath : undefined);
    } catch (error: any) {
      if (error?.errorFields) return;
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
    </Modal>
  );
};

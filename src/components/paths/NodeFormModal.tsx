import { Modal, Button, Tabs, Select, Form } from 'antd';
import { useState, useEffect, useMemo, useCallback } from 'react';
import { NodeForm, type PropsNodeForm } from './NodeForm';
import { ComponentSettingsForm } from '@/components/formConfig/ComponentSettingsForm';
import type { ZCreatePathDto, ZUpdatePathDto, ZDataType, ZCardinality } from '@/types/path';
import { zCreatePathDto, zUpdatePathDto } from '@/types/path';
import type { ZEditComponent } from '@/components/schemaForm/componentDefs/ZComponent';
import { getAllowedComponents } from '@/components/schemaForm/componentDefs/getAllowedComponents';

export type PropsNodeFormModal = Omit<PropsNodeForm, 'form'> & {
  open: boolean;
  title?: string;
  onCancel: () => void;
  onOk: (
    values: ZCreatePathDto | ZUpdatePathDto | { embedded_blueprint_id: number },
    formConfig?: ZEditComponent
  ) => Promise<void> | void;
  initialValues?: Partial<ZCreatePathDto | ZUpdatePathDto | { embedded_blueprint_id: number }>;
  loading?: boolean;
  fullPath?: string;
  formComponentConfig?: ZEditComponent;
  dataType?: ZDataType;
  cardinality?: ZCardinality;
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
  formComponentConfig,
  dataType,
  cardinality,
  parentPath,
  embeddableBlueprints,
  onBlueprintChange,
  initialValues,
}) => {
  const [form] = Form.useForm<FormValues>();
  const [activeTab, setActiveTab] = useState<string>('basic');
  const [componentConfig, setComponentConfig] = useState<ZEditComponent | undefined>(
    formComponentConfig
  );
  const [displayedFullPath, setDisplayedFullPath] = useState<string | undefined>(
    computedFullPath ?? fullPath
  );

  useEffect(() => {
    setComponentConfig(formComponentConfig);
  }, [formComponentConfig]);

  const allowedComponents = useMemo(() => {
    if (!dataType || !cardinality) return [];
    return getAllowedComponents(dataType, cardinality);
  }, [dataType, cardinality]);

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
    const editSpecific =
      mode === 'edit'
        ? {
            data_type: dataType ?? (initial as Partial<ZUpdatePathDto>).data_type,
            cardinality: cardinality ?? (initial as Partial<ZUpdatePathDto>).cardinality,
          }
        : {};

    return {
      ...baseDefaults,
      ...initial,
      ...editSpecific,
    };
  }, [cardinality, dataType, initialValues, mode]);

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

  const handleComponentTypeChange = useCallback(
    (componentName: ZEditComponent['name']) => {
      const defaultLabel = fullPath?.split('.').pop() || 'Поле';
      let baseComponent: ZEditComponent;

      switch (componentName) {
        case 'inputText':
          baseComponent = {
            name: 'inputText',
            props: {
              label: defaultLabel,
            },
          };
          break;
        case 'textarea':
          baseComponent = {
            name: 'textarea',
            props: {
              label: defaultLabel,
            },
          };
          break;
        case 'inputNumber':
          baseComponent = {
            name: 'inputNumber',
            props: {
              label: defaultLabel,
            },
          };
          break;
        case 'checkbox':
          baseComponent = {
            name: 'checkbox',
            props: {
              label: defaultLabel,
            },
          };
          break;
        case 'datePicker':
          baseComponent = {
            name: 'datePicker',
            props: {
              label: defaultLabel,
            },
          };
          break;
        case 'dateTimePicker':
          baseComponent = {
            name: 'dateTimePicker',
            props: {
              label: defaultLabel,
            },
          };
          break;
        case 'select':
          baseComponent = {
            name: 'select',
            props: {
              label: defaultLabel,
            },
          };
          break;
        default:
          return;
      }

      setComponentConfig(baseComponent);
    },
    [fullPath]
  );

  const handleOk = async () => {
    try {
      const values = await form.validateFields();
      if (mode === 'embed') {
        await onOk(values as { embedded_blueprint_id: number });
      } else {
        const validatedValues =
          mode === 'edit' ? zUpdatePathDto.parse(values) : zCreatePathDto.parse(values);
        await onOk(validatedValues, mode === 'edit' && fullPath ? componentConfig : undefined);
      }
      form.resetFields();
      setComponentConfig(undefined);
      setActiveTab('basic');
      setDisplayedFullPath(mode === 'edit' ? fullPath : undefined);
    } catch (error: any) {
      if (error?.errorFields) return;
      console.error(error);
    }
  };

  const handleCancel = () => {
    form.resetFields();
    setComponentConfig(formComponentConfig);
    setActiveTab('basic');
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

  const showTabs = mode === 'edit' && fullPath && !isReadonly;

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
      {showTabs ? (
        <Tabs
          activeKey={activeTab}
          onChange={setActiveTab}
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
              key: 'formConfig',
              label: 'Настройки формы',
              children: (
                <div className="space-y-4">
                  {allowedComponents.length > 0 && (
                    <Form.Item label="Тип поля в форме">
                      <Select
                        value={componentConfig?.name}
                        onChange={handleComponentTypeChange}
                        placeholder="Выберите тип компонента"
                        style={{ width: '100%' }}
                        options={allowedComponents.map(name => ({
                          label: name,
                          value: name,
                        }))}
                      />
                    </Form.Item>
                  )}
                  {componentConfig && (
                    <ComponentSettingsForm
                      componentType={componentConfig.name}
                      value={componentConfig}
                      onChange={setComponentConfig}
                    />
                  )}
                  {!componentConfig && allowedComponents.length > 0 && (
                    <div className="text-sm text-muted-foreground">
                      Выберите тип компонента, чтобы настроить отображение поля в форме
                    </div>
                  )}
                </div>
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

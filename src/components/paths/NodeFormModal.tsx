import { Modal, Button, Tabs, Select, Form } from 'antd';
import { useState, useEffect, useMemo } from 'react';
import { NodeForm, type PropsNodeForm } from './NodeForm';
import { ComponentSettingsForm } from '@/components/formConfig/ComponentSettingsForm';
import type { ZCreatePathDto, ZUpdatePathDto, ZDataType, ZCardinality } from '@/types/path';
import { zCreatePathDto, zUpdatePathDto } from '@/types/path';
import type { ZEditComponent } from '@/components/schemaForm/componentDefs/ZComponent';
import { getAllowedComponents } from '@/components/schemaForm/componentDefs/getAllowedComponents';

/**
 * Пропсы компонента модального окна формы узла.
 */
export type PropsNodeFormModal = Omit<PropsNodeForm, 'form'> & {
  /** Видимость модального окна. */
  open: boolean;
  /** Заголовок модального окна. */
  title?: string;
  /** Обработчик закрытия модального окна. */
  onCancel: () => void;
  /** Обработчик подтверждения формы. */
  onOk: (
    values: ZCreatePathDto | ZUpdatePathDto | { embedded_blueprint_id: number },
    formConfig?: ZEditComponent
  ) => Promise<void> | void;
  /** Начальные значения формы. */
  initialValues?: Partial<ZCreatePathDto | ZUpdatePathDto | { embedded_blueprint_id: number }>;
  /** Флаг загрузки (для блокировки кнопки OK). */
  loading?: boolean;
  /** Полный путь к узлу (для получения настроек формы). */
  fullPath?: string;
  /** Текущая конфигурация компонента для этого узла. */
  formComponentConfig?: ZEditComponent;
  /** Тип данных поля (для определения доступных компонентов). */
  dataType?: ZDataType;
  /** Кардинальность поля (для определения доступных компонентов). */
  cardinality?: ZCardinality;
};

/**
 * Модальное окно с формой создания/редактирования узла графа.
 * Обеспечивает валидацию через Zod и обработку отправки формы.
 * Поддерживает два таба: "Основное" (настройки поля) и "Настройки формы" (конфигурация компонента).
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
  formComponentConfig,
  dataType,
  cardinality,
  ...restProps
}) => {
  const [form] = Form.useForm<
    ZCreatePathDto | ZUpdatePathDto | { embedded_blueprint_id: number }
  >();
  const [activeTab, setActiveTab] = useState<string>('basic');
  const [componentConfig, setComponentConfig] = useState<ZEditComponent | undefined>(
    formComponentConfig
  );

  // Синхронизируем componentConfig с formComponentConfig при изменении пропсов
  useEffect(() => {
    setComponentConfig(formComponentConfig);
  }, [formComponentConfig]);

  // Получаем доступные компоненты на основе типа данных и кардинальности
  const allowedComponents = useMemo(() => {
    if (!dataType || !cardinality) return [];
    return getAllowedComponents(dataType, cardinality);
  }, [dataType, cardinality]);

  /**
   * Обрабатывает выбор типа компонента.
   * Создаёт базовую конфигурацию компонента с дефолтными значениями.
   */
  const handleComponentTypeChange = (componentName: ZEditComponent['name']) => {
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
  };

  const handleOk = async () => {
    try {
      const values = await form.validateFields();
      if (mode === 'embed') {
        // Для режима встраивания просто передаём значения как есть
        await onOk(values as { embedded_blueprint_id: number });
      } else {
        const validatedValues =
          mode === 'edit' ? zUpdatePathDto.parse(values) : zCreatePathDto.parse(values);
        // Передаём конфигурацию компонента только если режим редактирования и есть fullPath
        await onOk(validatedValues, mode === 'edit' && fullPath ? componentConfig : undefined);
      }
      form.resetFields();
      setComponentConfig(undefined);
    } catch (error) {
      // Валидация уже обработана Ant Design Form
    }
  };

  const handleCancel = () => {
    form.resetFields();
    setComponentConfig(undefined);
    setActiveTab('basic');
    onCancel();
  };

  const getTitle = () => {
    if (title) return title;
    if (mode === 'edit') return 'Редактировать поле';
    if (mode === 'embed') return 'Встроить Blueprint';
    return 'Создать поле';
  };

  const getButtonText = () => {
    if (mode === 'edit') return 'Сохранить';
    if (mode === 'embed') return 'Встроить';
    return 'Создать';
  };

  // Показываем табы только в режиме редактирования и если есть fullPath
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
          onClick={handleOk}
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
                  computedFullPath={computedFullPath}
                  isReadonly={isReadonly}
                  sourceBlueprint={sourceBlueprint}
                  onNameChange={onNameChange}
                  {...restProps}
                />
              ),
            },
            {
              key: 'formConfig',
              label: 'Настройки формы',
              children: (
                <div className="space-y-4">
                  {allowedComponents.length > 0 && (
                    <Form.Item label="Тип компонента">
                      <Select
                        value={componentConfig?.name}
                        onChange={handleComponentTypeChange}
                        placeholder="Выберите компонент"
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
                      Выберите тип компонента для настройки параметров
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
          computedFullPath={computedFullPath}
          isReadonly={isReadonly}
          sourceBlueprint={sourceBlueprint}
          onNameChange={onNameChange}
          {...restProps}
        />
      )}
    </Modal>
  );
};

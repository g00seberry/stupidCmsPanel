import { observer } from 'mobx-react-lite';
import React, { useEffect, useMemo } from 'react';
import { Form, Input, InputNumber, Switch } from 'antd';
import type { ZEditComponent } from '@/components/schemaForm/componentDefs/ZComponent';
import { zEditComponent } from '@/components/schemaForm/componentDefs/ZComponent';
import {
  extractEnhancedFieldMetadata,
  type EnhancedFieldMetadata,
} from '@/components/schemaForm/componentDefs/formFieldMetadata';

/**
 * Пропсы компонента формы настроек компонента.
 */
export type PropsComponentSettingsForm = {
  /** Тип компонента для настройки. */
  componentType: ZEditComponent['name'];
  /** Текущие значения настроек компонента. */
  value?: ZEditComponent;
  /** Обработчик изменения настроек. */
  onChange?: (value: ZEditComponent) => void;
};

/**
 * Рендерит поле формы на основе расширенных метаданных.
 */
const renderFormField = (metadata: EnhancedFieldMetadata): React.ReactNode => {
  const {
    name,
    label,
    placeholder,
    componentType,
    formItemProps,
    componentProps,
    valuePropName,
    customRender,
  } = metadata;

  let inputComponent: React.ReactNode;

  if (customRender) {
    // Используем кастомный рендерер, если он указан
    inputComponent = customRender({
      value: undefined, // Значение будет браться из Form.Item
      onChange: () => {}, // Изменения обрабатываются через Form.Item
      placeholder,
    });
  } else {
    // Рендерим стандартный компонент
    switch (componentType) {
      case 'inputNumber':
        inputComponent = (
          <InputNumber
            placeholder={placeholder}
            style={{ width: '100%' }}
            {...(componentProps as any)}
          />
        );
        break;
      case 'switch':
        inputComponent = <Switch {...(componentProps as any)} />;
        break;
      case 'textarea':
        inputComponent = (
          <Input.TextArea placeholder={placeholder} autoSize {...(componentProps as any)} />
        );
        break;
      default:
        inputComponent = <Input placeholder={placeholder} {...(componentProps as any)} />;
    }
  }

  return (
    <Form.Item
      key={name}
      label={label}
      name={name}
      valuePropName={valuePropName}
      {...formItemProps}
    >
      {inputComponent}
    </Form.Item>
  );
};

/**
 * Компонент формы настроек выбранного компонента.
 * Автоматически генерирует форму на основе типа компонента, используя
 * декларативные метаданные из реестра и валидацию из Zod схем.
 */
export const ComponentSettingsForm = observer<PropsComponentSettingsForm>(
  ({ componentType, value, onChange }) => {
    const [form] = Form.useForm();

    // Извлекаем расширенные метаданные полей (комбинация реестра + Zod схемы)
    const fieldsMetadata = useMemo(
      () => extractEnhancedFieldMetadata(componentType),
      [componentType]
    );

    // Синхронизируем форму со значением
    useEffect(() => {
      if (value?.props) {
        form.setFieldsValue(value.props);
      }
    }, [form, value]);

    /**
     * Обрабатывает изменение значений формы.
     * Валидирует данные через Zod схему перед вызовом onChange.
     */
    const handleValuesChange = () => {
      if (!onChange) return;

      const formValues = form.getFieldsValue();
      const newComponent: ZEditComponent = {
        name: componentType,
        props: formValues as ZEditComponent['props'],
      };

      // Валидируем через Zod схему, но игнорируем ошибки при вводе
      try {
        const validated = zEditComponent.parse(newComponent);
        onChange(validated);
      } catch {
        // Игнорируем ошибки валидации при вводе - пользователь ещё вводит данные
      }
    };

    // Если нет метаданных, не рендерим форму
    if (fieldsMetadata.length === 0) {
      return null;
    }

    // Генерируем форму из метаданных
    return (
      <Form form={form} layout="vertical" onValuesChange={handleValuesChange}>
        {fieldsMetadata.map(metadata => renderFormField(metadata))}
      </Form>
    );
  }
);

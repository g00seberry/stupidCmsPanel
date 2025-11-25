import { observer } from 'mobx-react-lite';
import React, { useEffect, useMemo } from 'react';
import { Form, Input, InputNumber, Switch } from 'antd';
import type { InputProps, InputNumberProps, SwitchProps } from 'antd';
import type { TextAreaProps } from 'antd/es/input';
import type { ZEditComponent } from '@/components/schemaForm/componentDefs/ZComponent';
import { zEditComponent } from '@/components/schemaForm/componentDefs/ZComponent';
import {
  extractEnhancedFieldMetadata,
  type EnhancedFieldMetadata,
} from '@/components/schemaForm/componentDefs/formFieldMetadata';

/**
 * Рендерит поле формы на основе расширенных метаданных.
 * @param metadata Расширенные метаданные поля с информацией из реестра и Zod схемы.
 * @returns React-элемент поля формы.
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
    // Form.Item автоматически передаст value и onChange в дочерний компонент
    inputComponent = customRender({
      value: undefined, // Будет передано автоматически через Form.Item
      onChange: () => {}, // Будет передано автоматически через Form.Item
      placeholder,
    });
  } else {
    // Рендерим стандартный компонент с правильной типизацией
    switch (componentType) {
      case 'inputNumber': {
        const numberProps = (componentProps || {}) as Partial<InputNumberProps>;
        inputComponent = (
          <InputNumber placeholder={placeholder} style={{ width: '100%' }} {...numberProps} />
        );
        break;
      }
      case 'switch': {
        const switchProps = (componentProps || {}) as Partial<SwitchProps>;
        inputComponent = <Switch {...switchProps} />;
        break;
      }
      case 'textarea': {
        const textareaProps = (componentProps || {}) as Partial<TextAreaProps>;
        inputComponent = <Input.TextArea placeholder={placeholder} autoSize {...textareaProps} />;
        break;
      }
      default: {
        const inputProps = (componentProps || {}) as Partial<InputProps>;
        inputComponent = <Input placeholder={placeholder} {...inputProps} />;
        break;
      }
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
    // Примечание: зависимость от value может вызывать обновления при каждом изменении объекта,
    // но это нормально, так как нужно синхронизировать форму с внешними изменениями
    useEffect(() => {
      if (value?.props) {
        form.setFieldsValue(value.props);
      }
    }, [form, value]);

    /**
     * Обрабатывает изменение значений формы.
     * Валидирует данные через Zod схему перед вызовом onChange.
     * Использует safeParse для безопасной валидации без выбрасывания исключений.
     */
    const handleValuesChange = () => {
      if (!onChange) return;

      const formValues = form.getFieldsValue();
      const newComponent: ZEditComponent = {
        name: componentType,
        props: formValues as ZEditComponent['props'],
      };

      // Валидируем через Zod схему безопасно
      const result = zEditComponent.safeParse(newComponent);
      if (result.success) {
        onChange(result.data);
      } else if (process.env.NODE_ENV === 'development') {
        // Логируем ошибки валидации только в режиме разработки
        console.warn('Ошибка валидации компонента:', result.error.format());
      }
      // В production игнорируем ошибки валидации при вводе - пользователь ещё вводит данные
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

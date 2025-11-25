// PropsForm.tsx
import { Form, Input, InputNumber, Switch } from 'antd';
import { type EditComponentName, type EditComponentPropsByName } from './editPropsSchemas';
import { getPropsFormConfig } from './getPropsFormConfig';

/**
 * Пропсы компонента формы редактирования props компонента.
 */
type PropsFormProps<N extends EditComponentName = EditComponentName> = {
  /** Имя компонента для определения схемы props. */
  name: N;
  /** Текущие значения props. */
  value: Partial<EditComponentPropsByName<N>> | undefined;
  /** Обработчик изменения props. */
  onChange: (value: Partial<EditComponentPropsByName<N>>) => void;
};

/**
 * Компонент формы для редактирования props компонента.
 * Автоматически генерирует поля формы на основе схемы props компонента.
 */
export const PropsForm = <N extends EditComponentName>({
  name,
  value,
  onChange,
}: PropsFormProps<N>) => {
  const fields = getPropsFormConfig(name);

  const handleChange = (fieldName: string, fieldValue: any) => {
    onChange({
      ...(value ?? {}),
      [fieldName]: fieldValue,
    } as Partial<EditComponentPropsByName<N>>);
  };

  return (
    <Form layout="vertical">
      {fields.map(field => {
        const v = (value as any)?.[field.name];

        if (field.type === 'boolean') {
          return (
            <Form.Item
              key={field.name}
              label={field.label}
              tooltip={field.helperText}
              valuePropName="checked"
            >
              <Switch checked={!!v} onChange={checked => handleChange(field.name, checked)} />
            </Form.Item>
          );
        }

        if (field.type === 'number') {
          return (
            <Form.Item
              key={field.name}
              label={field.label}
              tooltip={field.helperText}
              required={field.required}
            >
              <InputNumber
                style={{ width: '100%' }}
                value={v ?? undefined}
                onChange={val => handleChange(field.name, val ?? undefined)}
              />
            </Form.Item>
          );
        }

        // string по умолчанию
        return (
          <Form.Item
            key={field.name}
            label={field.label}
            tooltip={field.helperText}
            required={field.required}
          >
            <Input value={v ?? ''} onChange={e => handleChange(field.name, e.target.value)} />
          </Form.Item>
        );
      })}
    </Form>
  );
};

import { useEffect } from 'react';
import { Form, Input, Select, Switch, Tag } from 'antd';
import type { FormInstance } from 'antd/es/form';
import type { ZRouteNode, ZHttpMethod } from '@/types/routes';

/**
 * Пропсы компонента формы маршрута.
 */
export type PropsRouteForm = {
  /** Экземпляр формы Ant Design. */
  form: FormInstance;
  /** Исходные данные маршрута (для режима редактирования). */
  initialValues?: ZRouteNode | null;
  /** Режим только для чтения. */
  readonly?: boolean;
  /** Обработчик отправки формы. */
  onFinish?: (values: any) => void | Promise<void>;
};

/**
 * Доступные HTTP методы.
 */
const HTTP_METHODS: ZHttpMethod[] = ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS', 'HEAD'];

/**
 * Компонент формы для создания и редактирования маршрута.
 * Поддерживает условную логику для разных типов маршрутов (route/group) и действий (controller/entry).
 * @example
 * const [form] = Form.useForm();
 *
 * <RouteForm
 *   form={form}
 *   initialValues={route}
 *   readonly={route?.readonly}
 * />
 */
export const RouteForm: React.FC<PropsRouteForm> = ({
  form,
  initialValues,
  readonly = false,
  onFinish,
}) => {
  const kind = Form.useWatch('kind', form);
  const actionType = Form.useWatch('action_type', form);

  // Устанавливаем начальные значения при изменении initialValues
  useEffect(() => {
    if (initialValues) {
      form.setFieldsValue({
        kind: initialValues.kind,
        action_type: initialValues.action_type,
        name: initialValues.name,
        uri: initialValues.uri,
        methods: initialValues.methods,
        action: initialValues.action,
        entry_id: initialValues.entry_id,
        enabled: initialValues.enabled,
        middleware: initialValues.middleware,
        prefix: initialValues.prefix,
        domain: initialValues.domain,
        namespace: initialValues.namespace,
      });
    }
  }, [initialValues, form]);

  return (
    <Form form={form} layout="vertical" disabled={readonly} onFinish={onFinish}>
      <Form.Item
        name="kind"
        label="Тип узла"
        rules={[{ required: true, message: 'Выберите тип узла' }]}
      >
        <Select>
          <Select.Option value="group">Группа</Select.Option>
          <Select.Option value="route">Маршрут</Select.Option>
        </Select>
      </Form.Item>

      <Form.Item
        name="action_type"
        label="Тип действия"
        rules={[{ required: true, message: 'Выберите тип действия' }]}
      >
        <Select>
          <Select.Option value="controller">Контроллер</Select.Option>
          <Select.Option value="entry">Entry</Select.Option>
        </Select>
      </Form.Item>

      <Form.Item name="name" label="Имя маршрута">
        <Input placeholder="about" maxLength={255} />
      </Form.Item>

      <Form.Item name="enabled" label="Включён" valuePropName="checked" initialValue={true}>
        <Switch />
      </Form.Item>

      {/* Поля для kind=route */}
      {kind === 'route' && (
        <>
          <Form.Item
            name="uri"
            label="URI"
            rules={[
              { required: true, message: 'URI обязателен для маршрута' },
              { max: 255, message: 'Максимум 255 символов' },
            ]}
          >
            <Input placeholder="/about" maxLength={255} />
          </Form.Item>

          <Form.Item
            name="methods"
            label="HTTP методы"
            rules={[{ required: true, message: 'Выберите хотя бы один метод' }]}
          >
            <Select mode="multiple" placeholder="Выберите методы">
              {HTTP_METHODS.map(method => (
                <Select.Option key={method} value={method}>
                  {method}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
        </>
      )}

      {/* Поля для action_type=controller */}
      {actionType === 'controller' && (
        <Form.Item
          name="action"
          label="Действие"
          rules={[
            { max: 255, message: 'Максимум 255 символов' },
            {
              pattern: /^(App\\Http\\Controllers\\.+|view:|redirect:)/,
              message: 'Неверный формат действия',
            },
          ]}
          tooltip="Формат: App\\Http\\Controllers\\Controller@method, view:pages.about, redirect:/path"
        >
          <Input placeholder="App\\Http\\Controllers\\AboutController@show" maxLength={255} />
        </Form.Item>
      )}

      {/* Поля для action_type=entry */}
      {actionType === 'entry' && (
        <Form.Item
          name="entry_id"
          label="ID Entry"
          rules={[{ required: true, message: 'ID Entry обязателен' }]}
          normalize={value => {
            if (value === '' || value === null || value === undefined) {
              return null;
            }
            const num = Number.parseInt(String(value), 10);
            return Number.isNaN(num) ? null : num;
          }}
        >
          <Input type="number" placeholder="5" />
        </Form.Item>
      )}

      {/* Поля для kind=group */}
      {kind === 'group' && (
        <>
          <Form.Item
            name="prefix"
            label="Префикс URI"
            rules={[{ max: 255, message: 'Максимум 255 символов' }]}
            tooltip="Префикс, который будет добавлен к URI дочерних маршрутов"
          >
            <Input placeholder="blog" maxLength={255} />
          </Form.Item>

          <Form.Item
            name="domain"
            label="Домен"
            rules={[{ max: 255, message: 'Максимум 255 символов' }]}
          >
            <Input placeholder="example.com" maxLength={255} />
          </Form.Item>

          <Form.Item
            name="namespace"
            label="Namespace контроллеров"
            rules={[{ max: 255, message: 'Максимум 255 символов' }]}
          >
            <Input placeholder="App\\Http\\Controllers\\Admin" maxLength={255} />
          </Form.Item>
        </>
      )}

      <Form.Item name="middleware" label="Middleware">
        <Select
          mode="tags"
          placeholder="Введите middleware и нажмите Enter"
          tokenSeparators={[',']}
        />
      </Form.Item>

      {readonly && (
        <Form.Item>
          <Tag color="warning">Декларативный маршрут нельзя изменять</Tag>
        </Form.Item>
      )}
    </Form>
  );
};

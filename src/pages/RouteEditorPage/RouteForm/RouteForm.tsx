import { useEffect, useMemo } from 'react';
import { Form, Input, Select, Switch, Tag } from 'antd';
import type { FormInstance } from 'antd/es/form';
import type { ZRouteNode } from '@/types/routes';
import type React from 'react';
import { actionTypeOptions, kindOptions } from './constants';
import { actionTypeRules, kindRules } from './validations';
import { ControllerFields, EntryFields, GroupFields, RouteFields } from './fields';

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
};

/**
 * Компонент формы для создания и редактирования маршрута.
 * Поддерживает условную логику для разных типов маршрутов (route/group) и действий (controller/entry).
 *
 * @example
 * ```tsx
 * const [form] = Form.useForm();
 *
 * <RouteForm
 *   form={form}
 *   initialValues={route}
 *   readonly={route?.readonly}
 *   onFinish={handleSubmit}
 * />
 * ```
 */
export const RouteForm: React.FC<PropsRouteForm> = ({ form, initialValues, readonly = false }) => {
  const kind = Form.useWatch('kind', form);
  const actionType = Form.useWatch('action_type', form);

  // Мемоизируем значения для оптимизации
  const isRouteKind = useMemo(() => kind === 'route', [kind]);
  const isGroupKind = useMemo(() => kind === 'group', [kind]);
  const isControllerAction = useMemo(() => actionType === 'controller', [actionType]);
  const isEntryAction = useMemo(() => actionType === 'entry', [actionType]);

  // Устанавливаем начальные значения при изменении initialValues
  useEffect(() => {
    form.setFieldsValue(initialValues);
  }, [form, initialValues]);

  return (
    <Form form={form} layout="vertical" disabled={readonly}>
      {/* Основные поля */}
      <Form.Item name="kind" label="Тип узла" rules={kindRules}>
        <Select options={kindOptions} placeholder="Выберите тип узла" />
      </Form.Item>

      <Form.Item name="action_type" label="Тип действия" rules={actionTypeRules}>
        <Select options={actionTypeOptions} placeholder="Выберите тип действия" />
      </Form.Item>

      <Form.Item
        name="name"
        label="Имя маршрута"
        tooltip="Имя маршрута используется для идентификации в админ-панели"
      >
        <Input placeholder="about" maxLength={255} />
      </Form.Item>

      <Form.Item
        name="enabled"
        label="Включён"
        valuePropName="checked"
        initialValue={true}
        tooltip="Включённые маршруты активны и обрабатываются приложением"
      >
        <Switch />
      </Form.Item>

      {/* Условные поля для типа узла "route" */}
      {isRouteKind && <RouteFields />}

      {/* Условные поля для типа действия "controller" */}
      {isControllerAction && <ControllerFields />}

      {/* Условные поля для типа действия "entry" */}
      {isEntryAction && <EntryFields />}

      {/* Условные поля для типа узла "group" */}
      {isGroupKind && <GroupFields />}

      {/* Поле middleware (общее для всех типов) */}
      <Form.Item
        name="middleware"
        label="Middleware"
        tooltip="Список middleware, которые будут применены к маршруту или группе маршрутов"
      >
        <Select
          mode="tags"
          placeholder="Введите middleware и нажмите Enter"
          tokenSeparators={[',']}
        />
      </Form.Item>

      {/* Предупреждение о режиме только для чтения */}
      {readonly && (
        <Form.Item>
          <Tag color="warning">Декларативный маршрут нельзя изменять</Tag>
        </Form.Item>
      )}
    </Form>
  );
};

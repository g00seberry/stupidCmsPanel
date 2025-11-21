import { useEffect } from 'react';
import { observer } from 'mobx-react-lite';
import { Card, Form, Space, Button } from 'antd';
import { Filter } from 'lucide-react';
import type { FormItemProps } from 'antd/es/form';
import type { ReactNode } from 'react';
import { FilterFormStore } from './FilterFormStore';

/**
 * Конфигурация поля фильтрации.
 */
export type FilterFieldConfig = {
  /** Имя поля в форме. */
  name: string;
  /** Элемент поля (Input, Select и т.д.). */
  element: ReactNode;
  /** Дополнительные пропсы для Form.Item. */
  formItemProps?: Omit<FormItemProps, 'name' | 'children'>;
  /** Класс для обёртки поля. */
  className?: string;
};

/**
 * Пропсы компонента формы фильтрации.
 */
export type PropsFilterForm<TValues extends Record<string, unknown> = Record<string, unknown>> = {
  /** Store для управления состоянием фильтров. */
  store: FilterFormStore<TValues>;
  /** Конфигурация полей фильтрации. */
  fields: FilterFieldConfig[];
  /** Значения фильтров по умолчанию. */
  defaultValues?: TValues;
  /** Текст кнопки применения. По умолчанию: 'Применить'. */
  applyText?: string;
  /** Текст кнопки сброса. По умолчанию: 'Сбросить'. */
  resetText?: string;
  /** Показывать иконку фильтра на кнопке применения. По умолчанию: true. */
  showFilterIcon?: boolean;
  /** Дополнительный класс для карточки. */
  cardClassName?: string;
};

/**
 * Универсальный компонент формы фильтрации.
 * Объединяет поля фильтрации, кнопки применения и сброса в единый интерфейс.
 * Управляет значениями фильтров через FilterFormStore.
 * @example
 * const filterStore = useMemo(() => new FilterFormStore({ status: 'all' }), []);
 *
 * <FilterForm
 *   store={filterStore}
 *   fields={[
 *     {
 *       name: 'q',
 *       element: <Input placeholder="Поиск" />,
 *       className: 'flex-1 min-w-[200px]'
 *     },
 *     {
 *       name: 'status',
 *       element: <Select>...</Select>,
 *       formItemProps: { initialValue: 'all' }
 *     }
 *   ]}
 *   defaultValues={{ status: 'all' }}
 * />
 */
export const FilterForm = observer(
  <TValues extends Record<string, unknown> = Record<string, unknown>>({
    store,
    fields,
    defaultValues = {} as TValues,
    applyText = 'Применить',
    resetText = 'Сбросить',
    showFilterIcon = true,
    cardClassName,
  }: PropsFilterForm<TValues>) => {
    const [form] = Form.useForm();

    // Синхронизация формы со стором
    useEffect(() => {
      form.resetFields();
      form.setFieldsValue(store.values);
    }, [form, store.values]);

    // Инициализация значений по умолчанию
    useEffect(() => {
      store.setValues(defaultValues);
    }, [store, defaultValues]);

    /**
     * Обработчик применения фильтров.
     */
    const handleApply = (values: TValues): void => {
      store.setValues(values);
    };

    /**
     * Обработчик сброса фильтров.
     */
    const handleReset = (): void => {
      store.reset(defaultValues);
    };

    return (
      <Card className={cardClassName}>
        <Form form={form} layout="inline" onFinish={handleApply} className="w-full">
          <Space wrap className="w-full">
            {fields.map(field => (
              <Form.Item
                key={field.name}
                name={field.name}
                className={field.className}
                {...field.formItemProps}
              >
                {field.element}
              </Form.Item>
            ))}
            <Form.Item>
              <Space>
                <Button
                  type="primary"
                  htmlType="submit"
                  icon={showFilterIcon ? <Filter className="w-4 h-4" /> : undefined}
                >
                  {applyText}
                </Button>
                <Button onClick={handleReset}>{resetText}</Button>
              </Space>
            </Form.Item>
          </Space>
        </Form>
      </Card>
    );
  }
);

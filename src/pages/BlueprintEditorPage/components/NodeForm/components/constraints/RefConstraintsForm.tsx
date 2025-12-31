import { Form, Select } from 'antd';
import { observer } from 'mobx-react-lite';
import type { RefConstraintsStore } from './RefConstraintsStore';

type RefConstraintsFormProps = {
  store: RefConstraintsStore;
  disabled?: boolean;
};

/**
 * Компонент формы для редактирования ограничений типа ref.
 * Позволяет выбрать разрешенные типы контента (post types), на которые может ссылаться поле.
 */
export const RefConstraintsForm: React.FC<RefConstraintsFormProps> = observer(
  ({ store, disabled = false }) => {
    return (
      <Form.Item
        label="Разрешенные типы контента"
        name={['constraints', 'allowed_post_type_ids']}
        rules={[{ required: true }]}
      >
        <Select
          mode="multiple"
          placeholder="Выберите типы контента"
          options={store.postTypeOptions}
          loading={store.loading}
          disabled={disabled}
          style={{ width: '100%' }}
          allowClear
        />
      </Form.Item>
    );
  }
);

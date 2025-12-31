import { Form, Select } from 'antd';
import { observer } from 'mobx-react-lite';
import type { MediaConstraintsStore } from './MediaConstraintsStore';

type MediaConstraintsFormProps = {
  store: MediaConstraintsStore;
  disabled?: boolean;
};

/**
 * Компонент формы для редактирования ограничений типа media.
 * Позволяет выбрать разрешенные MIME типы файлов, которые можно загружать в поле.
 */
export const MediaConstraintsForm: React.FC<MediaConstraintsFormProps> = observer(
  ({ store, disabled = false }) => {
    return (
      <Form.Item label="Ограничения" name="constraints">
        <Select
          mode="tags"
          loading={store.loading}
          disabled={disabled}
          style={{ width: '100%' }}
          options={store.allowedMimeTypes}
          tokenSeparators={[',']}
          allowClear
        />
      </Form.Item>
    );
  }
);

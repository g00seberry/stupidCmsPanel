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
      <Form.Item
        label="Разрешенные MIME типы"
        name={['constraints', 'allowed_mimes']}
        rules={[{ required: true, message: 'Укажите хотя бы один MIME тип' }]}
        tooltip="Укажите MIME типы файлов, которые можно загружать в это поле. Например: image/jpeg, image/png, image/webp"
      >
        <Select
          mode="tags"
          loading={store.loading}
          disabled={disabled}
          style={{ width: '100%' }}
          options={store.allowedMimeTypes}
          tokenSeparators={[',']}
          allowClear
          placeholder="Выберите или введите MIME типы (например: image/jpeg)"
        />
      </Form.Item>
    );
  }
);

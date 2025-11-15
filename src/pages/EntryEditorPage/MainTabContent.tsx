import { SlugInput } from '@/components/SlugInput';
import { Card, Form, Input, Select } from 'antd';
import { Info } from 'lucide-react';
import { PublishCard } from './PublishCard';
import type { EntryEditorStore } from './EntryEditorStore';

/**
 * Пропсы компонента содержимого основной вкладки.
 */
export type PropsMainTabContent = {
  /** Заголовок записи для генерации slug. */
  titleValue: string | undefined;
  /** Режим редактирования. `true` если редактируется существующая запись. */
  isEditMode: boolean;
  /** Store редактора записи. */
  store: EntryEditorStore;
};

/**
 * Содержимое основной вкладки с полями формы записи.
 */
export const MainTabContent: React.FC<PropsMainTabContent> = ({
  titleValue,
  isEditMode,
  store,
}) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2 space-y-6">
        <Card className="p-6">
          <h2 className="text-2xl font-semibold mb-6">Основные настройки</h2>

          <div className="space-y-6">
            <div className="space-y-2">
              <Form.Item
                label="Заголовок"
                name="title"
                rules={[
                  { required: true, message: 'Заголовок обязателен.' },
                  { max: 255, message: 'Заголовок не должен превышать 255 символов.' },
                ]}
                className="mb-0"
              >
                <Input placeholder="Введите заголовок записи" className="text-lg" />
              </Form.Item>
              <p className="text-sm text-muted-foreground">
                Заголовок записи, отображаемый в интерфейсе
              </p>
            </div>

            <div className="space-y-2">
              <Form.Item
                label="Slug"
                name="slug"
                rules={[
                  { required: true, message: 'Slug обязателен.' },
                  {
                    pattern: /^[a-z0-9-]+$/,
                    message: 'Slug может содержать только строчные латинские буквы, цифры и дефис.',
                  },
                ]}
                className="mb-0"
              >
                <SlugInput
                  from={titleValue ?? ''}
                  holdOnChange={isEditMode}
                  placeholder="entry-slug"
                  disabled={store.initialLoading || store.pending}
                />
              </Form.Item>
              <p className="text-sm text-muted-foreground flex items-start gap-1">
                <Info className="w-4 h-4 mt-0.5 flex-shrink-0" />
                <span>URL-friendly идентификатор записи</span>
              </p>
            </div>

            <div className="space-y-2">
              <Form.Item label="Переопределение шаблона" name="template_override" className="mb-0">
                <Select
                  placeholder="Выберите шаблон"
                  allowClear
                  showSearch
                  loading={store.loading}
                  filterOption={(input, option) =>
                    (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
                  }
                  options={store.templates.map(({ name }) => ({ value: name, label: name }))}
                />
              </Form.Item>
              <p className="text-sm text-muted-foreground">
                Имя шаблона для переопределения шаблона типа контента
              </p>
            </div>
          </div>
        </Card>
      </div>

      <div className="lg:col-span-1">
        <PublishCard />
      </div>
    </div>
  );
};

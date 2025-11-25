import { EntryTermsManager } from '@/components/EntryTermsManager/EntryTermsManager';
import { SchemaForm } from '@/components/schemaForm/SchemaForm';
import { SlugInput } from '@/components/SlugInput';
import { buildUrl, PageUrl } from '@/PageUrl';
import { handleFormSubmit } from '@/components/schemaForm/formSubmitHandler';
import { Card, DatePicker, Form, Input, Select, Spin, Switch } from 'antd';
import { Info } from 'lucide-react';
import { observer } from 'mobx-react-lite';
import { useCallback, useEffect, useMemo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { EntryEditorHeader } from './EntryEditorHeader';
import { EntryEditorStore } from './EntryEditorStore';
import type { EntryEditorFormValues } from './transforms';

/**
 * Страница создания и редактирования записи CMS.
 */
export const EntryEditorPage = observer(() => {
  const { postType, id } = useParams<{ postType?: string; id?: string }>();

  const store = useMemo(() => {
    if (postType && id) {
      return new EntryEditorStore(postType, id);
    }
    return null;
  }, [postType, id]);

  if (!store) return null;

  return <Inner store={store} />;
});

interface PropsInner {
  store: EntryEditorStore;
}
const Inner = observer(({ store }: PropsInner) => {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const titleValue = Form.useWatch('title', form);
  const isEditMode = store?.isEditMode ?? false;
  const { postTypeSlug } = store;

  useEffect(() => {
    form.setFieldsValue(store.initialFormValues);
  }, [store.initialFormValues]);

  const handleSubmit = useCallback(
    async (values: EntryEditorFormValues) => {
      // Валидируем и получаем данные Blueprint формы, если она есть
      let blueprintData: Record<string, any> | undefined = undefined;

      if (store.blueprintModel) {
        const result = await handleFormSubmit(store.blueprintModel);
        if (!result.success) {
          // Ошибки валидации Blueprint формы - не сохраняем
          return;
        }
        blueprintData = result.values;
      }

      // Объединяем данные основной формы с данными Blueprint
      const finalValues: EntryEditorFormValues = {
        ...values,
        content_json: blueprintData || values.content_json,
      };

      const nextEntry = await store.saveEntry(finalValues);
      if (nextEntry) {
        navigate(
          buildUrl(PageUrl.EntryEdit, { postType: postTypeSlug, id: String(nextEntry.id) }),
          {
            replace: !isEditMode,
          }
        );
      }
    },
    [isEditMode, navigate, postTypeSlug, store]
  );

  const handleCancel = useCallback(() => {
    navigate(buildUrl(PageUrl.EntriesByType, { postType: postTypeSlug }));
  }, [postTypeSlug]);

  const handleSave = useCallback(() => {
    form.submit();
  }, [form]);
  return (
    <div className="min-h-screen bg-background w-full">
      <EntryEditorHeader
        postType={store.postType}
        isEditMode={isEditMode}
        onSave={handleSave}
        pending={store.loading}
        onCancel={handleCancel}
      />

      <div className="px-6 py-8 w-full">
        {store.loading ? (
          <div className="flex justify-center py-12">
            <Spin size="large" />
          </div>
        ) : (
          <Form<EntryEditorFormValues> form={form} layout="vertical" onFinish={handleSubmit}>
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
                            message:
                              'Slug может содержать только строчные латинские буквы, цифры и дефис.',
                          },
                        ]}
                        className="mb-0"
                      >
                        <SlugInput
                          from={titleValue ?? ''}
                          holdOnChange={isEditMode}
                          placeholder="entry-slug"
                          disabled={store.loading}
                        />
                      </Form.Item>
                      <p className="text-sm text-muted-foreground flex items-start gap-1">
                        <Info className="w-4 h-4 mt-0.5 flex-shrink-0" />
                        <span>URL-friendly идентификатор записи</span>
                      </p>
                    </div>

                    <div className="space-y-2">
                      <Form.Item
                        label="Переопределение шаблона"
                        name="template_override"
                        className="mb-0"
                      >
                        <Select
                          placeholder="Выберите шаблон"
                          allowClear
                          showSearch
                          loading={store.loading}
                          filterOption={(input, option) =>
                            (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
                          }
                          options={store.templates.map(({ name }) => ({
                            value: name,
                            label: name,
                          }))}
                        />
                      </Form.Item>
                      <p className="text-sm text-muted-foreground">
                        Имя шаблона для переопределения шаблона типа контента
                      </p>
                    </div>
                  </div>
                </Card>
              </div>

              <div className="lg:col-span-1 space-y-6 sticky top-24">
                <Card className="p-6 ">
                  <h2 className="text-lg font-semibold mb-6">Публикация</h2>
                  <div className="space-y-6">
                    <Form.Item
                      label="Опубликовано"
                      name="is_published"
                      valuePropName="checked"
                      className="mb-0"
                    >
                      <Switch />
                    </Form.Item>

                    <Form.Item label="Дата публикации" name="published_at" className="mb-0">
                      <DatePicker
                        showTime
                        format="YYYY-MM-DD HH:mm"
                        style={{ width: '100%' }}
                        placeholder="Выберите дату и время публикации"
                      />
                    </Form.Item>
                    <p className="text-sm text-muted-foreground">Дата и время публикации записи</p>
                  </div>
                </Card>
                {isEditMode && store.termsManagerStore && (
                  <Card className="p-6">
                    <Form.Item name="term_ids" className="mb-0">
                      <EntryTermsManager store={store.termsManagerStore} disabled={store.loading} />
                    </Form.Item>
                  </Card>
                )}
              </div>
            </div>
          </Form>
        )}

        {!store.loading && store.postType?.blueprint_id && store.blueprintModel && (
          <Card className="p-6 mt-6">
            <h2 className="text-2xl font-semibold mb-6">Данные Blueprint</h2>
            <SchemaForm model={store.blueprintModel} />
          </Card>
        )}
      </div>
    </div>
  );
});

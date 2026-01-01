import { EntryTermsManager } from '@/components/EntryTermsManager/EntryTermsManager';
import { PageLayout } from '@/components/PageLayout';
import { SchemaForm } from '@/components/schemaForm/SchemaForm';
import { buildUrl, PageUrl } from '@/PageUrl';
import type { ZId } from '@/types/ZId';
import { viewDate } from '@/utils/dateUtils';
import { Button, Card, Collapse, DatePicker, Form, Input, Select, Spin, Tag } from 'antd';
import dayjs from 'dayjs';
import { Calendar, Check, FileText, Settings, Tag as TagIcon } from 'lucide-react';
import { observer } from 'mobx-react-lite';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { EntryEditorStore } from './EntryEditorStore';
import type { EntryEditorFormValues } from './transforms';

/**
 * Страница создания и редактирования записи CMS.
 */
export const EntryEditorPage = observer(() => {
  const { postTypeId, id } = useParams<{ postTypeId?: ZId; id?: ZId }>();

  const store = useMemo(() => {
    if (postTypeId && id) {
      return new EntryEditorStore(postTypeId, id);
    }
    return null;
  }, [postTypeId, id]);

  if (!store) return null;

  return <Inner store={store} />;
});

interface PropsInner {
  store: EntryEditorStore;
}
const Inner = observer(({ store }: PropsInner) => {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const status = Form.useWatch('status', form) ?? 'draft';
  const publishedAt = Form.useWatch('published_at', form);
  const isEditMode = store?.isEditMode ?? false;
  const postType = store.postType;
  const [advancedSettingsOpen, setAdvancedSettingsOpen] = useState(false);

  useEffect(() => {
    const formValues = { ...store.initialFormValues };
    // Конвертируем published_at в dayjs объект, если это строка
    if (formValues.published_at && typeof formValues.published_at === 'string') {
      formValues.published_at = viewDate(formValues.published_at);
    }
    form.setFieldsValue(formValues);
  }, [store.initialFormValues, form]);

  const handleSubmit = useCallback(
    async (values: EntryEditorFormValues) => {
      const finalValues: EntryEditorFormValues = {
        ...values,
        data_json: store.blueprintModel?.json ?? values.data_json,
      };

      const nextEntry = await store.saveEntry(finalValues);
      if (nextEntry && postType) {
        navigate(
          buildUrl(PageUrl.EntryEdit, { postTypeId: postType.id, id: String(nextEntry.id) }),
          {
            replace: !isEditMode,
          }
        );
      }
    },
    [isEditMode, navigate, postType, store]
  );

  const handleCancel = useCallback(() => {
    if (postType) {
      navigate(buildUrl(PageUrl.EntriesByType, { postTypeId: postType.id }));
    }
  }, [navigate, postType]);

  const handleSave = useCallback(() => {
    form.submit();
  }, [form]);
  const getPublicationStatus = () => {
    if (status === 'draft') {
      return { text: 'Черновик', color: 'default' as const };
    }
    if (status === 'published') {
      if (publishedAt && publishedAt.isBefore(dayjs())) {
        return { text: 'Опубликовано', color: 'success' as const };
      }
      return { text: 'Опубликовано', color: 'success' as const };
    }
    return { text: 'Черновик', color: 'default' as const };
  };

  const publicationStatus = getPublicationStatus();

  return (
    <PageLayout
      breadcrumbs={[
        { label: 'Типы контента', to: PageUrl.ContentTypes },
        ...(postType
          ? [
              {
                label: postType.name,
                to: buildUrl(PageUrl.EntriesByType, { postTypeId: postType.id }),
              },
            ]
          : []),
        isEditMode ? 'Редактирование' : 'Создание',
      ]}
      extra={
        <>
          <Button onClick={handleCancel}>Отмена</Button>
          <Button
            type="primary"
            onClick={handleSave}
            loading={store.loading}
            icon={<Check className="w-4 h-4" />}
          >
            Сохранить
          </Button>
        </>
      }
      loading={store.loading}
    >
      <Form form={form} layout="vertical" onFinish={handleSubmit}>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Основной контент */}
          <div className="lg:col-span-2 space-y-6">
            {/* Основные поля */}
            <Card className="p-6 shadow-sm">
              <div className="space-y-6">
                {/* Заголовок */}
                <div className="space-y-2">
                  <Form.Item
                    label={
                      <span className="text-base font-semibold flex items-center gap-2">
                        <FileText className="w-4 h-4" />
                        Заголовок
                      </span>
                    }
                    name="title"
                    rules={[
                      { required: true, message: 'Заголовок обязателен.' },
                      { max: 255, message: 'Заголовок не должен превышать 255 символов.' },
                    ]}
                    className="mb-0"
                  >
                    <Input
                      placeholder="Введите заголовок записи"
                      className="text-lg"
                      size="large"
                      autoFocus
                    />
                  </Form.Item>
                  <p className="text-sm text-muted-foreground ml-6">
                    Заголовок записи, отображаемый в интерфейсе и поисковых системах
                  </p>
                </div>
              </div>
            </Card>

            {/* Продвинутые настройки */}
            <Collapse
              activeKey={advancedSettingsOpen ? ['advanced'] : []}
              onChange={keys => setAdvancedSettingsOpen(keys.includes('advanced'))}
              items={[
                {
                  key: 'advanced',
                  label: (
                    <span className="flex items-center gap-2 text-base font-medium">
                      <Settings className="w-4 h-4" />
                      Продвинутые настройки
                    </span>
                  ),
                  children: (
                    <div className="pt-4">
                      <Form.Item
                        label="Переопределение шаблона"
                        name="template_override"
                        className="mb-0"
                        tooltip="Позволяет использовать другой шаблон для этой записи вместо шаблона типа контента"
                      >
                        <Select
                          placeholder="Выберите шаблон (необязательно)"
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
                      <p className="text-sm text-muted-foreground mt-2">
                        Имя шаблона для переопределения шаблона типа контента. Оставьте пустым,
                        чтобы использовать шаблон по умолчанию.
                      </p>
                    </div>
                  ),
                },
              ]}
              className="bg-card"
            />

            {/* Blueprint данные */}
            {store.postType?.blueprint_id && store.blueprintModel && (
              <Card className="p-6 shadow-sm">
                <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
                  <FileText className="w-5 h-5" />
                  Содержимое записи
                </h2>
                <SchemaForm model={store.blueprintModel} />
              </Card>
            )}
          </div>

          {/* Боковая панель */}
          <div className="lg:col-span-1 space-y-6">
            {/* Публикация */}
            <Card className="p-6 shadow-sm">
              <div className="space-y-4">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-semibold flex items-center gap-2">
                    <Calendar className="w-5 h-5" />
                    Публикация
                  </h2>
                  <Tag color={publicationStatus.color}>{publicationStatus.text}</Tag>
                </div>

                <Form.Item
                  label="Статус"
                  name="status"
                  className="mb-4"
                  tooltip="Опубликованные записи видны пользователям. Черновики доступны только редакторам."
                >
                  <Select
                    size="large"
                    options={[
                      { value: 'draft', label: 'Черновик' },
                      { value: 'published', label: 'Опубликовано' },
                    ]}
                  />
                </Form.Item>

                <Form.Item
                  label="Дата публикации"
                  name="published_at"
                  className="mb-0"
                  tooltip="Записи можно запланировать на будущее. Если дата не указана, используется текущее время."
                >
                  <DatePicker
                    showTime
                    format="YYYY-MM-DD HH:mm"
                    style={{ width: '100%' }}
                    placeholder="Выберите дату и время"
                    size="large"
                    className="w-full"
                  />
                </Form.Item>
                {publishedAt && (
                  <p className="text-xs text-muted-foreground">
                    {publishedAt.isBefore(dayjs())
                      ? 'Запись будет опубликована сразу'
                      : `Запись будет опубликована ${publishedAt.format('DD.MM.YYYY в HH:mm')}`}
                  </p>
                )}
              </div>
            </Card>

            {/* Термы */}
            {isEditMode && store.termsManagerStore && (
              <Card className="p-6 shadow-sm">
                <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <TagIcon className="w-5 h-5" />
                  Категории и теги
                </h2>
                <Form.Item name="term_ids" className="mb-0">
                  <EntryTermsManager store={store.termsManagerStore} disabled={store.loading} />
                </Form.Item>
              </Card>
            )}
          </div>
        </div>
      </Form>
    </PageLayout>
  );
});

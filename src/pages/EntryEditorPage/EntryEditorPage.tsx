import { EntryTermsManager } from '@/components/EntryTermsManager/EntryTermsManager';
import { SchemaForm } from '@/components/schemaForm/SchemaForm';
import { SlugInput } from '@/components/SlugInput';
import { buildUrl, PageUrl } from '@/PageUrl';
import { Button, Card, Collapse, DatePicker, Form, Input, Select, Spin, Switch, Tag } from 'antd';
import { Calendar, Check, FileText, Info, Settings, Tag as TagIcon } from 'lucide-react';
import { observer } from 'mobx-react-lite';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { viewDate } from '@/utils/dateUtils';
import dayjs from 'dayjs';
import { PageHeader } from '@/components/PageHeader/PageHeader';
import { EntryEditorStore } from './EntryEditorStore';
import type { EntryEditorFormValues } from './transforms';
import type { ZId } from '@/types/ZId';

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
  const titleValue = Form.useWatch('title', form);
  const isPublished = Form.useWatch('is_published', form) ?? false;
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
        content_json: store.blueprintModel?.json ?? values.content_json,
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
    if (!isPublished) {
      return { text: 'Черновик', color: 'default' as const };
    }
    if (publishedAt && publishedAt.isBefore(dayjs())) {
      return { text: 'Опубликовано', color: 'success' as const };
    }
    return { text: 'Запланировано', color: 'processing' as const };
  };

  const publicationStatus = getPublicationStatus();

  return (
    <div className="bg-background w-full">
      <PageHeader
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
      />

      <div className="px-6 py-8 w-full max-w-7xl mx-auto">
        {store.loading ? (
          <div className="flex flex-col items-center justify-center py-16">
            <Spin size="large" />
            <p className="mt-4 text-sm text-muted-foreground">
              {isEditMode ? 'Загрузка записи...' : 'Подготовка формы...'}
            </p>
          </div>
        ) : (
          <Form<EntryEditorFormValues> form={form} layout="vertical" onFinish={handleSubmit}>
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

                    {/* Slug */}
                    <div className="space-y-2">
                      <Form.Item
                        label={
                          <span className="text-base font-semibold flex items-center gap-2">
                            <span>URL-адрес</span>
                            {titleValue && (
                              <Tag color="blue" className="text-xs">
                                Автогенерация
                              </Tag>
                            )}
                          </span>
                        }
                        name="slug"
                        rules={[
                          { required: true, message: 'URL-адрес обязателен.' },
                          {
                            pattern: /^[a-z0-9-]+$/,
                            message:
                              'URL-адрес может содержать только строчные латинские буквы, цифры и дефис.',
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
                      <p className="text-sm text-muted-foreground ml-6 flex items-start gap-1">
                        <Info className="w-4 h-4 mt-0.5 flex-shrink-0" />
                        <span>
                          Уникальный идентификатор записи в URL. Автоматически генерируется из
                          заголовка при создании.
                        </span>
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
                {!store.loading && store.postType?.blueprint_id && store.blueprintModel && (
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
                      label="Опубликовано"
                      name="is_published"
                      valuePropName="checked"
                      className="mb-4"
                      tooltip="Опубликованные записи видны пользователям. Черновики доступны только редакторам."
                    >
                      <Switch size="default" />
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
        )}
      </div>
    </div>
  );
});

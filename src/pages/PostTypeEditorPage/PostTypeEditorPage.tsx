import { useCallback, useEffect, useState } from 'react';
import { Button, Card, Form, Input, Spin } from 'antd';
import { useNavigate, useParams } from 'react-router-dom';
import { Check, Info } from 'lucide-react';
import { createPostType, getPostType, updatePostType } from '@/api/apiPostTypes';
import { notificationService } from '@/services/notificationService';
import type { ZPostType, ZPostTypePayload } from '@/types/postTypes';
import { onError } from '@/utils/onError';
import { buildUrl, PageUrl } from '@/PageUrl';

interface FormValues {
  readonly name: string;
  readonly slug: string;
  readonly template: string;
  readonly options_json: string;
}

const defaultFormValues: FormValues = {
  name: '',
  slug: '',
  template: '',
  options_json: '',
};

const optionsPlaceholder = '{\n  "fields": {}\n}';

/**
 * Преобразует данные типа контента в значения формы.
 * @param postType Тип контента, полученный из API.
 * @returns Значения формы, готовые к отображению пользователю.
 */
const toFormValues = (postType: ZPostType, fallbackTemplate = ''): FormValues => {
  const options = postType.options_json ?? {};

  return {
    name: postType.name,
    slug: postType.slug,
    template: postType.template ?? fallbackTemplate ?? '',
    options_json: JSON.stringify(options, null, 2),
  };
};

/**
 * Преобразует строку с JSON в объект настроек типа контента.
 * @param rawValue Строка из текстового поля.
 * @returns Объект настроек.
 * @throws Ошибка, если в строке содержится некорректный JSON или не-объект.
 */
const parseOptionsJson = (rawValue: string): Record<string, unknown> => {
  const trimmed = rawValue.trim();

  if (trimmed.length === 0) {
    return {};
  }

  let parsed: unknown;
  try {
    parsed = JSON.parse(trimmed);
  } catch {
    throw new Error('Поле «Настройки» должно содержать корректный JSON.');
  }

  if (parsed === null || Array.isArray(parsed) || typeof parsed !== 'object') {
    throw new Error('Поле «Настройки» должно описывать JSON-объект.');
  }

  return parsed as Record<string, unknown>;
};

/**
 * Форма создания и редактирования типа контента CMS.
 */
export const PostTypeEditorPage = () => {
  const { slug } = useParams<{ slug?: string }>();
  const [form] = Form.useForm<FormValues>();
  const navigate = useNavigate();
  const isEditMode = slug !== 'new' && slug !== undefined;
  const [initialLoading, setInitialLoading] = useState<boolean>(isEditMode);
  const [pending, setPending] = useState(false);

  useEffect(() => {
    if (!isEditMode) {
      form.setFieldsValue(defaultFormValues);
      return;
    }

    const load = async () => {
      setInitialLoading(true);
      try {
        const postType = await getPostType(slug);
        form.setFieldsValue(toFormValues(postType));
      } catch (error) {
        onError(error);
        navigate(PageUrl.ContentTypes);
      } finally {
        setInitialLoading(false);
      }
    };

    void load();
  }, [form, isEditMode, navigate, slug]);

  /**
   * Сохраняет изменения формы.
   * @param values Текущие значения формы АнтД.
   */
  const handleSubmit = useCallback(
    async (values: FormValues) => {
      setPending(true);

      let options: Record<string, unknown>;
      try {
        options = parseOptionsJson(values.options_json);
      } catch (jsonError) {
        setPending(false);
        form.setFields([
          {
            name: 'options_json',
            errors: [jsonError instanceof Error ? jsonError.message : 'Некорректный JSON'],
          },
        ]);
        return;
      }

      const payload: ZPostTypePayload = {
        slug: values.slug.trim(),
        name: values.name.trim(),
        template: values.template.trim() || undefined,
        options_json: options,
      };

      try {
        const nextPostType =
          isEditMode && slug ? await updatePostType(slug, payload) : await createPostType(payload);

        const successMessage = isEditMode ? 'Тип контента обновлён' : 'Тип контента создан';
        notificationService.showSuccess({ message: successMessage });
        form.setFieldsValue(toFormValues(nextPostType, payload.template ?? ''));

        if (!isEditMode || nextPostType.slug !== slug) {
          navigate(buildUrl(PageUrl.ContentTypesEdit, { slug: nextPostType.slug }), {
            replace: false,
          });
        }
      } catch (error) {
        onError(error);
      } finally {
        setPending(false);
      }
    },
    [form, isEditMode, navigate, slug]
  );

  const handleCancel = useCallback(() => {
    navigate(PageUrl.ContentTypes);
  }, [navigate]);

  return (
    <div className="min-h-screen bg-background w-full">
      {/* Breadcrumbs and action buttons */}
      <div className="border-b bg-card w-full">
        <div className="px-6 py-4 w-full">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <span
                className="hover:text-foreground cursor-pointer transition-colors"
                onClick={() => navigate(PageUrl.ContentTypes)}
              >
                Типы контента
              </span>
              <span>/</span>
              <span className="text-foreground font-medium">
                {isEditMode ? 'Редактирование' : 'Создание'}
              </span>
            </div>
            <div className="flex items-center gap-3">
              <Button onClick={handleCancel}>Отмена</Button>
              <Button
                type="primary"
                onClick={() => form.submit()}
                loading={pending}
                icon={<Check className="w-4 h-4" />}
              >
                Сохранить
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="px-6 py-8 w-full max-w-[1400px] mx-auto">
        {initialLoading ? (
          <div className="flex justify-center py-12">
            <Spin size="large" />
          </div>
        ) : (
          <Form<FormValues>
            form={form}
            layout="vertical"
            initialValues={defaultFormValues}
            onFinish={handleSubmit}
          >
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Main Content */}
              <div className="lg:col-span-2 space-y-6">
                <Card className="p-6">
                  <h2 className="text-2xl font-semibold mb-6">Основные настройки</h2>

                  <div className="space-y-6">
                    {/* Name */}
                    <div className="space-y-2">
                      <Form.Item
                        label={
                          <span className="text-base">
                            Название <span className="text-destructive">*</span>
                          </span>
                        }
                        name="name"
                        rules={[
                          { required: true, message: 'Название обязательно.' },
                          { max: 255, message: 'Название не должно превышать 255 символов.' },
                        ]}
                        className="mb-0"
                      >
                        <Input placeholder="Например, Articles" className="text-lg" />
                      </Form.Item>
                      <p className="text-sm text-muted-foreground">
                        Название типа контента, отображаемое в интерфейсе
                      </p>
                    </div>

                    {/* Slug */}
                    <div className="space-y-2">
                      <Form.Item
                        label={
                          <span className="text-base">
                            Slug <span className="text-destructive">*</span>
                          </span>
                        }
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
                        <Input placeholder="article" disabled={initialLoading || pending} />
                      </Form.Item>
                      <p className="text-sm text-muted-foreground flex items-start gap-1">
                        <Info className="w-4 h-4 mt-0.5 flex-shrink-0" />
                        <span>Уникальный идентификатор типа контента в URL</span>
                      </p>
                    </div>

                    {/* Template */}
                    <div className="space-y-2">
                      <Form.Item
                        label={
                          <span className="text-base">
                            Шаблон{' '}
                            <span className="text-muted-foreground text-sm">(необязательно)</span>
                          </span>
                        }
                        name="template"
                        className="mb-0"
                      >
                        <Input placeholder="single-article" />
                      </Form.Item>
                      <p className="text-sm text-muted-foreground">
                        Имя шаблона для отображения записей этого типа контента
                      </p>
                    </div>
                  </div>
                </Card>

                {/* JSON Settings */}
                <Card className="p-6">
                  <h2 className="text-lg font-semibold mb-4">Дополнительные настройки</h2>

                  <div className="space-y-2">
                    <Form.Item
                      label={
                        <span className="text-base">
                          Настройки (JSON){' '}
                          <span className="text-muted-foreground text-sm">(необязательно)</span>
                        </span>
                      }
                      name="options_json"
                      className="mb-0"
                    >
                      <Input.TextArea
                        rows={8}
                        placeholder={optionsPlaceholder}
                        spellCheck={false}
                        className="font-mono text-sm"
                      />
                    </Form.Item>
                    <p className="text-sm text-muted-foreground">
                      Дополнительные настройки типа контента в формате JSON. Настройки принимают
                      JSON-объект.
                    </p>
                  </div>
                </Card>
              </div>

              {/* Sidebar */}
              <div className="lg:col-span-1">
                <Card className="p-6 sticky top-24">
                  <h2 className="text-lg font-semibold mb-6">Информация</h2>
                  <div className="space-y-4 text-sm text-muted-foreground">
                    <p>
                      Тип контента определяет структуру и поведение записей в системе управления
                      контентом.
                    </p>
                    <p>
                      После создания типа контента вы сможете добавлять записи этого типа и
                      настраивать их поля.
                    </p>
                  </div>
                </Card>
              </div>
            </div>
          </Form>
        )}
      </div>
    </div>
  );
};

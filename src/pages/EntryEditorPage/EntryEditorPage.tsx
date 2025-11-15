import { EntryTermsManager } from '@/components/EntryTermsManager/EntryTermsManager';
import { buildUrl, PageUrl } from '@/PageUrl';
import { Card, Form, Spin, Tabs } from 'antd';
import { observer } from 'mobx-react-lite';
import { useCallback, useEffect, useMemo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { EntryEditorStore, type FormValues } from './EntryEditorStore';
import { EntryEditorHeader } from './EntryEditorHeader';
import { MainTabContent } from './MainTabContent';

/**
 * Страница создания и редактирования записи CMS.
 */
export const EntryEditorPage = observer(() => {
  const { postType: postTypeSlug, id } = useParams<{ postType?: string; id?: string }>();

  const store = useMemo(
    () => (postTypeSlug && id ? new EntryEditorStore(postTypeSlug, id) : null),
    [postTypeSlug, id]
  );

  if (!store) return null;

  return <Inner store={store} />;
});

interface PropsInner {
  store: EntryEditorStore;
}
const Inner = observer(({ store }: PropsInner) => {
  const [form] = Form.useForm<FormValues>();
  const navigate = useNavigate();
  const titleValue = Form.useWatch('title', form);
  const isEditMode = store?.isEditMode ?? false;
  const { currentPostTypeSlug: postTypeSlug, entryId: id } = store;

  useEffect(() => {
    form.setFieldsValue(store?.formValues ?? {});
  }, [form, store?.formValues]);

  const handleSubmit = useCallback(
    async (values: FormValues) => {
      const nextEntry = await store.saveEntry(values, isEditMode, id, postTypeSlug);
      if (nextEntry) {
        const url = buildUrl(PageUrl.EntryEdit, {
          postType: postTypeSlug,
          id: String(nextEntry.id),
        });
        navigate(url, { replace: !isEditMode });
      }
    },
    [isEditMode, navigate, postTypeSlug, id, store]
  );

  const handleCancel = useCallback(() => {
    navigate(
      postTypeSlug ? buildUrl(PageUrl.EntriesByType, { postType: postTypeSlug }) : PageUrl.Entries
    );
  }, [navigate, postTypeSlug]);

  const handleSave = useCallback(() => {
    form.submit();
  }, [form]);

  const tabsItems = useMemo(
    () => [
      {
        key: 'main',
        label: 'Основное',
        children: <MainTabContent titleValue={titleValue} isEditMode={isEditMode} store={store} />,
      },
      ...(isEditMode && id
        ? [
            {
              key: 'terms',
              label: 'Термы',
              children: (
                <Card className="p-6">
                  <EntryTermsManager
                    entryId={id}
                    disabled={store.pending || store.initialLoading}
                  />
                </Card>
              ),
            },
          ]
        : []),
    ],
    [isEditMode, id, store]
  );

  return (
    <div className="min-h-screen bg-background w-full">
      <EntryEditorHeader
        postType={store.postType}
        isEditMode={isEditMode}
        onSave={handleSave}
        pending={store.pending}
        onCancel={handleCancel}
      />

      <div className="px-6 w-full">
        {store.loading ? (
          <div className="flex justify-center py-12">
            <Spin size="large" />
          </div>
        ) : (
          <Form<FormValues>
            form={form}
            layout="vertical"
            initialValues={store.formValues}
            onFinish={handleSubmit}
          >
            <Tabs items={tabsItems} />
          </Form>
        )}
      </div>
    </div>
  );
});

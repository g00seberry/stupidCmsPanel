import { useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { observer } from 'mobx-react-lite';
import { Button, Card, Form, Spin } from 'antd';
import { CheckOutlined } from '@ant-design/icons';
import { PageLayout } from '@/components/PageLayout';
import { RouteEditorStore } from './RouteEditorStore';
import { RouteForm } from '@/components/RouteForm';
import { buildUrl, PageUrl } from '@/PageUrl';
import type { ZCreateRouteNodeDto, ZUpdateRouteNodeDto } from '@/types/routes';

const idNew = 'new';

/**
 * Страница создания и редактирования маршрута.
 */
export const RouteEditorPage = observer(() => {
  const { id } = useParams<{ id?: string }>();
  const navigate = useNavigate();
  const [form] = Form.useForm();

  const routeId = id === 'new' ? idNew : id ? Number.parseInt(id, 10) : idNew;

  const store = useMemo(() => {
    return new RouteEditorStore(routeId);
  }, [routeId]);

  const isEditMode = store.isEditMode;

  /**
   * Обработчик сохранения формы.
   */
  const handleSubmit = async (values: ZCreateRouteNodeDto | ZUpdateRouteNodeDto): Promise<void> => {
    if (isEditMode) {
      const result = await store.updateRoute(routeId as number, values as ZUpdateRouteNodeDto);
      if (result) {
        navigate(buildUrl(PageUrl.RouteEdit, { id: String(result.id) }), { replace: true });
      }
    } else {
      const result = await store.createRoute(values as ZCreateRouteNodeDto);
      if (result) {
        navigate(buildUrl(PageUrl.RouteEdit, { id: String(result.id) }), { replace: true });
      }
    }
  };

  /**
   * Обработчик отмены.
   */
  const handleCancel = (): void => {
    navigate(PageUrl.Routes);
  };

  /**
   * Обработчик сохранения.
   */
  const handleSave = (): void => {
    form.submit();
  };

  return (
    <PageLayout
      breadcrumbs={[
        { label: 'Маршруты', onClick: () => navigate(PageUrl.Routes) },
        isEditMode ? 'Редактирование' : 'Создание',
      ]}
      extra={
        <>
          <Button onClick={handleCancel}>Отмена</Button>
          <Button
            type="primary"
            onClick={handleSave}
            loading={store.saving}
            icon={<CheckOutlined />}
          >
            Сохранить
          </Button>
        </>
      }
    >
      <div className="w-full max-w-4xl mx-auto">
        {store.loading ? (
          <div className="flex flex-col items-center justify-center py-16">
            <Spin size="large" />
            <p className="mt-4 text-sm text-muted-foreground">
              {isEditMode ? 'Загрузка маршрута...' : 'Подготовка формы...'}
            </p>
          </div>
        ) : (
          <Card>
            <RouteForm
              form={form}
              initialValues={store.route}
              readonly={store.route?.readonly ?? false}
              onFinish={handleSubmit}
            />
          </Card>
        )}
      </div>
    </PageLayout>
  );
});

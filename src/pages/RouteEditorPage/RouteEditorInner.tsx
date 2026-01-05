import { PageLayout } from '@/components/PageLayout';
import { RouteForm } from '@/pages/RouteEditorPage/RouteForm';
import { buildUrl, PageUrl } from '@/PageUrl';
import { CheckOutlined } from '@ant-design/icons';
import { Button, Form } from 'antd';
import { observer } from 'mobx-react-lite';
import type React from 'react';
import { useNavigate } from 'react-router-dom';
import { RouteEditorStore } from './RouteEditorStore';

interface PropsRouteEditorInner {
  store: RouteEditorStore;
}

/**
 * Внутренний компонент страницы редактирования маршрута.
 */
export const RouteEditorInner: React.FC<PropsRouteEditorInner> = observer(({ store }) => {
  const navigate = useNavigate();
  const [form] = Form.useForm();

  /**
   * Обработчик отмены.
   */
  const handleCancel = (): void => {
    navigate(PageUrl.Routes);
  };

  /**
   * Обработчик сохранения.
   */
  const handleSave = async () => {
    const values = await form.validateFields();
    const result = await store.createRoute(values);
    if (result) {
      navigate(buildUrl(PageUrl.RouteEdit, { id: String(result.id) }), { replace: true });
    }
  };

  return (
    <PageLayout
      breadcrumbs={[
        { label: 'Маршруты', onClick: () => navigate(PageUrl.Routes) },
        'Редактирование',
      ]}
      extra={
        <>
          <Button onClick={handleCancel}>Отмена</Button>
          <Button type="primary" onClick={handleSave} icon={<CheckOutlined />}>
            Сохранить
          </Button>
        </>
      }
      loading={store.loading}
    >
      <RouteForm
        form={form}
        initialValues={store.route}
        readonly={store.route?.readonly ?? false}
      />
    </PageLayout>
  );
});

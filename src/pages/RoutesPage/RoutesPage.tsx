import { buildUrl, PageUrl } from '@/PageUrl';
import { PageLayout } from '@/components/PageLayout';
import { Button, Tree } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { observer } from 'mobx-react-lite';
import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { RoutesListStore } from './RoutesListStore';
import { findInTree } from '@/utils/treeUtils';
import { notificationService } from '@/services/notificationService';

/**
 * Страница со списком маршрутов.
 */
export const RoutesPage = observer(() => {
  const navigate = useNavigate();
  const store = useMemo(() => {
    const s = new RoutesListStore();
    s.initialize();
    return s;
  }, []);

  /**
   * Обработчик редактирования маршрута.
   */
  const handleEdit = (id: string): void => {
    if (!store.routes) return;
    const node = findInTree(store.routes, Number(id), 'id');
    if (node?.readonly) {
      notificationService.showWarning({ message: 'Системные роуты нельзя редактировать' });
      return;
    }
    navigate(buildUrl(PageUrl.RouteEdit, { id: String(id) }));
  };

  return (
    <PageLayout
      breadcrumbs={['Маршруты']}
      extra={
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => {
            navigate(PageUrl.RouteNew);
          }}
        >
          Создать маршрут
        </Button>
      }
    >
      <Tree treeData={store.treeData} onSelect={([id]) => handleEdit(String(id))} />
    </PageLayout>
  );
});

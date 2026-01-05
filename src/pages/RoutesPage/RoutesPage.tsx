import { buildUrl, PageUrl } from '@/PageUrl';
import { PageLayout } from '@/components/PageLayout';
import { Button, Tree } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { observer } from 'mobx-react-lite';
import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { RoutesListStore } from './RoutesListStore';

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
  const handleEdit = (id: number): void => {
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
      <Tree treeData={store.treeData} onSelect={([id]) => handleEdit(Number(id))} />
    </PageLayout>
  );
});

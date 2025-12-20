import { buildUrl, PageUrl } from '@/PageUrl';
import { PageLayout } from '@/components/PageLayout';
import { Button, Tree, Typography } from 'antd';
import { Plus } from 'lucide-react';
import { observer } from 'mobx-react-lite';
import { useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { RoutesListStore } from './RoutesListStore';

const { Title, Paragraph } = Typography;

/**
 * Страница со списком маршрутов.
 */
export const RoutesPage = observer(() => {
  const navigate = useNavigate();
  const store = useMemo(() => new RoutesListStore(), []);

  // Инициализация загрузки данных
  useEffect(() => {
    void store.initialize();
  }, [store]);

  /**
   * Обработчик редактирования маршрута.
   */
  const handleEdit = (id: number): void => {
    navigate(buildUrl(PageUrl.RouteEdit, { id: String(id) }));
  };

  // /**
  //  * Обработчик удаления маршрута.
  //  */
  // const handleDelete = (id: number): void => {
  //   Modal.confirm({
  //     title: 'Удалить маршрут?',
  //     content: 'Это действие приведёт к каскадному удалению всех дочерних узлов. Продолжить?',
  //     okText: 'Удалить',
  //     okType: 'danger',
  //     cancelText: 'Отмена',
  //     onOk: async () => {
  //       try {
  //         await deleteRoute(id);
  //         notificationService.showSuccess({ message: 'Маршрут удалён' });
  //         await store.loadRoutes();
  //       } catch (error) {
  //         onError(error);
  //       }
  //     },
  //   });
  // };

  // /**
  //  * Обработчик переключения статуса enabled.
  //  */
  // const handleToggleEnabled = async (id: number, enabled: boolean): Promise<void> => {
  //   try {
  //     await updateRoute(id, { enabled });
  //     notificationService.showSuccess({
  //       message: enabled ? 'Маршрут включён' : 'Маршрут выключен',
  //     });
  //     await store.loadRoutes();
  //   } catch (error) {
  //     onError(error);
  //   }
  // };

  return (
    <PageLayout
      breadcrumbs={['Маршруты']}
      extra={
        <Button
          type="primary"
          icon={<Plus className="w-4 h-4" />}
          onClick={() => {
            navigate(PageUrl.RouteNew);
          }}
        >
          Создать маршрут
        </Button>
      }
    >
      {/* Заголовок */}
      <div className="mb-6">
        <Title level={3} className="mb-2">
          Маршруты
        </Title>
        <Paragraph type="secondary" className="mb-0">
          Управление маршрутами приложения (декларативные и динамические)
        </Paragraph>
      </div>

      <Tree treeData={store.treeData} onSelect={([id]) => handleEdit(Number(id))} />
    </PageLayout>
  );
});

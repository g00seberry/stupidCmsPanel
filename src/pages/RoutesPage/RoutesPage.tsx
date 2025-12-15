import { useEffect, useMemo } from 'react';
import { observer } from 'mobx-react-lite';
import { Button, Modal, Tree, Typography } from 'antd';
import { Plus } from 'lucide-react';
import { PageHeader } from '@/components/PageHeader/PageHeader';
import { RoutesListStore } from './RoutesListStore';
import { useNavigate } from 'react-router-dom';
import { buildUrl, PageUrl } from '@/PageUrl';
import { updateRoute, deleteRoute } from '@/api/apiRoutes';
import { notificationService } from '@/services/notificationService';
import { onError } from '@/utils/onError';

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

  /**
   * Обработчик удаления маршрута.
   */
  const handleDelete = (id: number): void => {
    Modal.confirm({
      title: 'Удалить маршрут?',
      content: 'Это действие приведёт к каскадному удалению всех дочерних узлов. Продолжить?',
      okText: 'Удалить',
      okType: 'danger',
      cancelText: 'Отмена',
      onOk: async () => {
        try {
          await deleteRoute(id);
          notificationService.showSuccess({ message: 'Маршрут удалён' });
          await store.loadRoutes();
        } catch (error) {
          onError(error);
        }
      },
    });
  };

  /**
   * Обработчик переключения статуса enabled.
   */
  const handleToggleEnabled = async (id: number, enabled: boolean): Promise<void> => {
    try {
      await updateRoute(id, { enabled });
      notificationService.showSuccess({
        message: enabled ? 'Маршрут включён' : 'Маршрут выключен',
      });
      await store.loadRoutes();
    } catch (error) {
      onError(error);
    }
  };

  return (
    <div className="bg-background w-full">
      <PageHeader
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
      />

      <div className="px-6 py-8 w-full">
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
        {/* Таблица */}
        {/* <RoutesTable
          store={store}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onToggleEnabled={handleToggleEnabled}
        /> */}
      </div>
    </div>
  );
});

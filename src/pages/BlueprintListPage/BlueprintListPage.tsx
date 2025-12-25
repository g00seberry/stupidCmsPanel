import { BlueprintList } from '@/pages/BlueprintListPage/BlueprintList';
import { BlueprintListStore } from '@/pages/BlueprintListPage/BlueprintListStore';
import { DeleteButton } from '@/components/DeleteButton';
import { buildUrl, PageUrl } from '@/PageUrl';
import { Button, Space } from 'antd';
import { Plus } from 'lucide-react';
import { observer } from 'mobx-react-lite';
import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { PageLayout } from '@/components/PageLayout';

/**
 * Страница со списком Blueprint.
 */
export const BlueprintListPage = observer(() => {
  const store = useMemo(() => {
    const s = new BlueprintListStore();
    void s.initialize();
    return s;
  }, []);

  return (
    <PageLayout
      breadcrumbs={['Blueprint']}
      extra={
        <Space>
          <DeleteButton
            onDelete={() => store.bulkDelete()}
            selectedCount={store.selectedCount}
            loading={store.deleting}
            itemName="Blueprint"
          />
          <Link to={buildUrl(PageUrl.BlueprintsEdit, { id: 'new' })}>
            <Button type="primary" icon={<Plus className="w-4 h-4" />}>
              Создать
            </Button>
          </Link>
        </Space>
      }
    >
      <BlueprintList store={store} />
    </PageLayout>
  );
});

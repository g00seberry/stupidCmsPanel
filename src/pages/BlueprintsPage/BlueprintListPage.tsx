import { BlueprintList } from '@/pages/BlueprintsPage/BlueprintList';
import { BlueprintListStore } from '@/pages/BlueprintsPage/BlueprintListStore';
import { buildUrl, PageUrl } from '@/PageUrl';
import { Button } from 'antd';
import { Plus } from 'lucide-react';
import { observer } from 'mobx-react-lite';
import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { PageHeader } from '@/components/PageHeader/PageHeader';

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
    <div className="bg-background w-full">
      <PageHeader
        breadcrumbs={['Blueprint']}
        extra={
          <Link to={buildUrl(PageUrl.BlueprintsEdit, { id: 'new' })}>
            <Button type="primary" icon={<Plus className="w-4 h-4" />}>
              Создать
            </Button>
          </Link>
        }
      />

      <div className="p-6">
        <BlueprintList store={store} />
      </div>
    </div>
  );
});

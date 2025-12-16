import { BlueprintList } from '@/pages/BlueprintListPage/BlueprintList';
import { BlueprintListStore } from '@/pages/BlueprintListPage/BlueprintListStore';
import { buildUrl, PageUrl } from '@/PageUrl';
import { Button } from 'antd';
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
        <Link to={buildUrl(PageUrl.BlueprintsEdit, { id: 'new' })}>
          <Button type="primary" icon={<Plus className="w-4 h-4" />}>
            Создать
          </Button>
        </Link>
      }
    >
      <BlueprintList store={store} />
    </PageLayout>
  );
});

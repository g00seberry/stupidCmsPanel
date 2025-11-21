import { BlueprintList } from '@/pages/BlueprintsPage/BlueprintList';
import { BlueprintListStore } from '@/pages/BlueprintsPage/BlueprintListStore';
import { buildUrl, PageUrl } from '@/PageUrl';
import { Button } from 'antd';
import { Plus } from 'lucide-react';
import { observer } from 'mobx-react-lite';
import { useMemo } from 'react';
import { Link } from 'react-router-dom';

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
    <div className="min-h-screen bg-background w-full">
      <div className="border-b bg-card w-full">
        <div className="px-6 py-4 w-full">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <span className="hover:text-foreground cursor-pointer transition-colors">
                Blueprint
              </span>
            </div>
            <div className="flex items-center gap-3">
              <Link to={buildUrl(PageUrl.BlueprintsEdit, { id: 'new' })}>
                <Button type="primary" icon={<Plus className="w-4 h-4" />}>
                  Создать
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="p-6">
        <BlueprintList store={store} />
      </div>
    </div>
  );
});

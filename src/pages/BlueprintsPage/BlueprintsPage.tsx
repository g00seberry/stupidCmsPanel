import { observer } from 'mobx-react-lite';
import { useCallback, useEffect, useMemo } from 'react';
import { Button } from 'antd';
import { Link } from 'react-router-dom';
import { Plus } from 'lucide-react';
import { BlueprintList } from '@/components/blueprints/BlueprintList';
import { BlueprintStore } from '@/stores/BlueprintStore';
import { buildUrl, PageUrl } from '@/PageUrl';

/**
 * Страница со списком Blueprint.
 */
export const BlueprintsPage = observer(() => {
  const store = useMemo(() => new BlueprintStore(), []);

  const handleLoad = useCallback(() => {
    void store.loadBlueprints();
  }, [store]);

  useEffect(() => {
    handleLoad();
  }, [handleLoad]);

  const handleEdit = useCallback(() => {
    // Навигация будет обработана через Link в BlueprintList
  }, []);

  const handleDelete = useCallback(
    (id: number) => {
      void store.deleteBlueprint(id);
    },
    [store]
  );

  const editUrl = useCallback(
    (id: number) => buildUrl(PageUrl.BlueprintsEdit, { id: String(id) }),
    []
  );

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
        <BlueprintList
          store={store}
          onEdit={handleEdit}
          onDelete={handleDelete}
          editUrl={editUrl}
        />
      </div>
    </div>
  );
});

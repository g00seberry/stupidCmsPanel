import { useCallback, useEffect, useState } from 'react';
import { Button, Card, Empty, Spin } from 'antd';
import { Link, useNavigate } from 'react-router-dom';
import { Plus, List } from 'lucide-react';
import { listPostTypes } from '@/api/apiPostTypes';
import type { ZPostType } from '@/types/postTypes';
import { onError } from '@/utils/onError';
import { buildUrl, PageUrl } from '@/PageUrl';

/**
 * Страница со списком типов контента CMS.
 */
export const PostTypesPage = () => {
  const [postTypes, setPostTypes] = useState<ZPostType[]>([]);
  const [pending, setPending] = useState(false);
  const navigate = useNavigate();

  /**
   * Загружает данные типов контента с сервера.
   */
  const loadPostTypes = useCallback(async () => {
    setPending(true);

    try {
      const data = await listPostTypes();
      setPostTypes(data);
    } catch (loadError) {
      onError(loadError);
    } finally {
      setPending(false);
    }
  }, []);

  useEffect(() => {
    void loadPostTypes();
  }, [loadPostTypes]);

  return (
    <div className="min-h-screen bg-background w-full">
      {/* Breadcrumbs and action buttons */}
      <div className="border-b bg-card w-full">
        <div className="px-6 py-4 w-full">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <span className="hover:text-foreground cursor-pointer transition-colors">
                Типы контента
              </span>
            </div>
            <div className="flex items-center gap-3">
              <Button
                type="primary"
                onClick={() => navigate(buildUrl(PageUrl.ContentTypesEdit, { slug: 'new' }))}
                icon={<Plus className="w-4 h-4" />}
              >
                Создать тип
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="px-6 py-8 w-full">
        {pending ? (
          <div className="flex justify-center py-12">
            <Spin size="large" />
          </div>
        ) : postTypes.length === 0 ? (
          <div className="flex justify-center py-12">
            <Empty description="Типы контента отсутствуют" />
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {postTypes.map(postType => (
              <Card
                key={postType.slug}
                className="p-6 transition-all hover:shadow-lg hover:-translate-y-1"
              >
                <div className="space-y-3">
                  <h3 className="text-lg font-semibold text-foreground">{postType.name}</h3>
                  <code className="block text-sm text-muted-foreground bg-muted px-2 py-1 rounded font-mono">
                    {postType.slug}
                  </code>
                  {postType.updated_at && (
                    <p className="text-xs text-muted-foreground">
                      Обновлено: {new Date(postType.updated_at).toLocaleDateString('ru-RU')}
                    </p>
                  )}
                  <div className="flex gap-2 pt-2">
                    <Link to={buildUrl(PageUrl.EntriesByType, { postType: postType.slug })}>
                      <Button type="primary" size="small" icon={<List className="w-4 h-4" />}>
                        Записи
                      </Button>
                    </Link>
                    <Link to={buildUrl(PageUrl.ContentTypesEdit, { slug: postType.slug })}>
                      <Button size="small">Редактировать</Button>
                    </Link>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

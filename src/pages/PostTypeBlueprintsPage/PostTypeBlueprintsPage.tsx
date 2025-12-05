import { observer } from 'mobx-react-lite';
import { useCallback, useEffect, useState } from 'react';
import { Button, Card, Empty, Radio, Spin } from 'antd';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { Check, ArrowLeft } from 'lucide-react';
import { listBlueprints } from '@/api/blueprintApi';
import { getPostType, updatePostType } from '@/api/apiPostTypes';
import type { ZBlueprintListItem } from '@/types/blueprint';
import type { ZPostType } from '@/types/postTypes';
import type { ZId } from '@/types/ZId';
import { onError } from '@/utils/onError';
import { buildUrl, PageUrl } from '@/PageUrl';

/**
 * Страница настройки Blueprint для типа контента.
 * Позволяет выбрать один Blueprint для привязки к PostType или отвязать Blueprint.
 */
export const PostTypeBlueprintsPage = observer(() => {
  const { id: idParam } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [postType, setPostType] = useState<ZPostType | null>(null);
  const [blueprints, setBlueprints] = useState<ZBlueprintListItem[]>([]);
  const [selectedBlueprintId, setSelectedBlueprintId] = useState<ZId | null>(null);
  const [pending, setPending] = useState(false);
  const [saving, setSaving] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);

  const postTypeId: ZId | null = idParam || null;

  /**
   * Загружает данные типа контента и список Blueprints.
   */
  const loadData = useCallback(async () => {
    if (!postTypeId) {
      return;
    }

    setInitialLoading(true);
    setPending(true);

    try {
      const [postTypeData, blueprintsData] = await Promise.all([
        getPostType(postTypeId),
        listBlueprints({ per_page: 1000 }),
      ]);

      setPostType(postTypeData);
      setBlueprints(blueprintsData.data);
      setSelectedBlueprintId(postTypeData.blueprint_id ?? null);
    } catch (error) {
      onError(error);
    } finally {
      setPending(false);
      setInitialLoading(false);
    }
  }, [postTypeId]);

  useEffect(() => {
    void loadData();
  }, [loadData]);

  /**
   * Обрабатывает изменение выбора Blueprint.
   */
  const handleBlueprintChange = useCallback((blueprintId: ZId | null) => {
    setSelectedBlueprintId(blueprintId);
  }, []);

  /**
   * Сохраняет изменения.
   */
  const handleSave = useCallback(async () => {
    if (!postTypeId || !postType) {
      return;
    }

    setSaving(true);

    try {
      await updatePostType(postTypeId, {
        slug: postType.slug,
        name: postType.name,
        options_json: postType.options_json,
        blueprint_id: selectedBlueprintId,
      });
      navigate(buildUrl(PageUrl.ContentTypesEdit, { id: postTypeId }));
    } catch (error) {
      onError(error);
    } finally {
      setSaving(false);
    }
  }, [postTypeId, postType, selectedBlueprintId, navigate]);

  const hasChanges = postType?.blueprint_id !== selectedBlueprintId;

  if (initialLoading) {
    return (
      <div className="min-h-screen bg-background w-full flex items-center justify-center">
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background w-full">
      {/* Breadcrumbs and action buttons */}
      <div className="border-b bg-card w-full">
        <div className="px-6 py-4 w-full">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Link
                to={PageUrl.ContentTypes}
                className="hover:text-foreground cursor-pointer transition-colors"
              >
                Типы контента
              </Link>
              <span>/</span>
              {postType && (
                <>
                  <Link
                    to={buildUrl(PageUrl.ContentTypesEdit, { id: postType.id })}
                    className="hover:text-foreground cursor-pointer transition-colors"
                  >
                    {postType.name}
                  </Link>
                  <span>/</span>
                </>
              )}
              <span className="text-foreground font-medium">Настройка Blueprints</span>
            </div>
            <div className="flex items-center gap-3">
              <Link
                to={
                  postType
                    ? buildUrl(PageUrl.ContentTypesEdit, { id: postType.id })
                    : PageUrl.ContentTypes
                }
              >
                <Button icon={<ArrowLeft className="w-4 h-4" />}>Назад</Button>
              </Link>
              <Button
                type="primary"
                onClick={handleSave}
                loading={saving}
                disabled={!hasChanges}
                icon={<Check className="w-4 h-4" />}
              >
                Сохранить
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="px-6 py-8 w-full">
        <Card className="p-6">
          <h2 className="text-2xl font-semibold mb-4">
            Настройка Blueprint для &quot;{postType?.name}&quot;
          </h2>
          <p className="text-muted-foreground mb-6">
            Выберите Blueprint, который будет использоваться для структуры данных этого типа
            контента. Blueprint определяет поля и их типы для записей данного типа.
          </p>

          {pending ? (
            <div className="flex justify-center py-12">
              <Spin size="large" />
            </div>
          ) : blueprints.length === 0 ? (
            <Empty description="Нет доступных Blueprints" />
          ) : (
            <Radio.Group
              value={selectedBlueprintId}
              onChange={e => handleBlueprintChange(e.target.value)}
              className="w-full"
            >
              <div className="space-y-3">
                <div
                  className={`flex items-center gap-3 p-4 border rounded-lg hover:bg-muted/50 transition-colors cursor-pointer ${
                    selectedBlueprintId === null ? 'border-primary bg-primary/5' : ''
                  }`}
                  onClick={() => handleBlueprintChange(null)}
                >
                  <Radio value={null} />
                  <div className="flex-1">
                    <div className="font-medium">Без Blueprint</div>
                    <div className="text-sm text-muted-foreground">
                      Тип контента не будет использовать структуру Blueprint
                    </div>
                  </div>
                </div>
                {blueprints.map(blueprint => {
                  const isSelected = selectedBlueprintId === blueprint.id;
                  return (
                    <div
                      key={blueprint.id}
                      className={`flex items-center gap-3 p-4 border rounded-lg hover:bg-muted/50 transition-colors cursor-pointer ${
                        isSelected ? 'border-primary bg-primary/5' : ''
                      }`}
                      onClick={() => handleBlueprintChange(blueprint.id)}
                    >
                      <Radio value={blueprint.id} />
                      <div className="flex-1">
                        <div className="font-medium">{blueprint.name}</div>
                        <div className="text-sm text-muted-foreground">
                          {blueprint.code} • {blueprint.paths_count} полей
                        </div>
                        {blueprint.description && (
                          <div className="text-sm text-muted-foreground mt-1">
                            {blueprint.description}
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </Radio.Group>
          )}
        </Card>
      </div>
    </div>
  );
});

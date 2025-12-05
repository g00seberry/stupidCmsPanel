import { useCallback, useEffect, useState } from 'react';
import { App, Button, Card, Empty, Spin, Tag, Input } from 'antd';
import { Link } from 'react-router-dom';
import { Plus, Search, List, Trash2 } from 'lucide-react';
import { PageHeader } from '@/components/PageHeader/PageHeader';
import { deleteTaxonomy, listTaxonomies } from '@/api/apiTaxonomies';
import type { ZTaxonomy } from '@/types/taxonomies';
import { onError } from '@/utils/onError';
import { buildUrl, PageUrl } from '@/PageUrl';
import { viewDate } from '@/utils/dateUtils';
import axios from 'axios';
import { zProblemJson } from '@/types/ZProblemJson';
import { notificationService } from '@/services/notificationService';

/**
 * Страница со списком таксономий CMS.
 */
export const TaxonomiesPage = () => {
  const [taxonomies, setTaxonomies] = useState<ZTaxonomy[]>([]);
  const [pending, setPending] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const { modal } = App.useApp();

  /**
   * Загружает данные таксономий с сервера.
   */
  const loadTaxonomies = useCallback(async () => {
    setPending(true);

    try {
      const params = searchQuery ? { q: searchQuery } : undefined;
      const data = await listTaxonomies(params);
      setTaxonomies(data);
    } catch (loadError) {
      onError(loadError);
    } finally {
      setPending(false);
    }
  }, [searchQuery]);

  useEffect(() => {
    void loadTaxonomies();
  }, [loadTaxonomies]);

  /**
   * Обрабатывает удаление таксономии с подтверждением и обработкой ошибок.
   * @param taxonomy Таксономия для удаления.
   */
  const handleDelete = useCallback(
    async (taxonomy: ZTaxonomy) => {
      modal.confirm({
        title: 'Удалить таксономию?',
        content: `Вы уверены, что хотите удалить таксономию "${taxonomy.label}"? Это действие нельзя отменить.`,
        okText: 'Удалить',
        okType: 'danger',
        cancelText: 'Отмена',
        onOk: async () => {
          try {
            await deleteTaxonomy(taxonomy.id, false);
            notificationService.showSuccess({ message: 'Таксономия удалена' });
            void loadTaxonomies();
          } catch (error) {
            // Обработка ошибки 409 (CONFLICT) - таксономия содержит термины
            if (axios.isAxiosError(error) && error.response?.status === 409) {
              const problemResult = zProblemJson.safeParse(error.response?.data);
              const termsCount =
                problemResult.success && typeof problemResult.data.meta?.terms_count === 'number'
                  ? problemResult.data.meta.terms_count
                  : null;

              modal.confirm({
                title: 'Невозможно удалить таксономию',
                content: termsCount
                  ? `Таксономия содержит ${termsCount} ${termsCount === 1 ? 'термин' : 'терминов'}. Вы можете удалить таксономию вместе со всеми терминами.`
                  : 'Таксономия содержит термины. Вы можете удалить таксономию вместе со всеми терминами.',
                okText: 'Удалить всё',
                okType: 'danger',
                cancelText: 'Отмена',
                onOk: async () => {
                  try {
                    await deleteTaxonomy(taxonomy.id, true);
                    notificationService.showSuccess({
                      message: 'Таксономия и все термины удалены',
                    });
                    void loadTaxonomies();
                  } catch (forceError) {
                    onError(forceError);
                  }
                },
              });
            } else {
              onError(error);
            }
          }
        },
      });
    },
    [loadTaxonomies, modal]
  );

  return (
    <div className="bg-background w-full">
      <PageHeader
        breadcrumbs={['Таксономии']}
        extra={
          <Link to={buildUrl(PageUrl.TaxonomiesEdit, { id: 'new' })}>
            <Button type="primary" icon={<Plus className="w-4 h-4" />}>
              Создать таксономию
            </Button>
          </Link>
        }
      />

      <div className="px-6 py-8 w-full">
        {/* Поиск */}
        <div className="mb-6">
          <Input
            placeholder="Поиск по названию"
            prefix={<Search className="w-4 h-4 text-muted-foreground" />}
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            allowClear
            style={{ maxWidth: 400 }}
          />
        </div>

        {pending ? (
          <div className="flex justify-center py-12">
            <Spin size="large" />
          </div>
        ) : taxonomies.length === 0 ? (
          <div className="flex justify-center py-12">
            <Empty description="Таксономии отсутствуют" />
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {taxonomies.map(taxonomy => (
              <Card
                key={taxonomy.id}
                className="transition-all hover:shadow-lg hover:-translate-y-1"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-foreground">{taxonomy.label}</h3>
                    {taxonomy.hierarchical && (
                      <Tag color="blue" className="text-xs">
                        Иерархическая
                      </Tag>
                    )}
                  </div>
                  <code className="block text-sm text-muted-foreground bg-muted px-2 py-1 rounded font-mono">
                    ID: {taxonomy.id}
                  </code>
                  {taxonomy.updated_at && (
                    <p className="text-xs text-muted-foreground">
                      Обновлено: {viewDate(taxonomy.updated_at)?.format('DD.MM.YYYY HH:mm') || '-'}
                    </p>
                  )}
                  <div className="flex gap-2 pt-2">
                    <Link
                      to={buildUrl(PageUrl.TermsByTaxonomy, { taxonomyId: String(taxonomy.id) })}
                    >
                      <Button type="primary" size="small" icon={<List className="w-4 h-4" />}>
                        Термины
                      </Button>
                    </Link>
                    <Link to={buildUrl(PageUrl.TaxonomiesEdit, { id: String(taxonomy.id) })}>
                      <Button size="small">Редактировать</Button>
                    </Link>
                    <Button
                      danger
                      size="small"
                      icon={<Trash2 className="w-4 h-4" />}
                      onClick={e => {
                        e.preventDefault();
                        void handleDelete(taxonomy);
                      }}
                    />
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

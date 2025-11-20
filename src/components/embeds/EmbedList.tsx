import { observer } from 'mobx-react-lite';
import { Button, List, Space, Tag } from 'antd';
import { Trash2, Eye } from 'lucide-react';
import type { ZBlueprintEmbed } from '@/types/blueprintEmbed';
import { BlueprintEmbedStore } from '@/stores/BlueprintEmbedStore';

/**
 * Пропсы компонента списка встраиваний Blueprint.
 */
export type PropsEmbedList = {
  /** Store для управления встраиваниями. */
  store: BlueprintEmbedStore;
  /** Обработчик удаления встраивания. */
  onDelete?: (id: number) => void;
  /** Обработчик показа встраивания в графе. */
  onShowInGraph?: (embed: ZBlueprintEmbed) => void;
};

/**
 * Компонент списка встраиваний Blueprint.
 * Отображает список всех встраиваний с информацией о встроенном Blueprint и host_path.
 */
export const EmbedList: React.FC<PropsEmbedList> = observer(
  ({ store, onDelete, onShowInGraph }) => {
    return (
      <List
        dataSource={store.embeds}
        loading={store.pending}
        locale={{ emptyText: 'Встраивания отсутствуют' }}
        renderItem={embed => {
          const actions = [];
          if (onShowInGraph) {
            actions.push(
              <Button
                key="show"
                type="link"
                size="small"
                icon={<Eye className="w-4 h-4" />}
                onClick={() => onShowInGraph(embed)}
              >
                Показать в графе
              </Button>
            );
          }
          if (onDelete) {
            actions.push(
              <Button
                key="delete"
                type="link"
                danger
                size="small"
                icon={<Trash2 className="w-4 h-4" />}
                onClick={() => onDelete(embed.id)}
              >
                Удалить
              </Button>
            );
          }

          return (
            <List.Item actions={actions}
          >
            <List.Item.Meta
              title={
                <Space>
                  <span>{embed.embedded_blueprint?.name || 'Неизвестный Blueprint'}</span>
                  <Tag>{embed.embedded_blueprint?.code || 'N/A'}</Tag>
                </Space>
              }
              description={
                <div>
                  <div>
                    <strong>Встроен в:</strong>{' '}
                    {embed.host_path ? (
                      <code className="bg-muted px-2 py-1 rounded text-sm font-mono">
                        {embed.host_path.full_path}
                      </code>
                    ) : (
                      <span className="text-muted-foreground">Корень</span>
                    )}
                  </div>
                  {embed.created_at && (
                    <div className="text-xs text-muted-foreground mt-1">
                      Создано: {new Date(embed.created_at).toLocaleDateString('ru-RU')}
                    </div>
                  )}
                </div>
              }
            />
          </List.Item>
          );
        }}
      />
    );
  }
);


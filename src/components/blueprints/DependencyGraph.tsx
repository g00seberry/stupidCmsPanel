import { Card, List, Space, Tag, Empty } from 'antd';
import { Link } from 'react-router-dom';
import type { ZBlueprintDependencies } from '@/types/blueprint';
import { useCallback } from 'react';

/**
 * Пропсы компонента графа зависимостей Blueprint.
 */
export type PropsDependencyGraph = {
  /** Граф зависимостей Blueprint. */
  dependencies: ZBlueprintDependencies | null;
  /** Флаг загрузки данных. */
  loading?: boolean;
  /** Функция для построения URL редактирования Blueprint. */
  getEditUrl?: (id: number) => string;
};

/**
 * Компонент визуализации графа зависимостей Blueprint.
 * Отображает два списка: Blueprint, от которых зависит текущий, и Blueprint, которые зависят от текущего.
 */
export const DependencyGraph: React.FC<PropsDependencyGraph> = ({
  dependencies,
  loading = false,
  getEditUrl,
}) => {
  if (loading) {
    return <Card loading={loading} />;
  }

  if (!dependencies) {
    return <Empty description="Зависимости не загружены" />;
  }

  const renderBlueprintItem = useCallback(
    (blueprint: { id: number; code: string; name: string }) => {
      const content = (
        <Space>
          <span>{blueprint.name}</span>
          <Tag>{blueprint.code}</Tag>
        </Space>
      );

      return getEditUrl ? <Link to={getEditUrl(blueprint.id)}>{content}</Link> : content;
    },
    [getEditUrl]
  );

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <Card title="Зависит от" size="small">
        {dependencies.depends_on.length === 0 ? (
          <Empty description="Нет зависимостей" />
        ) : (
          <List
            size="small"
            dataSource={dependencies.depends_on}
            renderItem={item => <List.Item>{renderBlueprintItem(item)}</List.Item>}
          />
        )}
      </Card>

      <Card title="Зависят от текущего" size="small">
        {dependencies.depended_by.length === 0 ? (
          <Empty description="Нет зависимых Blueprint" />
        ) : (
          <List
            size="small"
            dataSource={dependencies.depended_by}
            renderItem={item => <List.Item>{renderBlueprintItem(item)}</List.Item>}
          />
        )}
      </Card>
    </div>
  );
};

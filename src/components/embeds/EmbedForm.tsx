import { Form, Select, TreeSelect, Alert, Card, Space, Tag } from 'antd';
import type { FormInstance } from 'antd/es/form';
import type { BlueprintEmbedStore } from '@/stores/BlueprintEmbedStore';
import type { PathStore } from '@/stores/PathStore';
import type { ZPath } from '@/types/path';
import { useMemo, useCallback } from 'react';
import { canEmbedInPath } from '@/utils/blueprintValidation';

/**
 * Пропсы компонента формы встраивания Blueprint.
 */
export type PropsEmbedForm = {
  /** Экземпляр формы Ant Design. */
  form: FormInstance<{
    embedded_blueprint_id: number;
    host_path_id?: number;
  }>;
  /** Store для управления встраиваниями. */
  embedStore: BlueprintEmbedStore;
  /** Store для управления полями (для выбора host_path). */
  pathStore: PathStore;
  /** Обработчик изменения выбранного Blueprint. */
  onBlueprintChange?: (blueprintId: number) => void;
};

/**
 * Форма добавления встраивания Blueprint.
 * Позволяет выбрать Blueprint для встраивания и поле-контейнер (host_path).
 */
export const EmbedForm: React.FC<PropsEmbedForm> = ({
  form,
  embedStore,
  pathStore,
  onBlueprintChange,
}) => {
  type TreeDataNode = {
    title: React.ReactNode;
    value: number;
    key: number;
    children?: TreeDataNode[];
  };

  const treeData = useMemo(() => {
    const convertPathsToTree = (paths: ZPath[]): TreeDataNode[] => {
      return paths
        .filter(path => path.data_type === 'json')
        .map(path => ({
          title: (
            <Space>
              <span>{path.name}</span>
              <Tag color="green">json</Tag>
              <code className="text-xs text-muted-foreground">{path.full_path}</code>
            </Space>
          ),
          value: path.id,
          key: path.id,
          children: path.children ? convertPathsToTree(path.children) : undefined,
        }));
    };

    return convertPathsToTree(pathStore.paths);
  }, [pathStore.paths]);

  const selectedBlueprintId = Form.useWatch('embedded_blueprint_id', form);
  const selectedBlueprint = useMemo(
    () => embedStore.embeddableBlueprints.find(bp => bp.id === selectedBlueprintId),
    [embedStore.embeddableBlueprints, selectedBlueprintId]
  );

  return (
    <Form form={form} layout="vertical">
      <Form.Item
        label="Blueprint для встраивания"
        name="embedded_blueprint_id"
        rules={[{ required: true, message: 'Выберите Blueprint для встраивания' }]}
        tooltip="Выберите Blueprint, который будет встроен в текущий Blueprint."
      >
        <Select
          placeholder="Выберите Blueprint"
          showSearch
          filterOption={(input, option) =>
            (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
          }
          options={useMemo(
            () =>
              embedStore.embeddableBlueprints.map(bp => ({
                label: `${bp.name} (${bp.code})`,
                value: bp.id,
              })),
            [embedStore.embeddableBlueprints]
          )}
          onChange={useCallback(
            (value: number) => {
              onBlueprintChange?.(value);
            },
            [onBlueprintChange]
          )}
        />
      </Form.Item>

      {selectedBlueprint && (
        <Card size="small" className="mb-4">
          <div className="text-sm">
            <div>
              <strong>Выбранный Blueprint:</strong> {selectedBlueprint.name}
            </div>
            <div className="text-muted-foreground mt-1">
              Код: <code>{selectedBlueprint.code}</code>
            </div>
          </div>
        </Card>
      )}

      <Form.Item
        label="Поле-контейнер"
        name="host_path_id"
        tooltip="Выберите поле типа JSON, в которое будет встроен Blueprint. Если не выбрано, встраивание произойдёт в корень."
        rules={[
          {
            validator: (_rule, value) => {
              if (!value) return Promise.resolve(); // Корневое встраивание разрешено
              const selectedPath = pathStore.paths
                .flatMap(p => [p, ...(p.children || [])])
                .find(p => p.id === value);
              if (selectedPath && !canEmbedInPath(selectedPath)) {
                return Promise.reject(new Error('Встраивание возможно только в поля типа JSON'));
              }
              return Promise.resolve();
            },
          },
        ]}
      >
        <TreeSelect
          placeholder="Выберите поле или оставьте пустым для встраивания в корень"
          treeData={treeData}
          allowClear
          treeDefaultExpandAll
          showSearch
          treeNodeFilterProp="title"
        />
      </Form.Item>

      <Alert
        message="Внимание"
        description="При встраивании все поля выбранного Blueprint будут скопированы в текущий Blueprint как readonly. Изменить их структуру можно только в исходном Blueprint."
        type="info"
        showIcon
        className="mt-4"
      />
    </Form>
  );
};

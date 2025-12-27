import { Button, Drawer, Space, type FormInstance } from 'antd';
import { useEffect, useMemo } from 'react';
import type React from 'react';
import type { EditCtx } from '../BlueprintEditorStore';
import type { ZPath } from '@/types/path';
import { findPathInTree } from '@/utils/pathUtils';
import { NodeForm } from './NodeForm/NodeForm';

type NodeEditorDrawerProps = {
  editContext: EditCtx;
  pathForm: FormInstance;
  paths: ZPath[];
  onCancel: () => void;
  onSave: (values: unknown) => void | Promise<void>;
};

const DrawerActions: React.FC<{
  onCancel: () => void;
  onSave: () => void | Promise<void>;
  submitButtonText: string;
}> = ({ onCancel, onSave, submitButtonText }) => (
  <Space>
    <Button danger onClick={onCancel}>
      Отмена
    </Button>
    <Button type="primary" onClick={onSave}>
      {submitButtonText}
    </Button>
  </Space>
);

export const NodeEditorDrawer: React.FC<NodeEditorDrawerProps> = ({
  editContext,
  pathForm,
  paths,
  onCancel,
  onSave,
}) => {
  const { title, path, submitButtonText } = useMemo(() => {
    if (editContext.type === 'edit') {
      const foundPath = findPathInTree(paths, editContext.nodeId);
      if (!foundPath) {
        return {
          title: `Путь ${editContext.nodeId} не найден`,
          path: null,
          submitButtonText: 'Сохранить',
        };
      }
      return {
        title: `Редактирование "${foundPath.name}"`,
        path: foundPath,
        submitButtonText: 'Сохранить',
      };
    }

    const parentPath = editContext.parentNodeId
      ? findPathInTree(paths, editContext.parentNodeId)
      : null;

    const hostTitle = parentPath ? `внутри "${parentPath?.name}"` : 'в корне';
    return {
      title: `Создание нового path ${hostTitle}`,
      path: null,
      submitButtonText: 'Создать',
    };
  }, [editContext, paths]);

  // Сброс формы при создании нового пути
  useEffect(() => {
    if (editContext.type === 'create') {
      pathForm.resetFields();
    }
  }, [editContext.type, pathForm]);

  const handleSave = async () => {
    const values = await pathForm.validateFields();
    await onSave(values);
  };

  if (editContext.type === 'edit' && !path) {
    return <div>{title}</div>;
  }

  return (
    <Drawer
      open
      onClose={onCancel}
      width="80%"
      title={title}
      extra={
        <DrawerActions
          onCancel={onCancel}
          onSave={handleSave}
          submitButtonText={submitButtonText}
        />
      }
    >
      <NodeForm form={pathForm} path={path || undefined} />
    </Drawer>
  );
};

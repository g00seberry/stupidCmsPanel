import { observer } from 'mobx-react-lite';
import { useCallback, useEffect, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { Button, Card, Select, Spin, Tree, Empty } from 'antd';
import { ArrowLeft, Check, AlertTriangle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { PageLayout } from '@/components/PageLayout';
import type { ZId } from '@/types/ZId';
import { buildUrl, PageUrl } from '@/PageUrl';
import { FormConfigStore } from './FormConfigStore';
import { PropsForm } from '@/components/PropsForm/PropsForm';
import type { ZEditComponent } from '@/components/schemaForm/ZComponent';
import type { ZBlueprintSchemaField } from '@/types/blueprintSchema';
import type { DataNode } from 'antd/es/tree';
import { Tooltip } from 'antd';

/**
 * Страница настройки конфигурации формы для типа контента и blueprint.
 * Позволяет настроить компоненты формы для каждого поля схемы blueprint.
 */
export const FormConfigPage = observer(() => {
  const { id: idParam, blueprintId } = useParams<{ id: string; blueprintId: string }>();
  const store = useMemo(() => new FormConfigStore(), []);

  const postTypeId: ZId | null = idParam || null;
  const blueprintIdNum: ZId | null = blueprintId || null;

  // Загрузка данных при монтировании
  useEffect(() => {
    if (postTypeId && blueprintIdNum) {
      void store.loadData(postTypeId, blueprintIdNum);
    }
  }, [postTypeId, blueprintIdNum, store]);

  /**
   * Обрабатывает сохранение конфигурации.
   */
  const handleSave = useCallback(async () => {
    if (!postTypeId || !blueprintIdNum) {
      return;
    }

    await store.saveConfig(postTypeId, blueprintIdNum);
  }, [postTypeId, blueprintIdNum, store]);

  /**
   * Обрабатывает изменение компонента для поля.
   * @param path Путь к полю.
   * @param componentName Имя компонента или null для удаления конфигурации.
   */
  const handleComponentChange = useCallback(
    (path: string, componentName: ZEditComponent['name'] | null) => {
      if (componentName === null) {
        store.updateFieldConfig(path, null);
        return;
      }

      const defaultConfig = store.createDefaultComponentConfig(path, componentName);
      store.updateFieldConfig(path, defaultConfig);
    },
    [store]
  );

  /**
   * Обрабатывает изменение настроек компонента.
   * @param path Путь к полю.
   * @param component Обновлённая конфигурация компонента.
   */
  const handleComponentSettingsChange = useCallback(
    (path: string, component: ZEditComponent) => {
      store.updateFieldConfig(path, component);
    },
    [store]
  );

  /**
   * Обрабатывает выбор узла в дереве.
   * @param selectedKeys Массив выбранных ключей.
   */
  const handleTreeSelect = useCallback(
    (selectedKeys: React.Key[]) => {
      const path = selectedKeys[0] as string | undefined;
      store.setSelectedPath(path || null);
    },
    [store]
  );

  /**
   * Рендерит пустое состояние формы настройки.
   * @param description Текст описания.
   */
  const renderEmptyState = (description: string) => (
    <div className="flex items-center justify-center h-full min-h-[200px]">
      <Empty description={description} />
    </div>
  );

  /**
   * Рендерит информацию о поле.
   * @param path Путь к полю.
   * @param field Поле схемы.
   */
  const renderFieldInfo = (path: string, field: ZBlueprintSchemaField) => (
    <div>
      <h3 className="text-lg font-semibold mb-2">{path}</h3>
      <div className="text-sm text-muted-foreground space-y-1">
        <div>
          Тип: <span className="font-medium">{field.type}</span>
        </div>
        <div>
          Кардинальность: <span className="font-medium">{field.cardinality}</span>
        </div>
        {(field.validation?.required ?? false) && (
          <div className="text-destructive">Обязательное поле</div>
        )}
      </div>
    </div>
  );

  /**
   * Рендерит селектор компонента формы.
   * @param path Путь к полю.
   * @param availableComponents Доступные компоненты.
   * @param currentComponentName Текущий выбранный компонент.
   */
  const renderComponentSelector = (
    path: string,
    availableComponents: ZEditComponent['name'][],
    currentComponentName: ZEditComponent['name'] | null
  ) => (
    <div>
      <label className="block text-sm font-medium mb-2">Компонент формы</label>
      <Select
        value={currentComponentName}
        onChange={value => handleComponentChange(path, value)}
        placeholder="Выберите компонент"
        className="w-full"
        allowClear
        options={availableComponents.map(componentName => ({
          label: componentName,
          value: componentName,
        }))}
      />
    </div>
  );

  /**
   * Рендерит заголовок узла дерева с предупреждением, если компонент не соответствует доступным.
   * @param nodeData Данные узла.
   * @returns Элемент заголовка узла.
   */
  const renderTreeNodeTitle = useCallback(
    (nodeData: DataNode & { hasInvalidComponent?: boolean }) => {
      const hasWarning = nodeData.hasInvalidComponent;
      const titleNode =
        typeof nodeData.title === 'function' ? nodeData.title(nodeData) : nodeData.title;

      if (!hasWarning) {
        return <span>{titleNode}</span>;
      }

      return (
        <div className="flex items-center gap-2">
          <span>{titleNode}</span>
          <Tooltip
            title="Выбранный компонент не соответствует доступным компонентам для этого типа поля"
            placement="right"
          >
            <AlertTriangle className="w-4 h-4 text-amber-500 flex-shrink-0" />
          </Tooltip>
        </div>
      );
    },
    []
  );

  /**
   * Рендерит форму настройки для выбранного поля.
   */
  const renderFieldConfig = () => {
    if (!store.selectedPath) {
      return renderEmptyState('Выберите поле из дерева для настройки');
    }

    const fieldData = store.getFieldByPath(store.selectedPath);
    if (!fieldData) {
      return renderEmptyState('Поле не найдено');
    }

    const { path, field } = fieldData;
    const availableComponents = store.getAvailableComponents(field);
    const currentConfig = store.formConfig[path];
    const currentComponentName = currentConfig?.name || null;

    if (availableComponents.length === 0) {
      return renderEmptyState('Нет доступных компонентов для этого типа поля');
    }

    return (
      <div className="space-y-6">
        {renderFieldInfo(path, field)}
        {renderComponentSelector(path, availableComponents, currentComponentName)}
        {currentConfig && (
          <div>
            <label className="block text-sm font-medium mb-2">Настройки компонента</label>
            <PropsForm
              name={currentConfig.name}
              value={currentConfig.props}
              onChange={props =>
                handleComponentSettingsChange(path, {
                  ...currentConfig,
                  props: props as ZEditComponent['props'],
                })
              }
            />
          </div>
        )}
      </div>
    );
  };

  if (store.initialLoading) {
    return (
      <div className="bg-background w-full flex items-center justify-center">
        <Spin size="large" />
      </div>
    );
  }

  if (!store.schema || !store.postType) {
    return null;
  }

  return (
    <PageLayout
      breadcrumbs={[
        { label: 'Типы контента', to: PageUrl.ContentTypes },
        {
          label: store.postType.name,
          to: buildUrl(PageUrl.ContentTypesEdit, { id: store.postType.id }),
        },
        'Настройка формы',
      ]}
      extra={
        <>
          <Link to={buildUrl(PageUrl.ContentTypesEdit, { id: store.postType.id })}>
            <Button icon={<ArrowLeft className="w-4 h-4" />}>Назад</Button>
          </Link>
          <Button
            type="primary"
            onClick={handleSave}
            loading={store.pending}
            icon={<Check className="w-4 h-4" />}
          >
            Сохранить
          </Button>
        </>
      }
    >
      <div className="mb-6">
        <h2 className="text-2xl font-semibold mb-2">
          Настройка формы для &quot;{store.postType.name}&quot;
        </h2>
        <p className="text-muted-foreground">
          Выберите поле из дерева схемы для настройки компонента формы.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <Card title="Схема полей" className="h-full">
            {store.schema?.schema && Object.keys(store.schema.schema).length > 0 ? (
              <Tree
                treeData={store.getSchemaTree() as DataNode[]}
                selectedKeys={store.selectedPath ? [store.selectedPath] : []}
                onSelect={handleTreeSelect}
                defaultExpandAll
                showLine={{ showLeafIcon: false }}
                className="bg-transparent"
                titleRender={renderTreeNodeTitle}
              />
            ) : (
              <Empty description="Нет полей в схеме" />
            )}
          </Card>
        </div>

        <div className="lg:col-span-2">
          <Card title={store.selectedPath ? `Настройка: ${store.selectedPath}` : 'Настройка поля'}>
            {renderFieldConfig()}
          </Card>
        </div>
      </div>
    </PageLayout>
  );
});

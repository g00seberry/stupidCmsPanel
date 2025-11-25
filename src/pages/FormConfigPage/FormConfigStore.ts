import { makeAutoObservable } from 'mobx';
import { getPostType } from '@/api/apiPostTypes';
import { getBlueprintSchema } from '@/api/blueprintApi';
import { getFormConfig, saveFormConfig } from '@/api/apiFormConfig';
import { onError } from '@/utils/onError';
import { notificationService } from '@/services/notificationService';
import type { ZPostType } from '@/types/postTypes';
import type { ZBlueprintSchema, ZBlueprintSchemaField } from '@/types/blueprintSchema';
import type { ZEditComponent } from '@/components/schemaForm/componentDefs/ZComponent';
import { getAllowedComponents } from '@/components/schemaForm/componentDefs/getAllowedComponents';
import { pathToString, type PathSegment } from '@/utils/pathUtils';

/**
 * Тип узла дерева схемы для компонента Tree из antd.
 */
type SchemaTreeNode = {
  key: string;
  title: string;
  children?: SchemaTreeNode[];
  /** Флаг несоответствия выбранного компонента доступным для поля. */
  hasInvalidComponent?: boolean;
};

/**
 * Тип данных поля с путём.
 */
type FieldWithPath = {
  path: string;
  field: ZBlueprintSchemaField;
};

/**
 * Store для управления состоянием страницы настройки формы.
 * Управляет загрузкой схемы blueprint, formConfig и сохранением настроек.
 */
export class FormConfigStore {
  /** Текущий тип контента. */
  postType: ZPostType | null = null;
  /** Схема blueprint. */
  schema: ZBlueprintSchema | null = null;
  /** Текущая конфигурация формы. */
  formConfig: Record<string, ZEditComponent> = {};
  /** Флаг начальной загрузки. */
  initialLoading = false;
  /** Флаг выполнения операции. */
  pending = false;
  /** Выбранный путь для настройки. */
  selectedPath: string | null = null;

  constructor() {
    makeAutoObservable(this, {}, { autoBind: true });
  }

  /**
   * Устанавливает флаг начальной загрузки.
   * @param value Новое значение флага.
   */
  setInitialLoading(value: boolean): void {
    this.initialLoading = value;
  }

  /**
   * Устанавливает флаг выполнения операции.
   * @param value Новое значение флага.
   */
  setPending(value: boolean): void {
    this.pending = value;
  }

  /**
   * Устанавливает тип контента.
   * @param postType Тип контента для установки.
   */
  setPostType(postType: ZPostType | null): void {
    this.postType = postType;
  }

  /**
   * Устанавливает схему blueprint.
   * @param schema Схема для установки.
   */
  setSchema(schema: ZBlueprintSchema | null): void {
    this.schema = schema;
  }

  /**
   * Устанавливает конфигурацию формы.
   * @param config Конфигурация для установки.
   */
  setFormConfig(config: Record<string, ZEditComponent>): void {
    this.formConfig = config;
  }

  /**
   * Устанавливает выбранный путь для настройки.
   * @param path Путь к полю или null для сброса выбора.
   */
  setSelectedPath(path: string | null): void {
    this.selectedPath = path;
  }

  /**
   * Обновляет конфигурацию компонента для поля.
   * @param path Путь к полю (например, 'title' или 'author.name').
   * @param component Конфигурация компонента.
   */
  updateFieldConfig(path: string, component: ZEditComponent | null): void {
    if (component === null) {
      const { [path]: _, ...rest } = this.formConfig;
      this.formConfig = rest;
    } else {
      this.formConfig = { ...this.formConfig, [path]: component };
    }
  }

  /**
   * Загружает данные для настройки формы.
   * @param postTypeSlug Slug типа контента.
   * @param blueprintId Идентификатор blueprint.
   */
  async loadData(postTypeSlug: string, blueprintId: number): Promise<void> {
    this.setInitialLoading(true);
    try {
      const [postTypeData, schemaData, configData] = await Promise.all([
        getPostType(postTypeSlug),
        getBlueprintSchema(blueprintId),
        getFormConfig(postTypeSlug, blueprintId).catch(() => ({})), // Если конфигурации нет, используем пустой объект
      ]);

      this.setPostType(postTypeData);
      this.setSchema(schemaData);
      this.setFormConfig(configData);
    } catch (error) {
      onError(error);
    } finally {
      this.setInitialLoading(false);
    }
  }

  /**
   * Сохраняет конфигурацию формы.
   * @param postTypeSlug Slug типа контента.
   * @param blueprintId Идентификатор blueprint.
   */
  async saveConfig(postTypeSlug: string, blueprintId: number): Promise<boolean> {
    this.setPending(true);
    try {
      await saveFormConfig(postTypeSlug, blueprintId, this.formConfig);
      notificationService.showSuccess({ message: 'Конфигурация формы сохранена' });
      return true;
    } catch (error) {
      onError(error);
      return false;
    } finally {
      this.setPending(false);
    }
  }

  /**
   * Рекурсивно собирает все пути полей из схемы.
   * @param fields Поля схемы.
   * @param parentPath Путь к родительскому полю.
   * @returns Массив путей к полям.
   */
  getAllFieldPaths(
    fields: Record<string, ZBlueprintSchemaField>,
    parentPath: PathSegment[] = []
  ): FieldWithPath[] {
    const result: FieldWithPath[] = [];

    for (const [key, field] of Object.entries(fields)) {
      const currentPath = [...parentPath, key];
      const pathStr = pathToString(currentPath);
      result.push({ path: pathStr, field });

      // Рекурсивно обрабатываем вложенные поля
      if (field.children) {
        result.push(...this.getAllFieldPaths(field.children, currentPath));
      }
    }

    return result;
  }

  /**
   * Получает доступные компоненты для поля.
   * @param field Поле схемы.
   * @returns Массив доступных компонентов.
   */
  getAvailableComponents(field: ZBlueprintSchemaField): ZEditComponent['name'][] {
    return getAllowedComponents(field.type, field.cardinality);
  }

  /**
   * Проверяет, соответствует ли выбранный компонент доступным компонентам для поля.
   * @param path Путь к полю.
   * @param field Поле схемы.
   * @returns `true`, если компонент не выбран или выбран допустимый компонент.
   */
  isComponentValidForField(path: string, field: ZBlueprintSchemaField): boolean {
    const currentConfig = this.formConfig[path];
    if (!currentConfig) {
      return true; // Если компонент не выбран, это валидно
    }

    const availableComponents = this.getAvailableComponents(field);
    return availableComponents.includes(currentConfig.name);
  }

  /**
   * Преобразует имя поля в читаемый формат для label.
   * @param fieldName Имя поля.
   * @returns Отформатированный label.
   */
  private formatFieldLabel(fieldName: string): string {
    return fieldName
      .replace(/_/g, ' ')
      .replace(/([A-Z])/g, ' $1')
      .trim()
      .replace(/^\w/, c => c.toUpperCase());
  }

  /**
   * Создаёт дефолтную конфигурацию компонента для поля.
   * @param path Путь к полю (например, 'title' или 'author.name').
   * @param componentName Имя компонента.
   * @returns Дефолтная конфигурация компонента.
   */
  createDefaultComponentConfig(
    path: string,
    componentName: ZEditComponent['name']
  ): ZEditComponent {
    const fieldName = path.split('.').pop() || path;
    const label = this.formatFieldLabel(fieldName);

    return {
      name: componentName,
      props: {
        label,
      },
    };
  }

  /**
   * Получает поле схемы по пути.
   * @param path Путь к полю.
   * @returns Поле схемы или undefined, если не найдено.
   */
  getFieldByPath(path: string): FieldWithPath | undefined {
    if (!this.schema) return undefined;
    const fieldPaths = this.getAllFieldPaths(this.schema.schema);
    return fieldPaths.find(f => f.path === path);
  }

  /**
   * Форматирует заголовок узла дерева.
   * @param key Имя поля.
   * @param field Поле схемы.
   * @param hasConfig Флаг наличия конфигурации.
   * @returns Отформатированный заголовок.
   */
  private formatTreeNodeTitle(
    key: string,
    field: ZBlueprintSchemaField,
    hasConfig: boolean
  ): string {
    const configMark = hasConfig ? ' ✓' : '';
    return `${key} (${field.type}, ${field.cardinality})${configMark}`;
  }

  /**
   * Рекурсивно строит дерево схемы.
   * @param fields Поля схемы.
   * @param parentPath Путь к родительскому полю.
   * @returns Массив узлов дерева.
   */
  private buildSchemaTree(
    fields: Record<string, ZBlueprintSchemaField>,
    parentPath: PathSegment[] = []
  ): SchemaTreeNode[] {
    const nodes: SchemaTreeNode[] = [];

    for (const [key, field] of Object.entries(fields)) {
      const currentPath = [...parentPath, key];
      const pathStr = pathToString(currentPath);
      const hasConfig = !!this.formConfig[pathStr];

      const isValidComponent = this.isComponentValidForField(pathStr, field);

      const node: SchemaTreeNode = {
        key: pathStr,
        title: this.formatTreeNodeTitle(key, field, hasConfig),
        hasInvalidComponent: hasConfig && !isValidComponent,
      };

      if (field.children) {
        node.children = this.buildSchemaTree(field.children, currentPath);
      }

      nodes.push(node);
    }

    return nodes;
  }

  /**
   * Преобразует схему в дерево для компонента Tree из antd.
   * @returns Массив узлов дерева.
   */
  getSchemaTree(): SchemaTreeNode[] {
    if (!this.schema) return [];
    return this.buildSchemaTree(this.schema.schema);
  }
}

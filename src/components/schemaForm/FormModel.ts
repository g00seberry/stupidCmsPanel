import { makeAutoObservable } from 'mobx';
import type { FormValues } from './types';
import type { ZBlueprintSchema, ZBlueprintSchemaField } from '@/types/blueprintSchema';
import { createDefaultValues, flatSchema } from '@/components/schemaForm/formModelUtils';
import { getValueByPath, setValueByPath, type PathSegment } from '@/utils/pathUtils';
import type { ZEditComponent } from './ZComponent';
/**
 * Модель формы на основе схемы сущности.
 * Управляет состоянием формы: значениями, ошибками валидации и операциями над данными.
 * Использует MobX для реактивности и является единым источником истины для формы.
 * Ошибки валидации устанавливаются с бэка после неудачного сабмита.
 * @template E Схема сущности.
 * @example
 * const schema: EntitySchema = {
 *   schema: {
 *     title: { type: 'string', cardinality: 'one', indexed: true }
 *   }
 * };
 * const model = new FormModel(schema, { title: 'Initial Title' });
 * model.setValue(['title'], 'New Title');
 * model.setErrorsFromApi({ 'data_json.title': ['Поле обязательно'] });
 */
export class FormModel {
  /** Схема сущности, описывающая структуру формы. */
  schema: ZBlueprintSchema;
  /** Значения формы, типизированные на основе схемы. */
  values: FormValues;
  /** Карта ошибок валидации по путям полей (ключ - строка пути, значение - массив сообщений об ошибках). */
  errors: Map<string, string[]>;
  /** Конфигурация компонентов формы по путям полей. */
  formConfig: Record<string, ZEditComponent>;

  /**
   * Создаёт экземпляр модели формы.
   * @param schema Схема сущности для формы.
   * @param initial Опциональные начальные значения (частичные).
   * @param formConfig Опциональная конфигурация компонентов формы по путям полей.
   */
  constructor(
    schema: ZBlueprintSchema,
    initial?: Partial<FormValues>,
    formConfig?: Record<string, ZEditComponent>
  ) {
    makeAutoObservable(this, {}, { autoBind: true });
    this.schema = schema;
    this.values = createDefaultValues(schema, initial);
    this.errors = new Map();
    this.formConfig = formConfig ?? {};
  }

  /**
   * Устанавливает значение поля по пути.
   * @param path Массив сегментов пути (строки для ключей объектов, числа для индексов массивов).
   * @param value Новое значение для установки.
   * @example
   * model.setValue(['title'], 'New Title');
   * model.setValue(['tags', 0], 'tag1');
   * model.setValue(['author', 'name'], 'John Doe');
   */
  setValue(path: PathSegment[], value: any): void {
    setValueByPath(this.values, path, value);
  }

  /**
   * Обновляет все значения формы частичным объектом.
   * Объединяет новые значения с существующими.
   * @param values Частичные значения для обновления.
   * @example
   * model.setAll({ title: 'New Title', price: 100 });
   */
  setAll(values: Partial<FormValues>): void {
    this.values = { ...this.values, ...values } as FormValues;
  }

  /**
   * Добавляет элемент в массив по пути.
   * Создаёт массив, если его ещё нет.
   * @param path Массив сегментов пути до массива.
   * @param item Элемент для добавления.
   * @example
   * model.addArrayItem(['tags'], 'newTag');
   * model.addArrayItem(['items', 0, 'tags'], 'tag');
   */
  addArrayItem(path: PathSegment[], item: unknown): void {
    const arr = getValueByPath(this.values, path) as unknown[];
    if (Array.isArray(arr)) {
      arr.push(item);
    } else {
      setValueByPath(this.values, path, [item]);
    }
  }

  /**
   * Удаляет элемент из массива по индексу.
   * @param path Массив сегментов пути до массива.
   * @param index Индекс элемента для удаления.
   * @example
   * model.removeArrayItem(['tags'], 0);
   * model.removeArrayItem(['items', 1, 'tags'], 2);
   */
  removeArrayItem(path: PathSegment[], index: number): void {
    const arr = getValueByPath(this.values, path) as unknown[];
    if (Array.isArray(arr)) {
      arr.splice(index, 1);
    }
  }

  /**
   * Устанавливает ошибки валидации из ответа API.
   * Преобразует ошибки из формата API (например, "data_json.title") в формат пути формы.
   * Убирает префикс data_json. из путей ошибок.
   * Ошибки должны приходить с бэка после неудачного сабмита (422).
   * @param apiErrors Объект ошибок от API, где ключ - путь поля (например, "data_json.title"), значение - массив сообщений об ошибках.
   * @example
   * model.setErrorsFromApi({
   *   'data_json.title': ['Поле обязательно для заполнения'],
   *   'data_json.author.0.name': ['Поле обязательно']
   * });
   * // Ошибки будут сохранены как: 'title' и 'author.0.name'
   */
  setErrorsFromApi(apiErrors: Record<string, string[]>): void {
    this.errors.clear();

    for (const [path, messages] of Object.entries(apiErrors)) {
      if (Array.isArray(messages) && messages.length > 0) {
        // Убираем префикс data_json.
        const normalizedPath = path.replace('data_json.', '');
        this.errors.set(normalizedPath, messages);
      }
    }
  }

  /**
   * Проверяет, есть ли ошибки валидации в форме.
   * @returns `true`, если ошибок нет (форма валидна).
   */
  get isValid(): boolean {
    return this.errors.size === 0;
  }

  /**
   * Получает первую ошибку валидации для указанного пути.
   * @param path Строковое представление пути (например, "title" или "author.0.name").
   * @returns Первое сообщение об ошибке или `undefined`, если ошибок нет.
   * @example
   * const error = model.errorFor('title');
   * if (error) {
   *   console.log('Ошибка:', error);
   * }
   */
  errorFor(path: string): string | undefined {
    const list = this.errors.get(path);
    return list?.[0];
  }

  /**
   * Возвращает значения формы в виде JSON объекта.
   * @returns Значения формы, типизированные на основе схемы.
   */
  get json(): FormValues {
    return this.values;
  }

  /**
   * Проверяет, содержит ли поле по указанному пути устаревшие данные.
   * Устаревшими считаются данные, которые не соответствуют текущей схеме поля,
   * например, когда cardinality изменился с 'one' на 'many' или наоборот.
   * @param path Массив сегментов пути к полю.
   * @returns `true`, если данные устарели и требуют исправления.
   * @example
   * const isOutdated = model.isOutdated(['title']);
   * // true, если title должен быть массивом, но является строкой, или наоборот
   */
  isOutdated(path: PathSegment[]): boolean {
    const finalValue = getValueByPath(this.values, path);
    const schemaLikePath = path.filter(item => typeof item === 'string');
    const flattenedSchema = flatSchema(this.schema);
    const finalSchema = flattenedSchema.find(
      item => item.path.join('.') === schemaLikePath.join('.')
    )?.schema;

    if (
      finalValue === undefined ||
      finalValue === null ||
      finalSchema === undefined ||
      typeof path[path.length - 1] === 'number'
    ) {
      return false;
    }

    if (finalSchema.cardinality === 'one') {
      return Array.isArray(finalValue);
    }

    if (finalSchema.cardinality === 'many') {
      return !Array.isArray(finalValue);
    }

    return false;
  }

  /**
   * Обновляет поле по указанному пути, устанавливая его значение в `undefined`.
   * Используется для сброса устаревших полей к значениям по умолчанию.
   * @param path Массив сегментов пути к полю.
   * @example
   * model.refreshField(['title']);
   * // Поле title будет установлено в undefined, что приведёт к пересозданию значения по умолчанию
   */
  refreshField(path: PathSegment[]): void {
    this.setValue(path, undefined);
  }

  /**
   * Рекурсивно собирает все пути полей из схемы.
   * @param fields Поля схемы.
   * @param parentPath Путь к родительскому полю.
   * @returns Массив путей к полям.
   */
  private getAllFieldPaths(
    fields: Record<string, ZBlueprintSchemaField>,
    parentPath: PathSegment[] = []
  ): PathSegment[][] {
    const result: PathSegment[][] = [];

    for (const [key, field] of Object.entries(fields)) {
      const currentPath = [...parentPath, key];
      result.push(currentPath);

      // Рекурсивно обрабатываем вложенные поля
      if (field.type === 'json' && field.children) {
        result.push(...this.getAllFieldPaths(field.children, currentPath));
      }
    }

    return result;
  }

  /**
   * Получает все пути полей с устаревшими данными.
   * Проверяет все поля схемы на соответствие их значений текущей схеме.
   * @returns Массив путей к полям с устаревшими данными.
   * @example
   * const outdatedPaths = model.getAllOutdatedPaths();
   * // [['title'], ['author', 'name']]
   */
  getAllOutdatedPaths(): PathSegment[][] {
    const allPaths = this.getAllFieldPaths(this.schema.schema);
    return allPaths.filter(path => this.isOutdated(path));
  }

  /**
   * Обновляет все поля с устаревшими данными.
   * Получает все outdated поля и вызывает refreshField для каждого.
   * @example
   * model.refreshAllOutdated();
   */
  refreshAllOutdated(): void {
    const outdatedPaths = this.getAllOutdatedPaths();
    for (const path of outdatedPaths) {
      this.refreshField(path);
    }
  }
}

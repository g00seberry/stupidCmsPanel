import { makeAutoObservable } from 'mobx';
import type { FormValues } from '@/components/schemaForm/FormValues';
import type { ZBlueprintSchema, ZBlueprintSchemaField } from '@/types/blueprintSchema';
import { createDefaultValues } from '@/components/schemaForm/formModelUtils';
import { getValueByPath, pathToString, setValueByPath, type PathSegment } from '@/utils/pathUtils';
import { validateField } from '@/utils/validationUtils';
import type { ZEditComponent } from './componentDefs/ZComponent';

/**
 * Модель формы на основе схемы сущности.
 * Управляет состоянием формы: значениями, ошибками валидации и операциями над данными.
 * Использует MobX для реактивности и является единым источником истины для формы.
 * @template E Схема сущности.
 * @example
 * const schema: EntitySchema = {
 *   schema: {
 *     title: { type: 'string', cardinality: 'one', required: true, indexed: true, validation: [] }
 *   }
 * };
 * const model = new FormModel(schema, { title: 'Initial Title' });
 * model.setValue(['title'], 'New Title');
 * const isValid = model.validate();
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
   * Рекурсивно валидирует поле и его вложенные поля (для json типа).
   * @param field Схема поля.
   * @param value Значение поля.
   * @param path Путь к полю.
   */
  private validateFieldRecursive(
    field: ZBlueprintSchemaField,
    value: any,
    path: PathSegment[]
  ): void {
    if (field.type === 'json' && field.children) {
      const children = field.children; // Сохраняем для сужения типа
      // Для json полей проверяем только required, остальная валидация для children
      if (field.required) {
        const isEmpty =
          value === null ||
          value === undefined ||
          (field.cardinality === 'many' && Array.isArray(value) && value.length === 0) ||
          (field.cardinality === 'one' &&
            (!value || (typeof value === 'object' && Object.keys(value).length === 0)));
        if (isEmpty) {
          const pathStr = pathToString(path);
          this.errors.set(pathStr, ['Обязательное поле']);
        }
      }

      // Валидируем children
      if (field.cardinality === 'many') {
        // Массив json объектов
        if (Array.isArray(value)) {
          value.forEach((item, index) => {
            const itemPath = [...path, index];
            // Валидируем children каждого элемента массива
            if (item && typeof item === 'object' && !Array.isArray(item)) {
              for (const [childName, childField] of Object.entries(children)) {
                const childPath = [...itemPath, childName];
                const childValue = item[childName];
                this.validateFieldRecursive(childField, childValue, childPath);
              }
            }
          });
        }
      } else {
        // Один json объект
        if (value && typeof value === 'object' && !Array.isArray(value)) {
          for (const [childName, childField] of Object.entries(children)) {
            const childPath = [...path, childName];
            const childValue = value[childName];
            this.validateFieldRecursive(childField, childValue, childPath);
          }
        }
      }
    } else {
      // Для примитивных полей валидируем значение
      if (field.cardinality === 'many') {
        // Массив примитивов
        if (Array.isArray(value)) {
          value.forEach((item, index) => {
            const itemPath = [...path, index];
            const errors = validateField(field, item, itemPath);
            if (errors.length > 0) {
              const pathStr = pathToString(itemPath);
              this.errors.set(pathStr, errors);
            }
          });
        } else {
          // Если поле required и массив пустой
          const errors = validateField(field, value, path);
          if (errors.length > 0) {
            const pathStr = pathToString(path);
            this.errors.set(pathStr, errors);
          }
        }
      } else {
        // Одно примитивное значение
        const errors = validateField(field, value, path);
        if (errors.length > 0) {
          const pathStr = pathToString(path);
          this.errors.set(pathStr, errors);
        }
      }
    }
  }

  /**
   * Выполняет валидацию всех полей формы.
   * Рекурсивно обходит схему и значения, применяет правила валидации
   * и записывает ошибки в `errors` по ключам вида "rrrr[0].eeee[1]".
   * @returns `true`, если валидация прошла успешно (нет ошибок).
   * @example
   * const isValid = model.validate();
   * if (!isValid) {
   *   console.log('Ошибки:', Array.from(model.errors.entries()));
   * }
   */
  validate(): boolean {
    this.errors.clear();

    // Рекурсивно обходим все поля схемы
    for (const [fieldName, field] of Object.entries(this.schema.schema)) {
      const path: PathSegment[] = [fieldName];
      const value = getValueByPath(this.values, path);
      this.validateFieldRecursive(field, value, path);
    }

    return this.errors.size === 0;
  }

  /**
   * Проверяет, валидна ли форма (нет ошибок валидации).
   * @returns `true`, если форма валидна.
   */
  get isValid(): boolean {
    return this.errors.size === 0;
  }

  /**
   * Получает первую ошибку валидации для указанного пути.
   * @param path Строковое представление пути (например, "title" или "rrrr[0].eeee[1]").
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
}

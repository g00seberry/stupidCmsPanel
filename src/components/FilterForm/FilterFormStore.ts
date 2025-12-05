import { makeAutoObservable } from 'mobx';

/**
 * Store для управления состоянием формы фильтрации.
 * Хранит значения фильтров и обеспечивает их изменение только внутри компонента.
 * @template TValues Тип значений фильтров. По умолчанию: `Record<string, unknown>`.
 * @example
 * const store = new FilterFormStore<{ search: string; status: string }>({ search: '', status: 'all' });
 * store.setValues({ search: 'test', status: 'active' });
 * console.log(store.values.search); // 'test'
 */
export class FilterFormStore<TValues extends Record<string, unknown> = Record<string, unknown>> {
  /** Значения фильтров. */
  values: TValues;

  /**
   * Создаёт экземпляр store для формы фильтрации.
   * @param initialValues Начальные значения фильтров.
   */
  constructor(initialValues: TValues = {} as TValues) {
    this.values = { ...initialValues };
    makeAutoObservable(this);
  }

  /**
   * Устанавливает значения фильтров.
   * @param values Новые значения фильтров.
   */
  setValues(values: TValues): void {
    this.values = { ...values };
  }

  /**
   * Обновляет значения фильтров частично.
   * @param values Частичные значения фильтров для обновления.
   */
  updateValues(values: Partial<TValues>): void {
    this.values = { ...this.values, ...values };
  }

  /**
   * Сбрасывает значения фильтров к начальным.
   * @param defaultValues Значения по умолчанию.
   */
  reset(defaultValues: TValues = {} as TValues): void {
    this.values = { ...defaultValues };
  }

  /**
   * Получает значение фильтра по имени.
   * @param name Имя поля фильтра.
   * @returns Значение фильтра или undefined.
   */
  getValue<K extends keyof TValues>(name: K): TValues[K] | undefined {
    return this.values[name];
  }
}

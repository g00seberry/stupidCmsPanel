import { makeAutoObservable } from 'mobx';

/**
 * Store для управления состоянием формы фильтрации.
 * Хранит значения фильтров и обеспечивает их изменение только внутри компонента.
 */
export class FilterFormStore {
  /** Значения фильтров. */
  values: Record<string, unknown> = {};

  constructor(initialValues: Record<string, unknown> = {}) {
    this.values = { ...initialValues };
    makeAutoObservable(this);
  }

  /**
   * Устанавливает значения фильтров.
   * @param values Новые значения фильтров.
   */
  setValues(values: Record<string, unknown>): void {
    this.values = { ...values };
  }

  /**
   * Обновляет значения фильтров частично.
   * @param values Частичные значения фильтров для обновления.
   */
  updateValues(values: Partial<Record<string, unknown>>): void {
    this.values = { ...this.values, ...values };
  }

  /**
   * Сбрасывает значения фильтров к начальным.
   * @param defaultValues Значения по умолчанию.
   */
  reset(defaultValues: Record<string, unknown> = {}): void {
    this.values = { ...defaultValues };
  }

  /**
   * Получает значение фильтра по имени.
   * @param name Имя поля фильтра.
   * @returns Значение фильтра или undefined.
   */
  getValue(name: string): unknown {
    return this.values[name];
  }
}

import { makeAutoObservable } from 'mobx';
import { PaginatedDataLoader } from './paginatedDataLoader';

/**
 * Универсальный стор для пагинированной таблицы.
 * Управляет загрузкой данных и выбором строк между страницами.
 * @template TData Тип элемента данных.
 * @template TFilters Тип фильтров запроса.
 */
export class PaginatedTableStore<TData, TFilters extends {}> {
  /** Загрузчик пагинированных данных. */
  loader: PaginatedDataLoader<TData, TFilters>;
  /** Множество выбранных ID строк (работает между страницами). */
  selectedRowKeys = new Set<string | number>();
  /** Ключ для строк таблицы (строка или функция). */
  rowKey: string | ((record: TData) => string);
  /** Функция для получения ключа строки из данных (используется внутренне). */
  private readonly getRowKey: (record: TData) => string | number;

  /**
   * Создаёт экземпляр стора для пагинированной таблицы.
   * @param loader Загрузчик пагинированных данных.
   * @param rowKey Ключ для строк таблицы. По умолчанию: 'id'
   */
  constructor(
    loader: PaginatedDataLoader<TData, TFilters>,
    rowKey: string | ((record: TData) => string) = 'id'
  ) {
    this.loader = loader;
    this.rowKey = rowKey;
    // Преобразуем rowKey в функцию для внутреннего использования
    this.getRowKey =
      typeof rowKey === 'string'
        ? (record: TData) => (record as any)[rowKey]
        : (record: TData) => rowKey(record);
    makeAutoObservable(this);
  }

  /**
   * Проверяет, выбрана ли строка с указанным ключом.
   * @param key Ключ строки.
   * @returns true, если строка выбрана.
   */
  isRowSelected(key: string | number): boolean {
    return this.selectedRowKeys.has(key);
  }

  /**
   * Выбирает строку по ключу.
   * @param key Ключ строки.
   */
  selectRow(key: string | number): void {
    this.selectedRowKeys.add(key);
  }

  /**
   * Снимает выбор со строки по ключу.
   * @param key Ключ строки.
   */
  deselectRow(key: string | number): void {
    this.selectedRowKeys.delete(key);
  }

  /**
   * Переключает выбор строки (выбирает, если не выбрана, и наоборот).
   * @param key Ключ строки.
   */
  toggleRowSelection(key: string | number): void {
    if (this.isRowSelected(key)) {
      this.deselectRow(key);
    } else {
      this.selectRow(key);
    }
  }

  /**
   * Выбирает все строки на текущей странице.
   */
  selectAllOnCurrentPage(): void {
    const currentData = this.loader.resp?.data;
    if (!currentData) {
      return;
    }

    currentData.forEach(record => {
      const key = this.getRowKey(record);
      this.selectedRowKeys.add(key);
    });
  }

  /**
   * Снимает выбор со всех строк на текущей странице.
   */
  deselectAllOnCurrentPage(): void {
    const currentData = this.loader.resp?.data;
    if (!currentData) {
      return;
    }

    currentData.forEach(record => {
      const key = this.getRowKey(record);
      this.selectedRowKeys.delete(key);
    });
  }

  /**
   * Переключает выбор всех строк на текущей странице.
   */
  toggleSelectAllOnCurrentPage(): void {
    const currentData = this.loader.resp?.data;
    if (!currentData) {
      return;
    }

    const allSelected = this.areAllOnCurrentPageSelected();
    if (allSelected) {
      this.deselectAllOnCurrentPage();
    } else {
      this.selectAllOnCurrentPage();
    }
  }

  /**
   * Проверяет, выбраны ли все строки на текущей странице.
   * @returns true, если все строки на текущей странице выбраны.
   */
  areAllOnCurrentPageSelected(): boolean {
    const currentData = this.loader.resp?.data;
    if (!currentData || currentData.length === 0) {
      return false;
    }

    return currentData.every(record => {
      const key = this.getRowKey(record);
      return this.selectedRowKeys.has(key);
    });
  }

  /**
   * Проверяет, выбрана ли хотя бы одна строка на текущей странице.
   * @returns true, если хотя бы одна строка на текущей странице выбрана.
   */
  areSomeOnCurrentPageSelected(): boolean {
    const currentData = this.loader.resp?.data;
    if (!currentData || currentData.length === 0) {
      return false;
    }

    return currentData.some(record => {
      const key = this.getRowKey(record);
      return this.selectedRowKeys.has(key);
    });
  }

  /**
   * Очищает весь выбор строк.
   */
  clearSelection(): void {
    this.selectedRowKeys.clear();
  }

  /**
   * Возвращает массив всех выбранных ключей.
   * @returns Массив выбранных ключей.
   */
  getSelectedKeys(): Array<string | number> {
    return Array.from(this.selectedRowKeys);
  }

  /**
   * Возвращает количество выбранных строк.
   * @returns Количество выбранных строк.
   */
  getSelectedCount(): number {
    return this.selectedRowKeys.size;
  }

  /**
   * Проверяет, есть ли выбранные строки.
   * @returns true, если есть выбранные строки.
   */
  hasSelection(): boolean {
    return this.selectedRowKeys.size > 0;
  }
}

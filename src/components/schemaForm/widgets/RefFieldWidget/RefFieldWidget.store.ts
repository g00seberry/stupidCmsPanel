import type { ZEntry, ZEntryRelatedEntryData } from '@/types/entries';
import type { ZId } from '@/types/ZId';
import { getValueByPath, type PathSegment } from '@/utils/pathUtils';
import { makeAutoObservable } from 'mobx';
import type { FormModel } from '../../FormModel';
import type { RefFieldWidgetStoreOptions } from './RefFieldWidget.types';

/**
 * Store для управления состоянием RefFieldWidget.
 * Управляет загрузкой и отображением записей (одна или несколько).
 */
export class RefFieldWidgetStore {
  /** Модель формы. */
  private readonly model: FormModel;

  /** Путь к полю в форме. */
  private readonly namePath: PathSegment[];
  /** Флаг открытия селектора. */
  selectorOpen = false;
  /** Кеш записей, загруженных в процессе работы с виджетом. */
  private entryCache: Record<string, ZEntry> = {};

  /**
   * Создаёт экземпляр store для RefFieldWidget.
   * @param options Опции для создания store.
   */
  constructor(options: RefFieldWidgetStoreOptions) {
    this.model = options.model;
    this.namePath = options.namePath;
    makeAutoObservable(this);
  }

  /**
   * Получает информацию о записях на основе текущего значения поля.
   * Использует кеш и relatedData для получения данных.
   * @returns Массив записей.
   */
  get entryInfo(): Record<ZId, ZEntryRelatedEntryData> {
    const currValue = getValueByPath(this.model.values, this.namePath);
    const arrVal = Array.isArray(currValue) ? currValue : [currValue].filter(Boolean);
    return arrVal.reduce(
      (acc, currId) => {
        const fromCache = this.entryCache[currId];
        const fromRelated = this.model.relatedData?.entryData?.[currId];
        if (fromCache || fromRelated) {
          acc[currId] = fromCache || fromRelated;
          return acc;
        }
        return acc;
      },
      {} as Record<ZId, ZEntryRelatedEntryData>
    );
  }

  /**
   * Устанавливает значение поля в форме.
   * @param data Значение для установки.
   */
  setEntry(data: unknown): void {
    this.model.setValue(this.namePath, data);
  }

  /**
   * Удаляет запись из поля.
   * @param id ID записи для удаления.
   */
  removeEntry(id: ZId): void {
    const currValue = getValueByPath(this.model.values, this.namePath);
    if (Array.isArray(currValue)) {
      const newValue = currValue.filter(v => v != id);
      this.model.setValue(this.namePath, newValue);
      return;
    }
    this.model.setValue(this.namePath, null);
  }

  /**
   * Обрабатывает выбор записи из селектора.
   * Кеширует выбранные записи и обновляет значение поля.
   * @param entries Записи для сохранения (одна или несколько).
   * @param tableStore Store таблицы для получения полных данных записей.
   */
  handleSelect(entries: ZEntry | ZEntry[]): void {
    const allEntries = Array.isArray(entries) ? entries : [entries];
    allEntries.forEach(entry => (this.entryCache[String(entry.id)] = entry));
    if (Array.isArray(entries)) {
      this.setEntry(entries.map(e => e.id));
    } else {
      this.setEntry(entries.id);
    }
    this.closeSelector();
  }

  /**
   * Открывает селектор записей.
   */
  openSelector(): void {
    this.selectorOpen = true;
  }

  /**
   * Закрывает селектор записей.
   */
  closeSelector(): void {
    this.selectorOpen = false;
  }
}

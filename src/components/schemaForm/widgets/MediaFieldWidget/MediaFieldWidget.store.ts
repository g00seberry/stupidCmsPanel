import type { ZMedia } from '@/types/media';
import type { ZId } from '@/types/ZId';
import { getValueByPath, type PathSegment } from '@/utils/pathUtils';
import { makeAutoObservable } from 'mobx';
import type { FormModel } from '../../FormModel';
import type { MediaFieldWidgetStoreOptions } from './MediaFieldWidget.types';

/**
 * Store для управления состоянием MediaFieldWidget.
 * Управляет загрузкой и отображением медиа-файлов (один или несколько).
 */
export class MediaFieldWidgetStore {
  /** Модель формы. */
  private readonly model: FormModel;

  setMedia(data: unknown): void {
    this.model.setValue(this.namePath, data);
  }

  /** Путь к полю в форме. */
  private readonly namePath: PathSegment[];
  /** Флаг открытия селектора. */
  selectorOpen = false;
  /** Кеш медиа-файлов, загруженных в процессе работы с виджетом. */
  private mediaCache: Record<string, ZMedia> = {};

  get mediaInfo() {
    const currValue = getValueByPath(this.model.values, this.namePath);
    const arrVal = Array.isArray(currValue) ? currValue : [currValue];
    const newValue = arrVal.map(
      id => this.mediaCache[id] || this.model.relatedData?.mediaData?.[id] || null
    );
    return newValue.filter(Boolean);
  }

  /**
   * Создаёт экземпляр store для MediaFieldWidget.
   * @param options Опции для создания store.
   */
  constructor(options: MediaFieldWidgetStoreOptions) {
    this.model = options.model;
    this.namePath = options.namePath;
    makeAutoObservable(this);
  }

  removeMedia(id: ZId) {
    const currValue = getValueByPath(this.model.values, this.namePath);
    if (Array.isArray(currValue)) {
      const newValue = currValue.filter(v => v != id);
      this.model.setValue(this.namePath, newValue);
      return;
    }
    this.model.setValue(this.namePath, null);
  }

  /**
   * Обрабатывает выбор медиа-файла из селектора.
   * @param media Медиа-файл для сохранения.
   */
  handleSelect(media: ZMedia | ZMedia[]): void {
    if (Array.isArray(media)) {
      media.forEach(item => (this.mediaCache[item.id] = item));
      this.setMedia(media.map(m => m.id));
      this.closeSelector();
      return;
    }
    this.mediaCache[media.id] = media;
    this.setMedia(media.id);
    this.closeSelector();
  }

  /**
   * Открывает селектор медиа-файлов.
   */
  openSelector(): void {
    this.selectorOpen = true;
  }

  /**
   * Закрывает селектор медиа-файлов.
   */
  closeSelector(): void {
    this.selectorOpen = false;
  }
}

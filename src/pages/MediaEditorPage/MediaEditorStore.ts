import { makeAutoObservable } from 'mobx';
import { getMedia, updateMedia, deleteMedia } from '@/api/apiMedia';
import { onError } from '@/utils/onError';
import type { ZMedia, ZMediaPayload } from '@/types/media';
import { notification } from 'antd';

/**
 * Store для управления редактированием метаданных медиа-файла.
 * Обеспечивает загрузку, обновление и удаление медиа-файла.
 */
export class MediaEditorStore {
  /** Текущий медиа-файл. */
  media: ZMedia | null = null;

  /** Флаг выполнения запроса загрузки. */
  pending = false;

  /** Флаг выполнения запроса сохранения. */
  saving = false;

  constructor() {
    makeAutoObservable(this);
  }

  /**
   * Загружает медиа-файл по ID.
   * @param id Идентификатор медиа-файла.
   */
  async loadMedia(id: string): Promise<void> {
    this.pending = true;
    try {
      this.media = await getMedia(id);
    } catch (error) {
      onError(error);
      throw error;
    } finally {
      this.pending = false;
    }
  }

  /**
   * Обновляет метаданные медиа-файла.
   * @param id Идентификатор медиа-файла.
   * @param payload Новые метаданные (title, alt, collection).
   */
  async updateMedia(id: string, payload: ZMediaPayload): Promise<void> {
    this.saving = true;
    try {
      this.media = await updateMedia(id, payload);
      notification.success({
        message: 'Медиа-файл обновлён',
        description: 'Метаданные успешно сохранены',
      });
    } catch (error) {
      onError(error);
      throw error;
    } finally {
      this.saving = false;
    }
  }

  /**
   * Удаляет медиа-файл (мягкое удаление).
   * @param id Идентификатор медиа-файла.
   */
  async deleteMedia(id: string): Promise<void> {
    this.saving = true;
    try {
      await deleteMedia(id);
      notification.success({
        message: 'Медиа-файл удалён',
        description: 'Файл успешно перемещён в корзину',
      });
    } catch (error) {
      onError(error);
      throw error;
    } finally {
      this.saving = false;
    }
  }

  /**
   * Сбрасывает состояние store.
   */
  reset(): void {
    this.media = null;
    this.pending = false;
    this.saving = false;
  }
}

import { makeAutoObservable } from 'mobx';
import { getMedia, updateMedia, deleteMedia, restoreMedia } from '@/api/apiMedia';
import { notificationService } from '@/services/notificationService';
import { onError } from '@/utils/onError';
import type { ZMedia, ZMediaUpdatePayload } from '@/types/media';

/**
 * Значения формы редактора медиа-файла.
 */
export interface FormValues {
  readonly title: string;
  readonly alt: string;
  readonly collection: string;
}

const defaultFormValues: FormValues = {
  title: '',
  alt: '',
  collection: '',
};

/**
 * Преобразует данные медиа-файла в значения формы.
 * @param media Медиа-файл, полученный из API.
 * @returns Значения формы, готовые к отображению пользователю.
 */
const toFormValues = (media: ZMedia): FormValues => {
  return {
    title: media.title ?? '',
    alt: media.alt ?? '',
    collection: media.collection ?? '',
  };
};

/**
 * Store для управления состоянием редактора медиа-файла.
 * Обеспечивает загрузку, редактирование и сохранение метаданных медиа-файла.
 */
export class MediaEditorStore {
  /** Текущий медиа-файл. */
  media: ZMedia | null = null;

  /** Значения формы редактирования. */
  formData: FormValues = defaultFormValues;

  /** Флаг выполнения запроса загрузки. */
  pending = false;

  /** Флаг выполнения запроса сохранения. */
  saving = false;

  /** ULID идентификатор медиа-файла. */
  mediaId: string;

  constructor(mediaId: string) {
    this.mediaId = mediaId;
    makeAutoObservable(this);
    void this.loadMedia();
  }

  /**
   * Загружает медиа-файл по ID.
   */
  async loadMedia(): Promise<void> {
    this.pending = true;
    try {
      this.media = await getMedia(this.mediaId);
      this.formData = toFormValues(this.media);
    } catch (error) {
      onError(error);
    } finally {
      this.pending = false;
    }
  }

  /**
   * Обновляет значение поля формы.
   * @param field Название поля формы.
   * @param value Новое значение поля.
   */
  updateFormField<K extends keyof FormValues>(field: K, value: FormValues[K]): void {
    this.formData = { ...this.formData, [field]: value };
  }

  /**
   * Сохраняет изменения метаданных медиа-файла.
   * @returns Обновлённый медиа-файл или `null` в случае ошибки.
   */
  async save(): Promise<ZMedia | null> {
    if (!this.media) {
      return null;
    }

    this.saving = true;
    try {
      const trimmedTitle = this.formData.title.trim();
      const trimmedAlt = this.formData.alt.trim();
      const trimmedCollection = this.formData.collection.trim();

      // Валидация: collection не должен быть пустым
      if (!trimmedCollection) {
        notificationService.showError({
          message: 'Ошибка валидации',
          description: 'Коллекция не может быть пустой',
        });
        return null;
      }

      const payload: ZMediaUpdatePayload = {
        ...(trimmedTitle && { title: trimmedTitle }),
        ...(trimmedAlt && { alt: trimmedAlt }),
        collection: trimmedCollection,
      };

      const updatedMedia = await updateMedia(this.mediaId, payload);
      this.media = updatedMedia;
      this.formData = toFormValues(updatedMedia);
      notificationService.showSuccess({ message: 'Медиа-файл обновлён' });
      return updatedMedia;
    } catch (error) {
      onError(error);
      return null;
    } finally {
      this.saving = false;
    }
  }

  /**
   * Выполняет мягкое удаление медиа-файла.
   * @returns `true`, если удаление выполнено успешно.
   */
  async delete(): Promise<boolean> {
    if (!this.media) {
      return false;
    }

    this.saving = true;
    try {
      await deleteMedia(this.mediaId);
      notificationService.showSuccess({ message: 'Медиа-файл удалён' });
      // Обновляем данные после удаления
      await this.loadMedia();
      return true;
    } catch (error) {
      onError(error);
      return false;
    } finally {
      this.saving = false;
    }
  }

  /**
   * Восстанавливает мягко удаленный медиа-файл.
   * @returns Восстановленный медиа-файл или `null` в случае ошибки.
   */
  async restore(): Promise<ZMedia | null> {
    this.saving = true;
    try {
      const restoredMedia = await restoreMedia(this.mediaId);
      this.media = restoredMedia;
      this.formData = toFormValues(restoredMedia);
      notificationService.showSuccess({ message: 'Медиа-файл восстановлен' });
      return restoredMedia;
    } catch (error) {
      onError(error);
      return null;
    } finally {
      this.saving = false;
    }
  }

  /**
   * Проверяет, удален ли медиа-файл.
   * @returns `true`, если медиа-файл удален (deleted_at !== null).
   */
  get isDeleted(): boolean {
    return this.media?.deleted_at !== null;
  }
}

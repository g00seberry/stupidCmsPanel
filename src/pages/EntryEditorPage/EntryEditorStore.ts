import { createEntry, getEntry, updateEntry } from '@/api/apiEntries';
import { notificationService } from '@/services/notificationService';
import type { ZEntry, ZEntryPayload } from '@/types/entries';
import { onError } from '@/utils/onError';
import { serverDate, viewDate } from '@/utils/dateUtils';
import { makeAutoObservable } from 'mobx';
import type { Dayjs } from 'dayjs';

/**
 * Значения формы редактора записи.
 */
export interface FormValues {
  readonly title: string;
  readonly slug: string;
  readonly content_json: string;
  readonly meta_json: string;
  readonly is_published: boolean;
  readonly published_at: Dayjs | null;
  readonly template_override: string;
}

const defaultFormValues: FormValues = {
  title: '',
  slug: '',
  content_json: '',
  meta_json: '',
  is_published: false,
  published_at: null,
  template_override: '',
};

/**
 * Преобразует данные записи в значения формы.
 * @param entry Запись, полученная из API.
 * @returns Значения формы, готовые к отображению пользователю.
 */
const toFormValues = (entry: ZEntry): FormValues => {
  const contentJson = entry.content_json ?? {};
  const metaJson = entry.meta_json ?? {};
  return {
    title: entry.title,
    slug: entry.slug,
    content_json: JSON.stringify(contentJson, null, 2),
    meta_json: JSON.stringify(metaJson, null, 2),
    is_published: entry.is_published,
    published_at: viewDate(entry.published_at),
    template_override: entry.template_override ?? '',
  };
};

/**
 * Store для управления состоянием редактора записи.
 */
export class EntryEditorStore {
  formValues: FormValues = defaultFormValues;
  initialLoading = false;
  pending = false;

  /**
   * Создаёт экземпляр стора редактора записи.
   */
  constructor() {
    makeAutoObservable(this);
  }

  /**
   * Устанавливает значения формы.
   * @param values Новые значения формы.
   */
  setFormValues(values: FormValues): void {
    this.formValues = values;
  }

  /**
   * Устанавливает значение конкретного поля формы.
   * @param field Имя поля.
   * @param value Новое значение поля.
   */
  setFormField<K extends keyof FormValues>(field: K, value: FormValues[K]): void {
    this.formValues = { ...this.formValues, [field]: value };
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
   * Сбрасывает форму к значениям по умолчанию.
   */
  resetForm(): void {
    this.formValues = defaultFormValues;
  }

  /**
   * Загружает данные записи для редактирования.
   * @param id ID записи.
   */
  async loadEntry(id: number): Promise<void> {
    this.setInitialLoading(true);
    try {
      const entry = await getEntry(id);
      this.setFormValues(toFormValues(entry));
    } catch (error) {
      onError(error);
    } finally {
      this.setInitialLoading(false);
    }
  }

  /**
   * Сохраняет запись (создаёт новую или обновляет существующую).
   * @param values Значения формы.
   * @param isEditMode Режим редактирования.
   * @param entryId ID записи (для режима редактирования).
   * @param postType Slug типа контента (обязателен при создании).
   * @returns Обновлённая запись.
   * @throws Ошибка валидации JSON или ошибка API.
   */
  async saveEntry(
    values: FormValues,
    isEditMode: boolean,
    entryId?: number,
    postType?: string
  ): Promise<ZEntry | null> {
    this.setPending(true);
    try {
      // При создании post_type обязателен
      if (!isEditMode && !postType) {
        notificationService.showError({
          message: 'Ошибка валидации',
          description: 'Тип контента обязателен при создании записи',
        });
        return null;
      }

      let contentJson: Record<string, unknown> | null = null;
      let metaJson: Record<string, unknown> | null = null;

      // Парсим JSON поля
      if (values.content_json.trim()) {
        try {
          contentJson = JSON.parse(values.content_json);
        } catch (error) {
          notificationService.showError({
            message: 'Ошибка валидации',
            description: 'Неверный формат JSON в поле content_json',
          });
          return null;
        }
      }

      if (values.meta_json.trim()) {
        try {
          metaJson = JSON.parse(values.meta_json);
        } catch (error) {
          notificationService.showError({
            message: 'Ошибка валидации',
            description: 'Неверный формат JSON в поле meta_json',
          });
          return null;
        }
      }

      const payload: ZEntryPayload = {
        title: values.title.trim(),
        slug: values.slug.trim(),
        content_json: contentJson ?? undefined,
        meta_json: metaJson ?? undefined,
        is_published: values.is_published,
        published_at: serverDate(values.published_at),
        template_override: values.template_override.trim() || null,
        ...(postType && { post_type: postType }),
      };

      const nextEntry =
        isEditMode && entryId ? await updateEntry(entryId, payload) : await createEntry(payload);
      const successMessage = isEditMode ? 'Запись обновлена' : 'Запись создана';
      notificationService.showSuccess({ message: successMessage });
      this.setFormValues(toFormValues(nextEntry));
      return nextEntry;
    } catch (error) {
      onError(error);
      return null;
    } finally {
      this.setPending(false);
    }
  }
}

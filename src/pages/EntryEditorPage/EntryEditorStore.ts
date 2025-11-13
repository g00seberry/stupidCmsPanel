import { createEntry, getEntry, updateEntry } from '@/api/apiEntries';
import { getTemplates } from '@/api/apiTemplates';
import { notificationService } from '@/services/notificationService';
import type { ZEntry, ZEntryPayload } from '@/types/entries';
import type { ZTemplate } from '@/types/templates';
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
  readonly is_published: boolean;
  readonly published_at: Dayjs | null;
  readonly template_override: string;
}

const defaultFormValues: FormValues = {
  title: '',
  slug: '',
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
  return {
    title: entry.title,
    slug: entry.slug,
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
  templates: ZTemplate[] = [];
  loadingTemplates = false;

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
   * Загружает список доступных шаблонов.
   */
  async loadTemplates(): Promise<void> {
    if (this.loadingTemplates || this.templates.length > 0) {
      return;
    }
    this.loadingTemplates = true;
    try {
      this.templates = await getTemplates();
    } catch (error) {
      onError(error);
    } finally {
      this.loadingTemplates = false;
    }
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

      const payload: ZEntryPayload = {
        title: values.title.trim(),
        slug: values.slug.trim(),
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

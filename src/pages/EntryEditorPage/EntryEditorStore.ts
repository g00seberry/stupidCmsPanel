import { createEntry, getEntry, updateEntry } from '@/api/apiEntries';
import { getPostType } from '@/api/apiPostTypes';
import { getTemplates } from '@/api/apiTemplates';
import { notificationService } from '@/services/notificationService';
import type { ZEntry, ZEntryPayload } from '@/types/entries';
import type { ZPostType } from '@/types/postTypes';
import type { ZTemplate } from '@/types/templates';
import { onError } from '@/utils/onError';
import { serverDate, viewDate } from '@/utils/dateUtils';
import { makeAutoObservable } from 'mobx';
import type { Dayjs } from 'dayjs';
import type { ZId } from '@/types/ZId';

const idNew = 'new';

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
  loading = false;
  postType: ZPostType | null = null;
  currentPostTypeSlug: string;
  entryId: ZId | typeof idNew;

  get isEditMode(): boolean {
    return this.entryId !== idNew;
  }
  /**
   * Создаёт экземпляр стора редактора записи.
   * @param postTypeSlug Slug типа контента (опционально).
   * @param entryId ID записи для редактирования (опционально).
   */
  constructor(postTypeSlug: string, entryId: ZId) {
    this.currentPostTypeSlug = postTypeSlug;
    this.entryId = entryId;
    makeAutoObservable(this);
    void this.init();
  }

  /**
   * Устанавливает тип контента.
   * @param postType Тип контента.
   */
  setPostType(postType: ZPostType): void {
    this.postType = postType;
  }

  /**
   * Устанавливает шаблоны.
   * @param templates Шаблоны.
   */
  setTemplates(templates: ZTemplate[]): void {
    this.templates = templates;
  }

  /**
   * Устанавливает значения формы.
   * @param values Новые значения формы.
   */
  setFormValues(values: FormValues): void {
    this.formValues = values;
  }

  /**
   * Устанавливает флаг начальной загрузки.
   * @param value Новое значение флага.
   */
  setLoading(value: boolean): void {
    this.loading = value;
  }

  /**
   * Устанавливает флаг выполнения операции.
   * @param value Новое значение флага.
   */
  setPending(value: boolean): void {
    this.pending = value;
  }

  /**
   * Инициализирует стор: загружает шаблоны, тип контента (если указан) и запись (если указан ID).
   * @param postTypeSlug Slug типа контента (опционально).
   * @param entryId ID записи для редактирования (опционально).
   */
  async init(): Promise<void> {
    try {
      this.setLoading(true);
      if (this.isEditMode) {
        const entry = await getEntry(this.entryId);
        this.setFormValues(toFormValues(entry));
      }
      this.setPostType(await getPostType(this.currentPostTypeSlug));
      this.setTemplates(await getTemplates());
    } catch (error) {
      onError(error);
    } finally {
      this.setLoading(false);
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
    entryId?: ZId,
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
        title: (values.title || '').trim(),
        slug: (values.slug || '').trim(),
        is_published: values.is_published,
        published_at: serverDate(values.published_at),
        template_override: (values.template_override || '').trim() || null,
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

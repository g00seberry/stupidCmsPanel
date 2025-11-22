import { createEntry, getEntry, getEntryTerms, updateEntry } from '@/api/apiEntries';
import { getPostType } from '@/api/apiPostTypes';
import { getTemplates } from '@/api/apiTemplates';
import { listPaths } from '@/api/pathApi';
import { EntryTermsManagerStore } from '@/components/EntryTermsManager/EntryTermsManagerStore';
// import { type BlueprintFormValues } from '@/components/blueprintForm';
import { notificationService } from '@/services/notificationService';
import type { ZId } from '@/types/ZId';
import type { ZEntry, ZEntryPayload } from '@/types/entries';
import type { ZPath } from '@/types/path';
import type { ZPostType } from '@/types/postTypes';
import type { ZTemplate } from '@/types/templates';
import { serverDate, viewDate } from '@/utils/dateUtils';
import { onError } from '@/utils/onError';
import type { Dayjs } from 'dayjs';
import { makeAutoObservable } from 'mobx';

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
  readonly term_ids: ZId[];
  readonly content_json?: Record<string, any>;
}

const defaultFormValues: FormValues = {
  title: '',
  slug: '',
  is_published: false,
  published_at: null,
  template_override: '',
  term_ids: [],
  content_json: {},
};

/**
 * Преобразует данные записи в значения формы.
 * @param entry Запись, полученная из API.
 * @param termIds Массив ID термов записи (опционально).
 * @param paths Дерево Path для преобразования content_json (опционально).
 * @returns Значения формы, готовые к отображению пользователю.
 */
const toFormValues = (entry: ZEntry, termIds: ZId[] = []): FormValues => {
  return {
    title: entry.title,
    slug: entry.slug,
    is_published: entry.is_published,
    published_at: viewDate(entry.published_at),
    template_override: entry.template_override ?? '',
    term_ids: termIds,
    content_json: entry.content_json || {},
  };
};

/**
 * Store для управления состоянием редактора записи.
 */
export class EntryEditorStore {
  initialFormValues: FormValues = defaultFormValues;
  initialLoading = false;
  pending = false;
  templates: ZTemplate[] = [];
  loading = false;
  postType: ZPostType | null = null;
  postTypeSlug: string;
  entryId: ZId | typeof idNew;
  /** Store для управления термами записи. Создаётся только в режиме редактирования. */
  termsManagerStore: EntryTermsManagerStore | null = null;
  /** Дерево Path для текущего Blueprint. */
  paths: ZPath[] = [];
  /** Флаг загрузки Path. */
  loadingPaths = false;
  /** Blueprint из Entry (если есть). */
  blueprintId: number | null = null;

  get isEditMode(): boolean {
    return this.entryId !== idNew;
  }
  /**
   * Создаёт экземпляр стора редактора записи.
   * @param postTypeSlug Slug типа контента (опционально).
   * @param entryId ID записи для редактирования (опционально).
   */
  constructor(postTypeSlug: string, entryId: ZId) {
    this.postTypeSlug = postTypeSlug;
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
    this.initialFormValues = values;
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
   * Устанавливает ID Blueprint.
   * @param value ID Blueprint или null.
   */
  setBlueprintId(value: number | null): void {
    this.blueprintId = value;
  }

  /**
   * Загружает Path дерево для Blueprint.
   * Использует blueprint из Entry, если доступен, иначе fallback на postType.blueprint_id.
   */
  async loadPaths(blueprintId?: number | null): Promise<void> {
    const id = blueprintId ?? this.blueprintId ?? this.postType?.blueprint_id ?? null;

    if (!id) {
      this.paths = [];
      return;
    }

    this.loadingPaths = true;
    try {
      this.setBlueprintId(id);
      this.paths = await listPaths(id);
    } catch (error) {
      onError(error);
      this.paths = [];
    } finally {
      this.loadingPaths = false;
    }
  }

  /**
   * Инициализирует стор: загружает шаблоны, тип контента (если указан) и запись (если указан ID).
   * @param postTypeSlug Slug типа контента (опционально).
   * @param entryId ID записи для редактирования (опционально).
   */
  async init(): Promise<void> {
    try {
      this.setLoading(true);
      this.setPostType(await getPostType(this.postTypeSlug));

      if (this.isEditMode) {
        const [entry, entryTerms] = await Promise.all([
          getEntry(this.entryId),
          getEntryTerms(this.entryId),
        ]);

        // Используем blueprint из Entry, если доступен
        if (entry.blueprint) {
          this.blueprintId = entry.blueprint.id;
          await this.loadPaths(entry.blueprint.id);
        } else {
          // Fallback на blueprint_id из PostType
          await this.loadPaths();
        }

        const termIds = entryTerms.terms_by_taxonomy.flatMap(group =>
          group.terms.map(term => term.id)
        );
        this.setFormValues(toFormValues(entry, termIds));
        // Создаём стор для управления термами
        this.termsManagerStore = new EntryTermsManagerStore(this.entryId);
        await this.termsManagerStore.initialize(termIds);
      } else {
        // При создании используем blueprint_id из PostType
        await this.loadPaths();
      }

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
        term_ids: values.term_ids,
        content_json: values.content_json,
        ...(postType && { post_type: postType }),
      };

      const nextEntry =
        isEditMode && entryId ? await updateEntry(entryId, payload) : await createEntry(payload);
      const successMessage = isEditMode ? 'Запись обновлена' : 'Запись создана';
      notificationService.showSuccess({ message: successMessage });
      // После сохранения загружаем термы для обновления формы и стора
      if (this.isEditMode && nextEntry) {
        const entryTerms = await getEntryTerms(nextEntry.id);
        const termIds = entryTerms.terms_by_taxonomy.flatMap(group =>
          group.terms.map(term => term.id)
        );
        this.setFormValues(toFormValues(nextEntry, termIds));
        // Обновляем стор термов
        if (this.termsManagerStore) {
          this.termsManagerStore.setEntryTerms(entryTerms);
          this.termsManagerStore.pendingTermIds = new Set(termIds);
        }
      } else {
        this.setFormValues(toFormValues(nextEntry, []));
      }
      return nextEntry;
    } catch (error) {
      onError(error);
      return null;
    } finally {
      this.setPending(false);
    }
  }
}

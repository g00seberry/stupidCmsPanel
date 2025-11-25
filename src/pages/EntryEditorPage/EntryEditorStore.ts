import { createEntry, getEntry, getEntryTerms, updateEntry } from '@/api/apiEntries';
import { getPostType } from '@/api/apiPostTypes';
import { getTemplates } from '@/api/apiTemplates';
import { EntryTermsManagerStore } from '@/components/EntryTermsManager/EntryTermsManagerStore';
import { notificationService } from '@/services/notificationService';
import { FormModel } from '@/components/schemaForm/FormModel';
import type { ZId } from '@/types/ZId';
import type { ZEntry } from '@/types/entries';
import type { ZPostType } from '@/types/postTypes';
import type { ZTemplate } from '@/types/templates';
import { onError } from '@/utils/onError';
import { createFormModelFromBlueprintSchema } from '@/components/schemaForm/schemaFormAdapter';
import { makeAutoObservable } from 'mobx';
import {
  entry2formValues,
  formValues2entryPayload,
  type EntryEditorFormValues,
} from './transforms';

const idNew = 'new';

const defaultFormValues: EntryEditorFormValues = {
  title: '',
  slug: '',
  is_published: false,
  published_at: null,
  template_override: '',
  term_ids: [],
  content_json: {},
};

/**
 * Store для управления состоянием редактора записи.
 */
export class EntryEditorStore {
  initialFormValues: EntryEditorFormValues = defaultFormValues;
  loading = false;
  templates: ZTemplate[] = [];
  postType: ZPostType | null = null;
  postTypeSlug: string;
  entryId: ZId | typeof idNew;
  termsManagerStore: EntryTermsManagerStore | null = null;
  blueprintModel: FormModel | null = null;

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
  setInitialFormValues(values: EntryEditorFormValues): void {
    this.initialFormValues = values;
  }

  /**
   * Устанавливает флаг выполнения асинхронной операции.
   * @param value Новое значение флага.
   */
  setLoading(value: boolean): void {
    this.loading = value;
  }

  /**
   * Устанавливает модель формы Blueprint.
   * @param model Модель формы или null.
   */
  setBlueprintModel(model: FormModel | null): void {
    this.blueprintModel = model;
  }

  setTermsManagerStore(store: EntryTermsManagerStore): void {
    this.termsManagerStore = store;
  }

  get isEditMode(): boolean {
    return this.entryId !== idNew;
  }

  /**
   * Инициализирует стор: загружает шаблоны, тип контента (если указан) и запись (если указан ID).
   * @param postTypeSlug Slug типа контента (опционально).
   * @param entryId ID записи для редактирования (опционально).
   */
  async init(): Promise<void> {
    try {
      this.setLoading(true);
      const postType = await getPostType(this.postTypeSlug);
      this.setPostType(postType);
      const templates = await getTemplates();
      this.setTemplates(templates);

      if (this.isEditMode) {
        const [entry, entryTerms] = await Promise.all([
          getEntry(this.entryId),
          getEntryTerms(this.entryId),
        ]);

        const termIds = entryTerms.terms_by_taxonomy.flatMap(group =>
          group.terms.map(term => term.id)
        );
        this.setInitialFormValues(entry2formValues(entry, termIds));
        this.setTermsManagerStore(new EntryTermsManagerStore(this.entryId, entryTerms));
      }
      // Инициализируем Blueprint форму
      if (postType.blueprint_id) {
        const initialValues: any = this.initialFormValues.content_json;
        const model = await createFormModelFromBlueprintSchema(
          postType.blueprint_id,
          initialValues,
          this.postTypeSlug
        );
        this.setBlueprintModel(model);
      }
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
  async saveEntry(values: EntryEditorFormValues): Promise<ZEntry | null> {
    this.setLoading(true);
    try {
      const payload = formValues2entryPayload(values, this.postTypeSlug);
      const nextEntry = this.isEditMode
        ? await updateEntry(this.entryId, payload)
        : await createEntry(payload);
      const formValues = entry2formValues(nextEntry, values.term_ids);
      this.setInitialFormValues(formValues);
      this.blueprintModel?.setAll(formValues.content_json ?? {});
      notificationService.showSuccess({
        message: this.isEditMode ? 'Запись обновлена' : 'Запись создана',
      });
      return nextEntry;
    } catch (error) {
      onError(error);
      return null;
    } finally {
      this.setLoading(false);
    }
  }
}

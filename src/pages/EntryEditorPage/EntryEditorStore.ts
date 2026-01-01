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
import type { AxiosError } from 'axios';
import { zProblemJson, type ZProblemJson } from '@/types/ZProblemJson';
import {
  entry2formValues,
  formValues2entryPayload,
  type EntryEditorFormValues,
} from './transforms';

const idNew = 'new';

const defaultFormValues: EntryEditorFormValues = {
  title: '',
  is_published: false,
  published_at: null,
  template_override: '',
  term_ids: [],
  data_json: {},
};

/**
 * Store для управления состоянием редактора записи.
 */
export class EntryEditorStore {
  initialFormValues: EntryEditorFormValues = defaultFormValues;
  loading = false;
  templates: ZTemplate[] = [];
  postType: ZPostType | null = null;
  postTypeId: ZId;
  entryId: ZId | typeof idNew;
  termsManagerStore: EntryTermsManagerStore | null = null;
  blueprintModel: FormModel | null = null;

  /**
   * Создаёт экземпляр стора редактора записи.
   * @param postTypeId ID типа контента.
   * @param entryId ID записи для редактирования (опционально).
   */
  constructor(postTypeId: ZId, entryId: ZId) {
    this.postTypeId = postTypeId;
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
   */
  async init(): Promise<void> {
    try {
      this.setLoading(true);
      const postType = await getPostType(this.postTypeId);
      this.setPostType(postType);
      const templates = await getTemplates();
      this.setTemplates(templates);

      let entry: ZEntry | null = null;
      if (this.isEditMode) {
        const [entryData, entryTerms] = await Promise.all([
          getEntry(this.entryId),
          getEntryTerms(this.entryId),
        ]);
        entry = entryData;

        const termIds = entryTerms.terms_by_taxonomy.flatMap(group =>
          group.terms.map(term => term.id)
        );
        this.setInitialFormValues(entry2formValues(entry, termIds));
        this.setTermsManagerStore(new EntryTermsManagerStore(this.entryId, entryTerms));
      }
      // Инициализируем Blueprint форму
      if (postType.blueprint_id) {
        const initialValues: any = this.initialFormValues.data_json;
        const relatedData = entry?.related ?? null;
        const model = await createFormModelFromBlueprintSchema(
          postType.blueprint_id,
          initialValues,
          this.postTypeId,
          relatedData
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
   * При ошибке валидации (422) устанавливает ошибки в blueprintModel из ответа API.
   * @param values Значения формы.
   * @returns Обновлённая запись или `null`, если произошла ошибка.
   */
  async saveEntry(values: EntryEditorFormValues): Promise<ZEntry | null> {
    this.setLoading(true);
    try {
      const payload = formValues2entryPayload(values, this.postTypeId);
      const nextEntry = this.isEditMode
        ? await updateEntry(this.entryId, payload)
        : await createEntry(payload);
      const formValues = entry2formValues(nextEntry, values.term_ids);
      this.setInitialFormValues(formValues);
      this.blueprintModel?.setAll(formValues.data_json ?? {});
      // Очищаем ошибки при успешном сохранении
      this.blueprintModel?.setErrorsFromApi({});
      notificationService.showSuccess({
        message: this.isEditMode ? 'Запись обновлена' : 'Запись создана',
      });
      return nextEntry;
    } catch (error) {
      // Обрабатываем ошибки валидации (422) и устанавливаем их в blueprintModel
      if (this.blueprintModel && (error as AxiosError).response?.status === 422) {
        const problemResult = zProblemJson.safeParse((error as AxiosError).response?.data);
        if (problemResult.success) {
          // Извлекаем ошибки из meta.errors или errors (в корне объекта)
          const data = problemResult.data as ZProblemJson & { errors?: Record<string, string[]> };
          const apiErrors = data.meta?.errors || data.errors;
          if (apiErrors && typeof apiErrors === 'object') {
            // Фильтруем ошибки, относящиеся к data_json (Blueprint форме)
            const blueprintErrors: Record<string, string[]> = {};
            for (const [path, messages] of Object.entries(apiErrors)) {
              if (path.startsWith('data_json.') && Array.isArray(messages)) {
                blueprintErrors[path] = messages;
              }
            }
            if (Object.keys(blueprintErrors).length > 0) {
              this.blueprintModel.setErrorsFromApi(blueprintErrors);
            }
          }
        }
      }
      onError(error);
      return null;
    } finally {
      this.setLoading(false);
    }
  }
}

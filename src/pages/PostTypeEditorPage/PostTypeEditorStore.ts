import { createPostType, deletePostType, getPostType, updatePostType } from '@/api/apiPostTypes';
import { getTemplates } from '@/api/apiTemplates';
import { notificationService } from '@/services/notificationService';
import type { ZPostType, ZPostTypePayload } from '@/types/postTypes';
import type { ZTemplate } from '@/types/templates';
import type { ZId } from '@/types/ZId';
import { onError } from '@/utils/onError';
import {
  getDefaultOptions,
  getTaxonomiesFromOptions,
  setTaxonomiesInOptions,
} from '@/utils/postTypeOptions';
import { makeAutoObservable } from 'mobx';

/**
 * Значения формы редактора типа контента.
 */
export interface FormValues {
  readonly name: string;
  readonly template: string | null;
  readonly taxonomies: ZId[];
}

const defaultFormValues: FormValues = {
  name: '',
  template: null,
  taxonomies: [],
};

/**
 * Преобразует данные типа контента в значения формы.
 * @param postType Тип контента, полученный из API.
 * @returns Значения формы, готовые к отображению пользователю.
 */
const toFormValues = (postType: ZPostType): FormValues => {
  return {
    name: postType.name,
    template: postType.template ?? null,
    taxonomies: getTaxonomiesFromOptions(postType.options_json),
  };
};

/**
 * Store для управления состоянием редактора типа контента.
 */
export class PostTypeEditorStore {
  formValues: FormValues = defaultFormValues;
  initialLoading = false;
  pending = false;
  /** Текущий тип контента, загруженный из API. */
  currentPostType: ZPostType | null = null;
  /** Список доступных шаблонов. */
  templates: ZTemplate[] = [];

  /**
   * Создаёт экземпляр стора редактора типа контента.
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
   * Устанавливает список доступных шаблонов.
   * @param templates Массив шаблонов.
   */
  setTemplates(templates: ZTemplate[]): void {
    this.templates = templates;
  }

  /**
   * Устанавливает текущий тип контента.
   * @param postType Тип контента для установки.
   */
  setCurrentPostType(postType: ZPostType | null): void {
    this.currentPostType = postType;
  }

  /**
   * Загружает данные типа контента для редактирования и список шаблонов.
   * @param id ID типа контента.
   */
  async loadPostType(id: ZId): Promise<void> {
    this.setInitialLoading(true);
    try {
      const [postType, templates] = await Promise.all([getPostType(id), getTemplates()]);
      this.setCurrentPostType(postType);
      this.setFormValues(toFormValues(postType));
      this.setTemplates(templates);
    } catch (error) {
      onError(error);
    } finally {
      this.setInitialLoading(false);
    }
  }

  /**
   * Загружает список доступных шаблонов.
   */
  async loadTemplates(): Promise<void> {
    try {
      const templates = await getTemplates();
      this.setTemplates(templates);
    } catch (error) {
      onError(error);
    }
  }

  /**
   * Создаёт payload для сохранения типа контента из значений формы.
   * Сохраняет текущий options_json и обновляет таксономии из формы.
   * @param values Значения формы.
   * @returns Payload для создания или обновления типа контента.
   * @private
   */
  private buildPayload(values: FormValues): ZPostTypePayload {
    const currentOptions = this.currentPostType?.options_json || getDefaultOptions();
    const updatedOptions = setTaxonomiesInOptions(currentOptions, values.taxonomies);

    return {
      name: values.name.trim(),
      template: values.template && values.template.trim() !== '' ? values.template.trim() : null,
      options_json: updatedOptions,
    };
  }

  /**
   * Сохраняет тип контента (создаёт новый или обновляет существующий).
   * @param values Значения формы.
   * @param isEditMode Режим редактирования.
   * @param currentId Текущий ID (для режима редактирования).
   * @returns Обновлённый тип контента.
   * @throws Ошибка валидации JSON или ошибка API.
   */
  async savePostType(
    values: FormValues,
    isEditMode: boolean,
    currentId?: ZId
  ): Promise<ZPostType | null> {
    this.setPending(true);

    const payload = this.buildPayload(values);

    try {
      const nextPostType =
        isEditMode && currentId
          ? await updatePostType(currentId, payload)
          : await createPostType(payload);
      const successMessage = isEditMode ? 'Тип контента обновлён' : 'Тип контента создан';
      notificationService.showSuccess({ message: successMessage });
      this.setCurrentPostType(nextPostType);
      this.setFormValues(toFormValues(nextPostType));
      return nextPostType;
    } catch (error) {
      onError(error);
      return null;
    } finally {
      this.setPending(false);
    }
  }

  /**
   * Удаляет тип контента.
   * @param id ID типа контента для удаления.
   * @param force Если `true`, каскадно удаляет все записи этого типа.
   * @returns `true`, если удаление выполнено успешно.
   * @throws Ошибка 409 (CONFLICT), если тип содержит записи и `force=false`.
   */
  async deletePostType(id: ZId, force = false): Promise<boolean> {
    this.setPending(true);
    try {
      await deletePostType(id, force);
      notificationService.showSuccess({ message: 'Тип контента удалён' });
      return true;
    } catch (error) {
      // Пробрасываем ошибку 409 для обработки в компоненте
      const axiosError = error as { response?: { status?: number } };
      if (axiosError.response?.status === 409) {
        throw error;
      }
      onError(error);
      return false;
    } finally {
      this.setPending(false);
    }
  }
}

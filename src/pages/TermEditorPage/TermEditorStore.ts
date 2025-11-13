import { createTerm, deleteTerm, getTerm, updateTerm } from '@/api/apiTerms';
import { notificationService } from '@/services/notificationService';
import type { ZTerm, ZTermPayload } from '@/types/terms';
import { onError } from '@/utils/onError';
import { makeAutoObservable } from 'mobx';

/**
 * Значения формы редактора термина.
 */
export interface FormValues {
  readonly name: string;
  readonly slug: string;
}

const defaultFormValues: FormValues = {
  name: '',
  slug: '',
};

/**
 * Преобразует данные термина в значения формы.
 * @param term Термин, полученный из API.
 * @returns Значения формы, готовые к отображению пользователю.
 */
const toFormValues = (term: ZTerm): FormValues => {
  return {
    name: term.name,
    slug: term.slug,
  };
};

/**
 * Store для управления состоянием редактора термина.
 */
export class TermEditorStore {
  formValues: FormValues = defaultFormValues;
  initialLoading = false;
  pending = false;

  /**
   * Создаёт экземпляр стора редактора термина.
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
   * Загружает данные термина для редактирования.
   * @param termId ID термина.
   */
  async loadTerm(termId: number): Promise<void> {
    this.setInitialLoading(true);
    try {
      const term = await getTerm(termId);
      this.setFormValues(toFormValues(term));
    } catch (error) {
      onError(error);
    } finally {
      this.setInitialLoading(false);
    }
  }

  /**
   * Сохраняет термин (создаёт новый или обновляет существующий).
   * @param values Значения формы.
   * @param taxonomySlug Slug таксономии.
   * @param isEditMode Режим редактирования.
   * @param termId ID термина (для режима редактирования).
   * @returns Обновлённый термин.
   */
  async saveTerm(
    values: FormValues,
    taxonomySlug: string,
    isEditMode: boolean,
    termId?: number
  ): Promise<ZTerm | null> {
    this.setPending(true);
    const payload: ZTermPayload = {
      name: values.name.trim(),
      slug: values.slug.trim(),
      meta_json: {},
    };
    try {
      const nextTerm =
        isEditMode && termId
          ? await updateTerm(termId, payload)
          : await createTerm(taxonomySlug, payload);
      const successMessage = isEditMode ? 'Термин обновлён' : 'Термин создан';
      notificationService.showSuccess({ message: successMessage });
      this.setFormValues(toFormValues(nextTerm));
      return nextTerm;
    } catch (error) {
      onError(error);
      return null;
    } finally {
      this.setPending(false);
    }
  }

  /**
   * Удаляет термин.
   * @param termId ID термина для удаления.
   * @param forceDetach Если `true`, автоматически отвязывает термин от всех записей.
   * @returns `true`, если удаление выполнено успешно.
   * @throws Ошибка 409 (CONFLICT), если термин привязан к записям и `forceDetach=false`.
   */
  async deleteTerm(termId: number, forceDetach = false): Promise<boolean> {
    this.setPending(true);
    try {
      await deleteTerm(termId, forceDetach);
      notificationService.showSuccess({ message: 'Термин удалён' });
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

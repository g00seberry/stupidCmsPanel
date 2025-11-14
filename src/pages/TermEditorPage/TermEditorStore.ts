import { createTerm, deleteTerm, getTerm, updateTerm } from '@/api/apiTerms';
import { notificationService } from '@/services/notificationService';
import type { ZTerm, ZTermPayload } from '@/types/terms';
import type { ZId } from '@/types/ZId';
import { onError } from '@/utils/onError';
import { makeAutoObservable } from 'mobx';

/**
 * Значения формы редактора термина.
 */
export interface FormValues {
  readonly name: string;
  readonly parent_id: ZId | null;
}

const defaultFormValues: FormValues = {
  name: '',
  parent_id: null,
};

/**
 * Преобразует данные термина в значения формы.
 * @param term Термин, полученный из API.
 * @returns Значения формы, готовые к отображению пользователю.
 */
const toFormValues = (term: ZTerm): FormValues => {
  return {
    name: term.name,
    parent_id: term.parent_id ?? null,
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
  async loadTerm(termId: ZId): Promise<void> {
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
   * @param taxonomyId ID таксономии.
   * @param isEditMode Режим редактирования.
   * @param termId ID термина (для режима редактирования).
   * @returns Обновлённый термин.
   */
  async saveTerm(
    values: FormValues,
    taxonomyId: ZId,
    isEditMode: boolean,
    termId?: ZId
  ): Promise<ZTerm | null> {
    this.setPending(true);
    const payload: ZTermPayload = {
      name: values.name.trim(),
      parent_id: values.parent_id ?? undefined,
      meta_json: {},
    };
    try {
      const nextTerm =
        isEditMode && termId
          ? await updateTerm(termId, payload)
          : await createTerm(taxonomyId, payload);
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
  async deleteTerm(termId: ZId, forceDetach = false): Promise<boolean> {
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

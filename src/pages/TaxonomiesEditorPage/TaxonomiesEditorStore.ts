import { createTaxonomy, deleteTaxonomy, getTaxonomy, updateTaxonomy } from '@/api/apiTaxonomies';
import { notificationService } from '@/services/notificationService';
import type { ZTaxonomy, ZTaxonomyPayload } from '@/types/taxonomies';
import type { ZId } from '@/types/ZId';
import { onError } from '@/utils/onError';
import { makeAutoObservable } from 'mobx';

/**
 * Значения формы редактора таксономии.
 */
export interface FormValues {
  readonly label: string;
  readonly hierarchical: boolean;
}

const defaultFormValues: FormValues = {
  label: '',
  hierarchical: false,
};

/**
 * Преобразует данные таксономии в значения формы.
 * @param taxonomy Таксономия, полученная из API.
 * @returns Значения формы, готовые к отображению пользователю.
 */
const toFormValues = (taxonomy: ZTaxonomy): FormValues => {
  return {
    label: taxonomy.label,
    hierarchical: taxonomy.hierarchical,
  };
};

/**
 * Store для управления состоянием редактора таксономии.
 */
export class TaxonomiesEditorStore {
  formValues: FormValues = defaultFormValues;
  initialLoading = false;
  pending = false;

  /**
   * Создаёт экземпляр стора редактора таксономии.
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
   * Загружает данные таксономии для редактирования.
   * @param id ID таксономии.
   */
  async loadTaxonomy(id: ZId): Promise<void> {
    this.setInitialLoading(true);
    try {
      const taxonomy = await getTaxonomy(id);
      this.setFormValues(toFormValues(taxonomy));
    } catch (error) {
      onError(error);
    } finally {
      this.setInitialLoading(false);
    }
  }

  /**
   * Сохраняет таксономию (создаёт новую или обновляет существующую).
   * @param values Значения формы.
   * @param isEditMode Режим редактирования.
   * @param currentId Текущий ID (для режима редактирования).
   * @returns Обновлённая таксономия.
   */
  async saveTaxonomy(
    values: FormValues,
    isEditMode: boolean,
    currentId?: ZId
  ): Promise<ZTaxonomy | null> {
    this.setPending(true);
    const payload: ZTaxonomyPayload = {
      label: values.label.trim(),
      hierarchical: values.hierarchical,
      options_json: {},
    };
    try {
      const nextTaxonomy =
        isEditMode && currentId
          ? await updateTaxonomy(currentId, payload)
          : await createTaxonomy(payload);
      const successMessage = isEditMode ? 'Таксономия обновлена' : 'Таксономия создана';
      notificationService.showSuccess({ message: successMessage });
      this.setFormValues(toFormValues(nextTaxonomy));
      return nextTaxonomy;
    } catch (error) {
      onError(error);
      return null;
    } finally {
      this.setPending(false);
    }
  }

  /**
   * Удаляет таксономию.
   * @param id ID таксономии для удаления.
   * @param force Если `true`, каскадно удаляет все термины этой таксономии.
   * @returns `true`, если удаление выполнено успешно.
   * @throws Ошибка 409 (CONFLICT), если таксономия содержит термины и `force=false`.
   */
  async deleteTaxonomy(id: ZId, force = false): Promise<boolean> {
    this.setPending(true);
    try {
      await deleteTaxonomy(id, force);
      notificationService.showSuccess({ message: 'Таксономия удалена' });
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

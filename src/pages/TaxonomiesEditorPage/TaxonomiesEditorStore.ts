import { createTaxonomy, deleteTaxonomy, getTaxonomy, updateTaxonomy } from '@/api/apiTaxonomies';
import { notificationService } from '@/services/notificationService';
import type { ZTaxonomy, ZTaxonomyPayload } from '@/types/taxonomies';
import { onError } from '@/utils/onError';
import { makeAutoObservable } from 'mobx';

/**
 * Значения формы редактора таксономии.
 */
export interface FormValues {
  readonly label: string;
  readonly slug: string;
  readonly hierarchical: boolean;
}

const defaultFormValues: FormValues = {
  label: '',
  slug: '',
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
    slug: taxonomy.slug,
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
   * Сбрасывает форму к значениям по умолчанию.
   */
  resetForm(): void {
    this.formValues = defaultFormValues;
  }

  /**
   * Загружает данные таксономии для редактирования.
   * @param slug Slug таксономии.
   */
  async loadTaxonomy(slug: string): Promise<void> {
    this.setInitialLoading(true);
    try {
      const taxonomy = await getTaxonomy(slug);
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
   * @param currentSlug Текущий slug (для режима редактирования).
   * @returns Обновлённая таксономия.
   */
  async saveTaxonomy(
    values: FormValues,
    isEditMode: boolean,
    currentSlug?: string
  ): Promise<ZTaxonomy | null> {
    this.setPending(true);
    const payload: ZTaxonomyPayload = {
      label: values.label.trim(),
      slug: values.slug.trim(),
      hierarchical: values.hierarchical,
      options_json: {},
    };
    try {
      const nextTaxonomy =
        isEditMode && currentSlug
          ? await updateTaxonomy(currentSlug, payload)
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
   * @param slug Slug таксономии для удаления.
   * @param force Если `true`, каскадно удаляет все термины этой таксономии.
   * @returns `true`, если удаление выполнено успешно.
   * @throws Ошибка 409 (CONFLICT), если таксономия содержит термины и `force=false`.
   */
  async deleteTaxonomy(slug: string, force = false): Promise<boolean> {
    this.setPending(true);
    try {
      await deleteTaxonomy(slug, force);
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


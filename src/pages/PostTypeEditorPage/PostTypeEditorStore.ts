import { createPostType, getPostType, updatePostType } from '@/api/apiPostTypes';
import { slugify } from '@/api/apiUtils';
import { notificationService } from '@/services/notificationService';
import type { ZPostType, ZPostTypePayload } from '@/types/postTypes';
import { debounce } from '@/utils/debounce';
import { onError } from '@/utils/onError';
import { makeAutoObservable } from 'mobx';

const slugifyDebounced = debounce<Promise<string | undefined>, string>(async (name: string) => {
  const trimmedName = name as string;
  if (trimmedName.length === 0) {
    return;
  }
  const result = await slugify(trimmedName);
  return result.base;
});

/**
 * Значения формы редактора типа контента.
 */
export interface FormValues {
  readonly name: string;
  readonly slug: string;
  readonly template: string;
  readonly options_json: string;
}

const defaultFormValues: FormValues = {
  name: '',
  slug: '',
  template: '',
  options_json: '',
};

/**
 * Преобразует данные типа контента в значения формы.
 * @param postType Тип контента, полученный из API.
 * @param fallbackTemplate Значение шаблона по умолчанию.
 * @returns Значения формы, готовые к отображению пользователю.
 */
const toFormValues = (postType: ZPostType): FormValues => {
  const options = postType.options_json ?? {};
  return {
    name: postType.name,
    slug: postType.slug,
    template: postType.template ?? '',
    options_json: JSON.stringify(options, null, 2),
  };
};

/**
 * Store для управления состоянием редактора типа контента.
 */
export class PostTypeEditorStore {
  formValues: FormValues = defaultFormValues;
  initialLoading = false;
  pending = false;
  slugManuallyEdited = false;

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
   * Устанавливает флаг ручного редактирования slug.
   * @param value Новое значение флага.
   */
  setSlugManuallyEdited(value: boolean): void {
    this.slugManuallyEdited = value;
  }

  /**
   * Сбрасывает форму к значениям по умолчанию.
   */
  resetForm(): void {
    this.formValues = defaultFormValues;
    this.slugManuallyEdited = false;
  }

  /**
   * Обрабатывает изменение названия и генерирует slug при необходимости.
   * @param name Новое значение названия.
   * @param isEditMode Режим редактирования (в режиме редактирования slug не генерируется автоматически).
   */
  async handleNameChange(name: string): Promise<void> {
    if (this.initialLoading || this.pending) {
      return;
    }
    const newSlug = await slugifyDebounced(300, name);
    if (newSlug) {
      this.setFormField('slug', newSlug);
    }
  }

  /**
   * Обрабатывает изменение slug и обновляет флаг ручного редактирования.
   * @param value Новое значение slug.
   */
  handleSlugChange(value: string): void {
    const trimmed = value.trim();
    this.setSlugManuallyEdited(trimmed.length > 0);
  }

  /**
   * Загружает данные типа контента для редактирования.
   * @param slug Slug типа контента.
   */
  async loadPostType(slug: string): Promise<void> {
    this.setInitialLoading(true);
    try {
      const postType = await getPostType(slug);
      this.setFormValues(toFormValues(postType));
    } catch (error) {
      onError(error);
    } finally {
      this.setInitialLoading(false);
    }
  }

  /**
   * Сохраняет тип контента (создаёт новый или обновляет существующий).
   * @param isEditMode Режим редактирования.
   * @param currentSlug Текущий slug (для режима редактирования).
   * @returns Обновлённый тип контента.
   * @throws Ошибка валидации JSON или ошибка API.
   */
  async savePostType(
    values: FormValues,
    isEditMode: boolean,
    currentSlug?: string
  ): Promise<ZPostType | null> {
    this.setPending(true);
    const payload: ZPostTypePayload = {
      slug: values.slug.trim(),
      name: values.name.trim(),
      template: values.template.trim() || undefined,
      options_json: {},
    };
    try {
      const nextPostType =
        isEditMode && currentSlug
          ? await updatePostType(currentSlug, payload)
          : await createPostType(payload);
      const successMessage = isEditMode ? 'Тип контента обновлён' : 'Тип контента создан';
      notificationService.showSuccess({ message: successMessage });
      this.setFormValues(toFormValues(nextPostType));
      return nextPostType;
    } catch (error) {
      onError(error);
      return null;
    } finally {
      this.setPending(false);
    }
  }
}

import type { FormModel } from '@/components/schemaForm/FormModel';
import type { FormValues } from '@/components/schemaForm/FormValues';

/**
 * Результат обработки сабмита формы.
 */
export interface FormSubmitResult {
  /** `true`, если валидация прошла успешно. */
  success: boolean;
  /** Значения формы (только если success === true). */
  values?: FormValues;
  /** Сообщения об ошибках (только если success === false). */
  errors?: Array<{ path: string; messages: string[] }>;
}

/**
 * Обрабатывает сабмит формы с валидацией через FormModel.
 * Выполняет валидацию всех полей формы и возвращает результат.
 * @param model Модель формы на MobX.
 * @returns Результат обработки сабмита с флагом success и данными/ошибками.
 * @example
 * const handleSubmit = async () => {
 *   const result = await handleFormSubmit(model);
 *   if (result.success) {
 *     console.log('Данные формы:', result.values);
 *     // Отправка на сервер
 *   } else {
 *     console.log('Ошибки:', result.errors);
 *   }
 * };
 */
export const handleFormSubmit = async (model: FormModel): Promise<FormSubmitResult> => {
  // Выполняем валидацию через FormModel
  const isValid = model.validate();

  if (!isValid) {
    // Если есть ошибки, возвращаем их
    const errors: Array<{ path: string; messages: string[] }> = [];
    for (const [path, messages] of model.errors.entries()) {
      errors.push({ path, messages });
    }

    return {
      success: false,
      errors,
    };
  }

  // Валидация прошла успешно - возвращаем значения
  return {
    success: true,
    values: model.json,
  };
};

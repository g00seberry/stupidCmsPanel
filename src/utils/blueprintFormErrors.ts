import type { AxiosError } from 'axios';
import type { FormInstance } from 'antd/es/form';
import { zProblemJson } from '@/types/ZProblemJson';

/**
 * Установить ошибки валидации в форму Ant Design из ответа API.
 * Обрабатывает ошибки валидации (422) с объектом errors в meta.
 * @param error Ошибка Axios с ответом от API.
 * @param form Экземпляр формы Ant Design для установки ошибок.
 * @returns `true`, если ошибки валидации были установлены, иначе `false`.
 */
export const setFormValidationErrors = (error: AxiosError, form: FormInstance): boolean => {
  const problemResult = zProblemJson.safeParse(error.response?.data);

  if (problemResult.success && problemResult.data.meta?.errors) {
    const errors = problemResult.data.meta.errors;
    const fields = Object.keys(errors);

    if (fields.length > 0) {
      const formErrors = fields
        .map(field => {
          const fieldErrors = errors[field];
          if (Array.isArray(fieldErrors) && fieldErrors.length > 0) {
            return {
              name: field,
              errors: fieldErrors,
            };
          }
          return null;
        })
        .filter((item): item is { name: string; errors: string[] } => item !== null);

      if (formErrors.length > 0) {
        // Преобразуем имена полей в формат Ant Design (массив для вложенных полей)
        const formattedErrors = formErrors.map(err => {
          // Если поле содержит точку, преобразуем в массив для вложенных полей
          // Например: "validation_rules.min" -> ["validation_rules", "min"]
          // "validation_rules.required_if.field" -> ["validation_rules", "required_if", "field"]
          if (err.name.includes('.')) {
            return {
              name: err.name.split('.'),
              errors: err.errors,
            };
          }
          return err;
        });

        form.setFields(formattedErrors);
        return true;
      }
    }
  }

  return false;
};

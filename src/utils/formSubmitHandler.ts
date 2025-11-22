import type { FormInstance } from 'antd/es/form';
import type { FormModel } from '@/stores/FormModel';
import type { EntitySchema, FormValues } from '@/types/schemaForm';

/**
 * Результат обработки сабмита формы.
 */
export interface FormSubmitResult<E extends EntitySchema> {
  /** `true`, если валидация прошла успешно. */
  success: boolean;
  /** Значения формы (только если success === true). */
  values?: FormValues<E>;
  /** Сообщения об ошибках (только если success === false). */
  errors?: Array<{ path: string; messages: string[] }>;
}

/**
 * Обрабатывает сабмит формы с валидацией.
 * Выполняет быструю валидацию AntD и бизнес-валидацию через FormModel.
 * @param form Экземпляр формы Ant Design.
 * @param model Модель формы на MobX.
 * @returns Результат обработки сабмита с флагом success и данными/ошибками.
 * @example
 * const handleSubmit = async () => {
 *   const result = await handleFormSubmit(form, model);
 *   if (result.success) {
 *     console.log('Данные формы:', result.values);
 *     // Отправка на сервер
 *   } else {
 *     console.log('Ошибки:', result.errors);
 *   }
 * };
 */
export const handleFormSubmit = async <E extends EntitySchema>(
  form: FormInstance,
  model: FormModel<E>
): Promise<FormSubmitResult<E>> => {
  try {
    // 1. Быстрая валидация AntD (проверка required, min, max, regex и т.д.)
    await form.validateFields();

    // 2. Бизнес-валидация через FormModel (сложные правила, кастомные валидаторы)
    const isValid = model.validate();

    if (!isValid) {
      // Если есть ошибки в модели, устанавливаем их в форму
      const errors: Array<{ path: string; messages: string[] }> = [];
      for (const [path, messages] of model.errors.entries()) {
        errors.push({ path, messages });
        // Устанавливаем ошибки в форму для отображения
        form.setFields([
          {
            name: path.split('.').map(seg => {
              // Обрабатываем индексы массивов [0]
              const match = seg.match(/^(.+)\[(\d+)\]$/);
              if (match) {
                return [match[1], parseInt(match[2], 10)];
              }
              return seg;
            }),
            errors: messages,
          },
        ]);
      }

      return {
        success: false,
        errors,
      };
    }

    // 3. Валидация прошла успешно - возвращаем значения
    return {
      success: true,
      values: model.json,
    };
  } catch (error) {
    // Ошибка валидации AntD
    return {
      success: false,
      errors: [
        {
          path: 'form',
          messages: [error instanceof Error ? error.message : 'Ошибка валидации формы'],
        },
      ],
    };
  }
};


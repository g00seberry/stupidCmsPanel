import axios from 'axios';
import { zProblemJson } from '@/types/ZProblemJson';
import { notificationService } from '@/services/notificationService';

/**
 * Показывает уведомление об ошибке и извлекает описание из разных источников.
 * @param error Ошибка, которую необходимо отобразить.
 */
export const onError = (error: unknown): void => {
  let description: string | React.ReactNode | undefined;
  let notificationMessage = 'Ошибка';
  console.error(error);
  if (axios.isAxiosError(error)) {
    const problemResult = zProblemJson.safeParse(error.response?.data);
    if (problemResult.success) {
      const problem = problemResult.data;
      notificationMessage = problem.title ?? problem.code ?? notificationMessage;
      description = problem.detail ?? error.message;
      if (problem.meta?.reasons) {
        description = (
          <div>
            <h2>{description}</h2>
            <ul>
              {problem.meta.reasons.map(r => (
                <li>{r}</li>
              ))}
            </ul>
          </div>
        );
      }
    } else {
      description = error.message;
    }
  } else if (typeof error === 'string') {
    description = error;
  } else if (error instanceof Error) {
    description = error.message;
  }

  notificationService.showError({
    message: notificationMessage,
    description,
  });
};

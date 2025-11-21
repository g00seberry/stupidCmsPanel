import { Modal } from 'antd';
import type { BlueprintEditorStore } from '@/stores/BlueprintEditorStore';

/**
 * Параметры для функции подтверждения удаления Blueprint.
 */
export type ConfirmDeleteBlueprintParams = {
  /** Store для управления Blueprint. */
  store: BlueprintEditorStore;
  /** Идентификатор Blueprint для удаления. */
  blueprintId: number;
  /** Название Blueprint (для отображения в сообщении). */
  blueprintName: string;
  /** Обработчик успешного удаления. */
  onSuccess?: () => void;
};

/**
 * Показывает модальное окно подтверждения удаления Blueprint.
 * Перед показом проверяет возможность удаления через API.
 * Если удаление невозможно, показывает причины и блокирует кнопку удаления.
 * @param params Параметры для подтверждения удаления.
 * @example
 * await confirmDeleteBlueprint({
 *   store: blueprintStore,
 *   blueprintId: 1,
 *   blueprintName: 'Article',
 *   onSuccess: () => navigate('/blueprints')
 * });
 */
export const confirmDeleteBlueprint = async ({
  store,
  blueprintId,
  blueprintName,
  onSuccess,
}: ConfirmDeleteBlueprintParams): Promise<void> => {
  try {
    const canDelete = await store.checkCanDelete(blueprintId);

    if (!canDelete.can_delete) {
      Modal.warning({
        title: 'Невозможно удалить Blueprint',
        content: (
          <div>
            <p>Blueprint &quot;{blueprintName}&quot; не может быть удалён по следующим причинам:</p>
            <ul className="list-disc list-inside mt-2">
              {canDelete.reasons.map((reason, index) => (
                <li key={index}>{reason}</li>
              ))}
            </ul>
            <p className="mt-4 text-sm text-muted-foreground">
              Удалите все зависимости перед удалением Blueprint.
            </p>
          </div>
        ),
        okText: 'Понятно',
        width: 500,
      });
      return;
    }

    Modal.confirm({
      title: 'Удалить Blueprint?',
      content: (
        <div>
          <p>Вы уверены, что хотите удалить Blueprint &quot;{blueprintName}&quot;?</p>
          <p className="mt-2 text-sm text-muted-foreground">
            Это действие нельзя отменить. Все данные Blueprint будут удалены.
          </p>
        </div>
      ),
      okText: 'Удалить',
      okType: 'danger',
      cancelText: 'Отмена',
      onOk: async () => {
        try {
          await store.deleteBlueprint(blueprintId);
          onSuccess?.();
        } catch (error) {
          // Ошибка уже обработана в store через onError
          throw error;
        }
      },
    });
  } catch (error) {
    // Ошибка уже обработана в store через onError
  }
};

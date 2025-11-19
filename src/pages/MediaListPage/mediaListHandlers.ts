import { bulkForceDeleteMedia, bulkRestoreMedia, listMedia, restoreMedia } from '@/api/apiMedia';
import { notificationService } from '@/services/notificationService';
import { onError } from '@/utils/onError';
import { AlertTriangle } from 'lucide-react';
import React from 'react';
import type { MessageInstance } from 'antd/es/message/interface';
import type { ModalStaticFunctions } from 'antd/es/modal/confirm';
import type { MediaListStore } from './MediaListStore';

/**
 * Загружает все идентификаторы медиа-файлов из корзины.
 * @returns Массив всех идентификаторов удаленных медиа-файлов.
 */
export const loadAllTrashMediaIds = async (): Promise<string[]> => {
  const allIds: string[] = [];
  let lastPage = 1;

  // Сначала загружаем первую страницу, чтобы узнать общее количество страниц
  try {
    const firstResult = await listMedia({
      deleted: 'only',
      page: 1,
      per_page: 100, // Максимальное количество на странице
      sort: 'created_at',
      order: 'desc',
    });

    allIds.push(...firstResult.data.map(m => m.id));
    lastPage = firstResult.meta.last_page;

    // Загружаем остальные страницы, если они есть
    for (let page = 2; page <= lastPage; page++) {
      const result = await listMedia({
        deleted: 'only',
        page,
        per_page: 100,
        sort: 'created_at',
        order: 'desc',
      });

      allIds.push(...result.data.map(m => m.id));
    }
  } catch (error) {
    onError(error);
  }

  return allIds;
};

/**
 * Обрабатывает удаление одного медиа-файла.
 * @param store Store для управления состоянием списка медиа-файлов.
 * @param id Идентификатор медиа-файла.
 */
export const handleDeleteMedia = async (store: MediaListStore, id: string): Promise<void> => {
  try {
    await store.bulkDelete([id]);
    notificationService.showSuccess({ message: 'Медиа-файл удалён' });
    // Если удалили последний элемент на странице, переходим на предыдущую
    const currentPage = store.loader.paginationMeta?.current_page || 1;
    if (currentPage > 1 && store.loader.data.length === 1) {
      await store.loader.goToPage(currentPage - 1);
    } else {
      await store.loadMedia();
    }
  } catch (error) {
    onError(error);
  }
};

/**
 * Обрабатывает массовое удаление медиа-файлов.
 * @param store Store для управления состоянием списка медиа-файлов.
 */
export const handleBulkDeleteMedia = async (store: MediaListStore): Promise<void> => {
  const selectedIds = store.getSelectedIds();
  if (selectedIds.length === 0) {
    return;
  }

  try {
    await store.bulkDelete(selectedIds);
    notificationService.showSuccess({ message: `Удалено медиа-файлов: ${selectedIds.length}` });
    store.deselectAll();
    // Если удалили все элементы на текущей странице, переходим на предыдущую
    const currentPage = store.loader.paginationMeta?.current_page || 1;
    if (currentPage > 1 && store.loader.data.length === selectedIds.length) {
      await store.loader.goToPage(currentPage - 1);
    } else {
      await store.loadMedia();
    }
  } catch (error) {
    onError(error);
  }
};

/**
 * Обрабатывает восстановление одного медиа-файла.
 * @param store Store для управления состоянием списка медиа-файлов.
 * @param id Идентификатор медиа-файла.
 * @param messageApi API для отображения сообщений Ant Design.
 */
export const handleRestoreMedia = async (
  store: MediaListStore,
  id: string,
  messageApi: MessageInstance
): Promise<void> => {
  try {
    await restoreMedia(id);
    messageApi.success('Медиа-файл восстановлен');
    // Если восстановили последний элемент на странице, переходим на предыдущую
    const currentPage = store.loader.paginationMeta?.current_page || 1;
    if (currentPage > 1 && store.loader.data.length === 1) {
      await store.loader.goToPage(currentPage - 1);
    } else {
      await store.loadMedia();
    }
  } catch (error) {
    onError(error);
  }
};

/**
 * Обрабатывает массовое восстановление медиа-файлов.
 * @param store Store для управления состоянием списка медиа-файлов.
 * @param messageApi API для отображения сообщений Ant Design.
 */
export const handleBulkRestoreMedia = async (
  store: MediaListStore,
  messageApi: MessageInstance
): Promise<void> => {
  const selectedIds = store.getSelectedIds();
  if (selectedIds.length === 0) {
    return;
  }

  try {
    await bulkRestoreMedia(selectedIds);
    messageApi.success(`Восстановлено медиа-файлов: ${selectedIds.length}`);
    store.deselectAll();
    // Если восстановили все элементы на текущей странице, переходим на предыдущую
    const currentPage = store.loader.paginationMeta?.current_page || 1;
    if (currentPage > 1 && store.loader.data.length === selectedIds.length) {
      await store.loader.goToPage(currentPage - 1);
    } else {
      await store.loadMedia();
    }
  } catch (error) {
    onError(error);
  }
};

/**
 * Обрабатывает окончательное удаление выбранных медиа-файлов.
 * @param store Store для управления состоянием списка медиа-файлов.
 * @param modalApi API для отображения модальных окон Ant Design.
 * @param messageApi API для отображения сообщений Ant Design.
 */
export const handleBulkForceDeleteMedia = async (
  store: MediaListStore,
  modalApi: Omit<ModalStaticFunctions, 'warn'>,
  messageApi: MessageInstance
): Promise<void> => {
  const selectedIds = store.getSelectedIds();
  if (selectedIds.length === 0) {
    return;
  }

  modalApi.confirm({
    title: 'Окончательное удаление',
    icon: React.createElement(AlertTriangle, { className: 'w-5 h-5 text-red-500' }),
    content: `Вы уверены, что хотите окончательно удалить ${selectedIds.length} медиа-файлов? Это действие нельзя отменить.`,
    okText: 'Удалить окончательно',
    okType: 'danger',
    cancelText: 'Отмена',
    onOk: async () => {
      try {
        await bulkForceDeleteMedia(selectedIds);
        messageApi.success(`Удалено медиа-файлов: ${selectedIds.length}`);
        store.deselectAll();
        // Если удалили все элементы на текущей странице, переходим на предыдущую
        const currentPage = store.loader.paginationMeta?.current_page || 1;
        if (currentPage > 1 && store.loader.data.length === selectedIds.length) {
          await store.loader.goToPage(currentPage - 1);
        } else {
          await store.loadMedia();
        }
      } catch (error) {
        onError(error);
      }
    },
  });
};

/**
 * Обрабатывает очистку всей корзины.
 * @param store Store для управления состоянием списка медиа-файлов.
 * @param modalApi API для отображения модальных окон Ant Design.
 * @param messageApi API для отображения сообщений Ant Design.
 */
export const handleClearTrash = async (
  store: MediaListStore,
  modalApi: Omit<ModalStaticFunctions, 'warn'>,
  messageApi: MessageInstance
): Promise<void> => {
  const totalCount = store.loader.paginationMeta?.total || 0;
  if (totalCount === 0) {
    return;
  }

  modalApi.confirm({
    title: 'Очистить корзину',
    icon: React.createElement(AlertTriangle, { className: 'w-5 h-5 text-red-500' }),
    content: `Вы уверены, что хотите окончательно удалить все ${totalCount} медиа-файлов из корзины? Это действие нельзя отменить.`,
    okText: 'Очистить корзину',
    okType: 'danger',
    cancelText: 'Отмена',
    onOk: async () => {
      try {
        // Загружаем все ID файлов из корзины
        const allMediaIds = await loadAllTrashMediaIds();

        if (allMediaIds.length === 0) {
          messageApi.info('Корзина уже пуста');
          await store.loadMedia();
          return;
        }

        // Удаляем все файлы порциями, если их много
        const batchSize = 100;
        for (let i = 0; i < allMediaIds.length; i += batchSize) {
          const batch = allMediaIds.slice(i, i + batchSize);
          await bulkForceDeleteMedia(batch);
        }

        messageApi.success(`Корзина очищена. Удалено ${allMediaIds.length} медиа-файлов`);
        store.deselectAll();
        // После очистки корзины возвращаемся на первую страницу
        await store.loader.goToPage(1);
        await store.loadMedia();
      } catch (error) {
        onError(error);
      }
    },
  });
};

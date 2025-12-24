import {
  bulkForceDeleteMedia,
  bulkRestoreMedia,
  emptyMediaTrash,
  restoreMedia,
} from '@/api/apiMedia';
import { notificationService } from '@/services/notificationService';
import { onError } from '@/utils/onError';
import type { MessageInstance } from 'antd/es/message/interface';
import type { ModalStaticFunctions } from 'antd/es/modal/confirm';
import { AlertTriangle } from 'lucide-react';
import React from 'react';
import type { MediaListStore } from './MediaListStore';

/**
 * Обрабатывает удаление одного медиа-файла.
 * @param store Store для управления состоянием списка медиа-файлов.
 * @param id Идентификатор медиа-файла.
 */
export const handleDeleteMedia = async (store: MediaListStore, id: string): Promise<void> => {
  try {
    await store.bulkDelete([id]);
    store.tableStore.deselectRow(id);
    const { resp } = store.tableStore.loader;
    notificationService.showSuccess({ message: 'Медиа-файл удалён' });
    // Если удалили последний элемент на странице, переходим на предыдущую
    const currentPage = resp?.meta?.current_page || 1;
    if (currentPage > 1 && resp?.data.length === 1) {
      await store.tableStore.loader.goToPage(currentPage - 1);
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
    const { resp } = store.tableStore.loader;
    // Если удалили все элементы на текущей странице, переходим на предыдущую
    const currentPage = resp?.meta?.current_page || 1;
    if (currentPage > 1 && resp?.data.length === selectedIds.length) {
      await store.tableStore.loader.goToPage(currentPage - 1);
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
    const { resp } = store.tableStore.loader;
    messageApi.success('Медиа-файл восстановлен');
    // Если восстановили последний элемент на странице, переходим на предыдущую
    const currentPage = resp?.meta?.current_page || 1;
    if (currentPage > 1 && resp?.data.length === 1) {
      await store.tableStore.loader.goToPage(currentPage - 1);
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
    const { resp } = store.tableStore.loader;
    // Если восстановили все элементы на текущей странице, переходим на предыдущую
    const currentPage = resp?.meta?.current_page || 1;
    if (currentPage > 1 && resp?.data.length === selectedIds.length) {
      await store.tableStore.loader.goToPage(currentPage - 1);
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
        const { resp } = store.tableStore.loader;
        messageApi.success(`Удалено медиа-файлов: ${selectedIds.length}`);
        store.deselectAll();
        // Если удалили все элементы на текущей странице, переходим на предыдущую
        const currentPage = resp?.meta?.current_page || 1;
        if (currentPage > 1 && resp?.data.length === selectedIds.length) {
          await store.tableStore.loader.goToPage(currentPage - 1);
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
  const totalCount = store.tableStore.loader.resp?.meta?.total || 0;
  if (totalCount === 0) {
    return;
  }

  modalApi.confirm({
    title: 'Очистить корзину',
    icon: React.createElement(AlertTriangle, { className: 'w-5 h-5 text-red-500' }),
    content: `Вы уверены, что хотите окончательно удалить все медиа-файлы из корзины? Это действие нельзя отменить.`,
    okText: 'Очистить корзину',
    okType: 'danger',
    cancelText: 'Отмена',
    onOk: async () => {
      try {
        await emptyMediaTrash();
        messageApi.success(`Корзина очищена. Удалено ${totalCount} медиа-файлов`);
        store.deselectAll();
        // После очистки корзины возвращаемся на первую страницу
        await store.tableStore.loader.goToPage(1);
        await store.loadMedia();
      } catch (error) {
        onError(error);
      }
    },
  });
};

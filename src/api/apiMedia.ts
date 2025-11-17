import { rest } from '@/api/rest';
import { zMediaListResponse, zMediaResponse, zMediaPayload } from '@/types/media';
import type { ZMedia, ZMediaListParams, ZMediaPayload } from '@/types/media';
import type { ZPaginationMeta, ZPaginationLinks } from '@/types/pagination';
import type { ZId } from '@/types/ZId';

/**
 * Формирует базовый URL для медиа API.
 * @param path Путь относительно базового URL медиа.
 * @returns Полный URL для медиа endpoint.
 */
const getAdminMediaUrl = (path: string): string => `/api/v1/admin/media${path}`;

/**
 * Преобразует параметры запроса в query-параметры для URL.
 * @param params Параметры запроса списка медиа-файлов.
 * @returns Объект с query-параметрами для Axios.
 */
const buildQueryParams = (params: ZMediaListParams): Record<string, string | number> => {
  const queryParams: Record<string, string | number> = {};

  if (params.kind) {
    queryParams.kind = params.kind;
  }

  if (params.mime) {
    queryParams.mime = params.mime;
  }

  if (params.collection) {
    queryParams.collection = params.collection;
  }

  if (params.q) {
    queryParams.q = params.q;
  }

  if (params.deleted) {
    queryParams.deleted = params.deleted;
  }

  if (params.sort) {
    queryParams.sort = params.sort;
  }

  if (params.order) {
    queryParams.order = params.order;
  }

  if (params.per_page !== undefined) {
    queryParams.per_page = params.per_page;
  }

  if (params.page !== undefined) {
    queryParams.page = params.page;
  }

  return queryParams;
};

/**
 * Загружает список медиа-файлов с фильтрами и пагинацией.
 * @param params Параметры фильтрации и пагинации.
 * @returns Объект с массивом медиа-файлов, метаданными пагинации и ссылками.
 * @example
 * const result = await listMedia({
 *   kind: 'image',
 *   collection: 'blog-images',
 *   per_page: 20,
 *   page: 1
 * });
 * console.log(result.data); // Массив медиа-файлов
 * console.log(result.meta.total); // Общее количество
 */
export const listMedia = async (
  params: ZMediaListParams = {}
): Promise<{
  data: ZMedia[];
  links: ZPaginationLinks;
  meta: ZPaginationMeta;
}> => {
  const queryParams = buildQueryParams(params);
  const response = await rest.get(getAdminMediaUrl(''), { params: queryParams });
  const parsed = zMediaListResponse.parse(response.data);
  return {
    data: parsed.data,
    links: parsed.links,
    meta: parsed.meta,
  };
};

/**
 * Загружает сведения о конкретном медиа-файле по ID.
 * @param id Уникальный идентификатор медиа-файла (ULID).
 * @returns Медиа-файл, прошедший валидацию схемой `zMedia`.
 * @example
 * const media = await getMedia('01HQZXABC123456789DEFGHIJKLM');
 * console.log(media.filename); // 'photo.jpg'
 * console.log(media.size_bytes); // 2048576
 */
export const getMedia = async (id: ZId): Promise<ZMedia> => {
  const response = await rest.get(getAdminMediaUrl(`/${id}`));
  const parsed = zMediaResponse.parse(response.data);
  return parsed.data;
};

/**
 * Загружает новый медиа-файл на сервер.
 * Использует `FormData` для передачи файла и дополнительных метаданных.
 * @param file Файл для загрузки.
 * @param metadata Дополнительные метаданные (title, alt, collection).
 * @param onProgress Callback для отслеживания прогресса загрузки.
 * @returns Созданный медиа-файл с присвоенным ID и метаданными.
 * @throws {Error} Если произошла ошибка при загрузке файла.
 * @example
 * const file = new File(['content'], 'photo.jpg', { type: 'image/jpeg' });
 * const media = await uploadMedia(file, {
 *   title: 'Закат на пляже',
 *   alt: 'Красивый закат на морском побережье',
 *   collection: 'blog-images'
 * }, (progress) => {
 *   console.log(`Загружено: ${progress}%`);
 * });
 * console.log(media.id); // '01HQZXABC123456789DEFGHIJKLM'
 */
export const uploadMedia = async (
  file: File,
  metadata?: Partial<ZMediaPayload>,
  onProgress?: (progress: number) => void
): Promise<ZMedia> => {
  const formData = new FormData();
  formData.append('file', file);

  if (metadata?.title) {
    formData.append('title', metadata.title);
  }

  if (metadata?.alt) {
    formData.append('alt', metadata.alt);
  }

  if (metadata?.collection) {
    formData.append('collection', metadata.collection);
  }

  const response = await rest.post(getAdminMediaUrl(''), formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
    onUploadProgress: progressEvent => {
      if (progressEvent.total && onProgress) {
        const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total);
        onProgress(progress);
      }
    },
  });

  const parsed = zMediaResponse.parse(response.data);
  return parsed.data;
};

/**
 * Обновляет метаданные существующего медиа-файла.
 * @param id Идентификатор медиа-файла для обновления.
 * @param payload Новые значения метаданных (title, alt, collection).
 * @returns Обновлённый медиа-файл.
 * @example
 * const updatedMedia = await updateMedia('01HQZXABC123456789DEFGHIJKLM', {
 *   title: 'Обновлённое название',
 *   alt: 'Обновлённый alt текст'
 * });
 * console.log(updatedMedia.title); // 'Обновлённое название'
 */
export const updateMedia = async (id: ZId, payload: ZMediaPayload): Promise<ZMedia> => {
  const parsedPayload = zMediaPayload.parse(payload);
  const response = await rest.put(getAdminMediaUrl(`/${id}`), parsedPayload);
  const parsed = zMediaResponse.parse(response.data);
  return parsed.data;
};

/**
 * Удаляет медиа-файлы (мягкое удаление).
 * Файлы помечаются как удалённые, но не удаляются физически.
 * @param ids Массив идентификаторов медиа-файлов для удаления (1-100 элементов).
 * @throws {Error} Если произошла ошибка при удалении.
 * @example
 * await deleteMedia(['01HQZXABC123456789DEFGHIJKLM']);
 * // или для нескольких файлов
 * await deleteMedia(['id1', 'id2', 'id3']);
 * console.log('Медиа-файлы успешно удалены');
 */
export const deleteMedia = async (ids: ZId[]): Promise<void> => {
  if (ids.length === 0) {
    throw new Error('Массив идентификаторов не может быть пустым');
  }
  if (ids.length > 100) {
    throw new Error('Максимум 100 элементов в одном запросе');
  }
  await rest.delete(getAdminMediaUrl('/bulk'), {
    data: { ids },
  });
};

/**
 * Восстанавливает ранее удалённые медиа-файлы.
 * @param ids Массив идентификаторов медиа-файлов для восстановления (1-100 элементов).
 * @returns Массив восстановленных медиа-файлов.
 * @throws {Error} Если произошла ошибка при восстановлении.
 * @example
 * const restored = await restoreMedia(['01HQZXABC123456789DEFGHIJKLM']);
 * // или для нескольких файлов
 * const restored = await restoreMedia(['id1', 'id2', 'id3']);
 * console.log(`Восстановлено ${restored.length} медиа-файлов`);
 */
export const restoreMedia = async (ids: ZId[]): Promise<ZMedia[]> => {
  if (ids.length === 0) {
    throw new Error('Массив идентификаторов не может быть пустым');
  }
  if (ids.length > 100) {
    throw new Error('Максимум 100 элементов в одном запросе');
  }
  const response = await rest.post(getAdminMediaUrl('/bulk/restore'), {
    ids,
  });
  const parsed = zMediaListResponse.parse(response.data);
  return parsed.data;
};

/**
 * Окончательно удаляет медиа-файлы (hard delete).
 * Файлы удаляются физически и не могут быть восстановлены.
 * @param ids Массив идентификаторов медиа-файлов для окончательного удаления (1-100 элементов).
 * @throws {Error} Если произошла ошибка при удалении.
 * @example
 * await forceDeleteMedia(['01HQZXABC123456789DEFGHIJKLM']);
 * // или для нескольких файлов
 * await forceDeleteMedia(['id1', 'id2', 'id3']);
 * console.log('Медиа-файлы окончательно удалены');
 */
export const forceDeleteMedia = async (ids: ZId[]): Promise<void> => {
  if (ids.length === 0) {
    throw new Error('Массив идентификаторов не может быть пустым');
  }
  if (ids.length > 100) {
    throw new Error('Максимум 100 элементов в одном запросе');
  }
  await rest.delete(getAdminMediaUrl('/bulk/force'), {
    data: { ids },
  });
};

/**
 * Массовое обновление метаданных медиа-файлов.
 * Применяет одинаковые метаданные ко всем указанным медиа-файлам.
 * @param ids Массив идентификаторов медиа-файлов для обновления (1-100 элементов).
 * @param payload Новые значения метаданных (title, alt, collection).
 * @returns Массив обновлённых медиа-файлов.
 * @throws {Error} Если произошла ошибка при обновлении.
 * @example
 * const updated = await bulkUpdateMedia(['id1', 'id2', 'id3'], {
 *   title: 'Общее название',
 *   collection: 'blog-images'
 * });
 * console.log(`Обновлено ${updated.length} медиа-файлов`);
 */
export const bulkUpdateMedia = async (ids: ZId[], payload: ZMediaPayload): Promise<ZMedia[]> => {
  if (ids.length === 0) {
    throw new Error('Массив идентификаторов не может быть пустым');
  }
  if (ids.length > 100) {
    throw new Error('Максимум 100 элементов в одном запросе');
  }
  const parsedPayload = zMediaPayload.parse(payload);
  const response = await rest.put(getAdminMediaUrl('/bulk'), {
    ids,
    ...parsedPayload,
  });
  const parsed = zMediaListResponse.parse(response.data);
  return parsed.data;
};

/**
 * Возвращает URL для превью медиа-файла через публичный API.
 * Используется для отображения изображений в UI без аутентификации.
 * @param id Идентификатор медиа-файла (ULID).
 * @param variant Название варианта превью. По умолчанию: 'thumbnail'.
 * @returns URL для запроса превью медиа-файла.
 * @example
 * const previewUrl = getMediaPreviewUrl('01HQZXABC123456789DEFGHIJKLM');
 * // '/api/v1/media/01HQZXABC123456789DEFGHIJKLM/preview?variant=thumbnail'
 *
 * const mediumUrl = getMediaPreviewUrl('01HQZXABC123456789DEFGHIJKLM', 'medium');
 * // '/api/v1/media/01HQZXABC123456789DEFGHIJKLM/preview?variant=medium'
 */
export const getMediaPreviewUrl = (id: ZId, variant: string = 'thumbnail'): string => {
  return `/api/v1/media/${id}/preview?variant=${variant}`;
};

/**
 * Возвращает URL для скачивания оригинального медиа-файла.
 * @param id Идентификатор медиа-файла.
 * @returns URL для скачивания медиа-файла.
 * @example
 * const downloadUrl = getMediaDownloadUrl('01HQZXABC123456789DEFGHIJKLM');
 * // '/api/v1/admin/media/01HQZXABC123456789DEFGHIJKLM/download'
 */
export const getMediaDownloadUrl = (id: ZId): string => {
  return getAdminMediaUrl(`/${id}/download`);
};

/**
 * Скачивает медиа-файл через API с аутентификацией.
 * Использует blob для скачивания файла с правильными заголовками и cookie.
 * @param id Идентификатор медиа-файла.
 * @param filename Опциональное имя файла. Если не указано, будет использовано имя из заголовка Content-Disposition или ID.
 * @throws {Error} Если произошла ошибка при скачивании файла.
 * @example
 * await downloadMedia('01HQZXABC123456789DEFGHIJKLM', 'photo.jpg');
 * // Файл будет скачан с именем 'photo.jpg'
 */
export const downloadMedia = async (id: ZId, filename?: string): Promise<void> => {
  const response = await rest.get<Blob>(getAdminMediaUrl(`/${id}/download`), {
    responseType: 'blob',
  });

  // Пытаемся получить имя файла из заголовка Content-Disposition
  const contentDisposition = response.headers['content-disposition'];
  let downloadFilename = filename;

  if (!downloadFilename && contentDisposition) {
    const filenameMatch = contentDisposition.match(/filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/);
    if (filenameMatch && filenameMatch[1]) {
      downloadFilename = filenameMatch[1].replace(/['"]/g, '');
      // Декодируем URL-encoded имя файла, если оно закодировано
      if (downloadFilename) {
        try {
          downloadFilename = decodeURIComponent(downloadFilename);
        } catch {
          // Если декодирование не удалось, используем как есть
        }
      }
    }
  }

  // Если имя файла всё ещё не определено, используем ID
  if (!downloadFilename) {
    downloadFilename = id;
  }

  // Создаём blob URL и инициируем скачивание
  const blob = new Blob([response.data]);
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = downloadFilename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  window.URL.revokeObjectURL(url);
};

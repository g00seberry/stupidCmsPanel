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
 * Удаляет медиа-файл (мягкое удаление).
 * Файл помечается как удалённый, но не удаляется физически.
 * @param id Идентификатор медиа-файла для удаления.
 * @throws {Error} Если медиа-файл не найден или произошла ошибка при удалении.
 * @example
 * await deleteMedia('01HQZXABC123456789DEFGHIJKLM');
 * console.log('Медиа-файл успешно удалён');
 */
export const deleteMedia = async (id: ZId): Promise<void> => {
  await rest.delete(getAdminMediaUrl(`/${id}`));
};

/**
 * Восстанавливает ранее удалённый медиа-файл.
 * @param id Идентификатор медиа-файла для восстановления.
 * @returns Восстановленный медиа-файл.
 * @throws {Error} Если медиа-файл не найден или произошла ошибка при восстановлении.
 * @example
 * const restoredMedia = await restoreMedia('01HQZXABC123456789DEFGHIJKLM');
 * console.log(restoredMedia.deleted_at); // null
 */
export const restoreMedia = async (id: ZId): Promise<ZMedia> => {
  const response = await rest.post(getAdminMediaUrl(`/${id}/restore`));
  const parsed = zMediaResponse.parse(response.data);
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

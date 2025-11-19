import { rest } from '@/api/rest';
import {
  zMediaResponse,
  zMediaListResponse,
  zMediaConfigResponse,
  zMediaUploadPayload,
  zMediaUpdatePayload,
  zMediaBulkPayload,
  zMediaArrayResponse,
} from '@/types/media';
import type {
  ZMedia,
  ZMediaListParams,
  ZMediaUploadPayload,
  ZMediaUpdatePayload,
  ZMediaConfig,
  ZMediaBulkPayload,
  ZMediaImage,
} from '@/types/media';
import type { ZPaginationMeta, ZPaginationLinks } from '@/types/pagination';
import { normalizeMediaUrl } from '@/utils/mediaUtils';

const getAdminMediaUrl = (path: string): string => `/api/v1/admin/media${path}`;

/**
 * Нормализует URL медиа-файла, преобразуя абсолютные URL в относительные пути через прокси.
 * @param media Медиа-файл для нормализации.
 * @returns Медиа-файл с нормализованными URL.
 */
const normalizeMedia = (media: ZMedia): ZMedia => {
  // Нормализуем основной URL
  const normalizedUrl = normalizeMediaUrl(media.url);

  // Для изображений нормализуем также preview_urls
  if (media.kind === 'image') {
    const imageMedia = media as ZMediaImage;
    return {
      ...imageMedia,
      url: normalizedUrl,
      preview_urls: {
        thumbnail: normalizeMediaUrl(imageMedia.preview_urls.thumbnail),
        medium: normalizeMediaUrl(imageMedia.preview_urls.medium),
        large: normalizeMediaUrl(imageMedia.preview_urls.large),
      },
    } as ZMedia;
  }

  // Для остальных типов медиа нормализуем только основной URL
  return {
    ...media,
    url: normalizedUrl,
  };
};

/**
 * Преобразует параметры запроса в query-параметры для URL.
 * @param params Параметры запроса списка медиа-файлов.
 * @returns Объект с query-параметрами для Axios.
 */
const buildQueryParams = (
  params: ZMediaListParams
): Record<string, string | number | undefined> => {
  const queryParams: Record<string, string | number | undefined> = {};

  if (params.q) {
    queryParams.q = params.q;
  }

  if (params.kind) {
    queryParams.kind = params.kind;
  }

  if (params.mime) {
    queryParams.mime = params.mime;
  }

  if (params.collection) {
    queryParams.collection = params.collection;
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
 * Загружает конфигурацию системы медиа-файлов.
 * @returns Конфигурация с разрешенными типами файлов, максимальным размером и вариантами изображений.
 * @example
 * const config = await getMediaConfig();
 * console.log(config.allowed_mime_types); // ['image/jpeg', 'image/png', 'video/mp4']
 * console.log(config.max_file_size_bytes); // 10485760
 */
export const getMediaConfig = async (): Promise<ZMediaConfig> => {
  const response = await rest.get(getAdminMediaUrl('/config'));
  const result = zMediaConfigResponse.parse(response.data);
  return result;
};

/**
 * Загружает список медиа-файлов с фильтрами и пагинацией.
 * @param params Параметры фильтрации и пагинации.
 * @returns Объект с массивом медиа-файлов, метаданными пагинации и ссылками.
 * @example
 * const result = await listMedia({
 *   kind: 'image',
 *   collection: 'uploads',
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
  const result = zMediaListResponse.parse(response.data);

  return {
    data: result.data.map(normalizeMedia),
    links: result.links,
    meta: result.meta,
  };
};

/**
 * Загружает сведения о конкретном медиа-файле по ID.
 * @param id ULID идентификатор медиа-файла.
 * @returns Медиа-файл, прошедший валидацию схемой `zMedia`.
 * @example
 * const media = await getMedia('01HXZYXQJ123456789ABCDEF');
 * console.log(media.title); // 'Hero image'
 * if (media.kind === 'image') {
 *   console.log(media.width, media.height); // 1920, 1080
 * }
 */
export const getMedia = async (id: string): Promise<ZMedia> => {
  const response = await rest.get(getAdminMediaUrl(`/${id}`));
  const parsed = zMediaResponse.parse(response.data);
  return normalizeMedia(parsed.data);
};

/**
 * Загружает новый медиа-файл на сервер.
 * @param file Файл для загрузки.
 * @param payload Дополнительные метаданные (title, alt, collection).
 * @returns Созданный медиа-файл.
 * @throws {Error} Если файл не соответствует ограничениям (размер, тип), нет авторизации (401), ошибка валидации (422) или превышен лимит запросов (429).
 * @example
 * const file = new File(['content'], 'image.jpg', { type: 'image/jpeg' });
 * const media = await uploadMedia(file, {
 *   title: 'Hero image',
 *   alt: 'Hero cover',
 *   collection: 'uploads'
 * });
 * console.log(media.id); // '01HXZYXQJ123456789ABCDEF'
 */
export const uploadMedia = async (
  file: File,
  payload: ZMediaUploadPayload = {}
): Promise<ZMedia> => {
  const parsedPayload = zMediaUploadPayload.parse(payload);
  const formData = new FormData();
  formData.append('file', file);

  if (parsedPayload.title) {
    formData.append('title', parsedPayload.title);
  }

  if (parsedPayload.alt) {
    formData.append('alt', parsedPayload.alt);
  }

  if (parsedPayload.collection) {
    formData.append('collection', parsedPayload.collection);
  }

  const response = await rest.post(getAdminMediaUrl(''), formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  const parsed = zMediaResponse.parse(response.data);
  return normalizeMedia(parsed.data);
};

/**
 * Обновляет метаданные существующего медиа-файла.
 * @param id ULID идентификатор медиа-файла для обновления.
 * @param payload Новые значения полей метаданных.
 * @returns Обновлённый медиа-файл.
 * @throws {Error} Если медиа-файл не найден (404), нет авторизации (401), ошибка валидации (422) или превышен лимит запросов (429).
 * @example
 * const updatedMedia = await updateMedia('01HXZYXQJ123456789ABCDEF', {
 *   title: 'Updated title',
 *   alt: 'Updated alt text',
 *   collection: 'new-collection'
 * });
 */
export const updateMedia = async (id: string, payload: ZMediaUpdatePayload): Promise<ZMedia> => {
  const parsedPayload = zMediaUpdatePayload.parse(payload);
  const response = await rest.put(getAdminMediaUrl(`/${id}`), parsedPayload);
  const parsed = zMediaResponse.parse(response.data);
  return normalizeMedia(parsed.data);
};

/**
 * Выполняет мягкое удаление медиа-файла.
 * Использует bulk API для удаления одного файла.
 * @param id ULID идентификатор медиа-файла для удаления.
 * @throws {Error} Если медиа-файл не найден (404), нет авторизации (401) или превышен лимит запросов (429).
 * @example
 * await deleteMedia('01HXZYXQJ123456789ABCDEF');
 */
export const deleteMedia = async (id: string): Promise<void> => {
  await bulkDeleteMedia([id]);
};

/**
 * Восстанавливает мягко удаленный медиа-файл.
 * Использует bulk API для восстановления одного файла.
 * @param id ULID идентификатор медиа-файла для восстановления.
 * @returns Восстановленный медиа-файл.
 * @throws {Error} Если медиа-файл не найден (404), нет авторизации (401) или превышен лимит запросов (429).
 * @example
 * const restoredMedia = await restoreMedia('01HXZYXQJ123456789ABCDEF');
 */
export const restoreMedia = async (id: string): Promise<ZMedia> => {
  const restored = await bulkRestoreMedia([id]);
  if (restored.length === 0) {
    throw new Error('Медиа-файл не найден');
  }
  return restored[0];
};

/**
 * Выполняет массовое мягкое удаление медиа-файлов.
 * @param ids Массив ULID идентификаторов медиа-файлов для удаления.
 * @throws {Error} Если нет авторизации (401), ошибка валидации (422) или превышен лимит запросов (429).
 * @example
 * await bulkDeleteMedia([
 *   '01HXZYXQJ123456789ABCDEF',
 *   '01HXZYXQJ987654321FEDCBA'
 * ]);
 */
export const bulkDeleteMedia = async (ids: string[]): Promise<void> => {
  const payload: ZMediaBulkPayload = { ids };
  const parsedPayload = zMediaBulkPayload.parse(payload);
  await rest.delete(getAdminMediaUrl('/bulk'), { data: parsedPayload });
};

/**
 * Выполняет массовое восстановление мягко удаленных медиа-файлов.
 * @param ids Массив ULID идентификаторов медиа-файлов для восстановления.
 * @returns Массив восстановленных медиа-файлов.
 * @throws {Error} Если нет авторизации (401), ошибка валидации (422) или превышен лимит запросов (429).
 * @example
 * const restoredMedia = await bulkRestoreMedia([
 *   '01HXZYXQJ123456789ABCDEF',
 *   '01HXZYXQJ987654321FEDCBA'
 * ]);
 */
export const bulkRestoreMedia = async (ids: string[]): Promise<ZMedia[]> => {
  const payload: ZMediaBulkPayload = { ids };
  const parsedPayload = zMediaBulkPayload.parse(payload);
  const response = await rest.post(getAdminMediaUrl('/bulk/restore'), parsedPayload);
  const parsed = zMediaArrayResponse.parse(response.data);
  return parsed.data.map(normalizeMedia);
};

/**
 * Выполняет окончательное удаление медиа-файлов (удаляет физические файлы и записи из БД).
 * Требует специальных прав доступа.
 * @param ids Массив ULID идентификаторов медиа-файлов для окончательного удаления.
 * @throws {Error} Если нет авторизации (401), нет прав доступа (403), ошибка валидации (422) или превышен лимит запросов (429).
 * @example
 * await bulkForceDeleteMedia([
 *   '01HXZYXQJ123456789ABCDEF',
 *   '01HXZYXQJ987654321FEDCBA'
 * ]);
 */
export const bulkForceDeleteMedia = async (ids: string[]): Promise<void> => {
  const payload: ZMediaBulkPayload = { ids };
  const parsedPayload = zMediaBulkPayload.parse(payload);
  await rest.delete(getAdminMediaUrl('/bulk/force'), { data: parsedPayload });
};

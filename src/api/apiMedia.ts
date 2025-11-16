import { rest } from '@/api/rest';
import { zMediaCollection, zMediaResponse, zMediaUpdatePayload } from '@/types/media';
import type { ZMedia, ZMediaFilters, ZMediaUpdatePayload } from '@/types/media';
import type { ZPaginationLinks, ZPaginationMeta } from '@/types/pagination';

const getAdminMediaUrl = (path: string): string => `/api/v1/admin/media${path}`;

/**
 * Преобразует параметры запроса в query-параметры для URL.
 * @param params Параметры запроса списка медиафайлов.
 * @returns Объект с query-параметрами для Axios.
 */
const buildQueryParams = (params: ZMediaFilters): Record<string, string | number> => {
  const queryParams: Record<string, string | number> = {};

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
 * Загружает список медиафайлов с фильтрами и пагинацией.
 * @param filters Параметры фильтрации и пагинации.
 * @returns Объект с массивом медиафайлов, метаданными пагинации и ссылками.
 * @example
 * const result = await listMedia({
 *   kind: 'image',
 *   collection: 'uploads',
 *   per_page: 20,
 *   page: 1
 * });
 * console.log(result.data); // Массив медиафайлов
 * console.log(result.meta.total); // Общее количество
 */
export const listMedia = async (
  filters: ZMediaFilters = {}
): Promise<{
  data: ZMedia[];
  links: ZPaginationLinks;
  meta: ZPaginationMeta;
}> => {
  const queryParams = buildQueryParams(filters);
  const response = await rest.get(getAdminMediaUrl(''), { params: queryParams });
  const parsed = zMediaCollection.parse(response.data);
  return {
    data: parsed.data,
    links: parsed.links,
    meta: parsed.meta,
  };
};

/**
 * Загружает сведения о конкретном медиафайле по ID.
 * @param id Уникальный идентификатор медиафайла.
 * @returns Медиафайл, прошедший валидацию схемой `zMedia`.
 * @example
 * const media = await getMedia('01HQZ8X9VJQ4KJ5N7R8Y9T0W1X');
 * console.log(media.name); // 'hero.jpg'
 */
export const getMedia = async (id: string): Promise<ZMedia> => {
  const response = await rest.get(getAdminMediaUrl(`/${id}`));
  const parsed = zMediaResponse.parse(response.data);
  return parsed.data;
};

/**
 * Загружает новый медиафайл на сервер.
 * @param file Файл для загрузки.
 * @param metadata Опциональные метаданные: title, alt, collection.
 * @returns Созданный медиафайл.
 * @example
 * const fileInput = document.querySelector('input[type="file"]');
 * const file = fileInput.files[0];
 * const newMedia = await uploadMedia(file, {
 *   title: 'Hero image',
 *   alt: 'Hero cover',
 *   collection: 'uploads'
 * });
 * console.log(newMedia.id); // ID созданного медиафайла
 */
export const uploadMedia = async (
  file: File,
  metadata?: {
    /** Пользовательский заголовок. Максимум 255 символов. */
    title?: string;
    /** Альтернативный текст для изображений. Максимум 255 символов. */
    alt?: string;
    /** Коллекция, к которой принадлежит медиафайл. Максимум 64 символа, regex: ^[a-z0-9-_.]+$ (case-insensitive). */
    collection?: string;
  }
): Promise<ZMedia> => {
  const formData = new FormData();
  formData.append('file', file);

  if (metadata?.title !== undefined) {
    formData.append('title', metadata.title);
  }

  if (metadata?.alt !== undefined) {
    formData.append('alt', metadata.alt);
  }

  if (metadata?.collection !== undefined) {
    formData.append('collection', metadata.collection);
  }

  const response = await rest.post(getAdminMediaUrl(''), formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });

  const parsed = zMediaResponse.parse(response.data);
  return parsed.data;
};

/**
 * Обновляет метаданные существующего медиафайла.
 * @param id Идентификатор медиафайла для обновления.
 * @param payload Новые значения метаданных: title, alt, collection.
 * @returns Обновлённый медиафайл.
 * @example
 * const updatedMedia = await updateMedia('01HQZ8X9VJQ4KJ5N7R8Y9T0W1X', {
 *   title: 'Updated hero image',
 *   alt: 'Updated hero cover'
 * });
 */
export const updateMedia = async (id: string, payload: ZMediaUpdatePayload): Promise<ZMedia> => {
  const parsedPayload = zMediaUpdatePayload.parse(payload);
  const response = await rest.put(getAdminMediaUrl(`/${id}`), parsedPayload);
  const parsed = zMediaResponse.parse(response.data);
  return parsed.data;
};

/**
 * Удаляет медиафайл (soft delete).
 * @param id Идентификатор медиафайла для удаления.
 * @throws {Error} Если медиафайл не найден (404), используется в записях (409), превышен лимит запросов (429).
 * @example
 * await deleteMedia('01HQZ8X9VJQ4KJ5N7R8Y9T0W1X');
 * // Если медиа используется в записях, будет ошибка 409 с информацией о связанных записях
 */
export const deleteMedia = async (id: string): Promise<void> => {
  await rest.delete(getAdminMediaUrl(`/${id}`));
};

/**
 * Восстанавливает удалённый медиафайл из корзины.
 * @param id Идентификатор медиафайла для восстановления.
 * @returns Восстановленный медиафайл.
 * @throws {Error} Если медиафайл не найден (404) или не был удалён, превышен лимит запросов (429).
 * @example
 * const restoredMedia = await restoreMedia('01HQZ8X9VJQ4KJ5N7R8Y9T0W1X');
 * console.log(restoredMedia.deleted_at); // null
 */
export const restoreMedia = async (id: string): Promise<ZMedia> => {
  const response = await rest.post(getAdminMediaUrl(`/${id}/restore`));
  const parsed = zMediaResponse.parse(response.data);
  return parsed.data;
};

/**
 * Возвращает относительный URL endpoint для получения превью медиафайла.
 * URL будет использоваться через прокси Vite для отправки credentials.
 * При обращении к endpoint возвращается 302 редирект на подписанный URL хранилища.
 * @param id Идентификатор медиафайла.
 * @param variant Вариант превью: 'thumbnail' (max 320px) или 'medium' (max 1024px). По умолчанию: 'thumbnail'.
 * @returns Относительный URL endpoint для получения превью (через прокси Vite).
 * @example
 * const previewUrl = getMediaPreviewUrl('01HQZ8X9VJQ4KJ5N7R8Y9T0W1X', 'thumbnail');
 * // '/api/v1/admin/media/01HQZ8X9VJQ4KJ5N7R8Y9T0W1X/preview?variant=thumbnail'
 */
export const getMediaPreviewUrl = (id: string, variant: string = 'thumbnail'): string => {
  return getAdminMediaUrl(`/${id}/preview?variant=${variant}`);
};

/**
 * Возвращает относительный URL endpoint для скачивания медиафайла.
 * URL будет использоваться через прокси Vite для отправки credentials.
 * При обращении к endpoint возвращается 302 редирект на подписанный URL хранилища.
 * @param id Идентификатор медиафайла.
 * @returns Относительный URL endpoint для скачивания (через прокси Vite).
 * @example
 * const downloadUrl = getMediaDownloadUrl('01HQZ8X9VJQ4KJ5N7R8Y9T0W1X');
 * // '/api/v1/admin/media/01HQZ8X9VJQ4KJ5N7R8Y9T0W1X/download'
 */
export const getMediaDownloadUrl = (id: string): string => {
  return getAdminMediaUrl(`/${id}/download`);
};


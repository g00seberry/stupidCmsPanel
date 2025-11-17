import { z } from 'zod';
import { zId, type ZId } from './ZId';
import { zPaginationLinks, zPaginationMeta } from './pagination';

/**
 * Схема валидации типа медиа-файла.
 * Определяет категорию файла для обработки и отображения.
 */
export const zMediaKind = z.enum(['image', 'video', 'audio', 'document', 'other']);

/**
 * Тип медиа-файла.
 */
export type ZMediaKind = z.infer<typeof zMediaKind>;

/**
 * Схема валидации статуса варианта медиа-файла.
 * Отражает состояние обработки варианта (thumbnail, resize и т.д.).
 */
export const zMediaVariantStatus = z.enum(['pending', 'processing', 'completed', 'failed']);

/**
 * Тип статуса варианта медиа-файла.
 */
export type ZMediaVariantStatus = z.infer<typeof zMediaVariantStatus>;

/**
 * Схема валидации варианта медиа-файла.
 * Вариант представляет производную версию оригинального файла (превью, миниатюра, ресайз).
 * @example
 * const variant: ZMediaVariant = {
 *   id: '01HQZXYZ123456789ABCDEFGHJK',
 *   media_id: '01HQZXABC123456789DEFGHIJKLM',
 *   variant_name: 'thumbnail',
 *   disk: 'public',
 *   path: 'media/thumbnails/image-thumb.jpg',
 *   size_bytes: 15360,
 *   width: 200,
 *   height: 150,
 *   status: 'completed',
 *   started_at: '2025-11-17T10:00:00+00:00',
 *   finished_at: '2025-11-17T10:00:05+00:00'
 * };
 */
export const zMediaVariant = z.object({
  /** Уникальный идентификатор варианта (ULID). */
  id: zId,
  /** ID родительского медиа-файла (ULID). */
  media_id: zId,
  /** Название варианта (например, 'thumbnail', 'medium', 'large'). */
  variant_name: z.string(),
  /** Имя диска хранения файла. */
  disk: z.string(),
  /** Путь к файлу на диске. */
  path: z.string(),
  /** Размер файла в байтах. */
  size_bytes: z.number().int(),
  /** Ширина изображения/видео в пикселях. Может быть `null` для не-визуальных файлов. */
  width: z.number().int().nullable(),
  /** Высота изображения/видео в пикселях. Может быть `null` для не-визуальных файлов. */
  height: z.number().int().nullable(),
  /** Статус обработки варианта. */
  status: zMediaVariantStatus,
  /** Дата начала обработки варианта в формате ISO 8601. Может быть `null`. */
  started_at: z.string().nullable(),
  /** Дата завершения обработки варианта в формате ISO 8601. Может быть `null`. */
  finished_at: z.string().nullable(),
});

/**
 * Тип варианта медиа-файла.
 */
export type ZMediaVariant = z.infer<typeof zMediaVariant>;

/**
 * Схема валидации нормализованных аудио/видео метаданных медиа-файла.
 * Хранит технические характеристики медиа-контента.
 * @example
 * const metadata: ZMediaMetadata = {
 *   media_id: '01HQZXABC123456789DEFGHIJKLM',
 *   duration_ms: 125000,
 *   bitrate_kbps: 2500,
 *   frame_rate: 30.0,
 *   frame_count: 3750,
 *   video_codec: 'h264',
 *   audio_codec: 'aac'
 * };
 */
export const zMediaMetadata = z.object({
  /** ID родительского медиа-файла (ULID). */
  media_id: zId,
  /** Длительность медиа-контента в миллисекундах. Может быть `null`. */
  duration_ms: z.number().int().nullable(),
  /** Битрейт в килобитах в секунду. Может быть `null`. */
  bitrate_kbps: z.number().int().nullable(),
  /** Частота кадров (FPS). Может быть `null`. */
  frame_rate: z.number().nullable(),
  /** Количество кадров. Может быть `null`. */
  frame_count: z.number().int().nullable(),
  /** Видео кодек (например, 'h264', 'vp9'). Может быть `null`. */
  video_codec: z.string().nullable().optional(),
  /** Аудио кодек (например, 'aac', 'mp3'). Может быть `null`. */
  audio_codec: z.string().nullable().optional(),
});

/**
 * Тип нормализованных аудио/видео метаданных медиа-файла.
 */
export type ZMediaMetadata = z.infer<typeof zMediaMetadata>;

/**
 * Схема валидации медиа-файла.
 * Представляет загруженный файл любого типа: изображение, видео, аудио, документ.
 * @example
 * const media: ZMedia = {
 *   id: '01HQZXABC123456789DEFGHIJKLM',
 *   kind: 'image',
 *   name: 'photo.jpg',
 *   ext: 'jpg',
 *   mime: 'image/jpeg',
 *   size_bytes: 2048576,
 *   width: 1920,
 *   height: 1080,
 *   duration_ms: null,
 *   title: 'Закат на пляже',
 *   alt: 'Красивый закат на морском побережье',
 *   collection: 'blog-images',
 *   created_at: '2025-11-17T10:00:00+00:00',
 *   updated_at: '2025-11-17T10:05:00+00:00',
 *   deleted_at: null,
 *   preview_urls: {
 *     thumbnail: 'http://localhost/media/thumb.jpg',
 *     medium: 'http://localhost/media/medium.jpg'
 *   },
 *   download_url: 'http://localhost/media/download'
 * };
 */
export const zMedia = z.object({
  /** Уникальный идентификатор медиа-файла (ULID). */
  id: zId,
  /** Тип медиа-файла для категоризации. */
  kind: zMediaKind,
  /** Исходное имя файла. */
  name: z.string(),
  /** Расширение файла (без точки). */
  ext: z.string(),
  /** MIME-тип файла (например, 'image/jpeg', 'video/mp4'). */
  mime: z.string(),
  /** Размер файла в байтах. */
  size_bytes: z.number().int(),
  /** Ширина изображения/видео в пикселях. Может быть `null` для не-визуальных файлов. */
  width: z.number().int().nullable(),
  /** Высота изображения/видео в пикселях. Может быть `null` для не-визуальных файлов. */
  height: z.number().int().nullable(),
  /** Длительность аудио/видео в миллисекундах. Может быть `null` для других типов. */
  duration_ms: z.number().int().nullable(),
  /** Название медиа-файла для отображения. Может быть `null`. */
  title: z.string().nullable(),
  /** Альтернативный текст для изображений (для доступности). Может быть `null`. */
  alt: z.string().nullable(),
  /** Название коллекции для группировки файлов. Может быть `null`. */
  collection: z.string().nullable(),
  /** Дата создания записи в формате ISO 8601. */
  created_at: z.string(),
  /** Дата последнего обновления в формате ISO 8601. */
  updated_at: z.string(),
  /** Дата мягкого удаления в формате ISO 8601. Может быть `null`. */
  deleted_at: z.string().nullable(),
  /** URL для превью изображений в различных размерах. */
  preview_urls: z
    .object({
      thumbnail: z.string().optional(),
      medium: z.string().optional(),
    })
    .optional(),
  /** URL для скачивания оригинального файла. */
  download_url: z.string().optional(),
  /** Массив вариантов медиа-файла (опционально, загружается при необходимости). */
  variants: z.array(zMediaVariant).optional(),
  /** Нормализованные аудио/видео метаданные (опционально, загружается при необходимости). */
  metadata: zMediaMetadata.nullable().optional(),
});

/**
 * Тип медиа-файла.
 */
export type ZMedia = z.infer<typeof zMedia>;

/**
 * Схема валидации ответа API со списком медиа-файлов.
 * @example
 * const response: ZMediaListResponse = {
 *   data: [media1, media2],
 *   links: { first: '...', last: '...', prev: null, next: '...' },
 *   meta: { current_page: 1, from: 1, last_page: 5, per_page: 15, to: 15, total: 72 }
 * };
 */
export const zMediaListResponse = z.object({
  /** Массив медиа-файлов. */
  data: z.array(zMedia),
  /** Ссылки пагинации. */
  links: zPaginationLinks,
  /** Метаданные пагинации. */
  meta: zPaginationMeta,
});

/**
 * Тип ответа API со списком медиа-файлов.
 */
export type ZMediaListResponse = z.infer<typeof zMediaListResponse>;

/**
 * Схема валидации ответа API с одним медиа-файлом.
 * @example
 * const response: ZMediaResponse = {
 *   data: {
 *     id: '01HQZXABC123456789DEFGHIJKLM',
 *     filename: 'photo.jpg',
 *     // ... остальные поля
 *   }
 * };
 */
export const zMediaResponse = z.object({
  /** Данные медиа-файла. */
  data: zMedia,
});

/**
 * Тип ответа API с одним медиа-файлом.
 */
export type ZMediaResponse = z.infer<typeof zMediaResponse>;

/**
 * Схема валидации данных для обновления метаданных медиа-файла.
 * Используется для PUT запроса обновления существующего медиа-файла.
 * @example
 * const payload: ZMediaPayload = {
 *   title: 'Обновлённое название',
 *   alt: 'Обновлённый alt текст',
 *   collection: 'blog-images'
 * };
 */
export const zMediaPayload = z.object({
  /** Название медиа-файла для отображения. */
  title: z.string().optional(),
  /** Альтернативный текст для изображений. */
  alt: z.string().optional(),
  /** Название коллекции для группировки файлов. */
  collection: z.string().optional(),
});

/**
 * Тип данных для обновления метаданных медиа-файла.
 */
export type ZMediaPayload = z.infer<typeof zMediaPayload>;

/**
 * Параметры запроса списка медиа-файлов.
 * Используется для фильтрации, сортировки и пагинации списка медиа.
 * @example
 * const params: ZMediaListParams = {
 *   kind: 'image',
 *   collection: 'blog-images',
 *   q: 'sunset',
 *   deleted: 'with',
 *   sort: 'created_at',
 *   order: 'desc',
 *   per_page: 20,
 *   page: 1
 * };
 */
export type ZMediaListParams = {
  /** Фильтр по типу медиа-файла. */
  kind?: ZMediaKind;
  /** Фильтр по MIME-типу (prefix match, например 'image/png'). */
  mime?: string;
  /** Фильтр по названию коллекции. */
  collection?: string;
  /** Поиск по названию файла или метаданным. */
  q?: string;
  /** Фильтр удалённых файлов: undefined - только активные, 'with' - все включая удалённые, 'only' - только удалённые. */
  deleted?: 'with' | 'only';
  /** Поле сортировки. По умолчанию: 'created_at'. */
  sort?: 'created_at' | 'size_bytes' | 'mime';
  /** Направление сортировки. По умолчанию: 'desc'. */
  order?: 'asc' | 'desc';
  /** Количество элементов на странице (1-100). По умолчанию: 15. */
  per_page?: number;
  /** Номер страницы (>=1). По умолчанию: 1. */
  page?: number;
};

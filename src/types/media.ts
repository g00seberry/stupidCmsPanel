import { zPaginationLinks, zPaginationMeta } from '@/types/pagination';
import { z } from 'zod';

/**
 * Константы типов медиа-файлов.
 */
export const MediaKind = {
  Image: 'image',
  Video: 'video',
  Audio: 'audio',
  Document: 'document',
} as const;

/**
 * Тип для значения MediaKind.
 */
export type MediaKindValue = (typeof MediaKind)[keyof typeof MediaKind];

/**
 * Массив значений типов медиа для Zod enum.
 */
const mediaKindValues = [
  MediaKind.Image,
  MediaKind.Video,
  MediaKind.Audio,
  MediaKind.Document,
] as const;

/**
 * Схема валидации URL-идентификатора медиа-файла (ULID).
 */
const zMediaId = z.string().min(1);

/**
 * Схема валидации вариантов превью изображения.
 * Содержит URL для разных размеров изображения.
 */
const zMediaPreviewUrls = z.object({
  /** URL миниатюры изображения. */
  thumbnail: z.string(),
  /** URL среднего размера изображения. */
  medium: z.string(),
  /** URL большого размера изображения. */
  large: z.string(),
});

/**
 * Базовая схема валидации медиа-файла.
 * Содержит общие поля для всех типов медиа.
 */
const zMediaBase = z.object({
  /** ULID идентификатор медиа-файла. */
  id: zMediaId,
  /** Тип медиа-файла: image, video, audio, document. */
  kind: z.enum(mediaKindValues),
  /** Исходное имя файла. */
  name: z.string(),
  /** Расширение файла без точки. */
  ext: z.string(),
  /** MIME-тип файла. */
  mime: z.string(),
  /** Размер файла в байтах. */
  size_bytes: z.number().int().nonnegative(),
  /** Название медиа-файла. Может быть `null`. */
  title: z.string().nullable(),
  /** Альтернативный текст для изображений. Может быть `null`. */
  alt: z.string().nullable(),
  /** URL для доступа к медиа-файлу. */
  url: z.string(),
  /** Дата создания в формате ISO 8601. */
  created_at: z.string(),
  /** Дата последнего обновления в формате ISO 8601. */
  updated_at: z.string(),
  /** Дата мягкого удаления в формате ISO 8601. Может быть `null`. */
  deleted_at: z.string().nullable(),
});

/**
 * Схема валидации медиа-файла типа "изображение".
 * @example
 * const imageMedia: ZMediaImage = {
 *   id: '01HXZYXQJ123456789ABCDEF',
 *   kind: 'image',
 *   name: 'hero.jpg',
 *   ext: 'jpg',
 *   mime: 'image/jpeg',
 *   size_bytes: 235678,
 *   width: 1920,
 *   height: 1080,
 *   title: 'Hero image',
 *   alt: 'Hero cover',
 *   url: 'https://api.stupidcms.dev/api/v1/media/01HXZYXQJ123456789ABCDEF',
 *   preview_urls: {
 *     thumbnail: 'https://api.stupidcms.dev/api/v1/media/01HXZYXQJ123456789ABCDEF?variant=thumbnail',
 *     medium: 'https://api.stupidcms.dev/api/v1/media/01HXZYXQJ123456789ABCDEF?variant=medium',
 *     large: 'https://api.stupidcms.dev/api/v1/media/01HXZYXQJ123456789ABCDEF?variant=large'
 *   },
 *   created_at: '2025-01-10T12:00:00+00:00',
 *   updated_at: '2025-01-10T12:00:00+00:00',
 *   deleted_at: null
 * };
 */
export const zMediaImage = zMediaBase.extend({
  kind: z.literal('image'),
  /** Ширина изображения в пикселях. */
  width: z.number().int().positive(),
  /** Высота изображения в пикселях. */
  height: z.number().int().positive(),
  /** URL вариантов превью изображения разных размеров. */
  preview_urls: zMediaPreviewUrls,
});

/**
 * Тип медиа-файла "изображение".
 */
export type ZMediaImage = z.infer<typeof zMediaImage>;

/**
 * Схема валидации медиа-файла типа "видео".
 * @example
 * const videoMedia: ZMediaVideo = {
 *   id: '01HXZYXQJ987654321FEDCBA',
 *   kind: 'video',
 *   name: 'video.mp4',
 *   ext: 'mp4',
 *   mime: 'video/mp4',
 *   size_bytes: 5242880,
 *   duration_ms: 120000,
 *   bitrate_kbps: 3500,
 *   frame_rate: 30,
 *   frame_count: 3600,
 *   video_codec: 'h264',
 *   audio_codec: 'aac',
 *   title: 'Video title',
 *   alt: null,
 *   url: 'https://api.stupidcms.dev/api/v1/media/01HXZYXQJ987654321FEDCBA',
 *   created_at: '2025-01-10T12:01:00+00:00',
 *   updated_at: '2025-01-10T12:01:00+00:00',
 *   deleted_at: null
 * };
 */
export const zMediaVideo = zMediaBase.extend({
  kind: z.literal('video'),
  /** Длительность видео в миллисекундах. */
  duration_ms: z.number().int().nonnegative(),
  /** Битрейт видео в килобитах в секунду. */
  bitrate_kbps: z.number().int().nonnegative(),
  /** Частота кадров в кадрах в секунду. */
  frame_rate: z.number().nonnegative(),
  /** Общее количество кадров. */
  frame_count: z.number().int().nonnegative(),
  /** Видеокодек. */
  video_codec: z.string(),
  /** Аудиокодек. */
  audio_codec: z.string(),
});

/**
 * Тип медиа-файла "видео".
 */
export type ZMediaVideo = z.infer<typeof zMediaVideo>;

/**
 * Схема валидации медиа-файла типа "аудио".
 * @example
 * const audioMedia: ZMediaAudio = {
 *   id: '01HXZYXQJABCDEF1234567890',
 *   kind: 'audio',
 *   name: 'audio.mp3',
 *   ext: 'mp3',
 *   mime: 'audio/mpeg',
 *   size_bytes: 3145728,
 *   duration_ms: 180000,
 *   bitrate_kbps: 256,
 *   audio_codec: 'mp3',
 *   title: 'Audio title',
 *   alt: null,
 *   url: 'https://api.stupidcms.dev/api/v1/media/01HXZYXQJABCDEF1234567890',
 *   created_at: '2025-01-10T12:02:00+00:00',
 *   updated_at: '2025-01-10T12:02:00+00:00',
 *   deleted_at: null
 * };
 */
export const zMediaAudio = zMediaBase.extend({
  kind: z.literal('audio'),
  /** Длительность аудио в миллисекундах. */
  duration_ms: z.number().int().nonnegative().nullish(),
  /** Битрейт аудио в килобитах в секунду. */
  bitrate_kbps: z.number().int().nonnegative().nullish(),
  /** Аудиокодек. */
  audio_codec: z.string().nullish(),
});

/**
 * Тип медиа-файла "аудио".
 */
export type ZMediaAudio = z.infer<typeof zMediaAudio>;

/**
 * Схема валидации медиа-файла типа "документ".
 * @example
 * const documentMedia: ZMediaDocument = {
 *   id: '01HXZYXQJFEDCBA9876543210',
 *   kind: 'document',
 *   name: 'document.pdf',
 *   ext: 'pdf',
 *   mime: 'application/pdf',
 *   size_bytes: 102400,
 *   title: 'Document title',
 *   alt: null,
 *   url: 'https://api.stupidcms.dev/api/v1/media/01HXZYXQJFEDCBA9876543210',
 *   created_at: '2025-01-10T12:03:00+00:00',
 *   updated_at: '2025-01-10T12:03:00+00:00',
 *   deleted_at: null
 * };
 */
export const zMediaDocument = zMediaBase.extend({
  kind: z.literal('document'),
});

/**
 * Тип медиа-файла "документ".
 */
export type ZMediaDocument = z.infer<typeof zMediaDocument>;

/**
 * Схема валидации медиа-файла любого типа.
 * Использует discriminated union по полю `kind` для определения конкретного типа.
 * @example
 * const media: ZMedia = {
 *   id: '01HXZYXQJ123456789ABCDEF',
 *   kind: 'image',
 *   name: 'hero.jpg',
 *   // ... остальные поля в зависимости от kind
 * };
 */
export const zMedia = z.discriminatedUnion('kind', [
  zMediaImage,
  zMediaVideo,
  zMediaAudio,
  zMediaDocument,
]);

/**
 * Тип медиа-файла любого типа.
 */
export type ZMedia = z.infer<typeof zMedia>;

/**
 * Схема валидации ответа API со списком медиа-файлов.
 */
export const zMediaListResponse = z.object({
  /** Массив медиа-файлов. */
  data: zMedia.array(),
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
 * Схема валидации ответа API с одним медиа-файлом.
 */
export const zMediaArrayResponse = z.object({
  /** Данные медиа-файла. */
  data: zMedia.array(),
});

/**
 * Тип ответа API с массивом медиа-файлов.
 */
export type ZMediaArrayResponse = z.infer<typeof zMediaArrayResponse>;

/**
 * Параметры запроса списка медиа-файлов.
 */
export type ZMediaListParams = {
  /** Поиск по названию и исходному имени файла. */
  q?: string;
  /** Фильтр по типу медиа: image, video, audio, document. */
  kind?: 'image' | 'video' | 'audio' | 'document';
  /** Фильтр по MIME-типу (префиксный поиск). */
  mime?: string;
  /** Управление soft-deleted: with (включая удаленные), only (только удаленные). */
  deleted?: 'with' | 'only';
  /** Поле сортировки: created_at, size_bytes, mime. По умолчанию: created_at. */
  sort?: 'created_at' | 'size_bytes' | 'mime';
  /** Направление сортировки: asc, desc. По умолчанию: desc. */
  order?: 'asc' | 'desc';
  /** Размер страницы (1-100). По умолчанию: 15. */
  per_page?: number;
  /** Номер страницы (>=1). По умолчанию: 1. */
  page?: number;
};

/**
 * Схема валидации данных для загрузки медиа-файла.
 * @example
 * const uploadPayload: ZMediaUploadPayload = {
 *   title: 'Hero image',
 *   alt: 'Hero cover'
 * };
 */
export const zMediaUploadPayload = z.object({
  /** Название медиа-файла. Минимум 1 символ, максимум 255 символов. */
  title: z.string().min(1).max(255).optional(),
  /** Альтернативный текст для изображений. Минимум 1 символ, максимум 255 символов. */
  alt: z.string().min(1).max(255).optional(),
});

/**
 * Тип данных для загрузки медиа-файла.
 */
export type ZMediaUploadPayload = z.infer<typeof zMediaUploadPayload>;

/**
 * Схема валидации данных для обновления метаданных медиа-файла.
 * @example
 * const updatePayload: ZMediaUpdatePayload = {
 *   title: 'Updated title',
 *   alt: 'Updated alt text'
 * };
 */
export const zMediaUpdatePayload = z.object({
  /** Название медиа-файла. Минимум 1 символ, максимум 255 символов. */
  title: z.string().min(1).max(255).optional(),
  /** Альтернативный текст для изображений. Минимум 1 символ, максимум 255 символов. */
  alt: z.string().min(1).max(255).optional(),
});

/**
 * Тип данных для обновления метаданных медиа-файла.
 */
export type ZMediaUpdatePayload = z.infer<typeof zMediaUpdatePayload>;

/**
 * Схема валидации варианта изображения в конфигурации.
 * @example
 * const variant: ZMediaImageVariant = {
 *   max: 320,
 *   format: null,
 *   quality: null
 * };
 */
export const zMediaImageVariant = z.object({
  /** Максимальный размер варианта изображения в пикселях. */
  max: z.number().int().positive(),
  /** Формат изображения. Может быть `null` для сохранения исходного формата. */
  format: z.string().nullable(),
  /** Качество изображения (обычно 1-100). Может быть `null` для использования значения по умолчанию. */
  quality: z.number().int().min(1).max(100).nullable(),
});

/**
 * Тип варианта изображения в конфигурации.
 */
export type ZMediaImageVariant = z.infer<typeof zMediaImageVariant>;

/**
 * Схема валидации конфигурации системы медиа-файлов.
 * Содержит информацию о разрешенных типах файлов, максимальном размере и доступных вариантах изображений.
 * @example
 * const config: ZMediaConfig = {
 *   allowed_mimes: ['image/jpeg', 'image/png', 'video/mp4'],
 *   max_upload_mb: 10,
 *   image_variants: {
 *     thumbnail: { max: 320, format: null, quality: null },
 *     medium: { max: 1024, format: null, quality: null },
 *     large: { max: 2048, format: null, quality: null }
 *   }
 * };
 */
export const zMediaConfig = z.object({
  /** Массив разрешенных MIME-типов файлов. */
  allowed_mimes: z.array(z.string()),
  /** Максимальный размер файла в мегабайтах. */
  max_upload_mb: z.number().int().positive(),
  /** Объект доступных вариантов изображений, где ключ - название варианта (thumbnail, medium, large). */
  image_variants: z.record(z.string(), zMediaImageVariant),
});

/**
 * Тип конфигурации системы медиа-файлов.
 */
export type ZMediaConfig = z.infer<typeof zMediaConfig>;

/**
 * Схема валидации ответа API с конфигурацией медиа-системы.
 */
export const zMediaConfigResponse = zMediaConfig;

/**
 * Тип ответа API с конфигурацией медиа-системы.
 */
export type ZMediaConfigResponse = z.infer<typeof zMediaConfigResponse>;

/**
 * Схема валидации тела запроса для массовых операций с медиа.
 * @example
 * const bulkPayload: ZMediaBulkPayload = {
 *   ids: ['01HXZYXQJ123456789ABCDEF', '01HXZYXQJ987654321FEDCBA']
 * };
 */
export const zMediaBulkPayload = z.object({
  /** Массив ULID идентификаторов медиа-файлов. */
  ids: z.array(zMediaId).min(1),
});

/**
 * Тип данных для массовых операций с медиа.
 */
export type ZMediaBulkPayload = z.infer<typeof zMediaBulkPayload>;

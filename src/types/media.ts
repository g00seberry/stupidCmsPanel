import { zPaginationLinks, zPaginationMeta } from '@/types/pagination';
import { z } from 'zod';

/**
 * Тип медиафайла: image, video, audio, document.
 */
export type MediaKind = 'image' | 'video' | 'audio' | 'document';

/**
 * Поля сортировки для списка медиафайлов.
 */
export type MediaSortField = 'created_at' | 'size_bytes' | 'mime';

/**
 * Направление сортировки для списка медиафайлов.
 */
export type MediaSortOrder = 'asc' | 'desc';

/**
 * Управление soft-deleted медиафайлами в фильтрах.
 */
export type MediaDeletedFilter = 'with' | 'only';

/**
 * Схема валидации медиафайла CMS.
 * Представляет загруженный файл: изображение, видео, аудио или документ.
 * @example
 * const media: ZMedia = {
 *   id: '01HQZ8X9VJQ4KJ5N7R8Y9T0W1X',
 *   kind: 'image',
 *   name: 'hero.jpg',
 *   ext: 'jpg',
 *   mime: 'image/jpeg',
 *   size_bytes: 235678,
 *   width: 1920,
 *   height: 1080,
 *   duration_ms: null,
 *   title: 'Hero image',
 *   alt: 'Hero cover',
 *   collection: 'uploads',
 *   created_at: '2025-01-10T12:00:00+00:00',
 *   updated_at: '2025-01-10T12:00:00+00:00',
 *   deleted_at: null,
 *   preview_urls: {
 *     thumbnail: 'https://api.stupidcms.dev/api/v1/admin/media/uuid-media/preview?variant=thumbnail'
 *   },
 *   download_url: 'https://api.stupidcms.dev/api/v1/admin/media/uuid-media/download'
 * };
 */
export const zMedia = z.object({
  /** Уникальный идентификатор медиафайла (ULID). */
  id: z.string(),
  /** Тип медиафайла: image, video, audio, document. */
  kind: z.enum(['image', 'video', 'audio', 'document']),
  /** Исходное имя файла при загрузке. */
  name: z.string(),
  /** Расширение файла (без точки). */
  ext: z.string(),
  /** MIME-тип файла. */
  mime: z.string(),
  /** Размер файла в байтах. */
  size_bytes: z.number(),
  /** Ширина в пикселях (только для изображений и видео). Может быть `null`. */
  width: z.number().nullable(),
  /** Высота в пикселях (только для изображений и видео). Может быть `null`. */
  height: z.number().nullable(),
  /** Длительность в миллисекундах (только для видео и аудио). Может быть `null`. */
  duration_ms: z.number().nullable(),
  /** Заголовок медиафайла. Может быть `null`. */
  title: z.string().nullable(),
  /** Альтернативный текст для изображений. Может быть `null`. */
  alt: z.string().nullable(),
  /** Коллекция, к которой принадлежит медиафайл. Может быть `null`. */
  collection: z.string().nullable(),
  /** Дата создания в формате ISO 8601. */
  created_at: z.string(),
  /** Дата последнего обновления в формате ISO 8601. */
  updated_at: z.string(),
  /** Дата мягкого удаления в формате ISO 8601. Может быть `null`. */
  deleted_at: z.string().nullable(),
  /** URLs превью для вариантов (только для изображений). Может быть пустым объектом. */
  preview_urls: z.record(z.string(), z.string()),
  /** URL endpoint для скачивания файла. */
  download_url: z.string(),
});

/**
 * Тип данных медиафайла CMS.
 */
export type ZMedia = z.infer<typeof zMedia>;

/**
 * Схема валидации ответа API с одним медиафайлом.
 */
export const zMediaResponse = z.object({
  /** Данные медиафайла. */
  data: zMedia,
});

/**
 * Тип ответа API с одним медиафайлом.
 */
export type ZMediaResponse = z.infer<typeof zMediaResponse>;

/**
 * Схема валидации ответа API со списком медиафайлов.
 */
export const zMediaCollection = z.object({
  /** Массив медиафайлов. */
  data: z.array(zMedia),
  /** Ссылки пагинации. */
  links: zPaginationLinks,
  /** Метаданные пагинации. */
  meta: zPaginationMeta,
});

/**
 * Тип ответа API со списком медиафайлов.
 */
export type ZMediaCollection = z.infer<typeof zMediaCollection>;

/**
 * Параметры запроса списка медиафайлов.
 * @example
 * const filters: ZMediaFilters = {
 *   q: 'hero',
 *   kind: 'image',
 *   mime: 'image/png',
 *   collection: 'uploads',
 *   deleted: 'with',
 *   sort: 'created_at',
 *   order: 'desc',
 *   per_page: 20,
 *   page: 1
 * };
 */
export type ZMediaFilters = {
  /** Поиск по названию и исходному имени (максимум 255 символов). */
  q?: string;
  /** Фильтр по типу медиафайла: image, video, audio, document. */
  kind?: MediaKind;
  /** Фильтр по MIME-типу (prefix match, например 'image/png'). */
  mime?: string;
  /** Фильтр по коллекции (slug, до 64 символов). */
  collection?: string;
  /** Управление soft-deleted: 'with' - включить удалённые, 'only' - только удалённые. */
  deleted?: MediaDeletedFilter;
  /** Поле сортировки: created_at, size_bytes, mime. По умолчанию: created_at. */
  sort?: MediaSortField;
  /** Направление сортировки: asc, desc. По умолчанию: desc. */
  order?: MediaSortOrder;
  /** Размер страницы (1-100). По умолчанию: 15. */
  per_page?: number;
  /** Номер страницы (>=1). По умолчанию: 1. */
  page?: number;
};

/**
 * Схема валидации данных для обновления метаданных медиафайла.
 * @example
 * const payload: ZMediaUpdatePayload = {
 *   title: 'Updated hero image',
 *   alt: 'Updated hero cover',
 *   collection: 'uploads'
 * };
 */
export const zMediaUpdatePayload = z.object({
  /** Заголовок медиафайла. Может быть `null`. */
  title: z.string().max(255).nullable().optional(),
  /** Альтернативный текст для изображений. Может быть `null`. */
  alt: z.string().max(255).nullable().optional(),
  /** Коллекция, к которой принадлежит медиафайл. Может быть `null`. Максимум 64 символа, regex: ^[a-z0-9-_.]+$ (case-insensitive). */
  collection: z
    .string()
    .max(64)
    .regex(/^[a-z0-9-_.]+$/i)
    .nullable()
    .optional(),
});

/**
 * Тип данных для обновления метаданных медиафайла.
 */
export type ZMediaUpdatePayload = z.infer<typeof zMediaUpdatePayload>;

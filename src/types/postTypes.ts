import { z } from 'zod';

/**
 * Описание одного типа контента CMS.
 */
export const zPostType = z.object({
  slug: z.string(),
  name: z.string(),
  template: z.string().optional().nullable(),
  options_json: z.record(z.string(), z.unknown()).nullish().default(null),
  created_at: z.string().optional(),
  updated_at: z.string().optional(),
});

/**
 * Тип данных одного типа контента.
 */
export type ZPostType = z.infer<typeof zPostType>;

/**
 * Данные для создания или обновления типа контента.
 */
export const zPostTypePayload = z.object({
  slug: z.string().min(1),
  name: z.string().min(1),
  template: z.string().optional().nullable(),
  options_json: z.record(z.string(), z.unknown()).default({}),
});

/**
 * DTO для сохранения типа контента.
 */
export type ZPostTypePayload = z.infer<typeof zPostTypePayload>;

/**
 * Ответ API со списком типов контента.
 */
export const zPostTypesResponse = z.object({
  data: z.array(zPostType),
});

/**
 * Ответ API с данными одного типа контента.
 */
export const zPostTypeResponse = z.object({
  data: zPostType,
});

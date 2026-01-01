import { z } from 'zod';
import { zId } from './ZId';

/**
 * Схема валидации объекта с идентификатором и названием.
 * Универсальная схема для упрощённых представлений сущностей (например, PostType в контексте Entry).
 */
export const zIdName = z.object({
  /** Уникальный идентификатор. */
  id: zId,
  /** Отображаемое название. */
  name: z.string(),
});

/**
 * Тип объекта с идентификатором и названием.
 */
export type ZIdName = z.infer<typeof zIdName>;

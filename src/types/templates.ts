import { z } from 'zod';

/**
 * Схема одного шаблона из ответа API.
 */
export const zTemplate = z.object({
  /** Имя шаблона в dot notation. */
  name: z.string(),
  /** Путь к файлу шаблона. */
  path: z.string(),
  /** Флаг существования файла шаблона. */
  exists: z.boolean(),
});

/**
 * Схема ответа API получения списка шаблонов.
 */
export const zTemplatesResponse = z.object({
  data: z.array(zTemplate),
});

/**
 * Тип одного шаблона.
 */
export type ZTemplate = z.infer<typeof zTemplate>;

/**
 * Тип ответа API получения списка шаблонов.
 */
export type ZTemplatesResponse = z.infer<typeof zTemplatesResponse>;

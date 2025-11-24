import { z } from 'zod';
import { zEditComponent } from '@/components/schemaForm/componentDefs/ZComponent';

/**
 * Схема валидации ответа с конфигурацией формы (GET).
 * API возвращает объект напрямую, не обёрнутый в data.
 */
export const zFormConfigResponse = z.record(z.string(), zEditComponent);

/**
 * Схема валидации ответа при сохранении конфигурации (PUT).
 */
export const zFormConfigSaveResponse = z.object({
  data: z.object({
    post_type_slug: z.string(),
    blueprint_id: z.number(),
    config_json: z.record(z.string(), zEditComponent),
    created_at: z.string().optional(),
    updated_at: z.string().optional(),
  }),
});

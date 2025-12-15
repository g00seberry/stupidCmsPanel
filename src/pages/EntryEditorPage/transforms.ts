import type { ZEntry, ZEntryPayload } from '@/types/entries';
import type { ZId } from '@/types/ZId';
import { serverDate, viewDate } from '@/utils/dateUtils';
import type { Dayjs } from 'dayjs';

/**
 * Значения формы редактора записи.
 */
export interface EntryEditorFormValues {
  readonly title: string;
  readonly is_published: boolean;
  readonly published_at: Dayjs | null;
  readonly template_override: string;
  readonly term_ids: ZId[];
  readonly data_json?: Record<string, any>;
}

/**
 * Преобразует данные записи в значения формы.
 * @param entry Запись, полученная из API.
 * @param termIds Массив ID термов записи (опционально).
 * @param paths Дерево Path для преобразования data_json (опционально).
 * @returns Значения формы, готовые к отображению пользователю.
 */
export const entry2formValues = (entry: ZEntry, termIds: ZId[] = []): EntryEditorFormValues => {
  return {
    title: entry.title,
    is_published: entry.is_published,
    published_at: viewDate(entry.published_at),
    template_override: entry.template_override ?? '',
    term_ids: termIds,
    data_json: entry.data_json || {},
  };
};

export const formValues2entryPayload = (
  values: EntryEditorFormValues,
  postTypeId: ZId
): ZEntryPayload => {
  return {
    post_type_id: postTypeId,
    title: values.title,
    is_published: values.is_published,
    published_at: serverDate(values.published_at),
    template_override: values.template_override,
    term_ids: values.term_ids,
    data_json: values.data_json ?? {},
  };
};

import type { ZId } from '@/types/ZId';
import type { FormModel } from '../../FormModel';
import type { ZEntry, ZEntryRelatedEntryData } from '@/types/entries';

/**
 * Нормализует значение поля в массив ID записей.
 * @param value Значение поля (может быть массивом, одиночным значением или null/undefined).
 * @returns Массив ID записей.
 */
export const normalizeEntryIds = (value: unknown): ZId[] => {
  if (value === null || value === undefined) {
    return [];
  }
  if (Array.isArray(value)) {
    return value;
  }
  if (!Array.isArray(value)) {
    return [String(value)];
  }
  return [];
};

/**
 * Формирует отображаемое значение для поля ввода на основе связанных данных.
 * Использует метаданные из relatedData для отображения заголовков записей вместо ID.
 * @param value Значение поля (ID записи или массив ID).
 * @param model Модель формы, содержащая relatedData.
 * @returns Строка для отображения в поле ввода.
 */
export const getDisplayValue = (value: unknown, model: FormModel, rows: ZEntry[]): string => {
  const entryIds = normalizeEntryIds(value);

  if (entryIds.length === 0) {
    return '';
  }

  const relatedEntryData = model.relatedData?.entryData;
  const relatedEntryDataExtended = {
    ...relatedEntryData,
    ...rows.reduce(
      (acc, row) => {
        acc[String(row.id)] = { entryPostType: row.post_type?.name ?? null, entryTitle: row.title };
        return acc;
      },
      {} as Record<string, ZEntryRelatedEntryData>
    ),
  };
  if (relatedEntryDataExtended) {
    const titles = entryIds
      .map(id => {
        const entryData = relatedEntryDataExtended[String(id)];
        return entryData?.entryTitle || String(id);
      })
      .filter(Boolean);

    return titles.join(', ');
  }

  // Fallback: отображаем ID, если related данные недоступны
  return entryIds.map(String).join(', ');
};

/**
 * Получает тип выбора строк на основе кардинальности поля.
 * @param cardinality Кардинальность поля ('one' | 'many').
 * @returns Тип выбора: 'radio' для 'one', 'checkbox' для 'many'.
 */
export const getSelectionType = (cardinality: 'one' | 'many'): 'checkbox' | 'radio' => {
  return cardinality === 'many' ? 'checkbox' : 'radio';
};

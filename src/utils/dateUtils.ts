import dayjs, { type Dayjs } from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import 'dayjs/locale/ru';

dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.locale('ru');

/**
 * Преобразует дату из формата представления (Dayjs объект или строка) в формат сервера (ISO 8601 строка).
 * @param date Дата в формате представления (Dayjs объект, строка или null/undefined).
 * @returns Дата в формате ISO 8601 для отправки на сервер или null, если дата не указана.
 * @example
 * const serverDate = serverDate(dayjs('2025-02-10 08:00'));
 * console.log(serverDate); // '2025-02-10T08:00:00+00:00'
 */
export const serverDate = (date: Dayjs | string | null | undefined): string | null => {
  if (!date) {
    return null;
  }

  const dayjsDate = typeof date === 'string' ? dayjs(date) : date;
  if (!dayjsDate.isValid()) {
    return null;
  }

  return dayjsDate.utc().toISOString();
};

/**
 * Преобразует дату из формата сервера (ISO 8601 строка) в формат представления (Dayjs объект).
 * @param date Дата в формате ISO 8601 с сервера или null/undefined.
 * @returns Dayjs объект для использования в DatePicker или null, если дата не указана.
 * @example
 * const viewDate = viewDate('2025-02-10T08:00:00+00:00');
 * console.log(viewDate?.format('YYYY-MM-DD HH:mm')); // '2025-02-10 08:00'
 */
export const viewDate = (date: string | null | undefined): Dayjs | null => {
  if (!date) {
    return null;
  }

  const dayjsDate = dayjs(date);
  if (!dayjsDate.isValid()) {
    return null;
  }

  return dayjsDate;
};


/**
 * Запрос на получение справочных данных.
 */
export interface ReferenceQuery {
  /** Ресурс для загрузки (например, 'entries', 'users', 'categories'). */
  resource: string;
  /** Дополнительные параметры запроса. */
  params?: Record<string, unknown>;
}

/**
 * Опция для выбора в справочном поле.
 */
export interface ReferenceOption {
  /** Значение опции (ID или другой идентификатор). */
  value: string | number;
  /** Отображаемый текст опции. */
  label: string;
}

/**
 * Результат загрузки справочных данных.
 */
export interface ReferenceDataResult {
  /** Флаг выполнения загрузки. */
  loading: boolean;
  /** Ошибка загрузки, если произошла. */
  error?: Error;
  /** Массив опций для выбора. */
  options: ReferenceOption[];
  /** Функция для загрузки следующей страницы (для пагинации). */
  loadMore?: () => void;
  /** Функция для поиска по справочнику. */
  search?: (term: string) => void;
}


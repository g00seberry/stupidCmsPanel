/**
 * Конфигурация UI для поля формы.
 * Определяет внешний вид и поведение поля.
 */
export interface FieldUIConfig {
  /** Ширина поля в колонках (для layout). */
  width?: number;
  /** Тип виджета для отображения поля (например, 'textarea', 'select', 'radio-group'). */
  widget?: string;
  /** Ключ локализации для placeholder. */
  placeholderKey?: string;
  /** Ключ локализации для label. */
  labelKey?: string;
  /** Ключ локализации для help text. */
  helpKey?: string;
  /** Конфигурация для ref-полей (resource и params). */
  refConfig?: {
    resource?: string;
    params?: Record<string, unknown>;
  };
  /** Нормализованные правила валидации. */
  validationRules?: Array<{
    /** Тип правила валидации (min, max, regex, length, enum, custom). */
    type: string;
    /** Дополнительные параметры правила. */
    [key: string]: unknown;
  }>;
  /** Дополнительные произвольные свойства. */
  [key: string]: unknown;
}

import type { ZCreatePathDto, ZUpdatePathDto, ZValidationRules } from '@/types/path';
import { normalizeValidationRulesForForm } from '@/utils/validationRules';

type FormValues = ZCreatePathDto | ZUpdatePathDto | { embedded_blueprint_id: number };

/**
 * Значения по умолчанию для создания поля.
 */
const DEFAULT_CREATE_VALUES: Partial<ZCreatePathDto> = {
  cardinality: 'one',
  is_indexed: false,
};

/**
 * Нормализует начальные значения формы.
 * Обрабатывает validation_rules и устанавливает значения по умолчанию для режима создания.
 * @param initialValues Начальные значения формы.
 * @param mode Режим формы (create/edit/embed).
 * @returns Нормализованные значения формы.
 */
export const normalizeFormInitialValues = (
  initialValues?: Partial<FormValues>,
  mode?: 'create' | 'edit' | 'embed'
): Partial<FormValues> => {
  const baseDefaults = mode === 'create' ? DEFAULT_CREATE_VALUES : {};
  const initial = initialValues || {};

  // Нормализуем validation_rules для формы
  let normalizedValidationRules: ZValidationRules | undefined = undefined;
  if (
    'validation_rules' in initial &&
    initial.validation_rules !== null &&
    initial.validation_rules !== undefined
  ) {
    normalizedValidationRules = normalizeValidationRulesForForm(
      initial.validation_rules as ZValidationRules
    );
  }

  const result: Partial<FormValues> = {
    ...baseDefaults,
    ...initial,
  };

  // Устанавливаем validation_rules только если оно есть или было явно передано
  // Используем type assertion, так как мы проверяем наличие validation_rules в initial
  if (normalizedValidationRules !== undefined) {
    (result as Partial<ZCreatePathDto | ZUpdatePathDto>).validation_rules =
      normalizedValidationRules;
  } else if ('validation_rules' in initial) {
    // Если validation_rules было явно передано как null/undefined, преобразуем null в undefined
    (result as Partial<ZCreatePathDto | ZUpdatePathDto>).validation_rules =
      initial.validation_rules === null
        ? undefined
        : (initial.validation_rules as ZValidationRules | undefined);
  }

  return result;
};

/**
 * Вычисляет полный путь поля на основе имени и родительского пути.
 * @param name Имя поля.
 * @param parentPath Родительский путь.
 * @returns Полный путь или undefined, если имя не указано.
 */
export const buildFullPath = (
  name?: string,
  parentPath?: { id: number; full_path: string }
): string | undefined => {
  const trimmed = name?.trim();
  if (!trimmed) return undefined;
  return parentPath?.full_path ? `${parentPath.full_path}.${trimmed}` : trimmed;
};

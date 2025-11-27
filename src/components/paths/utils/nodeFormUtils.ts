import type { ZCreatePathDto, ZUpdatePathDto, ZValidationRules } from '@/types/path';
import { normalizeValidationRulesForForm } from '@/utils/validationRules';

type PathFormValues = ZCreatePathDto | ZUpdatePathDto;

/**
 * Значения по умолчанию для создания поля.
 */
const DEFAULT_CREATE_VALUES: Partial<ZCreatePathDto> = {
  cardinality: 'one',
  is_indexed: false,
};

/**
 * Нормализует начальные значения формы для создания/редактирования пути.
 * Обрабатывает validation_rules и устанавливает значения по умолчанию для режима создания.
 * @param initialValues Начальные значения формы.
 * @param mode Режим формы (create/edit).
 * @returns Нормализованные значения формы.
 */
export const normalizeFormInitialValues = (
  initialValues?: Partial<PathFormValues>,
  mode?: 'create' | 'edit'
): Partial<PathFormValues> => {
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

  const result: Partial<PathFormValues> = {
    ...baseDefaults,
    ...initial,
  };

  // Устанавливаем validation_rules только если оно есть или было явно передано
  if (normalizedValidationRules !== undefined) {
    result.validation_rules = normalizedValidationRules;
  } else if ('validation_rules' in initial) {
    // Если validation_rules было явно передано как null/undefined, преобразуем null в undefined
    result.validation_rules =
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

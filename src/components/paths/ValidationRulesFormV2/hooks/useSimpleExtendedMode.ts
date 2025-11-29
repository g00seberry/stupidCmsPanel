import { useEffect, useState, useCallback } from 'react';
import type { RuleKey } from '../types';
import type { ValidationRulesStore } from '../ValidationRulesStore';

/**
 * Параметры для хука useSimpleExtendedMode.
 */
export type UseSimpleExtendedModeParams = {
  /** Store для управления правилами валидации. */
  store: ValidationRulesStore;
  /** Ключ правила. */
  ruleKey: RuleKey;
  /** Функция извлечения строкового значения из объекта для простого режима. */
  extractSimpleValue: (value: any) => string;
  /** Функция создания объекта из строки для расширенного режима. */
  createExtendedValue: (simpleValue: string) => any;
  /** Функция получения ключа для извлечения значения из объекта (например, 'field' или 'table'). */
  getObjectKey: () => string;
};

/**
 * Хук для управления переключением между простым и расширенным форматом правила.
 * Упрощает логику работы с правилами, которые могут быть представлены как строкой, так и объектом.
 * 
 * @param params Параметры хука.
 * @returns Объект с текущим режимом и обработчиком переключения.
 * 
 * @example
 * const { mode, handleModeChange } = useSimpleExtendedMode({
 *   store,
 *   ruleKey: 'unique',
 *   extractSimpleValue: (value) => value?.table || '',
 *   createExtendedValue: (simpleValue) => ({ table: simpleValue.trim() }),
 *   getObjectKey: () => 'table'
 * });
 */
export const useSimpleExtendedMode = ({
  store,
  ruleKey,
  extractSimpleValue,
  createExtendedValue,
  getObjectKey,
}: UseSimpleExtendedModeParams) => {
  const ruleValue = store.getRule(ruleKey);
  const isSimple = typeof ruleValue === 'string' || ruleValue === undefined || ruleValue === null;
  const [mode, setMode] = useState<'simple' | 'extended'>(isSimple ? 'simple' : 'extended');

  useEffect(() => {
    const currentIsSimple =
      typeof ruleValue === 'string' || ruleValue === undefined || ruleValue === null;
    const newMode = currentIsSimple ? 'simple' : 'extended';
    if (mode !== newMode) {
      setMode(newMode);
    }
  }, [ruleValue, mode]);

  const handleModeChange = useCallback(
    (newMode: 'simple' | 'extended') => {
      setMode(newMode);
      if (newMode === 'simple') {
        const simpleValue = ruleValue && typeof ruleValue === 'object' 
          ? extractSimpleValue(ruleValue) 
          : '';
        store.setRule(ruleKey, simpleValue || undefined);
      } else {
        if (typeof ruleValue === 'string' && ruleValue.trim()) {
          store.setRule(ruleKey, createExtendedValue(ruleValue));
        } else if (!ruleValue || (typeof ruleValue === 'object' && !ruleValue[getObjectKey()])) {
          store.setRule(ruleKey, createExtendedValue(''));
        }
      }
    },
    [store, ruleKey, ruleValue, extractSimpleValue, createExtendedValue, getObjectKey]
  );

  return {
    mode,
    handleModeChange,
  };
};


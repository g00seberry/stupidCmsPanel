import { Form } from 'antd';
import { useEffect, useState, useCallback } from 'react';
import type { FormInstance } from 'antd/es/form';
import type { RuleKey } from '../types';

/**
 * Параметры для хука useSimpleExtendedMode.
 */
export type UseSimpleExtendedModeParams = {
  /** Экземпляр формы Ant Design. */
  form: FormInstance<any>;
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
 *   form,
 *   ruleKey: 'unique',
 *   extractSimpleValue: (value) => value?.table || '',
 *   createExtendedValue: (simpleValue) => ({ table: simpleValue.trim() }),
 *   getObjectKey: () => 'table'
 * });
 */
export const useSimpleExtendedMode = ({
  form,
  ruleKey,
  extractSimpleValue,
  createExtendedValue,
  getObjectKey,
}: UseSimpleExtendedModeParams) => {
  const ruleValue = Form.useWatch(['validation_rules', ruleKey], form);
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
        form.setFieldValue(['validation_rules', ruleKey], simpleValue);
      } else {
        if (typeof ruleValue === 'string' && ruleValue.trim()) {
          form.setFieldValue(['validation_rules', ruleKey], createExtendedValue(ruleValue));
        } else if (!ruleValue || (typeof ruleValue === 'object' && !ruleValue[getObjectKey()])) {
          form.setFieldValue(['validation_rules', ruleKey], createExtendedValue(''));
        }
      }
    },
    [form, ruleKey, ruleValue, extractSimpleValue, createExtendedValue, getObjectKey]
  );

  return {
    mode,
    handleModeChange,
  };
};


import type { ZValidationRules } from '@/types/path';
import { makeAutoObservable } from 'mobx';
import type { RuleKey } from './types';

/**
 * Store для управления состоянием правил валидации.
 * Хранит правила валидации и предоставляет методы для их изменения.
 */
export class ValidationRulesStore {
  /** Объект с правилами валидации. */
  rules: ZValidationRules | null = null;

  /**
   * Создаёт экземпляр стора правил валидации.
   */
  constructor() {
    makeAutoObservable(this);
  }

  /**
   * Устанавливает правила валидации.
   * @param rules Объект правил или `null` для сброса.
   */
  setRules(rules: ZValidationRules | null) {
    this.rules = rules;
  }

  /**
   * Инициализирует стор начальными значениями.
   * @param initialRules Начальные правила валидации.
   */
  init(initialRules?: ZValidationRules | null) {
    this.rules = initialRules || null;
  }

  /**
   * Получает значение конкретного правила.
   * @param ruleKey Ключ правила.
   * @returns Значение правила или `undefined`.
   */
  getRule(ruleKey: RuleKey): ZValidationRules[RuleKey] | undefined {
    return this.rules?.[ruleKey];
  }

  /**
   * Устанавливает значение конкретного правила.
   * @param ruleKey Ключ правила.
   * @param value Значение правила.
   */
  setRule(ruleKey: RuleKey, value: ZValidationRules[RuleKey] | undefined) {
    if (!this.rules) {
      this.rules = {} as ZValidationRules;
    }
    if (value === undefined) {
      const newRules = { ...this.rules };
      delete newRules[ruleKey];
      const remainingKeys = Object.keys(newRules);
      this.rules = remainingKeys.length === 0 ? null : (newRules as ZValidationRules);
    } else {
      (this.rules as any)[ruleKey] = value;
    }
  }

  /**
   * Удаляет правило из стора.
   * Если после удаления не остаётся правил, устанавливает rules в null.
   * @param ruleKey Ключ правила для удаления.
   */
  removeRule(ruleKey: RuleKey) {
    if (!this.rules) return;

    const newRules = { ...this.rules };
    delete newRules[ruleKey];

    const remainingKeys = Object.keys(newRules);
    this.rules = remainingKeys.length === 0 ? null : (newRules as ZValidationRules);
  }

  /**
   * Добавляет правило с значением по умолчанию.
   * @param ruleKey Ключ правила.
   * @param defaultValue Значение по умолчанию.
   */
  addRule(ruleKey: RuleKey, defaultValue: ZValidationRules[RuleKey]) {
    this.setRule(ruleKey, defaultValue);
  }

  /**
   * Получает список активных правил (ключи).
   * @returns Массив ключей активных правил.
   */
  getActiveRules(): RuleKey[] {
    if (!this.rules || typeof this.rules !== 'object') {
      return [];
    }

    return (Object.keys(this.rules) as RuleKey[]).filter(key => {
      const value = this.rules![key];
      // Правило не активно только если значение явно null
      if (value === null) return false;
      // Все остальные значения считаются активными
      return true;
    });
  }

  /**
   * Получает полный объект правил для сохранения.
   * @returns Объект правил или `null` если правил нет.
   */
  getRulesForSave(): ZValidationRules | null {
    return this.rules;
  }
}

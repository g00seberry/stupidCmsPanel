import type { ZValidationRules } from '@/types/path/pathValidationRules';
import type { PathValidationRule } from './types';

export const listValidationRules = (value: ZValidationRules): PathValidationRule[] => {
  return (Object.entries(value) as [keyof ZValidationRules, unknown][])
    .filter(([, val]) => val !== undefined)
    .map(([type, val]) => ({ type, value: val }) as PathValidationRule);
};

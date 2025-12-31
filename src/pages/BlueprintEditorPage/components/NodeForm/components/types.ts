import type { ZConditionalRule, ZFieldComparisonRule } from '@/types/path/pathValidationRules';

export type PathValidationRule =
  | { type: 'required'; value: boolean }
  | { type: 'min'; value: number }
  | { type: 'max'; value: number }
  | { type: 'pattern'; value: string }
  | { type: 'distinct'; value: boolean }
  | { type: 'required_if'; value: ZConditionalRule }
  | { type: 'prohibited_unless'; value: ZConditionalRule }
  | { type: 'required_unless'; value: ZConditionalRule }
  | { type: 'prohibited_if'; value: ZConditionalRule }
  | { type: 'field_comparison'; value: ZFieldComparisonRule };

export type RuleListRendererProps = {
  rule: PathValidationRule;
  onEdit: () => void;
};

export type RuleFormRendererProps = {
  rule: PathValidationRule;
  onSave: (rule: PathValidationRule) => void;
  onCancel: () => void;
};

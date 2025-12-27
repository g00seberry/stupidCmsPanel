import type React from 'react';
import type { PathValidationRule, RuleListRendererProps } from '../types';
import {
  RequiredRuleListItem,
  MinRuleListItem,
  MaxRuleListItem,
  PatternRuleListItem,
  DistinctRuleListItem,
  RequiredIfRuleListItem,
  ProhibitedUnlessRuleListItem,
  RequiredUnlessRuleListItem,
  ProhibitedIfRuleListItem,
  FieldComparisonRuleListItem,
} from './RuleListItems';

export const ruleListRenderers: Record<PathValidationRule['type'], React.FC<RuleListRendererProps>> = {
  required: RequiredRuleListItem,
  min: MinRuleListItem,
  max: MaxRuleListItem,
  pattern: PatternRuleListItem,
  distinct: DistinctRuleListItem,
  required_if: RequiredIfRuleListItem,
  prohibited_unless: ProhibitedUnlessRuleListItem,
  required_unless: RequiredUnlessRuleListItem,
  prohibited_if: ProhibitedIfRuleListItem,
  field_comparison: FieldComparisonRuleListItem,
};


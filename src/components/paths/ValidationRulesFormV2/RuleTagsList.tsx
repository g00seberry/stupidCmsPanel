import { Form } from 'antd';
import type { FormInstance } from 'antd/es/form';
import type { RuleKey } from './types';
import { RuleTag } from './RuleTag';
import { getActiveRules } from './utils';

/**
 * Пропсы компонента списка тегов правил.
 */
export type PropsRuleTagsList = {
  /** Экземпляр формы Ant Design. */
  form: FormInstance<any>;
  /** Обработчик клика на тег. */
  onTagClick?: (ruleKey: RuleKey) => void;
  /** Обработчик удаления правила. */
  onRemove?: (ruleKey: RuleKey) => void;
  /** Флаг только для чтения. */
  isReadonly?: boolean;
};

/**
 * Компонент списка тегов правил валидации.
 * Отображает все активные правила в виде тегов.
 */
export const RuleTagsList: React.FC<PropsRuleTagsList> = ({
  form,
  onTagClick,
  onRemove,
  isReadonly,
}) => {
  const validationRules = Form.useWatch('validation_rules', form);
  const activeRules = getActiveRules(validationRules);

  if (activeRules.length === 0) {
    return (
      <div className="text-muted-foreground rounded border border-dashed border-border p-4 text-center text-sm">
        Правила валидации не добавлены
      </div>
    );
  }

  return (
    <div className="flex flex-wrap gap-2">
      {activeRules.map(ruleKey => (
        <RuleTag
          key={ruleKey}
          ruleKey={ruleKey}
          onClick={() => onTagClick?.(ruleKey)}
          onRemove={() => onRemove?.(ruleKey)}
          isReadonly={isReadonly}
        />
      ))}
    </div>
  );
};

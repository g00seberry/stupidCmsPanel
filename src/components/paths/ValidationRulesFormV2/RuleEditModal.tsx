import { Modal, Button, Space } from 'antd';
import type { RuleKey } from './types';
import { getRuleConfig } from './registry';
import type { ValidationRulesStore } from './ValidationRulesStore';

/**
 * Пропсы компонента модального окна редактирования правила.
 */
export type PropsRuleEditModal = {
  /** Флаг открытия модального окна. */
  open: boolean;
  /** Обработчик закрытия модального окна. */
  onCancel: () => void;
  /** Обработчик сохранения правила. */
  onSave: () => void;
  /** Обработчик удаления правила. */
  onRemove: () => void;
  /** Ключ правила. */
  ruleKey: RuleKey;
  /** Store для управления правилами валидации. */
  store: ValidationRulesStore;
  /** Флаг только для чтения. */
  isReadonly?: boolean;
};

/**
 * Компонент модального окна редактирования правила валидации.
 * Отображает форму для настройки конкретного правила.
 */
export const RuleEditModal: React.FC<PropsRuleEditModal> = ({
  open,
  onCancel,
  onSave,
  onRemove,
  ruleKey,
  store,
  isReadonly,
}) => {
  const config = getRuleConfig(ruleKey);
  if (!config) return null;

  const Renderer = config.renderer;
  const meta = config.meta;

  return (
    <Modal
      title={meta.label}
      open={open}
      onCancel={onCancel}
      okText="Сохранить"
      cancelText="Отмена"
      footer={
        <Space>
          {!isReadonly && (
            <Button danger onClick={onRemove}>
              Удалить
            </Button>
          )}
          <Button onClick={onCancel}>Отмена</Button>
          {!isReadonly && (
            <Button type="primary" onClick={onSave}>
              Сохранить
            </Button>
          )}
        </Space>
      }
      width={600}
    >
      <div className="mb-4 text-sm text-muted-foreground">{meta.description}</div>
      <Renderer store={store} ruleKey={ruleKey} isReadonly={isReadonly} />
    </Modal>
  );
};

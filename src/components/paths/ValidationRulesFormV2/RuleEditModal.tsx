import { Modal, Form, Button, Space } from 'antd';
import type { FormInstance } from 'antd/es/form';
import type { RuleKey } from './types';
import { getRuleConfig } from './registry';

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
  /** Экземпляр формы Ant Design. */
  form: FormInstance<any>;
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
  form,
  isReadonly,
}) => {
  const config = getRuleConfig(ruleKey);
  if (!config) return null;

  const Renderer = config.renderer.component;
  const meta = config.meta;

  const handleOk = async () => {
    try {
      await form.validateFields([['validation_rules', ruleKey]]);
      onSave();
    } catch (error) {
      // Валидация не прошла, ошибки отобразятся автоматически
    }
  };

  return (
    <Modal
      title={meta.label}
      open={open}
      onOk={handleOk}
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
            <Button type="primary" onClick={handleOk}>
              Сохранить
            </Button>
          )}
        </Space>
      }
      width={600}
    >
      <div className="mb-4 text-sm text-muted-foreground">{meta.description}</div>
      <Renderer form={form} ruleKey={ruleKey} isReadonly={isReadonly} />
    </Modal>
  );
};

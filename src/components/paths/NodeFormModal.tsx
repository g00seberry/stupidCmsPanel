import { Modal, Button } from 'antd';
import { Form } from 'antd';
import { NodeForm, type PropsNodeForm } from './NodeForm';
import type { ZCreatePathDto, ZUpdatePathDto } from '@/types/path';
import { zCreatePathDto, zUpdatePathDto } from '@/types/path';

/**
 * Пропсы компонента модального окна формы узла.
 */
export type PropsNodeFormModal = Omit<PropsNodeForm, 'form'> & {
  /** Видимость модального окна. */
  open: boolean;
  /** Заголовок модального окна. */
  title?: string;
  /** Обработчик закрытия модального окна. */
  onCancel: () => void;
  /** Обработчик подтверждения формы. */
  onOk: (values: ZCreatePathDto | ZUpdatePathDto) => Promise<void> | void;
  /** Начальные значения формы. */
  initialValues?: Partial<ZCreatePathDto | ZUpdatePathDto>;
  /** Флаг загрузки (для блокировки кнопки OK). */
  loading?: boolean;
};

/**
 * Модальное окно с формой создания/редактирования узла графа.
 * Обеспечивает валидацию через Zod и обработку отправки формы.
 */
export const NodeFormModal: React.FC<PropsNodeFormModal> = ({
  open,
  title,
  onCancel,
  onOk,
  loading = false,
  mode,
  computedFullPath,
  isReadonly,
  sourceBlueprint,
  onNameChange,
  ...restProps
}) => {
  const [form] = Form.useForm<ZCreatePathDto | ZUpdatePathDto>();

  const handleOk = async () => {
    try {
      const values = await form.validateFields();
      const validatedValues =
        mode === 'edit' ? zUpdatePathDto.parse(values) : zCreatePathDto.parse(values);
      await onOk(validatedValues);
      form.resetFields();
    } catch (error) {
      // Валидация уже обработана Ant Design Form
    }
  };

  const handleCancel = () => {
    form.resetFields();
    onCancel();
  };

  return (
    <Modal
      open={open}
      title={title || (mode === 'edit' ? 'Редактировать поле' : 'Создать поле')}
      onCancel={handleCancel}
      footer={[
        <Button key="cancel" onClick={handleCancel}>
          Отмена
        </Button>,
        <Button
          key="submit"
          type="primary"
          loading={loading}
          onClick={handleOk}
          disabled={isReadonly && mode === 'edit'}
        >
          {mode === 'edit' ? 'Сохранить' : 'Создать'}
        </Button>,
      ]}
      width={600}
    >
      <NodeForm
        form={form}
        mode={mode}
        computedFullPath={computedFullPath}
        isReadonly={isReadonly}
        sourceBlueprint={sourceBlueprint}
        onNameChange={onNameChange}
        {...restProps}
      />
    </Modal>
  );
};

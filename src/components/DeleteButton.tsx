import { App, Button } from 'antd';
import { ExclamationCircleOutlined, DeleteOutlined } from '@ant-design/icons';
import React from 'react';

/**
 * Пропсы компонента кнопки удаления.
 */
export type PropsDeleteButton = {
  /** Функция для выполнения удаления. */
  onDelete: () => Promise<void> | void;
  /** Количество выбранных элементов. */
  selectedCount: number;
  /** Флаг выполнения операции удаления. */
  loading?: boolean;
  /** Название элемента в единственном числе (для текста в модальном окне). По умолчанию: 'элемент'. */
  itemName?: string;
  /** Заголовок модального окна подтверждения. По умолчанию: 'Удалить выбранные'. */
  title?: string;
  /** Текст кнопки подтверждения. По умолчанию: 'Удалить'. */
  okText?: string;
  /** Текст кнопки. По умолчанию: 'Удалить выбранные'. */
  buttonText?: string;
};

/**
 * Универсальная кнопка для массового удаления выбранных элементов.
 * Показывается только при наличии выбранных элементов.
 * При клике показывает модальное окно подтверждения.
 */
export const DeleteButton: React.FC<PropsDeleteButton> = ({
  onDelete,
  selectedCount,
  loading = false,
  itemName = 'элемент',
  title,
  okText = 'Удалить',
  buttonText,
}) => {
  const { modal } = App.useApp();

  if (selectedCount === 0) {
    return null;
  }

  const defaultTitle = `Удалить выбранные ${itemName}${selectedCount > 1 ? 'ы' : ''}`;
  const defaultButtonText = `Удалить выбранные (${selectedCount})`;

  const handleClick = () => {
    modal.confirm({
      title: title || defaultTitle,
      icon: React.createElement(ExclamationCircleOutlined, { className: 'text-red-500' }),
      content: `Вы уверены, что хотите удалить ${selectedCount} ${itemName}${selectedCount > 1 ? 'ов' : ''}? Это действие нельзя отменить.`,
      okText,
      okType: 'danger',
      cancelText: 'Отмена',
      onOk: async () => {
        await onDelete();
      },
    });
  };

  return (
    <Button danger icon={<DeleteOutlined />} onClick={handleClick} loading={loading}>
      {buttonText || defaultButtonText}
    </Button>
  );
};

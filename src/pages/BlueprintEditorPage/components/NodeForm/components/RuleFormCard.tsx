import { Button, Card, Form, Space } from 'antd';
import type React from 'react';

type RuleFormCardProps = {
  title?: string;
  onSave: () => void;
  onCancel: () => void;
  children: React.ReactNode;
  showCard?: boolean;
};

export const RuleFormCard: React.FC<RuleFormCardProps> = ({
  title,
  onSave,
  onCancel,
  children,
  showCard = true,
}) => {
  const formContent = (
    <Form layout="vertical">
      {children}
      <Form.Item>
        <Space>
          <Button type="primary" onClick={onSave}>
            Сохранить
          </Button>
          <Button onClick={onCancel}>Отмена</Button>
        </Space>
      </Form.Item>
    </Form>
  );

  if (showCard) {
    return <Card title={title}>{formContent}</Card>;
  }

  return formContent;
};


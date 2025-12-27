import { List } from 'antd';
import type React from 'react';

type RuleListItemProps = {
  title: string;
  description: string;
  onEdit: () => void;
};

export const RuleListItem: React.FC<RuleListItemProps> = ({ title, description, onEdit }) => {
  return (
    <List.Item onClick={onEdit} style={{ cursor: 'pointer' }}>
      <List.Item.Meta title={title} description={description} />
    </List.Item>
  );
};


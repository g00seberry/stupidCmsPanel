import { Card, DatePicker, Form, Switch } from 'antd';

/**
 * Боковая панель с настройками публикации записи.
 */
export const PublishCard: React.FC = () => {
  return (
    <Card className="p-6 sticky top-24">
      <h2 className="text-lg font-semibold mb-6">Публикация</h2>
      <div className="space-y-6">
        <Form.Item
          label="Опубликовано"
          name="is_published"
          valuePropName="checked"
          className="mb-0"
        >
          <Switch />
        </Form.Item>

        <Form.Item label="Дата публикации" name="published_at" className="mb-0">
          <DatePicker
            showTime
            format="YYYY-MM-DD HH:mm"
            style={{ width: '100%' }}
            placeholder="Выберите дату и время публикации"
          />
        </Form.Item>
        <p className="text-sm text-muted-foreground">Дата и время публикации записи</p>
      </div>
    </Card>
  );
};


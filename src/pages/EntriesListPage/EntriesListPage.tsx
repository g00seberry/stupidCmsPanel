import { Card, Space, Typography } from 'antd';
import { observer } from 'mobx-react-lite';

export const EntriesListPage = observer(() => {
  return (
    <Space direction="vertical" size="large" style={{ width: '100%' }}>
      <div>
        <Typography.Title level={3} style={{ marginBottom: 8 }}>
          Страницы
        </Typography.Title>
        <Typography.Paragraph type="secondary" style={{ marginBottom: 0 }}>
          Список материалов CMS. Реализация загрузки данных появится в отдельной задаче.
        </Typography.Paragraph>
      </div>

      <Card
        style={{ borderStyle: 'dashed', borderColor: '#d9d9d9', backgroundColor: '#ffffff' }}
        styles={{ body: { padding: 24 } }}
        variant="outlined"
      >
        <Typography.Text type="secondary">Здесь будет таблица записей.</Typography.Text>
      </Card>
    </Space>
  );
});

export default EntriesListPage;

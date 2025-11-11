import { Card, Space, Typography } from 'antd';
import { observer } from 'mobx-react-lite';
import styles from './entriesListPage.module.less';

/**
 * Заглушка страницы со списком записей CMS.
 */
export const EntriesListPage = observer(() => {
  return (
    <Space direction="vertical" size="large" className={styles.page}>
      <div className={styles.headingBlock}>
        <Typography.Title level={3} className={styles.title}>
          Страницы
        </Typography.Title>
        <Typography.Paragraph type="secondary" className={styles.description}>
          Список материалов CMS. Реализация загрузки данных появится в отдельной задаче.
        </Typography.Paragraph>
      </div>

      <Card className={styles.placeholderCard} variant="outlined">
        <Typography.Text type="secondary">Здесь будет таблица записей.</Typography.Text>
      </Card>
    </Space>
  );
});

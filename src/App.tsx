import { Layout, Typography } from 'antd';
import LoginPage from '@/pages/LoginPage/LoginPage';
import { routes } from '@/routes';
import { authStore } from '@/AuthStore';
import { observer } from 'mobx-react-lite';
import { useRoutes } from 'react-router-dom';

const { Header, Content } = Layout;

export const App = observer(() => {
  const element = useRoutes(routes);

  if (!authStore.isAuthenticated) {
    return <LoginPage />;
  }

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Header
        style={{
          backgroundColor: '#ffffff',
          boxShadow: '0 1px 2px rgba(0, 0, 0, 0.08)',
          display: 'flex',
          alignItems: 'center',
        }}
      >
        <div
          style={{
            flex: 1,
            maxWidth: 1120,
            margin: '0 auto',
            padding: '0 24px',
          }}
        >
          <Typography.Title level={3} style={{ margin: 0 }}>
            CMS Admin
          </Typography.Title>
        </div>
      </Header>
      <Content
        style={{
          flex: 1,
          width: '100%',
          maxWidth: 1120,
          margin: '0 auto',
          padding: '32px 24px',
        }}
      >
        {element}
      </Content>
    </Layout>
  );
});

export default App;

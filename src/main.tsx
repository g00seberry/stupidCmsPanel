import 'antd/dist/reset.css';
import { App as AntdApp, ConfigProvider } from 'antd';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from '@/App';
import '@/styles.css';

createRoot(document.getElementById('app')!).render(
  <StrictMode>
    <ConfigProvider
      theme={{
        token: {
          colorBgLayout: '#f5f5f5',
        },
      }}
    >
      <AntdApp>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </AntdApp>
    </ConfigProvider>
  </StrictMode>
);

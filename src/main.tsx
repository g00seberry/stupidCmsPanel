import 'antd/dist/reset.css';
import '@/index.css';
import { App as AntdApp, ConfigProvider } from 'antd';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { App } from '@/App';
import { themeConfig } from '@/themeConfig';
import { NotificationProvider } from './providers/NotificationProvider';

createRoot(document.getElementById('app')!).render(
  <StrictMode>
    <ConfigProvider theme={themeConfig}>
      <AntdApp>
        <BrowserRouter>
          <NotificationProvider>
            <App />
          </NotificationProvider>
        </BrowserRouter>
      </AntdApp>
    </ConfigProvider>
  </StrictMode>
);

import type { ThemeConfig } from 'antd';

/**
 * Базовая конфигурация тёплой темы Ant Design.
 */
export const themeConfig: ThemeConfig = {
  token: {
    colorPrimary: '#d97706',
    colorBgLayout: '#fdf6ec',
    colorBgContainer: '#fff7ed',
    colorBorder: '#f0a04b',
    colorText: '#3c2f2f',
    colorTextHeading: '#5c3d2e',
    colorTextSecondary: '#735751',
    colorLink: '#d97706',
    borderRadius: 12,
  },
  components: {
    Layout: {
      bodyBg: '#fdf6ec',
      headerBg: '#fff1d6',
    },
    Menu: {
      itemBorderRadius: 8,
      itemHeight: 44,
      colorItemText: '#3c2f2f',
      colorItemBg: 'transparent',
      colorItemTextHover: '#d97706',
      colorItemBgHover: '#fde3b2',
      colorItemTextSelected: '#b45309',
      colorItemBgSelected: '#fde3b2',
      colorActiveBarWidth: 0,
      itemMarginInline: 0,
    },
    Button: {
      colorPrimary: '#d97706',
      colorPrimaryHover: '#f59e0b',
      colorPrimaryActive: '#b45309',
      controlHeight: 40,
    },
    Typography: {
      colorTextHeading: '#5c3d2e',
    },
  },
};

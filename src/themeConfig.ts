import type { ThemeConfig } from 'antd';

/**
 * Конвертирует HSL значения в hex цвет.
 * @param h Оттенок (0-360).
 * @param s Насыщенность (0-100).
 * @param l Яркость (0-100).
 * @returns Hex цвет.
 */
const hslToHex = (h: number, s: number, l: number): string => {
  l /= 100;
  const a = (s * Math.min(l, 1 - l)) / 100;
  const f = (n: number) => {
    const k = (n + h / 30) % 12;
    const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
    return Math.round(255 * color)
      .toString(16)
      .padStart(2, '0');
  };
  return `#${f(0)}${f(8)}${f(4)}`;
};

/**
 * Базовая конфигурация темы Ant Design, соответствующая Tailwind CSS переменным.
 */
export const themeConfig: ThemeConfig = {
  token: {
    // Primary: hsl(24, 95%, 53%) → #f97316
    colorPrimary: hslToHex(24, 95, 53),
    // Background: hsl(30, 40%, 98%) → #faf8f5
    colorBgLayout: hslToHex(30, 40, 98),
    // Card: hsl(0, 0%, 100%) → #ffffff
    colorBgContainer: hslToHex(0, 0, 100),
    // Border: hsl(30, 20%, 88%) → #e5ddd0
    colorBorder: hslToHex(30, 20, 88),
    // Foreground: hsl(20, 14%, 15%) → #2d1f1a
    colorText: hslToHex(20, 14, 15),
    colorTextHeading: hslToHex(20, 14, 15),
    // Muted foreground: hsl(25, 10%, 45%) → #6b5d57
    colorTextSecondary: hslToHex(25, 10, 45),
    colorLink: hslToHex(24, 95, 53),
    // Radius: 0.5rem = 8px
    borderRadius: 5,
  },
  components: {
    Layout: {
      // Background: hsl(30, 40%, 98%)
      bodyBg: hslToHex(30, 40, 98),
      // Card: hsl(0, 0%, 100%)
      headerBg: hslToHex(0, 0, 100),
    },
    Menu: {
      itemBorderRadius: 5,
      itemHeight: 44,
      // Foreground: hsl(20, 14%, 15%)
      colorItemText: hslToHex(20, 14, 15),
      colorItemBg: 'transparent',
      // Primary: hsl(24, 95%, 53%)
      colorItemTextHover: hslToHex(24, 95, 53),
      // Muted: hsl(30, 25%, 92%) → #ede8e0
      colorItemBgHover: hslToHex(30, 25, 92),
      // Primary darker: hsl(24, 95%, 40%) → #c2410c
      colorItemTextSelected: hslToHex(24, 95, 40),
      colorItemBgSelected: hslToHex(30, 25, 92),
      colorActiveBarWidth: 0,
      itemMarginInline: 0,
    },
    Button: {
      // Primary: hsl(24, 95%, 53%)
      colorPrimary: hslToHex(24, 95, 53),
      // Primary hover: hsl(24, 95%, 60%) → #fb923c
      colorPrimaryHover: hslToHex(24, 95, 60),
      // Primary active: hsl(24, 95%, 40%)
      colorPrimaryActive: hslToHex(24, 95, 40),
      controlHeight: 40,
    },
    Typography: {
      // Foreground: hsl(20, 14%, 15%)
      colorTextHeading: hslToHex(20, 14, 15),
    },
  },
};

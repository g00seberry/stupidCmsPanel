import type { LucideIcon } from 'lucide-react';
import { FileType, Image, LayoutDashboard, Search, Settings, Tags } from 'lucide-react';

/**
 * Пункт навигации сайдбара.
 */
export interface SidebarLink {
  /**
   * Заголовок пункта меню.
   */
  readonly title: string;
  /**
   * URL перехода.
   */
  readonly url: string;
  /**
   * Иконка, отображаемая слева от подписи.
   */
  readonly icon: LucideIcon;
  /**
   * Требуется точное совпадение маршрута.
   */
  readonly exact?: boolean;
}

/**
 * Пункт навигации верхнего меню.
 */
export interface HeaderLink {
  /**
   * Заголовок пункта меню.
   */
  readonly title: string;
  /**
   * URL перехода.
   */
  readonly url: string;
  /**
   * Требуется точное совпадение маршрута.
   */
  readonly exact?: boolean;
}

/**
 * Основные ссылки в разделе «Управление контентом».
 */
export const sidebarLinks: readonly SidebarLink[] = [
  { title: 'Dashboard', url: '/', icon: LayoutDashboard, exact: true },
  { title: 'Media', url: '/media', icon: Image },
  { title: 'Taxonomies', url: '/taxonomies', icon: Tags },
  { title: 'Content Types', url: '/content-types', icon: FileType },
  { title: 'SEO', url: '/seo', icon: Search },
] as const;

/**
 * Системные ссылки в нижнем блоке сайдбара.
 */
export const systemSidebarLinks: readonly SidebarLink[] = [
  { title: 'Настройки', url: '/settings', icon: Settings },
] as const;

/**
 * Ссылки основного горизонтального меню.
 */
export const headerLinks: readonly HeaderLink[] = [
  { title: 'Dashboard', url: '/', exact: true },
  { title: 'Media', url: '/media' },
  { title: 'Taxonomies', url: '/taxonomies' },
  { title: 'Content Types', url: '/content-types' },
  { title: 'SEO', url: '/seo' },
] as const;

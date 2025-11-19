import { PageUrl } from '@/PageUrl';
import type { LucideIcon } from 'lucide-react';
import { FileType, Image, LayoutDashboard, Settings, Tags } from 'lucide-react';

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
  { title: 'Dashboard', url: PageUrl.Dashboard, icon: LayoutDashboard, exact: true },
  { title: 'Media', url: PageUrl.Media, icon: Image },
  { title: 'Taxonomies', url: PageUrl.Taxonomies, icon: Tags },
  { title: 'Content Types', url: PageUrl.ContentTypes, icon: FileType },
] as const;

/**
 * Системные ссылки в нижнем блоке сайдбара.
 */
export const systemSidebarLinks: readonly SidebarLink[] = [
  { title: 'Настройки', url: PageUrl.Settings, icon: Settings },
] as const;

/**
 * Ссылки основного горизонтального меню.
 */
export const headerLinks: readonly HeaderLink[] = [
  { title: 'Dashboard', url: PageUrl.Dashboard, exact: true },
  { title: 'Media', url: PageUrl.Media },
  { title: 'Taxonomies', url: PageUrl.Taxonomies },
  { title: 'Content Types', url: PageUrl.ContentTypes },
] as const;

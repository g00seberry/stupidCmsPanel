import { PageUrl } from '@/PageUrl';
import type { ComponentType } from 'react';
import {
  FileOutlined,
  PictureOutlined,
  DashboardOutlined,
  SettingOutlined,
  TagsOutlined,
  BoxPlotOutlined,
  BranchesOutlined,
} from '@ant-design/icons';

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
  readonly icon: ComponentType<{ className?: string }>;
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
  { title: 'Dashboard', url: PageUrl.Dashboard, icon: DashboardOutlined, exact: true },
  { title: 'Media', url: PageUrl.Media, icon: PictureOutlined },
  { title: 'Taxonomies', url: PageUrl.Taxonomies, icon: TagsOutlined },
  { title: 'Content Types', url: PageUrl.ContentTypes, icon: FileOutlined },
  { title: 'Blueprints', url: PageUrl.Blueprints, icon: BoxPlotOutlined },
  { title: 'Routes', url: PageUrl.Routes, icon: BranchesOutlined },
] as const;

/**
 * Системные ссылки в нижнем блоке сайдбара.
 */
export const systemSidebarLinks: readonly SidebarLink[] = [
  { title: 'Настройки', url: PageUrl.Settings, icon: SettingOutlined },
] as const;

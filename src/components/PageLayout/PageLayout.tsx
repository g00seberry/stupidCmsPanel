import type { ReactNode } from 'react';
import { PageHeader, type BreadcrumbItem } from '@/components/PageHeader/PageHeader';
import styles from './PageLayout.module.less';
import { Spin } from 'antd';

/**
 * Пропсы компонента лейаута страницы.
 */
export type PropsPageLayout = {
  /**
   * Массив элементов хлебных крошек.
   */
  readonly breadcrumbs: ReadonlyArray<BreadcrumbItem>;
  /**
   * Дополнительные элементы справа (кнопки, действия и т.д.).
   */
  readonly extra?: ReactNode;

  readonly loading?: boolean;
  /**
   * Содержимое страницы.
   */
  readonly children: ReactNode;
};

/**
 * Универсальный лейаут страницы с заголовком и контейнером контента.
 * Используется для единообразного отображения страниц по всему приложению.
 */
export const PageLayout: React.FC<PropsPageLayout> = ({
  breadcrumbs,
  extra,
  loading,
  children,
}) => {
  return (
    <div className="bg-background w-full">
      {loading && (
        <div className={styles.loaderBox}>
          <Spin spinning={loading} />
        </div>
      )}

      <PageHeader breadcrumbs={breadcrumbs} extra={extra} />
      <div className="px-6 py-8">{children}</div>
    </div>
  );
};

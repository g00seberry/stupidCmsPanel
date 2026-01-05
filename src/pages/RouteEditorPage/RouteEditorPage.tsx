import { useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { observer } from 'mobx-react-lite';
import type { ZId } from '@/types/ZId';
import { RouteEditorStore } from './RouteEditorStore';
import { RouteEditorInner } from './RouteEditorInner';
import { RouteEditorInnerNew } from './RouteEditorInnerNew';

const buildInner = (id: ZId) => {
  const store = new RouteEditorStore(id);
  if (id === 'new') return <RouteEditorInnerNew store={store} />;
  return <RouteEditorInner store={store} />;
};

/**
 * Страница создания и редактирования маршрута.
 */
export const RouteEditorPage = observer(() => {
  const { id: routeId = 'new' } = useParams<{ id?: ZId }>();
  const inner = useMemo(() => buildInner(routeId), [routeId]);
  return inner;
});

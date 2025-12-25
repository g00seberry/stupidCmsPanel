import type { ZId } from '@/types/ZId';
import { observer } from 'mobx-react-lite';
import { useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { BlueprintEditorStore } from './BlueprintEditorStore';
import { BlueprintEditorInner } from './BlueprintEditorInner';
import { BlueprintEditorInnerNew } from './BlueprintEditorInnerNew';
import { BlueprintStore } from './stores/BlueprintStore';
import { PathStore } from './stores/PathStore';
import { BlueprintEmbedStore } from './stores/BlueprintEmbedStore';

const buildInner = (id: ZId) => {
  if (id === 'new') return <BlueprintEditorInnerNew />;
  const blueprintStore = new BlueprintStore(id);
  const pathStore = new PathStore(id);
  const embedStore = new BlueprintEmbedStore(id);
  const editorStore = new BlueprintEditorStore(pathStore, embedStore, blueprintStore);
  return <BlueprintEditorInner store={editorStore} />;
};
/**
 * Страница редактирования Blueprint.
 * Включает форму основной информации о Blueprint.
 */
export const BlueprintEditorPage = observer(() => {
  const { id: blueprintId = 'new' } = useParams<{ id: ZId }>();
  const inner = useMemo(() => buildInner(blueprintId), [blueprintId]);
  return inner;
});

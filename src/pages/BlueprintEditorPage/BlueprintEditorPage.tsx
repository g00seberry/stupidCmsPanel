import { observer } from 'mobx-react-lite';
import { useCallback, useEffect, useMemo } from 'react';
import { Button, Card, Form, message } from 'antd';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { Save } from 'lucide-react';
import { BlueprintForm } from '@/components/blueprints/BlueprintForm';
import { BlueprintEditorStore } from '@/pages/BlueprintEditorPage/BlueprintEditorStore';
import type { ZCreateBlueprintDto, ZUpdateBlueprintDto } from '@/types/blueprint';
import type { ZId } from '@/types/ZId';
import { buildUrl, PageUrl } from '@/PageUrl';
import { onError } from '@/utils/onError';
import { setFormValidationErrors } from '@/utils/blueprintFormErrors';

/**
 * Страница редактирования Blueprint.
 * Включает форму основной информации о Blueprint.
 */
export const BlueprintEditorPage = observer(() => {
  const { id } = useParams<{ id: string }>();
  const [form] = Form.useForm<ZCreateBlueprintDto | ZUpdateBlueprintDto>();
  const navigate = useNavigate();

  const isEditMode = id !== 'new' && id !== undefined;
  const blueprintId: ZId | null = isEditMode ? id : null;

  const blueprintStore = useMemo(() => new BlueprintEditorStore(), []);

  // Загрузка Blueprint при редактировании
  useEffect(() => {
    if (blueprintId) {
      void blueprintStore.loadBlueprint(blueprintId);
    }
  }, [blueprintId, blueprintStore]);

  // Синхронизация формы со стором
  useEffect(() => {
    if (blueprintStore.currentBlueprint) {
      form.setFieldsValue({
        name: blueprintStore.currentBlueprint.name,
        code: blueprintStore.currentBlueprint.code,
        description: blueprintStore.currentBlueprint.description ?? undefined,
      });
    }
  }, [blueprintStore.currentBlueprint, form]);

  /**
   * Сохраняет Blueprint (создание или обновление).
   */
  const handleSave = useCallback(async () => {
    try {
      const values = await form.validateFields();
      if (isEditMode && blueprintId) {
        await blueprintStore.updateBlueprint(blueprintId, values as ZUpdateBlueprintDto);
        message.success('Blueprint обновлён');
      } else {
        const newBlueprint = await blueprintStore.createBlueprint(values as ZCreateBlueprintDto);
        if (newBlueprint) {
          message.success('Blueprint создан');
          navigate(buildUrl(PageUrl.BlueprintsEdit, { id: String(newBlueprint.id) }), {
            replace: true,
          });
        }
      }
    } catch (error) {
      if (error && typeof error === 'object' && 'response' in error) {
        const axiosError = error as Parameters<typeof setFormValidationErrors>[0];
        if (!setFormValidationErrors(axiosError, form)) {
          onError(error);
        }
      } else {
        onError(error);
      }
    }
  }, [form, isEditMode, blueprintId, blueprintStore, navigate]);

  return (
    <div className="min-h-screen bg-background w-full">
      <div className="border-b bg-card w-full">
        <div className="px-6 py-4 w-full">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <span
                className="hover:text-foreground cursor-pointer transition-colors"
                onClick={() => navigate(PageUrl.Blueprints)}
              >
                Blueprint
              </span>
              <span>/</span>
              <span className="text-foreground">
                {isEditMode
                  ? blueprintStore.currentBlueprint?.name || 'Редактирование'
                  : 'Создание'}
              </span>
            </div>
            <div className="flex items-center gap-3">
              {isEditMode && blueprintId && (
                <Link to={buildUrl(PageUrl.BlueprintsSchema, { id: blueprintId })}>
                  <Button>Схема</Button>
                </Link>
              )}
              <Button type="primary" icon={<Save className="w-4 h-4" />} onClick={handleSave}>
                Сохранить
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="p-6">
        <Card className="mb-6">
          <BlueprintForm
            form={form}
            initialValues={
              blueprintStore.currentBlueprint
                ? {
                    name: blueprintStore.currentBlueprint.name,
                    code: blueprintStore.currentBlueprint.code,
                    description: blueprintStore.currentBlueprint.description ?? undefined,
                  }
                : undefined
            }
            isEditMode={isEditMode}
          />
        </Card>
      </div>
    </div>
  );
});

import { createBlueprint } from '@/api/blueprintApi';
import { PageLayout } from '@/components/PageLayout';
import { BlueprintForm } from '@/pages/BlueprintEditorPage/BlueprintForm';
import { buildUrl, PageUrl } from '@/PageUrl';
import { notificationService } from '@/services/notificationService';
import type { ZCreateBlueprintDto } from '@/types/blueprint';
import { onError } from '@/utils/onError';
import { Button, Form } from 'antd';
import { SaveOutlined } from '@ant-design/icons';
import { observer } from 'mobx-react-lite';
import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';

export const BlueprintEditorInnerNew: React.FC = observer(() => {
  const navigate = useNavigate();
  const [form] = Form.useForm<ZCreateBlueprintDto>();

  const handleSave = useCallback(async () => {
    try {
      const values = await form.validateFields();
      const newBlueprint = await createBlueprint(values);
      if (newBlueprint) {
        notificationService.showSuccess({ message: 'Blueprint создан' });
        navigate(buildUrl(PageUrl.BlueprintsEdit, { id: newBlueprint.id }), {
          replace: true,
        });
      }
    } catch (error) {
      onError(error);
    }
  }, [form, navigate]);

  return (
    <PageLayout
      breadcrumbs={[
        { label: 'Blueprint', onClick: () => navigate(PageUrl.Blueprints) },
        'Создание',
      ]}
      extra={
        <Button type="primary" icon={<SaveOutlined />} onClick={handleSave}>
          Создать
        </Button>
      }
    >
      <BlueprintForm form={form} isEditMode={false} />
    </PageLayout>
  );
});

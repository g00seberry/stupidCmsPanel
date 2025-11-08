import { observer } from 'mobx-react-lite';

export const EntriesListPage = observer(() => {
  return (
    <div className="space-y-4">
      <header>
        <h1 className="text-2xl font-semibold text-gray-900">Страницы</h1>
        <p className="text-sm text-gray-600">
          Список материалов CMS. Реализация загрузки данных появится в отдельной задаче.
        </p>
      </header>
      <div className="rounded border border-dashed border-gray-300 bg-white p-6 text-sm text-gray-500">
        Здесь будет таблица записей.
      </div>
    </div>
  );
});

export default EntriesListPage;

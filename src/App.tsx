import LoginPage from '@/pages/LoginPage/LoginPage';
import { routes } from '@/routes';
import { authStore } from '@/AuthStore';
import { observer } from 'mobx-react-lite';
import { useRoutes } from 'react-router-dom';

export const App = observer(() => {
  const element = useRoutes(routes);
  if (!authStore.isAuthenticated) {
    return <LoginPage />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <h1 className="text-2xl font-bold text-gray-900">CMS Admin</h1>
        </div>
      </header>
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">{element}</main>
    </div>
  );
});

export default App;

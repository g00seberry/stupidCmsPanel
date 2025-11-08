import { useRoutes } from 'react-router-dom';
import { routes } from '@/routes';

/**
 * Корневой компонент admin-приложения, отвечающий за маршрутизацию и базовый Layout.
 */
export function App() {
  return useRoutes(routes);
}

export default App;

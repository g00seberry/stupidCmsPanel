import { observer } from 'mobx-react-lite';
import { useLocation, useNavigate } from 'react-router-dom';
import { LoginForm } from '@/components/LoginForm';

type LocationState = {
  returnTo?: string;
};

export const LoginPage = observer(() => {
  const navigate = useNavigate();
  const location = useLocation() as { state?: LocationState };

  const returnTo = location.state?.returnTo ?? '/entries';
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-6">
      <LoginForm onSuccess={() => navigate(returnTo, { replace: true })} />
    </div>
  );
});

export default LoginPage;

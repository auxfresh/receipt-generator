import { LoginForm } from '@/components/auth/login-form';
import { useLocation } from 'wouter';

export default function Login() {
  const [, setLocation] = useLocation();

  const handleSuccess = () => {
    setLocation('/dashboard');
  };

  return <LoginForm onSuccess={handleSuccess} />;
}

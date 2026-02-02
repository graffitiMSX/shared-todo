import { LoginForm } from '@/components/auth/LoginForm';

export default function LoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-green-50 via-blue-50 to-orange-50 px-4 py-12">
      <LoginForm />
    </div>
  );
}

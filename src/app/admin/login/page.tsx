import { LoginForm } from './LoginForm';

export default function AdminLoginPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-6 px-4">
      <h1 className="text-2xl font-bold text-gray-900">INVICSOL Admin</h1>
      <LoginForm />
    </div>
  );
}

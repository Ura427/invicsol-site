import { getTranslations } from 'next-intl/server';
import { getAdminLocale } from '@/shared/lib/admin-locale';
import { Logo } from '@/shared/ui/Logo';
import { LoginForm } from './LoginForm';

export default async function AdminLoginPage() {
  const locale = await getAdminLocale();
  const t = await getTranslations({ locale, namespace: 'Admin.login' });

  return (
    <div className="mx-auto flex min-h-screen max-w-sm flex-col justify-center gap-8 px-4 py-16">
      <div className="flex items-center gap-2.5">
        <Logo size={30} />
        <h1 className="text-navy-800 text-2xl">{t('heading')}</h1>
      </div>
      <LoginForm />
    </div>
  );
}

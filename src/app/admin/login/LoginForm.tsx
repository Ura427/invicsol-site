'use client';

import { useState, type FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { signIn } from 'next-auth/react';
import { TextField } from '@/shared/ui/TextField';
import { Button } from '@/shared/ui/Button';

export function LoginForm() {
  const router = useRouter();
  const t = useTranslations('Admin.login');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setIsSubmitting(true);

    const formData = new FormData(event.currentTarget);
    const result = await signIn('credentials', {
      email: String(formData.get('email') ?? ''),
      password: String(formData.get('password') ?? ''),
      redirect: false,
    });

    setIsSubmitting(false);

    // One message for both a wrong address and a wrong password, on purpose:
    // saying which half was wrong tells an attacker which addresses exist.
    if (!result || result.error) {
      setError(t('invalid'));
      return;
    }

    router.push('/admin');
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <TextField
        id="admin-email"
        name="email"
        type="email"
        label={t('email')}
        required
        autoComplete="email"
      />
      <TextField
        id="admin-password"
        name="password"
        type="password"
        label={t('password')}
        required
        autoComplete="current-password"
      />

      {error ? (
        <p className="text-sm text-red-700" role="alert" aria-live="polite">
          {error}
        </p>
      ) : null}

      <Button type="submit" disabled={isSubmitting} className="w-full">
        {isSubmitting ? t('submitting') : t('submit')}
      </Button>
    </form>
  );
}

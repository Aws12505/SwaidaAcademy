import { Head, usePage } from '@inertiajs/react';
import RegisterForm from '@/components/auth/RegisterForm';
import type { PageProps } from '@/types';
import { useRTL } from '@/hooks/useRTL';

export default function Register() {
  const { locale } = usePage<PageProps>().props;
  const { dir } = useRTL();

  return (
    <>
      <Head title={locale === 'ar' ? 'إنشاء حساب' : 'Register'} />

      <div
        className="min-h-svh flex items-center justify-center bg-gradient-to-br from-primary/5 via-background to-secondary/5 px-4 py-6 sm:py-10 pt:[calc(1.25rem+env(safe-area-inset-top))] pb:[calc(1.25rem+env(safe-area-inset-bottom))]"
        dir={dir}
      >
        <div className="w-full max-w-md container-responsive">
          {/* Logo */}
          <div className="mb-6 sm:mb-8 text-center">
            <img
              src="/logo.svg"
              alt="Logo"
              className="mx-auto h-40 w-40 sm:h-30 sm:w-30 mb-3 sm:mb-4"
            />
            <h2 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              Swaida Academy
            </h2>
          </div>

          <RegisterForm />
        </div>
      </div>
    </>
  );
}

import { FormEventHandler, useState } from 'react';
import { Link, useForm, usePage } from '@inertiajs/react';
import { Mail, Lock, Eye, EyeOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle
} from '@/components/ui/card';
import type { PageProps } from '@/types';
import { useRTL } from '@/hooks/useRTL';

export default function LoginForm() {
  const { locale } = usePage<PageProps>().props;
  const { isRTL } = useRTL();
  const [showPassword, setShowPassword] = useState(false);

  const { data, setData, post, processing, errors } = useForm({
    email: '',
    password: '',
    remember: false,
  });

  const submit: FormEventHandler = (e) => {
    e.preventDefault();
    if (processing) return;
    post('/login');
  };

  return (
    <Card className="w-full max-w-md mx-auto shadow-sm">
      <CardHeader className="space-y-1">
        <CardTitle className="text-xl sm:text-2xl font-bold text-center">
          {locale === 'ar' ? 'تسجيل الدخول' : 'Login'}
        </CardTitle>
        <CardDescription className="text-center text-sm">
          {locale === 'ar'
            ? 'أدخل بريدك الإلكتروني وكلمة المرور للوصول إلى حسابك'
            : 'Enter your email and password to access your account'}
        </CardDescription>
      </CardHeader>

      <form onSubmit={submit} noValidate>
        {/* Increased inner spacing */}
        <CardContent className="space-y-5 sm:space-y-6">
          {/* Email */}
          <div className="space-y-2">
            <Label htmlFor="email">
              {locale === 'ar' ? 'البريد الإلكتروني' : 'Email'}
            </Label>
            <div className="relative">
              <Mail
                className={`absolute ${isRTL ? 'right-3' : 'left-3'} top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground`}
                aria-hidden="true"
              />
              <Input
                id="email"
                type="email"
                inputMode="email"
                autoComplete="email"
                placeholder={locale === 'ar' ? 'example@email.com' : 'example@email.com'}
                value={data.email}
                onChange={(e) => setData('email', e.target.value)}
                className={isRTL ? 'pr-9' : 'pl-9'}
                aria-invalid={!!errors.email}
                aria-describedby={errors.email ? 'email-error' : undefined}
                required
              />
            </div>
            {errors.email && (
              <p id="email-error" className="text-sm text-destructive">{errors.email}</p>
            )}
          </div>

          {/* Password */}
          <div className="space-y-2">
            <Label htmlFor="password">
              {locale === 'ar' ? 'كلمة المرور' : 'Password'}
            </Label>
            <div className="relative">
              <Lock
                className={`absolute ${isRTL ? 'right-3' : 'left-3'} top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground`}
                aria-hidden="true"
              />
              <Input
                id="password"
                type={showPassword ? 'text' : 'password'}
                autoComplete="current-password"
                placeholder="••••••••"
                value={data.password}
                onChange={(e) => setData('password', e.target.value)}
                className={isRTL ? 'pr-9 pl-12' : 'pl-9 pr-12'}
                aria-invalid={!!errors.password}
                aria-describedby={errors.password ? 'password-error' : undefined}
                required
              />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className={`absolute ${isRTL ? 'left-1' : 'right-1'} top-1/2 h-7 w-7 -translate-y-1/2 touch-target`}
                onClick={() => setShowPassword((v) => !v)}
                aria-label={showPassword ? (locale === 'ar' ? 'إخفاء كلمة المرور' : 'Hide password') : (locale === 'ar' ? 'عرض كلمة المرور' : 'Show password')}
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </Button>
            </div>
            {errors.password && (
              <p id="password-error" className="text-sm text-destructive">{errors.password}</p>
            )}
          </div>

          {/* Remember Me */}
          <div className={`flex items-center ${isRTL ? 'space-x-reverse' : ''} space-x-2`}>
            <input
              id="remember"
              type="checkbox"
              checked={data.remember}
              onChange={(e) => setData('remember', e.target.checked)}
              className="h-4 w-4 rounded border-border"
            />
            <Label htmlFor="remember" className="text-sm font-normal cursor-pointer">
              {locale === 'ar' ? 'تذكرني' : 'Remember me'}
            </Label>
          </div>
        </CardContent>

        {/* Extra gap before buttons */}
        <CardFooter className="flex flex-col space-y-5 sm:space-y-6 mt-4 sm:mt-6">
          <Button type="submit" className="w-full touch-target" disabled={processing}>
            {processing
              ? (locale === 'ar' ? 'جاري التسجيل...' : 'Logging in...')
              : (locale === 'ar' ? 'تسجيل الدخول' : 'Login')}
          </Button>

          <div className="text-center text-sm">
            <span className="text-muted-foreground">
              {locale === 'ar' ? 'ليس لديك حساب؟' : "Don't have an account?"}{' '}
            </span>
            <Link
              href={`/${locale}/register`}
              className="font-medium text-primary hover:underline"
            >
              {locale === 'ar' ? 'إنشاء حساب' : 'Sign up'}
            </Link>
          </div>
        </CardFooter>
      </form>
    </Card>
  );
}

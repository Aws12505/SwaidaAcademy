import { FormEventHandler, useState } from 'react';
import { Link, useForm, usePage } from '@inertiajs/react';
import { Mail, Lock, Eye, EyeOff, User, Phone } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle
} from '@/components/ui/card';
import type { PageProps } from '@/types';
import { useRTL } from '@/hooks/useRTL';

export default function RegisterForm() {
  const { locale } = usePage<PageProps>().props;
  const { isRTL } = useRTL();
  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordConfirmation, setShowPasswordConfirmation] = useState(false);

  const { data, setData, post, processing, errors } = useForm({
    name: '',
    email: '',
    whatsapp_number: '',
    password: '',
    password_confirmation: '',
  });

  const submit: FormEventHandler = (e) => {
    e.preventDefault();
    if (processing) return;
    post('/register');
  };

  return (
    <Card className="w-full max-w-md mx-auto shadow-sm">
      <CardHeader className="space-y-1">
        <CardTitle className="text-xl sm:text-2xl font-bold text-center">
          {locale === 'ar' ? 'إنشاء حساب' : 'Create Account'}
        </CardTitle>
        <CardDescription className="text-center text-sm">
          {locale === 'ar'
            ? 'أدخل معلوماتك لإنشاء حساب جديد'
            : 'Enter your information to create a new account'}
        </CardDescription>
      </CardHeader>

      <form onSubmit={submit} noValidate>
        {/* More generous vertical rhythm */}
        <CardContent className="space-y-5 sm:space-y-6">
          {/* Name */}
          <div className="space-y-2">
            <Label htmlFor="name">{locale === 'ar' ? 'الاسم' : 'Name'}</Label>
            <div className="relative">
              <User
                className={`absolute ${isRTL ? 'right-3' : 'left-3'} top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground`}
                aria-hidden="true"
              />
              <Input
                id="name"
                type="text"
                autoComplete="name"
                placeholder={locale === 'ar' ? 'الاسم الكامل' : 'Full Name'}
                value={data.name}
                onChange={(e) => setData('name', e.target.value)}
                className={isRTL ? 'pr-9' : 'pl-9'}
                aria-invalid={!!errors.name}
                aria-describedby={errors.name ? 'name-error' : undefined}
                required
              />
            </div>
            {errors.name && <p id="name-error" className="text-sm text-destructive">{errors.name}</p>}
          </div>

          {/* Email */}
          <div className="space-y-2">
            <Label htmlFor="email">{locale === 'ar' ? 'البريد الإلكتروني' : 'Email'}</Label>
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
                placeholder="example@email.com"
                value={data.email}
                onChange={(e) => setData('email', e.target.value)}
                className={isRTL ? 'pr-9' : 'pl-9'}
                aria-invalid={!!errors.email}
                aria-describedby={errors.email ? 'email-error' : undefined}
                required
              />
            </div>
            {errors.email && <p id="email-error" className="text-sm text-destructive">{errors.email}</p>}
          </div>

          {/* WhatsApp Number */}
          <div className="space-y-2">
            <Label htmlFor="whatsapp_number">
              {locale === 'ar' ? 'رقم الواتساب' : 'WhatsApp Number'}
            </Label>
            <div className="relative">
              <Phone
                className={`absolute ${isRTL ? 'right-3' : 'left-3'} top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground`}
                aria-hidden="true"
              />
              <Input
                id="whatsapp_number"
                type="tel"
                inputMode="tel"
                autoComplete="tel"
                placeholder={locale === 'ar' ? 'مثال: +963 9XX XXX XXX' : 'e.g. +1 234 567 890'}
                value={data.whatsapp_number}
                onChange={(e) => setData('whatsapp_number', e.target.value)}
                className={isRTL ? 'pr-9' : 'pl-9'}
                aria-invalid={!!errors.whatsapp_number}
                aria-describedby={errors.whatsapp_number ? 'wa-error' : undefined}
                required
              />
            </div>
            {errors.whatsapp_number && (
              <p id="wa-error" className="text-sm text-destructive">{errors.whatsapp_number}</p>
            )}
          </div>

          {/* Password */}
          <div className="space-y-2">
            <Label htmlFor="password">{locale === 'ar' ? 'كلمة المرور' : 'Password'}</Label>
            <div className="relative">
              <Lock
                className={`absolute ${isRTL ? 'right-3' : 'left-3'} top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground`}
                aria-hidden="true"
              />
              <Input
                id="password"
                type={showPassword ? 'text' : 'password'}
                autoComplete="new-password"
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
            {errors.password && <p id="password-error" className="text-sm text-destructive">{errors.password}</p>}
          </div>

          {/* Password Confirmation */}
          <div className="space-y-2">
            <Label htmlFor="password_confirmation">
              {locale === 'ar' ? 'تأكيد كلمة المرور' : 'Confirm Password'}
            </Label>
            <div className="relative">
              <Lock
                className={`absolute ${isRTL ? 'right-3' : 'left-3'} top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground`}
                aria-hidden="true"
              />
              <Input
                id="password_confirmation"
                type={showPasswordConfirmation ? 'text' : 'password'}
                autoComplete="new-password"
                placeholder="••••••••"
                value={data.password_confirmation}
                onChange={(e) => setData('password_confirmation', e.target.value)}
                className={isRTL ? 'pr-9 pl-12' : 'pl-9 pr-12'}
                aria-invalid={!!errors.password_confirmation}
                aria-describedby={errors.password_confirmation ? 'password2-error' : undefined}
                required
              />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className={`absolute ${isRTL ? 'left-1' : 'right-1'} top-1/2 h-7 w-7 -translate-y-1/2 touch-target`}
                onClick={() => setShowPasswordConfirmation((v) => !v)}
                aria-label={showPasswordConfirmation ? (locale === 'ar' ? 'إخفاء التأكيد' : 'Hide confirmation') : (locale === 'ar' ? 'عرض التأكيد' : 'Show confirmation')}
              >
                {showPasswordConfirmation ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </Button>
            </div>
            {errors.password_confirmation && (
              <p id="password2-error" className="text-sm text-destructive">{errors.password_confirmation}</p>
            )}
          </div>
        </CardContent>

        {/* Extra vertical gap before buttons */}
        <CardFooter className="flex flex-col space-y-5 sm:space-y-6 mt-4 sm:mt-6">
          <Button type="submit" className="w-full touch-target" disabled={processing}>
            {processing
              ? (locale === 'ar' ? 'جاري الإنشاء...' : 'Creating...')
              : (locale === 'ar' ? 'إنشاء حساب' : 'Create Account')}
          </Button>

          <div className="text-center text-sm">
            <span className="text-muted-foreground">
              {locale === 'ar' ? 'لديك حساب بالفعل؟' : 'Already have an account?'}{' '}
            </span>
            <Link
              href={`/${locale}/login`}
              className="font-medium text-primary hover:underline"
            >
              {locale === 'ar' ? 'تسجيل الدخول' : 'Login'}
            </Link>
          </div>
        </CardFooter>
      </form>
    </Card>
  );
}

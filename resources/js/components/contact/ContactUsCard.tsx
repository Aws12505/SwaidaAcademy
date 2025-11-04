import { useForm, usePage, Link } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useRTL } from '@/hooks/useRTL';
import ScrollReveal from '@/components/motion/ScrollReveal';
import { CheckCircle2, Send } from 'lucide-react';
import type { PageProps } from '@/types';
import { useRef } from 'react';

export default function ContactUsCard() {
  const { locale, flash } = usePage<PageProps>().props as any;
  const { isRTL } = useRTL();

  const formRef = useRef<HTMLFormElement>(null);

  const { data, setData, post, processing, errors, recentlySuccessful, reset } = useForm({
    full_name: '',
    whatsapp_number: '',
    email: '',
    message: '',
  });

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Run native HTML5 validation. If invalid, show the browser messages and stop.
    const form = formRef.current;
    if (form && !form.checkValidity()) {
      form.reportValidity();
      return;
    }

    post(`/${locale}/contact`, {
      preserveScroll: true,
      onSuccess: () => reset(),
    });
  };

  return (
    <ScrollReveal y={12}>
      <Card className="border-2">
        <CardContent className="p-5 sm:p-7 lg:p-8">
          <div className="mb-6 text-center space-y-2">
            <h2 className="text-2xl sm:text-3xl font-bold">
              {locale === 'ar' ? 'تواصل معنا' : 'Contact Us'}
            </h2>
            <p className="text-muted-foreground">
              {locale === 'ar'
                ? 'راسلنا عبر النموذج وسنعود إليك قريبًا'
                : 'Send us a message and we’ll get back to you soon'}
            </p>

            {(recentlySuccessful || flash?.success) && (
              <div className="mx-auto flex w-fit items-center gap-2 rounded-md border p-2 px-3 text-sm">
                <CheckCircle2 className="h-4 w-4" />
                <span>{flash?.success ?? (locale === 'ar' ? 'تم الإرسال بنجاح' : 'Message sent successfully')}</span>
              </div>
            )}
          </div>

          <form ref={formRef} onSubmit={onSubmit} className="grid gap-4 sm:grid-cols-2" noValidate={false}>
            <div className="sm:col-span-1">
              <label className="mb-2 block text-sm font-medium">
                {locale === 'ar' ? 'الاسم الكامل' : 'Full Name'}
              </label>
              <Input
                value={data.full_name}
                onChange={(e) => setData('full_name', e.target.value)}
                placeholder={locale === 'ar' ? 'اكتب اسمك الكامل' : 'Enter your full name'}
                required
                aria-invalid={!!errors.full_name}
              />
              {errors.full_name && <p className="mt-1 text-sm text-destructive">{errors.full_name}</p>}
            </div>

            <div className="sm:col-span-1">
              <label className="mb-2 block text-sm font-medium">
                {locale === 'ar' ? 'رقم واتساب' : 'WhatsApp Number'}
              </label>
              <Input
                type="tel"
                value={data.whatsapp_number}
                onChange={(e) => setData('whatsapp_number', e.target.value)}
                placeholder={locale === 'ar' ? 'رقم واتساب' : 'WhatsApp number'}
                required
                aria-invalid={!!errors.whatsapp_number}
              />
              {errors.whatsapp_number && <p className="mt-1 text-sm text-destructive">{errors.whatsapp_number}</p>}
            </div>

            <div className="sm:col-span-2">
              <label className="mb-2 block text-sm font-medium">
                {locale === 'ar' ? 'البريد الإلكتروني (اختياري)' : 'Email (optional)'}
              </label>
              <Input
                type="email"
                value={data.email}
                onChange={(e) => setData('email', e.target.value)}
                placeholder="example@mail.com"
                // Not required; but if filled, type="email" enforces a valid email format
                aria-invalid={!!errors.email}
              />
              {errors.email && <p className="mt-1 text-sm text-destructive">{errors.email}</p>}
            </div>

            <div className="sm:col-span-2">
              <label className="mb-2 block text-sm font-medium">
                {locale === 'ar' ? 'الرسالة' : 'Message'}
              </label>
              <Textarea
                rows={6}
                value={data.message}
                onChange={(e) => setData('message', e.target.value)}
                placeholder={locale === 'ar' ? 'اكتب رسالتك هنا...' : 'Write your message...'}
                required
                aria-invalid={!!errors.message}
              />
              {errors.message && <p className="mt-1 text-sm text-destructive">{errors.message}</p>}
            </div>

            <div className={`sm:col-span-2 flex ${isRTL ? 'justify-start' : 'justify-end'}`}>
              <Button type="submit" disabled={processing} className="inline-flex items-center gap-2">
                <Send className="h-4 w-4" />
                {processing
                  ? (locale === 'ar' ? 'جارٍ الإرسال...' : 'Sending...')
                  : (locale === 'ar' ? 'إرسال' : 'Send')}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </ScrollReveal>
  );
}

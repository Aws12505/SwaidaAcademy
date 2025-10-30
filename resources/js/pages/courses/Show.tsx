import { Head, Link, usePage, router } from '@inertiajs/react';
import {
  ArrowLeft, ExternalLink, Clock, Award, Target, Building2,
  FolderOpen, Lock, Calendar
} from 'lucide-react';
import AppLayout from '@/components/layout/AppLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import type { PageProps, Course } from '@/types';
import { getLevelBadgeColor, formatDate } from '@/lib/utils';
import { useRTL } from '@/hooks/useRTL';
import ScrollReveal from '@/components/motion/ScrollReveal';

interface CourseShowProps extends PageProps {
  course: Course;
}

export default function CourseShow({ course }: CourseShowProps) {
  const { auth, locale } = usePage<PageProps>().props;
  const isAuthenticated = !!auth.user;
  const { isRTL } = useRTL();

  const handleAccess = () => {
    if (!isAuthenticated) {
      window.location.href = `/${locale}/login`;
      return;
    }
    const win = window.open('about:blank', '_blank');
    router.post(
      `/${locale}/courses/${course.id}/access`,
      {},
      {
        preserveScroll: true,
        onFinish: () => {
          if (win) win.location.href = course.external_url;
          else window.open(course.external_url, '_blank');
        },
      }
    );
  };

  return (
    <AppLayout>
      <Head title={course.title} />

      {/* Back Bar */}
      <ScrollReveal y={6}>
        <div className="border-b bg-muted/30">
          <div className="container-responsive max-w-7xl mx-auto py-3 sm:py-4">
            <Button asChild variant="ghost" size="sm" className="touch-target">
              <Link href={`/${locale}/courses`} className={`inline-flex items-center ${isRTL ? 'flex-row-reverse' : ''} gap-2`}>
                <ArrowLeft className={`h-4 w-4 ${isRTL ? 'rotate-180' : ''}`} />
                {locale === 'ar' ? 'العودة إلى الدورات' : 'Back to Courses'}
              </Link>
            </Button>
          </div>
        </div>
      </ScrollReveal>

      <div className="container-responsive max-w-7xl mx-auto py-8 sm:py-12">
        <div className="grid gap-6 sm:gap-8 lg:grid-cols-[minmax(0,1fr)_360px] xl:grid-cols-[minmax(0,1fr)_400px]">
          {/* Main */}
          <div className="space-y-6 sm:space-y-8">
            {course.cover_image && (
              <ScrollReveal y={12}>
                <div className="aspect-video w-full overflow-hidden rounded-lg shadow-sm">
                  <img src={course.cover_image.image_url} alt={course.title} className="h-full w-full object-cover" />
                </div>
              </ScrollReveal>
            )}

            {/* Title + meta */}
            <ScrollReveal y={8}>
              <div className="space-y-3 sm:space-y-4">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4">
                  <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold">{course.title}</h1>
                  <Badge className={`${getLevelBadgeColor(course.level)} shrink-0`}>
                    {course.level.charAt(0).toUpperCase() + course.level.slice(1)}
                  </Badge>
                </div>
                <div className={`inline-flex items-center ${isRTL ? 'flex-row-reverse' : ''} gap-2 text-xs sm:text-sm text-muted-foreground`}>
                  <Calendar className="h-4 w-4" />
                  <span>{formatDate(course.created_at, locale)}</span>
                </div>
              </div>
            </ScrollReveal>

            <ScrollReveal y={6}>
              <Separator />
            </ScrollReveal>

            {/* Description */}
            <ScrollReveal y={10}>
              <div className="space-y-3 sm:space-y-4">
                <h2 className="text-xl sm:text-2xl font-bold">
                  {locale === 'ar' ? 'الوصف' : 'Description'}
                </h2>
                <div
                  className="prose prose-sm sm:prose-base max-w-none dark:prose-invert"
                  dangerouslySetInnerHTML={{ __html: course.description }}
                />
              </div>
            </ScrollReveal>

            {/* Gallery */}
            {course.images && course.images.length > 1 && (
              <div className="space-y-3 sm:space-y-4">
                <ScrollReveal as="h2" y={8} className="text-xl sm:text-2xl font-bold">
                  {locale === 'ar' ? 'معرض الصور' : 'Image Gallery'}
                </ScrollReveal>
                <div className="grid gap-4 sm:gap-5 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
                  {course.images
                    .filter((img) => !img.is_cover)
                    .map((image, i) => (
                      <ScrollReveal key={image.id} y={12} delay={i * 50}>
                        <div className="aspect-video w-full overflow-hidden rounded-lg shadow-sm">
                          <img src={image.image_url} alt={course.title} className="h-full w-full object-cover" />
                        </div>
                      </ScrollReveal>
                    ))}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <ScrollReveal as="aside" y={8} delay={40} className="space-y-4 sm:space-y-6 lg:sticky lg:top-24 lg:self-start">
            <Card className="border-2 shadow-sm">
              <CardContent className="p-4 sm:p-6 space-y-4">
                <Button className="w-full touch-target" size="lg" onClick={handleAccess}>
                  <span className={`inline-flex items-center justify-center ${isRTL ? 'flex-row-reverse' : ''} gap-2`}>
                    {isAuthenticated ? <ExternalLink className="h-5 w-5" /> : <Lock className="h-5 w-5" />}
                    {isAuthenticated
                      ? (locale === 'ar' ? 'الذهاب إلى الدورة' : 'Go to Course')
                      : (locale === 'ar' ? 'تسجيل الدخول للوصول' : 'Login to Access')}
                  </span>
                </Button>
              </CardContent>
            </Card>

            <ScrollReveal y={8} delay={80}>
              <Card className="shadow-sm">
                <CardContent className="p-4 sm:p-6 space-y-4">
                  <h3 className="font-semibold text-base sm:text-lg">
                    {locale === 'ar' ? 'تفاصيل الدورة' : 'Course Details'}
                  </h3>
                  <Separator />
                  <div className="space-y-4">
                    <DetailRow
                      rtl={isRTL}
                      icon={<Building2 className="h-5 w-5 text-muted-foreground mt-0.5 shrink-0" />}
                      label={locale === 'ar' ? 'المنصة' : 'Platform'}
                      value={course.platform.name}
                    />
                    <DetailRow
                      rtl={isRTL}
                      icon={<FolderOpen className="h-5 w-5 text-muted-foreground mt-0.5 shrink-0" />}
                      label={locale === 'ar' ? 'الفئة' : 'Category'}
                      value={course.category.name}
                    />
                    <DetailRow
                      rtl={isRTL}
                      icon={<Target className="h-5 w-5 text-muted-foreground mt-0.5 shrink-0" />}
                      label={locale === 'ar' ? 'المستوى' : 'Level'}
                      value={<span className="capitalize">{course.level}</span>}
                    />
                    {course.duration && (
                      <DetailRow
                        rtl={isRTL}
                        icon={<Clock className="h-5 w-5 text-muted-foreground mt-0.5 shrink-0" />}
                        label={locale === 'ar' ? 'المدة' : 'Duration'}
                        value={course.duration}
                      />
                    )}
                    <DetailRow
                      rtl={isRTL}
                      icon={<Award className="h-5 w-5 text-muted-foreground mt-0.5 shrink-0" />}
                      label={locale === 'ar' ? 'الشهادة' : 'Certificate'}
                      value={course.have_certificate
                        ? (locale === 'ar' ? 'متاح' : 'Available')
                        : (locale === 'ar' ? 'غير متاح' : 'Not Available')}
                    />
                  </div>
                </CardContent>
              </Card>
            </ScrollReveal>
          </ScrollReveal>
        </div>
      </div>
    </AppLayout>
  );
}

function DetailRow({
  rtl, icon, label, value,
}: { rtl: boolean; icon: React.ReactNode; label: string; value: React.ReactNode; }) {
  return (
    <div className={`flex items-start ${rtl ? 'flex-row-reverse text-right' : 'text-left'} gap-3`}>
      {icon}
      <div>
        <p className="text-sm font-medium text-muted-foreground">{label}</p>
        <p className="font-medium text-sm sm:text-base">{value}</p>
      </div>
    </div>
  );
}

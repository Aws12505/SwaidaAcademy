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
import type { PageProps, Scholarship } from '@/types';
import { getLevelBadgeColor, formatDate } from '@/lib/utils';
import { useRTL } from '@/hooks/useRTL';

interface ScholarshipShowProps extends PageProps {
  scholarship: Scholarship;
}

export default function ScholarshipShow({ scholarship }: ScholarshipShowProps) {
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
      `/${locale}/scholarships/${scholarship.id}/access`,
      {},
      {
        preserveScroll: true,
        onFinish: () => {
          if (win) win.location.href = scholarship.external_url;
          else window.open(scholarship.external_url, '_blank');
        },
      }
    );
  };

  return (
    <AppLayout>
      <Head title={scholarship.title} />

      {/* Back bar */}
      <div className="border-b bg-muted/30">
        <div className="container-responsive max-w-7xl mx-auto py-3 sm:py-4">
          <Button asChild variant="ghost" size="sm" className="touch-target">
            <Link href={`/${locale}/scholarships`} className={`inline-flex items-center ${isRTL ? 'flex-row-reverse' : ''} gap-2`}>
              <ArrowLeft className={`h-4 w-4 ${isRTL ? 'rotate-180' : ''}`} />
              {locale === 'ar' ? 'العودة إلى المنح' : 'Back to Scholarships'}
            </Link>
          </Button>
        </div>
      </div>

      <div className="container-responsive max-w-7xl mx-auto py-8 sm:py-12">
        <div className="grid gap-6 sm:gap-8 lg:grid-cols-[minmax(0,1fr)_360px] xl:grid-cols-[minmax(0,1fr)_400px]">
          {/* Main */}
          <div className="space-y-6 sm:space-y-8">
            {/* Cover */}
            {scholarship.cover_image && (
              <div className="aspect-video w-full overflow-hidden rounded-lg shadow-sm">
                <img
                  src={scholarship.cover_image.image_url}
                  alt={scholarship.title}
                  className="h-full w-full object-cover"
                />
              </div>
            )}

            {/* Title + meta */}
            <div className="space-y-3 sm:space-y-4">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4">
                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold">{scholarship.title}</h1>
                <Badge className={`${getLevelBadgeColor(scholarship.level)} shrink-0`}>
                  {scholarship.level.charAt(0).toUpperCase() + scholarship.level.slice(1)}
                </Badge>
              </div>
              <div className={`inline-flex items-center ${isRTL ? 'flex-row-reverse' : ''} gap-2 text-xs sm:text-sm text-muted-foreground`}>
                <Calendar className="h-4 w-4" />
                <span>{formatDate(scholarship.created_at, locale)}</span>
              </div>
            </div>

            <Separator />

            {/* Description */}
            <div className="space-y-3 sm:space-y-4">
              <h2 className="text-xl sm:text-2xl font-bold">
                {locale === 'ar' ? 'الوصف' : 'Description'}
              </h2>
              <div
                className="prose prose-sm sm:prose-base max-w-none dark:prose-invert"
                dangerouslySetInnerHTML={{ __html: scholarship.description }}
              />
            </div>

            {/* Gallery */}
            {scholarship.images && scholarship.images.length > 1 && (
              <div className="space-y-3 sm:space-y-4">
                <h2 className="text-xl sm:text-2xl font-bold">
                  {locale === 'ar' ? 'معرض الصور' : 'Image Gallery'}
                </h2>
                <div className="grid gap-4 sm:gap-5 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
                  {scholarship.images
                    .filter((img) => !img.is_cover)
                    .map((image) => (
                      <div key={image.id} className="aspect-video w-full overflow-hidden rounded-lg shadow-sm">
                        <img
                          src={image.image_url}
                          alt={scholarship.title}
                          className="h-full w-full object-cover"
                        />
                      </div>
                    ))}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <aside className="space-y-4 sm:space-y-6 lg:sticky lg:top-24 lg:self-start">
            {/* Access */}
            <Card className="border-2 shadow-sm">
              <CardContent className="p-4 sm:p-6 space-y-4">
                <Button className="w-full touch-target" size="lg" onClick={handleAccess}>
                  <span className={`inline-flex items-center justify-center ${isRTL ? 'flex-row-reverse' : ''} gap-2`}>
                    {isAuthenticated ? <ExternalLink className="h-5 w-5" /> : <Lock className="h-5 w-5" />}
                    {isAuthenticated
                      ? (locale === 'ar' ? 'الذهاب إلى المنحة' : 'Go to Scholarship')
                      : (locale === 'ar' ? 'تسجيل الدخول للوصول' : 'Login to Access')}
                  </span>
                </Button>
              </CardContent>
            </Card>

            {/* Details */}
            <Card className="shadow-sm">
              <CardContent className="p-4 sm:p-6 space-y-4">
                <h3 className="font-semibold text-base sm:text-lg">
                  {locale === 'ar' ? 'تفاصيل المنحة' : 'Scholarship Details'}
                </h3>
                <Separator />
                <div className="space-y-4">
                  <DetailRow
                    rtl={isRTL}
                    icon={<Building2 className="h-5 w-5 text-muted-foreground mt-0.5 shrink-0" />}
                    label={locale === 'ar' ? 'المؤسسة' : 'Institution'}
                    value={scholarship.platform.name}
                  />
                  <DetailRow
                    rtl={isRTL}
                    icon={<FolderOpen className="h-5 w-5 text-muted-foreground mt-0.5 shrink-0" />}
                    label={locale === 'ar' ? 'الفئة' : 'Category'}
                    value={scholarship.category.name}
                  />
                  <DetailRow
                    rtl={isRTL}
                    icon={<Target className="h-5 w-5 text-muted-foreground mt-0.5 shrink-0" />}
                    label={locale === 'ar' ? 'المستوى' : 'Level'}
                    value={<span className="capitalize">{scholarship.level}</span>}
                  />
                  {scholarship.duration && (
                    <DetailRow
                      rtl={isRTL}
                      icon={<Clock className="h-5 w-5 text-muted-foreground mt-0.5 shrink-0" />}
                      label={locale === 'ar' ? 'المدة' : 'Duration'}
                      value={scholarship.duration}
                    />
                  )}
                  <DetailRow
                    rtl={isRTL}
                    icon={<Award className="h-5 w-5 text-muted-foreground mt-0.5 shrink-0" />}
                    label={locale === 'ar' ? 'الشهادة' : 'Certificate'}
                    value={scholarship.have_certificate
                      ? (locale === 'ar' ? 'متاح' : 'Available')
                      : (locale === 'ar' ? 'غير متاح' : 'Not Available')}
                  />
                </div>
              </CardContent>
            </Card>
          </aside>
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

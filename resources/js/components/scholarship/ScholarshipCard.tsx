import { Link, usePage, router } from '@inertiajs/react';
import { ExternalLink, Clock, Award, Lock } from 'lucide-react';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import type { Scholarship, PageProps } from '@/types';
import { getLevelBadgeColor, stripHtml, truncateText } from '@/lib/utils';
import { useRTL } from '@/hooks/useRTL';

interface ScholarshipCardProps {
  scholarship: Scholarship;
}

export default function ScholarshipCard({ scholarship }: ScholarshipCardProps) {
  const { auth, locale } = usePage<PageProps>().props;
  const isAuthenticated = !!auth.user;
  const { isRTL } = useRTL();

  const handleAccess = (e: React.MouseEvent) => {
    if (!isAuthenticated) {
      e.preventDefault();
      window.location.href = `/${locale}/login`;
      return;
    }
    e.preventDefault();
    const win = window.open('about:blank', '_blank');
    router.post(
      `/${locale}/scholarships/${scholarship.id}/access`,
      {},
      {
        preserveScroll: true,
        onFinish: () => {
          if (win) {
            win.location.href = scholarship.external_url;
          } else {
            window.open(scholarship.external_url, '_blank');
          }
        },
      }
    );
  };

  return (
    <Card className="group overflow-hidden transition-shadow hover:shadow-lg flex flex-col h-full">
      <Link href={`/${locale}/scholarships/${scholarship.id}`}>
        <CardHeader className="p-0">
          <div className="relative aspect-video w-full overflow-hidden bg-muted">
            {scholarship.cover_image ? (
              <img
                src={scholarship.cover_image.image_url}
                alt={scholarship.title}
                className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-secondary/10 to-primary/10">
                <Award className="h-12 w-12 sm:h-16 sm:w-16 text-muted-foreground" />
              </div>
            )}
            <Badge className={`absolute top-2 sm:top-3 ${isRTL ? 'left-2 sm:left-3' : 'right-2 sm:right-3'} ${getLevelBadgeColor(scholarship.level)} text-xs`}>
              {scholarship.level.charAt(0).toUpperCase() + scholarship.level.slice(1)}
            </Badge>
          </div>
        </CardHeader>
      </Link>

      <CardContent className="p-4 sm:p-5 space-y-2.5 sm:space-y-3 flex-1">
        <Link href={`/${locale}/scholarships/${scholarship.id}`}>
          <h3 className="font-semibold text-base sm:text-lg line-clamp-2 transition-colors group-hover:text-primary">
            {scholarship.title}
          </h3>
        </Link>

        <p className="text-xs sm:text-sm text-muted-foreground line-clamp-2">
          {truncateText(stripHtml(scholarship.description), 100)}
        </p>

        <div className="flex flex-wrap gap-1.5 sm:gap-2">
          <Badge variant="outline" className="text-xs">{scholarship.platform.name}</Badge>
          <Badge variant="outline" className="text-xs">{scholarship.category.name}</Badge>
        </div>

        <div className={`flex items-center ${isRTL ? 'flex-row-reverse' : ''} gap-4 text-xs sm:text-sm text-muted-foreground`}>
          {scholarship.duration && (
            <span className={`inline-flex items-center ${isRTL ? 'flex-row-reverse' : ''} gap-1`}>
              <Clock className="h-4 w-4" />
              {scholarship.duration}
            </span>
          )}
          {scholarship.have_certificate && (
            <span className={`inline-flex items-center ${isRTL ? 'flex-row-reverse' : ''} gap-1`}>
              <Award className="h-4 w-4" />
              {locale === 'ar' ? 'شهادة' : 'Certificate'}
            </span>
          )}
        </div>
      </CardContent>

      <CardFooter className="p-4 sm:p-5 pt-0">
        <Button className="w-full text-sm touch-target" size="sm" onClick={handleAccess}>
          <span className={`inline-flex items-center justify-center ${isRTL ? 'flex-row-reverse' : ''} gap-2`}>
            {isAuthenticated ? <ExternalLink className="h-4 w-4" /> : <Lock className="h-4 w-4" />}
            {isAuthenticated
              ? (locale === 'ar' ? 'الذهاب إلى المنحة' : 'Go to Scholarship')
              : (locale === 'ar' ? 'تسجيل الدخول للوصول' : 'Login to Access')}
          </span>
        </Button>
      </CardFooter>
    </Card>
  );
}

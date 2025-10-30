import { Link, usePage, router } from '@inertiajs/react';
import { ExternalLink, Clock, Award, TrendingUp, Lock } from 'lucide-react';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import type { Course, PageProps } from '@/types';
import { getLevelBadgeColor, stripHtml, truncateText } from '@/lib/utils';
import { useRTL } from '@/hooks/useRTL';

interface CourseCardProps {
  course: Course;
}

export default function CourseCard({ course }: CourseCardProps) {
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
      `/${locale}/courses/${course.id}/access`,
      {},
      {
        preserveScroll: true,
        onFinish: () => {
          if (win) {
            win.location.href = course.external_url;
          } else {
            window.open(course.external_url, '_blank');
          }
        },
      }
    );
  };

  return (
    <Card className="group overflow-hidden transition-shadow hover:shadow-lg flex flex-col h-full">
      <Link href={`/${locale}/courses/${course.id}`}>
        <CardHeader className="p-0">
          <div className="relative aspect-video w-full overflow-hidden bg-muted">
            {course.cover_image ? (
              <img
                src={course.cover_image.image_url}
                alt={course.title}
                className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-primary/10 to-secondary/10">
                <TrendingUp className="h-12 w-12 sm:h-16 sm:w-16 text-muted-foreground" />
              </div>
            )}
            <Badge className={`absolute top-2 sm:top-3 ${isRTL ? 'left-2 sm:left-3' : 'right-2 sm:right-3'} ${getLevelBadgeColor(course.level)} text-xs`}>
              {course.level.charAt(0).toUpperCase() + course.level.slice(1)}
            </Badge>
          </div>
        </CardHeader>
      </Link>

      <CardContent className="p-4 sm:p-5 space-y-2.5 sm:space-y-3 flex-1">
        <Link href={`/${locale}/courses/${course.id}`}>
          <h3 className="font-semibold text-base sm:text-lg line-clamp-2 transition-colors group-hover:text-primary">
            {course.title}
          </h3>
        </Link>

        <p className="text-xs sm:text-sm text-muted-foreground line-clamp-2">
          {truncateText(stripHtml(course.description), 100)}
        </p>

        <div className="flex flex-wrap gap-1.5 sm:gap-2">
          <Badge variant="outline" className="text-xs">{course.platform.name}</Badge>
          <Badge variant="outline" className="text-xs">{course.category.name}</Badge>
        </div>

        <div className={`flex items-center ${isRTL ? 'flex-row-reverse' : ''} gap-4 text-xs sm:text-sm text-muted-foreground`}>
          {course.duration && (
            <span className={`inline-flex items-center ${isRTL ? 'flex-row-reverse' : ''} gap-1`}>
              <Clock className="h-4 w-4" />
              {course.duration}
            </span>
          )}
          {course.have_certificate && (
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
              ? (locale === 'ar' ? 'الذهاب إلى الدورة' : 'Go to Course')
              : (locale === 'ar' ? 'تسجيل الدخول للوصول' : 'Login to Access')}
          </span>
        </Button>
      </CardFooter>
    </Card>
  );
}

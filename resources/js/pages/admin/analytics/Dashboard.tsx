import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem, PageProps } from '@/types';
import { Head, Link, usePage } from '@inertiajs/react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { BarChart3, GraduationCap, Award, Users } from 'lucide-react';

const breadcrumbs: BreadcrumbItem[] = [
  { title: 'Dashboard', href: '/admin/dashboard' },
];

interface DashboardProps extends PageProps {
  stats: {
    from: string;
    to: string;
    course_accesses: number;
    scholarship_accesses: number;
    new_users: number;
  };
}

export default function Dashboard({ stats }: DashboardProps) {
  const { locale } = usePage<PageProps>().props;

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Dashboard" />
      <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4 overflow-x-auto">
        <div className="grid auto-rows-min gap-4 md:grid-cols-3">
          {/* Courses Accessed */}
          <Card className="relative overflow-hidden border border-sidebar-border/70 dark:border-sidebar-border">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <GraduationCap className="h-4 w-4" />
                {locale === 'ar' ? 'الوصول إلى الدورات (30 يومًا)' : 'Course Accesses (30 days)'}
              </CardTitle>
              <BarChart3 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{stats.course_accesses}</div>
              <p className="text-xs text-muted-foreground mt-1">
                {locale === 'ar' ? 'من' : 'From'} {stats.from} {locale === 'ar' ? 'إلى' : 'to'} {stats.to}
              </p>
              <div className="mt-4">
                <Button asChild size="sm" variant="outline">
                  <Link href={`/admin/analytics?type=courses`}>
                    {locale === 'ar' ? 'تحليلات مفصلة' : 'View analytics'}
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Scholarships Accessed */}
          <Card className="relative overflow-hidden border border-sidebar-border/70 dark:border-sidebar-border">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <Award className="h-4 w-4" />
                {locale === 'ar' ? 'الوصول إلى المنح (30 يومًا)' : 'Scholarship Accesses (30 days)'}
              </CardTitle>
              <BarChart3 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{stats.scholarship_accesses}</div>
              <p className="text-xs text-muted-foreground mt-1">
                {locale === 'ar' ? 'من' : 'From'} {stats.from} {locale === 'ar' ? 'إلى' : 'to'} {stats.to}
              </p>
              <div className="mt-4">
                <Button asChild size="sm" variant="outline">
                  <Link href={`/admin/analytics?type=scholarships`}>
                    {locale === 'ar' ? 'تحليلات مفصلة' : 'View analytics'}
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Registered Users */}
          <Card className="relative overflow-hidden border border-sidebar-border/70 dark:border-sidebar-border">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <Users className="h-4 w-4" />
                {locale === 'ar' ? 'المستخدمون المسجلون (30 يومًا)' : 'Registered Users (30 days)'}
              </CardTitle>
              <BarChart3 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{stats.new_users}</div>
              <p className="text-xs text-muted-foreground mt-1">
                {locale === 'ar' ? 'من' : 'From'} {stats.from} {locale === 'ar' ? 'إلى' : 'to'} {stats.to}
              </p>
              <div className="mt-4">
                <Button asChild size="sm" variant="outline">
                  <Link href={`/admin/analytics?type=users`}>
                    {locale === 'ar' ? 'تحليلات مفصلة' : 'View analytics'}
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Space for future charts/overview */}
        <div className="relative min-h-[40vh] flex-1 overflow-hidden rounded-xl border border-sidebar-border/70 md:min-h-min dark:border-sidebar-border p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">
              {locale === 'ar' ? 'نظرة عامة' : 'Overview'}
            </h3>
            <Button asChild size="sm" variant="secondary">
              <Link href="/admin/analytics">
                {locale === 'ar' ? 'افتح التحليلات الكاملة' : 'Open full analytics'}
              </Link>
            </Button>
          </div>
          <p className="text-sm text-muted-foreground">
            {locale === 'ar'
              ? 'راجع تفاصيل التفاعل من خلال التحليلات الكاملة، بما في ذلك التصفية حسب الوقت والبحث والفرز.'
              : 'Review detailed engagement in full analytics, including time filtering, search, and sorting.'}
          </p>
        </div>
      </div>
    </AppLayout>
  );
}

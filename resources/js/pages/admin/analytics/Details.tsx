import AppLayout from '@/layouts/app-layout';
import { Head, Link, router, usePage } from '@inertiajs/react';
import type { BreadcrumbItem, PageProps } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useEffect, useMemo, useState } from 'react';
import { Calendar, Search, ExternalLink, Eye } from 'lucide-react';

type AnalyticsItem = {
  id: number;
  created_at: string;
  user_id?: number;
  user_name?: string;
  user_email?: string;
  item_id?: number;
  title_en?: string | null;
  title_ar?: string | null;
};

interface DetailsProps extends PageProps {
  type: 'courses' | 'scholarships' | 'users';
  items: {
    data: AnalyticsItem[];
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
    links: { url: string | null; label: string; active: boolean }[];
  };
  filters: {
    q?: string;
    sort_by?: string;
    sort_dir?: 'asc' | 'desc';
    date_from?: string | null;
    date_to?: string | null;
  };
}

const breadcrumbs: BreadcrumbItem[] = [
  { title: 'Dashboard', href: '/admin/dashboard' },
  { title: 'Analytics', href: '/admin/analytics' },
];

export default function Details({ type, items, filters }: DetailsProps) {
  const { locale } = usePage<PageProps>().props;

  const [currentType, setCurrentType] = useState<'courses' | 'scholarships' | 'users'>(type);
  const [q, setQ] = useState(filters.q ?? '');
  const [sortBy, setSortBy] = useState(filters.sort_by ?? 'created_at');
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>((filters.sort_dir as any) ?? 'desc');
  const [dateFrom, setDateFrom] = useState(filters.date_from ?? '');
  const [dateTo, setDateTo] = useState(filters.date_to ?? '');

  // Keep URL in sync (GET)
  const reload = () => {
    router.get(
      '/admin/analytics',
      {
        type: currentType,
        q: q || undefined,
        sort_by: sortBy,
        sort_dir: sortDir,
        date_from: dateFrom || undefined,
        date_to: dateTo || undefined,
      },
      { preserveScroll: true, preserveState: true, replace: true }
    );
  };

  useEffect(() => {
    // when type tab changes, fetch fresh
    reload();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentType]);

  const titleLabel = useMemo(
    () => (locale === 'ar' ? 'العنوان' : 'Title'),
    [locale]
  );

  const createdLabel = locale === 'ar' ? 'التاريخ' : 'Date';
  const userLabel = locale === 'ar' ? 'المستخدم' : 'User';
  const actionsLabel = locale === 'ar' ? 'الإجراءات' : 'Actions';

  const showTitle = (row: AnalyticsItem) => {
    // Prefer Arabic when locale=ar
    if (locale === 'ar') {
      return row.title_ar || row.title_en || '-';
    }
    return row.title_en || row.title_ar || '-';
    }

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title={locale === 'ar' ? 'التحليلات' : 'Analytics'} />

      <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4 overflow-x-auto">
        <Card>
          <CardHeader>
            <CardTitle>{locale === 'ar' ? 'تحليلات تفصيلية' : 'Detailed Analytics'}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Type Tabs */}
            <Tabs value={currentType} onValueChange={(v) => setCurrentType(v as any)}>
              <TabsList className="grid grid-cols-3 w-full">
                <TabsTrigger value="courses">{locale === 'ar' ? 'الدورات' : 'Courses'}</TabsTrigger>
                <TabsTrigger value="scholarships">{locale === 'ar' ? 'المنح' : 'Scholarships'}</TabsTrigger>
                <TabsTrigger value="users">{locale === 'ar' ? 'المستخدمون' : 'Users'}</TabsTrigger>
              </TabsList>
            </Tabs>

            {/* Filters */}
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
              <div className="sm:col-span-2">
                <Label htmlFor="q">{locale === 'ar' ? 'بحث' : 'Search'}</Label>
                <div className="relative mt-2">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="q"
                    value={q}
                    onChange={(e) => setQ(e.target.value)}
                    placeholder={locale === 'ar' ? 'ابحث بالعنوان أو المستخدم' : 'Search by title or user'}
                    className="pl-9"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="date_from">{locale === 'ar' ? 'من تاريخ' : 'From'}</Label>
                <div className="relative mt-2">
                  <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input id="date_from" type="date" value={dateFrom || ''} onChange={(e) => setDateFrom(e.target.value)} className="pl-9" />
                </div>
              </div>

              <div>
                <Label htmlFor="date_to">{locale === 'ar' ? 'إلى تاريخ' : 'To'}</Label>
                <div className="relative mt-2">
                  <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input id="date_to" type="date" value={dateTo || ''} onChange={(e) => setDateTo(e.target.value)} className="pl-9" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <Label>{locale === 'ar' ? 'الترتيب حسب' : 'Sort By'}</Label>
                  <Select value={sortBy} onValueChange={(v) => setSortBy(v)}>
                    <SelectTrigger className="mt-2">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="created_at">{locale === 'ar' ? 'التاريخ' : 'Date'}</SelectItem>
                      <SelectItem value="user_name">{locale === 'ar' ? 'المستخدم' : 'User'}</SelectItem>
                      <SelectItem value="title">{locale === 'ar' ? 'العنوان' : 'Title'}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>{locale === 'ar' ? 'الاتجاه' : 'Direction'}</Label>
                  <Select value={sortDir} onValueChange={(v) => setSortDir(v as 'asc' | 'desc')}>
                    <SelectTrigger className="mt-2">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="desc">{locale === 'ar' ? 'تنازلي' : 'Desc'}</SelectItem>
                      <SelectItem value="asc">{locale === 'ar' ? 'تصاعدي' : 'Asc'}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => { setQ(''); setDateFrom(''); setDateTo(''); setSortBy('created_at'); setSortDir('desc'); }}>
                {locale === 'ar' ? 'إعادة تعيين' : 'Reset'}
              </Button>
              <Button onClick={reload}>
                {locale === 'ar' ? 'تطبيق' : 'Apply'}
              </Button>
            </div>

            {/* Results Table */}
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>{createdLabel}</TableHead>
                    {currentType !== 'users' && <TableHead>{titleLabel}</TableHead>}
                    {currentType !== 'users' && <TableHead>{userLabel}</TableHead>}
                    {currentType === 'users' && <TableHead>{locale === 'ar' ? 'الاسم' : 'Name'}</TableHead>}
                    {currentType === 'users' && <TableHead>Email</TableHead>}
                    <TableHead className="text-right">{actionsLabel}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {items.data.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                        {locale === 'ar' ? 'لا توجد بيانات' : 'No data'}
                      </TableCell>
                    </TableRow>
                  ) : (
                    items.data.map((row) => (
                      <TableRow key={row.id}>
                        <TableCell className="whitespace-nowrap text-sm">{new Date(row.created_at).toLocaleString()}</TableCell>

                        {currentType !== 'users' && (
                          <TableCell className="max-w-[300px] truncate">
                            {showTitle(row)}
                          </TableCell>
                        )}

                        {currentType !== 'users' && (
                          <TableCell className="max-w-[260px] truncate">
                            {row.user_name} <span className="text-muted-foreground text-xs">({row.user_email})</span>
                          </TableCell>
                        )}

                        {currentType === 'users' && (
                          <>
                            <TableCell className="max-w-[260px] truncate">{(row as any).name ?? '-'}</TableCell>
                            <TableCell className="max-w-[260px] truncate">{(row as any).email ?? '-'}</TableCell>
                          </>
                        )}

                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            {/* View item (course/scholarship/user) */}
                            {currentType === 'courses' && row.item_id && (
                              <Button asChild variant="ghost" size="icon" title="Open Course">
                                <Link href={`/admin/courses/${row.item_id}`}>
                                  <Eye className="h-4 w-4" />
                                </Link>
                              </Button>
                            )}
                            {currentType === 'scholarships' && row.item_id && (
                              <Button asChild variant="ghost" size="icon" title="Open Scholarship">
                                <Link href={`/admin/scholarships/${row.item_id}`}>
                                  <Eye className="h-4 w-4" />
                                </Link>
                              </Button>
                            )}
                            {currentType === 'users' && (
                              <Button asChild variant="ghost" size="icon" title="Open User">
                                <Link href={`/admin/users/${(row as any).id}`}>
                                  <Eye className="h-4 w-4" />
                                </Link>
                              </Button>
                            )}

                            {/* Open public page if applicable (optional quick link) */}
                            {currentType !== 'users' && row.item_id && (
                              <Button asChild variant="outline" size="sm">
                                <Link href={
                                  currentType === 'courses'
                                    ? `/admin/courses/${row.item_id}`
                                    : `/admin/scholarships/${row.item_id}`
                                }>
                                  <ExternalLink className="h-4 w-4 mr-2" />
                                  {locale === 'ar' ? 'عرض' : 'Show'}
                                </Link>
                              </Button>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>

            {/* Pagination */}
            {items.last_page > 1 && (
              <div className="flex justify-center gap-2">
                {items.links.map((link, idx) => (
                  <Button
                    key={idx}
                    variant={link.active ? 'default' : 'outline'}
                    size="sm"
                    disabled={!link.url}
                    asChild={!!link.url}
                  >
                    {link.url ? (
                      <a href={link.url} dangerouslySetInnerHTML={{ __html: link.label }} />
                    ) : (
                      <span dangerouslySetInnerHTML={{ __html: link.label }} />
                    )}
                  </Button>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}

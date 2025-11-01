import { Head, Link } from '@inertiajs/react';
import { ArrowLeft, Pencil } from 'lucide-react';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import type { BreadcrumbItem } from '@/types';

type Translatable = string | { en?: string; ar?: string };

interface ShowCategoryProps {
  category: {
    id: number;
    name: Translatable;
    courses_count?: number;
    scholarships_count?: number;
  };
}

const breadcrumbs: BreadcrumbItem[] = [
  { title: 'Dashboard', href: '/admin/dashboard' },
  { title: 'Categories', href: '/admin/categories' },
  { title: 'View', href: '#' },
];

const isObj = (v: unknown): v is Record<string, any> =>
  v !== null && typeof v === 'object' && !Array.isArray(v);

export default function ShowCategory({ category }: ShowCategoryProps) {
  const nameEn = isObj(category.name) ? (category.name.en ?? '') : (category.name ?? '');
  const nameAr = isObj(category.name) ? (category.name.ar ?? '') : '';
  const headTitle = nameEn || nameAr || 'Category';

  const coursesCount = category.courses_count ?? 0;
  const scholarshipsCount = category.scholarships_count ?? 0;

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title={headTitle} />

      <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4 overflow-x-auto">
        <div className="relative min-h-[100vh] flex-1 rounded-xl border border-sidebar-border/70 md:min-h-min dark:border-sidebar-border">
          <div className="p-6">
            {/* Header */}
            <div className="mb-6 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Button asChild variant="outline" size="icon">
                  <Link href="/admin/categories">
                    <ArrowLeft className="h-4 w-4" />
                  </Link>
                </Button>
                <div>
                  <h2 className="text-2xl font-bold">Category Details</h2>
                  <p className="text-muted-foreground">View category information</p>
                </div>
              </div>
              <Button asChild>
                <Link href={`/admin/categories/${category.id}/edit`}>
                  <Pencil className="mr-2 h-4 w-4" />
                  Edit
                </Link>
              </Button>
            </div>

            <div className="max-w-2xl">
              <Card>
                <CardHeader>
                  <CardTitle>Category Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">ID</p>
                    <p className="text-sm font-semibold">{category.id}</p>
                  </div>

                  <Separator />

                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Name</p>

                    <Tabs defaultValue={nameEn ? 'en' : 'ar'} className="mt-2">
                      <TabsList className="grid w-full max-w-xs grid-cols-2">
                        <TabsTrigger value="en">English</TabsTrigger>
                        <TabsTrigger value="ar">العربية</TabsTrigger>
                      </TabsList>

                      <TabsContent value="en">
                        <p className="text-lg font-semibold">{nameEn || '—'}</p>
                      </TabsContent>

                      <TabsContent value="ar">
                        <p className="text-lg font-semibold" dir="rtl">{nameAr || '—'}</p>
                      </TabsContent>
                    </Tabs>
                  </div>

                  <Separator />

                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Associated Items</p>
                    <div className="mt-2 space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span>Courses</span>
                        <span className="font-semibold">{coursesCount}</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span>Scholarships</span>
                        <span className="font-semibold">{scholarshipsCount}</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}

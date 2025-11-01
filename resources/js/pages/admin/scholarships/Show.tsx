// resources/js/pages/admin/scholarships/Show.tsx
import { Head, Link } from '@inertiajs/react';
import { ArrowLeft, Pencil, ExternalLink, Calendar } from 'lucide-react';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import type { BreadcrumbItem } from '@/types';
import type { Scholarship } from '@/types';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { getLevelBadgeColor, formatDate } from '@/lib/utils';

type Translatable = string | { en?: string; ar?: string };

interface ShowScholarshipSafe extends Omit<Scholarship, 'title' | 'description' | 'platform' | 'category'> {
  title: Translatable;
  description: Translatable;
  platform: { id: number; name: Translatable };
  category: { id: number; name: Translatable };
}

interface ShowScholarshipProps {
  scholarship: ShowScholarshipSafe;
}

const breadcrumbs: BreadcrumbItem[] = [
  { title: 'Dashboard', href: '/admin/dashboard' },
  { title: 'Scholarships', href: '/admin/scholarships' },
  { title: 'View', href: '#' },
];

const isObj = (v: unknown): v is Record<string, any> =>
  v !== null && typeof v === 'object' && !Array.isArray(v);

const pickStr = (v: Translatable, pref: 'en' | 'ar' = 'en') =>
  isObj(v) ? (v[pref] ?? v.en ?? v.ar ?? '') : (v ?? '');

export default function ShowScholarship({ scholarship }: ShowScholarshipProps) {
  // Normalize all possibly-translatable fields
  const titleEn = pickStr(scholarship.title, 'en');
  const titleAr = pickStr(scholarship.title, 'ar');
  const descEn  = pickStr(scholarship.description, 'en');
  const descAr  = pickStr(scholarship.description, 'ar');

  const platformNameEn = pickStr(scholarship.platform?.name ?? '', 'en');
  const platformNameAr = pickStr(scholarship.platform?.name ?? '', 'ar');
  const platformName   = platformNameEn || platformNameAr || '—';

  const categoryNameEn = pickStr(scholarship.category?.name ?? '', 'en');
  const categoryNameAr = pickStr(scholarship.category?.name ?? '', 'ar');
  const categoryName   = categoryNameEn || categoryNameAr || '—';

  const headTitle = titleEn || titleAr || 'Scholarship';

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
                  <Link href="/admin/scholarships">
                    <ArrowLeft className="h-4 w-4" />
                  </Link>
                </Button>
                <div>
                  <h2 className="text-2xl font-bold">Scholarship Details</h2>
                  <p className="text-muted-foreground">View scholarship information</p>
                </div>
              </div>
              <Button asChild>
                <Link href={`/admin/scholarships/${scholarship.id}/edit`}>
                  <Pencil className="mr-2 h-4 w-4" />
                  Edit
                </Link>
              </Button>
            </div>

            <div className="grid gap-6 lg:grid-cols-3">
              {/* Main Content */}
              <div className="lg:col-span-2 space-y-6">
                {/* Cover Image */}
                {scholarship.cover_image && (
                  <Card>
                    <CardContent className="p-0">
                      <div className="aspect-video w-full overflow-hidden rounded-lg">
                        <img
                          src={scholarship.cover_image.image_url}
                          alt={headTitle}
                          className="h-full w-full object-cover"
                        />
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Title & Description */}
                <Card>
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <CardTitle className="text-2xl">
                        {/* Show EN, optionally Arabic below */}
                        {titleEn || titleAr || 'Untitled'}
                        {titleEn && titleAr ? (
                          <div className="mt-1 text-base text-muted-foreground" dir="rtl">
                            {titleAr}
                          </div>
                        ) : null}
                      </CardTitle>
                      <Badge className={getLevelBadgeColor(scholarship.level)}>
                        {scholarship.level}
                      </Badge>
                    </div>
                  </CardHeader>

                  <CardContent className="space-y-4">
                    <div>
                      <h3 className="font-semibold mb-2">Description</h3>

                      {/* Tabs for both languages */}
                      <Tabs defaultValue={descEn ? 'en' : 'ar'}>
                        <TabsList className="grid w-full grid-cols-2 mb-3">
                          <TabsTrigger value="en">English</TabsTrigger>
                          <TabsTrigger value="ar">العربية</TabsTrigger>
                        </TabsList>

                        <TabsContent value="en">
                          <div
                            className="prose prose-sm max-w-none dark:prose-invert"
                            dangerouslySetInnerHTML={{
                              __html: descEn || '<p><em>No English description</em></p>',
                            }}
                          />
                        </TabsContent>

                        <TabsContent value="ar">
                          <div
                            className="prose prose-sm max-w-none dark:prose-invert"
                            dir="rtl"
                            dangerouslySetInnerHTML={{
                              __html: descAr || '<p><em>لا يوجد وصف عربي</em></p>',
                            }}
                          />
                        </TabsContent>
                      </Tabs>
                    </div>
                  </CardContent>
                </Card>

                {/* Image Gallery */}
                {scholarship.images && scholarship.images.length > 1 && (
                  <Card>
                    <CardHeader>
                      <CardTitle>Image Gallery</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid gap-4 sm:grid-cols-2">
                        {scholarship.images
                          .filter((img) => !img.is_cover)
                          .map((image) => (
                            <div key={image.id} className="aspect-video w-full overflow-hidden rounded-lg">
                              <img
                                src={image.image_url}
                                alt={headTitle}
                                className="h-full w-full object-cover"
                              />
                            </div>
                          ))}
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>

              {/* Sidebar */}
              <div className="space-y-6">
                {/* Details Card */}
                <Card>
                  <CardHeader>
                    <CardTitle>Scholarship Information</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Institution</p>
                      <p className="text-sm font-semibold">
                        {/* Prefer EN; show AR hint if both exist */}
                        {platformName}
                        {platformNameEn && platformNameAr && (
                          <span className="ml-2 text-muted-foreground" dir="rtl">
                            ({platformNameAr})
                          </span>
                        )}
                      </p>
                    </div>

                    <Separator />

                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Category</p>
                      <p className="text-sm font-semibold">
                        {categoryName}
                        {categoryNameEn && categoryNameAr && (
                          <span className="ml-2 text-muted-foreground" dir="rtl">
                            ({categoryNameAr})
                          </span>
                        )}
                      </p>
                    </div>

                    <Separator />

                    {scholarship.duration && (
                      <>
                        <div>
                          <p className="text-sm font-medium text-muted-foreground">Duration</p>
                          <p className="text-sm font-semibold">{scholarship.duration}</p>
                        </div>
                        <Separator />
                      </>
                    )}

                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Certificate</p>
                      <Badge
                        variant="outline"
                        className={
                          scholarship.have_certificate
                            ? 'bg-green-50 text-green-700 dark:bg-green-950 dark:text-green-300'
                            : 'bg-gray-50 text-gray-700 dark:bg-gray-950 dark:text-gray-300'
                        }
                      >
                        {scholarship.have_certificate ? 'Available' : 'Not Available'}
                      </Badge>
                    </div>

                    <Separator />

                    <div>
                      <p className="text-sm font-medium text-muted-foreground mb-2">External Link</p>
                      <Button asChild variant="outline" size="sm" className="w-full">
                        <a href={pickStr(scholarship.external_url as any) || '#'} target="_blank" rel="noopener noreferrer">
                          <ExternalLink className="mr-2 h-4 w-4" />
                          Visit Scholarship
                        </a>
                      </Button>
                    </div>

                    <Separator />

                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Created</p>
                      <div className="flex items-center gap-2 text-sm">
                        <Calendar className="h-4 w-4" />
                        {formatDate(scholarship.created_at, 'en')}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}

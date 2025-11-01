import { Head, Link } from '@inertiajs/react';
import { ArrowLeft, Pencil, ExternalLink, Calendar } from 'lucide-react';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import type { BreadcrumbItem } from '@/types';
import type { Course } from '@/types';
import { getLevelBadgeColor, formatDate } from '@/lib/utils';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';

interface ShowCourseProps {
  course: Course & {
    title: string | { en?: string; ar?: string };
    description: string | { en?: string; ar?: string };
  };
}

const breadcrumbs: BreadcrumbItem[] = [
  { title: 'Dashboard', href: '/admin/dashboard' },
  { title: 'Courses', href: '/admin/courses' },
  { title: 'View', href: '#' },
];

const isObj = (v: unknown): v is Record<string, any> =>
  v !== null && typeof v === 'object' && !Array.isArray(v);

export default function ShowCourse({ course }: ShowCourseProps) {
  // Normalize multilingual fields
  const titleEn = isObj(course.title) ? (course.title.en ?? '') : (course.title ?? '');
  const titleAr = isObj(course.title) ? (course.title.ar ?? '') : '';
  const descEn  = isObj(course.description) ? (course.description.en ?? '') : (course.description ?? '');
  const descAr  = isObj(course.description) ? (course.description.ar ?? '') : '';

  const headTitle = titleEn || titleAr || 'Course';

  // Platform/Category names are likely strings (models translate on toArray)
  // but guard just in case:
  const nameOf = (maybe: any) =>
    isObj(maybe) ? (maybe.en ?? maybe.ar ?? '') : (maybe ?? '');

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
                  <Link href="/admin/courses">
                    <ArrowLeft className="h-4 w-4" />
                  </Link>
                </Button>
                <div>
                  <h2 className="text-2xl font-bold">Course Details</h2>
                  <p className="text-muted-foreground">View course information</p>
                </div>
              </div>
              <Button asChild>
                <Link href={`/admin/courses/${course.id}/edit`}>
                  <Pencil className="mr-2 h-4 w-4" />
                  Edit
                </Link>
              </Button>
            </div>

            <div className="grid gap-6 lg:grid-cols-3">
              {/* Main Content */}
              <div className="lg:col-span-2 space-y-6">
                {/* Cover Image */}
                {course.cover_image && (
                  <Card>
                    <CardContent className="p-0">
                      <div className="aspect-video w-full overflow-hidden rounded-lg">
                        <img
                          src={course.cover_image.image_url}
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
                        {titleEn || titleAr || 'Untitled'}
                        {titleEn && titleAr ? (
                          <div className="mt-1 text-base text-muted-foreground" dir="rtl">
                            {titleAr}
                          </div>
                        ) : null}
                      </CardTitle>
                      <Badge className={getLevelBadgeColor(course.level)}>
                        {course.level}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <h3 className="font-semibold mb-2">Description</h3>

                      <Tabs defaultValue={descEn ? 'en' : 'ar'}>
                        <TabsList className="grid w-full grid-cols-2 mb-3">
                          <TabsTrigger value="en">English</TabsTrigger>
                          <TabsTrigger value="ar">العربية</TabsTrigger>
                        </TabsList>

                        <TabsContent value="en">
                          <div
                            className="prose prose-sm max-w-none dark:prose-invert"
                            dangerouslySetInnerHTML={{ __html: descEn || '<p><em>No English content</em></p>' }}
                          />
                        </TabsContent>

                        <TabsContent value="ar">
                          <div
                            className="prose prose-sm max-w-none dark:prose-invert"
                            dir="rtl"
                            dangerouslySetInnerHTML={{ __html: descAr || '<p><em>لا يوجد محتوى عربي</em></p>' }}
                          />
                        </TabsContent>
                      </Tabs>
                    </div>
                  </CardContent>
                </Card>

                {/* Image Gallery */}
                {course.images && course.images.length > 1 && (
                  <Card>
                    <CardHeader>
                      <CardTitle>Image Gallery</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid gap-4 sm:grid-cols-2">
                        {course.images
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
                <Card>
                  <CardHeader>
                    <CardTitle>Course Information</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Platform</p>
                      <p className="text-sm font-semibold">{nameOf(course.platform?.name)}</p>
                    </div>
                    
                    <Separator />
                    
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Category</p>
                      <p className="text-sm font-semibold">{nameOf(course.category?.name)}</p>
                    </div>
                    
                    <Separator />
                    
                    {course.duration && (
                      <>
                        <div>
                          <p className="text-sm font-medium text-muted-foreground">Duration</p>
                          <p className="text-sm font-semibold">{course.duration}</p>
                        </div>
                        <Separator />
                      </>
                    )}
                    
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Certificate</p>
                      <Badge
                        variant="outline"
                        className={
                          course.have_certificate
                            ? 'bg-green-50 text-green-700 dark:bg-green-950 dark:text-green-300'
                            : 'bg-gray-50 text-gray-700 dark:bg-gray-950 dark:text-gray-300'
                        }
                      >
                        {course.have_certificate ? 'Available' : 'Not Available'}
                      </Badge>
                    </div>
                    
                    <Separator />
                    
                    <div>
                      <p className="text-sm font-medium text-muted-foreground mb-2">External Link</p>
                      <Button asChild variant="outline" size="sm" className="w-full">
                        <a href={course.external_url} target="_blank" rel="noopener noreferrer">
                          <ExternalLink className="mr-2 h-4 w-4" />
                          Visit Course
                        </a>
                      </Button>
                    </div>
                    
                    <Separator />
                    
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Created</p>
                      <div className="flex items-center gap-2 text-sm">
                        <Calendar className="h-4 w-4" />
                        {formatDate(course.created_at, 'en')}
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

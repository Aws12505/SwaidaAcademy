import { Head, Link } from '@inertiajs/react';
import { ArrowLeft, Pencil, Calendar } from 'lucide-react';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import type { BreadcrumbItem, Blog } from '@/types';
import { formatDate } from '@/lib/utils';

interface ShowBlogProps {
  blog: Blog & {
    // ensure types allow objects here
    title: string | { en?: string; ar?: string };
    content: string | { en?: string; ar?: string };
  };
}

const breadcrumbs: BreadcrumbItem[] = [
  { title: 'Dashboard', href: '/admin/dashboard' },
  { title: 'Blogs', href: '/admin/blogs' },
  { title: 'View', href: '#' },
];

const isObj = (v: unknown): v is Record<string, any> =>
  v !== null && typeof v === 'object' && !Array.isArray(v);

export default function ShowBlog({ blog }: ShowBlogProps) {
  // normalize title/content to strings per locale
  const titleEn = isObj(blog.title) ? (blog.title.en ?? '') : (blog.title ?? '');
  const titleAr = isObj(blog.title) ? (blog.title.ar ?? '') : '';
  const contentEn = isObj(blog.content) ? (blog.content.en ?? '') : (blog.content ?? '');
  const contentAr = isObj(blog.content) ? (blog.content.ar ?? '') : '';

  // Choose something stringy for <Head> and alt attributes
  const headTitle = titleEn || titleAr || 'Blog';

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
                  <Link href="/admin/blogs">
                    <ArrowLeft className="h-4 w-4" />
                  </Link>
                </Button>
                <div>
                  <h2 className="text-2xl font-bold">Blog Post Details</h2>
                  <p className="text-muted-foreground">View blog post information</p>
                </div>
              </div>
              <Button asChild>
                <Link href={`/admin/blogs/${blog.id}/edit`}>
                  <Pencil className="mr-2 h-4 w-4" />
                  Edit
                </Link>
              </Button>
            </div>

            <div className="grid gap-6 lg:grid-cols-3">
              {/* Main Content */}
              <div className="lg:col-span-2 space-y-6">
                {/* Cover Image */}
                {blog.cover_image && (
                  <Card>
                    <CardContent className="p-0">
                      <div className="aspect-[21/9] w-full overflow-hidden rounded-lg">
                        <img
                          src={blog.cover_image.image_url}
                          alt={headTitle}
                          className="h-full w-full object-cover"
                        />
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Title & Content */}
                <Card>
                  <CardHeader>
                    {/* Render a safe string, optionally show both */}
                    <CardTitle className="text-2xl">
                      {titleEn || titleAr || 'Untitled'}
                      {titleAr && titleEn && (
                        <div className="mt-1 text-base text-muted-foreground" dir="rtl">
                          {titleAr}
                        </div>
                      )}
                    </CardTitle>
                  </CardHeader>

                  <CardContent className="space-y-4">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Calendar className="h-4 w-4" />
                      {formatDate(blog.created_at, 'en')}
                    </div>

                    <Separator />

                    <div>
                      <h3 className="font-semibold mb-2">Content</h3>

                      {/* Tabs to view both languages */}
                      <Tabs defaultValue={contentEn ? 'en' : 'ar'}>
                        <TabsList className="grid w-full grid-cols-2 mb-3">
                          <TabsTrigger value="en">English</TabsTrigger>
                          <TabsTrigger value="ar">العربية</TabsTrigger>
                        </TabsList>

                        <TabsContent value="en">
                          <div
                            className="prose prose-sm max-w-none dark:prose-invert"
                            dangerouslySetInnerHTML={{ __html: contentEn || '<p><em>No English content</em></p>' }}
                          />
                        </TabsContent>

                        <TabsContent value="ar">
                          <div
                            className="prose prose-sm max-w-none dark:prose-invert"
                            dir="rtl"
                            dangerouslySetInnerHTML={{ __html: contentAr || '<p><em>لا يوجد محتوى عربي</em></p>' }}
                          />
                        </TabsContent>
                      </Tabs>
                    </div>
                  </CardContent>
                </Card>

                {/* Image Gallery */}
                {blog.images && blog.images.length > 1 && (
                  <Card>
                    <CardHeader>
                      <CardTitle>Image Gallery</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid gap-4 sm:grid-cols-2">
                        {blog.images
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
                    <CardTitle>Post Information</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Created</p>
                      <p className="text-sm font-semibold">{formatDate(blog.created_at, 'en')}</p>
                    </div>

                    <Separator />

                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Last Updated</p>
                      <p className="text-sm font-semibold">{formatDate(blog.updated_at, 'en')}</p>
                    </div>

                    <Separator />

                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Total Images</p>
                      <p className="text-sm font-semibold">{blog.images?.length || 0}</p>
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

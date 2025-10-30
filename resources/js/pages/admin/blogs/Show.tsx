import { Head, Link } from '@inertiajs/react';
import { ArrowLeft, Pencil, Calendar } from 'lucide-react';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import type { BreadcrumbItem } from '@/types';
import type { Blog } from '@/types';
import { formatDate } from '@/lib/utils';

interface ShowBlogProps {
  blog: Blog;
}

const breadcrumbs: BreadcrumbItem[] = [
  {
    title: 'Dashboard',
    href: '/admin/dashboard',
  },
  {
    title: 'Blogs',
    href: '/admin/blogs',
  },
  {
    title: 'View',
    href: '#',
  },
];

export default function ShowBlog({ blog }: ShowBlogProps) {
  const getTitle = (title: any): string => {
    if (typeof title === 'string') return title;
    if (typeof title === 'object' && title.en) return title.en;
    return 'Blog';
  };

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title={getTitle(blog.title)} />
      
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
                          alt={blog.title}
                          className="h-full w-full object-cover"
                        />
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Title & Content */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-2xl">{blog.title}</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Calendar className="h-4 w-4" />
                      {formatDate(blog.created_at, 'en')}
                    </div>
                    
                    <Separator />
                    
                    <div>
                      <h3 className="font-semibold mb-2">Content</h3>
                      <div 
                        className="prose prose-sm max-w-none dark:prose-invert"
                        dangerouslySetInnerHTML={{ __html: blog.content }}
                      />
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
                                alt={blog.title}
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
                {/* Metadata Card */}
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

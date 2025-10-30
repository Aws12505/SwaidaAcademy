import { Head, usePage } from '@inertiajs/react';
import { BookOpen } from 'lucide-react';
import AppLayout from '@/components/layout/AppLayout';
import BlogCard from '@/components/blog/BlogCard';
import { Button } from '@/components/ui/button';
import type { PageProps, Blog, PaginatedData } from '@/types';
import { useRTL } from '@/hooks/useRTL';

interface BlogsIndexProps extends PageProps {
  blogs: PaginatedData<Blog>;
}

export default function BlogsIndex({ blogs }: BlogsIndexProps) {
  const { locale } = usePage<PageProps>().props;
  const { isRTL } = useRTL();

  return (
    <AppLayout>
      <Head title={locale === 'ar' ? 'المدونة' : 'Blog'} />

      {/* Header */}
      <section className="bg-gradient-to-br from-primary/5 to-secondary/5">
        <div className="container-responsive max-w-7xl mx-auto py-8 sm:py-12">
          <div className={`flex items-center ${isRTL ? 'flex-row-reverse' : ''} gap-3 sm:gap-4 mb-2`}>
            <div className="flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-full bg-primary/10">
              <BookOpen className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />
            </div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold">
              {locale === 'ar' ? 'المدونة' : 'Blog'}
            </h1>
          </div>
          <p className="text-sm sm:text-base text-muted-foreground max-w-2xl">
            {locale === 'ar'
              ? 'اقرأ آخر المقالات والأخبار حول التعليم والدورات والمنح الدراسية'
              : 'Read the latest articles and news about education, courses, and scholarships'}
          </p>
        </div>
      </section>

      {/* Content */}
      <section>
        <div className="container-responsive max-w-7xl mx-auto py-8 sm:py-12">
          {/* Results header */}
          <div className="mb-6 sm:mb-8">
            <p className="text-sm text-muted-foreground">
              {locale === 'ar'
                ? `عرض ${blogs.from}-${blogs.to} من ${blogs.total} مقالة`
                : `Showing ${blogs.from}-${blogs.to} of ${blogs.total} articles`}
            </p>
          </div>

          {/* Grid */}
          {blogs.data.length > 0 ? (
            <>
              <div className="grid gap-6 sm:gap-8 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3">
                {blogs.data.map((blog) => (
                  <BlogCard key={blog.id} blog={blog} />
                ))}
              </div>

              {/* Pagination */}
              {blogs.last_page > 1 && (
                <div className="flex justify-center gap-2 pt-6 sm:pt-8 flex-wrap">
                  {blogs.links.map((link, index) => (
                    <Button
                      key={index}
                      variant={link.active ? 'default' : 'outline'}
                      size="sm"
                      disabled={!link.url}
                      asChild={!!link.url}
                      className="touch-target"
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
            </>
          ) : (
            <div className="flex flex-col items-center justify-center py-12 sm:py-16 text-center">
              <BookOpen className="h-12 w-12 sm:h-16 sm:w-16 text-muted-foreground mb-4" />
              <h3 className="text-base sm:text-lg font-semibold mb-2">
                {locale === 'ar' ? 'لا توجد مقالات بعد' : 'No articles yet'}
              </h3>
              <p className="text-sm sm:text-base text-muted-foreground">
                {locale === 'ar' ? 'تحقق مرة أخرى قريبًا للحصول على محتوى جديد' : 'Check back soon for new content'}
              </p>
            </div>
          )}
        </div>
      </section>
    </AppLayout>
  );
}

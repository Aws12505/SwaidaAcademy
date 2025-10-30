import { Head, Link, usePage } from '@inertiajs/react';
import { ArrowLeft, Calendar } from 'lucide-react';
import AppLayout from '@/components/layout/AppLayout';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import type { PageProps, Blog } from '@/types';
import { formatDate } from '@/lib/utils';
import { useRTL } from '@/hooks/useRTL';
import ScrollReveal from '@/components/motion/ScrollReveal';

interface BlogShowProps extends PageProps {
  blog: Blog;
}

export default function BlogShow({ blog }: BlogShowProps) {
  const { locale } = usePage<PageProps>().props;
  const { isRTL } = useRTL();

  return (
    <AppLayout>
      <Head title={blog.title} />

      {/* Back bar */}
      <ScrollReveal y={6}>
        <div className="border-b bg-muted/30">
          <div className="container-responsive max-w-7xl mx-auto py-3 sm:py-4">
            <Button asChild variant="ghost" size="sm" className="touch-target">
              <Link href={`/${locale}/blogs`} className={`inline-flex items-center ${isRTL ? 'flex-row-reverse' : ''} gap-2`}>
                <ArrowLeft className={`h-4 w-4 ${isRTL ? 'rotate-180' : ''}`} />
                {locale === 'ar' ? 'العودة إلى المدونة' : 'Back to Blog'}
              </Link>
            </Button>
          </div>
        </div>
      </ScrollReveal>

      <article className="container-responsive max-w-7xl mx-auto py-8 sm:py-12">
        <div className="mx-auto w-full max-w-3xl sm:max-w-4xl">
          {/* Cover */}
          {blog.cover_image && (
            <ScrollReveal y={12}>
              <div className="mb-6 sm:mb-8 aspect-[21/9] w-full overflow-hidden rounded-lg shadow-sm">
                <img
                  src={blog.cover_image.image_url}
                  alt={blog.title}
                  className="h-full w-full object-cover"
                />
              </div>
            </ScrollReveal>
          )}

          {/* Header */}
          <ScrollReveal as="header" y={8} className="mb-6 sm:mb-8 space-y-3 sm:space-y-4">
            <h1 className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-bold leading-tight">
              {blog.title}
            </h1>

            <div className={`inline-flex items-center ${isRTL ? 'flex-row-reverse' : ''} gap-2 text-xs sm:text-sm text-muted-foreground`}>
              <Calendar className="h-4 w-4" />
              <time dateTime={blog.created_at}>{formatDate(blog.created_at, locale)}</time>
            </div>
          </ScrollReveal>

          <ScrollReveal y={6}>
            <Separator className="mb-6 sm:mb-8" />
          </ScrollReveal>

          {/* Content */}
          <ScrollReveal y={10}>
            <div
              className="prose prose-sm sm:prose-base lg:prose-lg max-w-none dark:prose-invert prose-headings:font-bold prose-a:text-primary prose-img:rounded-lg"
              dangerouslySetInnerHTML={{ __html: blog.content }}
            />
          </ScrollReveal>

          {/* Gallery */}
          {blog.images && blog.images.length > 1 && (
            <div className="mt-8 sm:mt-12 space-y-4 sm:space-y-6">
              <ScrollReveal y={6}><Separator /></ScrollReveal>
              <ScrollReveal as="h2" y={8} className="text-xl sm:text-2xl font-bold">
                {locale === 'ar' ? 'معرض الصور' : 'Image Gallery'}
              </ScrollReveal>
              <div className="grid gap-4 sm:gap-5 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
                {blog.images
                  .filter((img) => !img.is_cover)
                  .map((image) => (
                    <ScrollReveal key={image.id} y={12}>
                      <div className="aspect-video w-full overflow-hidden rounded-lg shadow-sm">
                        <img
                          src={image.image_url}
                          alt={blog.title}
                          className="h-full w-full object-cover"
                        />
                      </div>
                    </ScrollReveal>
                  ))}
              </div>
            </div>
          )}
        </div>
      </article>
    </AppLayout>
  );
}

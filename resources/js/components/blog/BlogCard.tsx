import { Link, usePage } from '@inertiajs/react';
import { Calendar, BookOpen } from 'lucide-react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import type { Blog, PageProps } from '@/types';
import { formatDate, stripHtml, truncateText } from '@/lib/utils';
import { useRTL } from '@/hooks/useRTL';

interface BlogCardProps {
  blog: Blog;
}

export default function BlogCard({ blog }: BlogCardProps) {
  const { locale } = usePage<PageProps>().props;
  const { isRTL } = useRTL();

  return (
    <Card className="group overflow-hidden transition-all hover:shadow-lg h-full flex flex-col">
      <Link href={`/${locale}/blogs/${blog.id}`} className="focus-visible:outline-none">
        <CardHeader className="p-0">
          <div className="relative aspect-video w-full overflow-hidden bg-muted">
            {blog.cover_image ? (
              <img
                src={blog.cover_image.image_url}
                alt={blog.title}
                className="h-full w-full object-cover transition-transform group-hover:scale-105"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-primary/10 to-secondary/10">
                <BookOpen className="h-12 w-12 sm:h-16 sm:w-16 text-muted-foreground" aria-hidden="true" />
              </div>
            )}
          </div>
        </CardHeader>

        <CardContent className="p-4 sm:p-6 space-y-2 sm:space-y-3 flex-1 flex flex-col">
          <div className={`inline-flex items-center ${isRTL ? 'flex-row-reverse' : ''} gap-2 text-xs sm:text-sm text-muted-foreground`}>
            <Calendar className="h-4 w-4" />
            <time dateTime={blog.created_at}>{formatDate(blog.created_at, locale)}</time>
          </div>

          <h3 className="font-semibold text-lg sm:text-xl line-clamp-2 group-hover:text-primary transition-colors">
            {blog.title}
          </h3>

          <p className="text-sm sm:text-base text-muted-foreground line-clamp-3 flex-1">
            {truncateText(stripHtml(blog.content), 150)}
          </p>
        </CardContent>
      </Link>
    </Card>
  );
}

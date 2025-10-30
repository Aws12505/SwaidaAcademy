import { Head, usePage } from '@inertiajs/react';
import { Award } from 'lucide-react';
import AppLayout from '@/components/layout/AppLayout';
import ScholarshipCard from '@/components/scholarship/ScholarshipCard';
import ScholarshipFilters from '@/components/scholarship/ScholarshipFilters';
import { Button } from '@/components/ui/button';
import type { PageProps, Scholarship, Platform, Category, LevelOption, Filters, PaginatedData } from '@/types';
import { useRTL } from '@/hooks/useRTL';

interface ScholarshipsIndexProps extends PageProps {
  scholarships: PaginatedData<Scholarship>;
  platforms: Platform[];
  categories: Category[];
  levels: LevelOption[];
  filters: Filters;
}

export default function ScholarshipsIndex({ scholarships, platforms, categories, levels, filters }: ScholarshipsIndexProps) {
  const { locale } = usePage<PageProps>().props;
  const { isRTL } = useRTL();

  return (
    <AppLayout>
      <Head title={locale === 'ar' ? 'المنح الدراسية' : 'Scholarships'} />

      {/* Header */}
      <section className="bg-gradient-to-br from-secondary/5 to-primary/5">
        <div className="container-responsive max-w-7xl mx-auto py-8 sm:py-12">
          <div className={`flex items-center ${isRTL ? 'flex-row-reverse' : ''} gap-3 sm:gap-4 mb-2`}>
            <div className="flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-full bg-secondary/10">
              <Award className="h-5 w-5 sm:h-6 sm:w-6 text-secondary" />
            </div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold">
              {locale === 'ar' ? 'المنح الدراسية' : 'Scholarships'}
            </h1>
          </div>
          <p className="text-sm sm:text-base text-muted-foreground max-w-2xl">
            {locale === 'ar'
              ? 'اكتشف فرص المنح الدراسية من أفضل المؤسسات التعليمية حول العالم'
              : 'Discover scholarship opportunities from the best educational institutions worldwide'}
          </p>
        </div>
      </section>

      {/* Content */}
      <section>
        <div className="container-responsive max-w-7xl mx-auto py-8 sm:py-12">
          <div className="grid gap-6 sm:gap-8 lg:grid-cols-[300px_minmax(0,1fr)] xl:grid-cols-[320px_minmax(0,1fr)]">
            {/* Filters */}
            <aside className="lg:sticky lg:top-24 lg:self-start">
              <ScholarshipFilters
                platforms={platforms}
                categories={categories}
                levels={levels}
                currentFilters={filters}
              />
            </aside>

            {/* Results */}
            <div className="space-y-4 sm:space-y-6">
              <div className="flex items-center justify-between">
                <p className="text-sm text-muted-foreground">
                  {locale === 'ar'
                    ? `عرض ${scholarships.from}-${scholarships.to} من ${scholarships.total} نتيجة`
                    : `Showing ${scholarships.from}-${scholarships.to} of ${scholarships.total} results`}
                </p>
              </div>

              {scholarships.data.length > 0 ? (
                <>
                  <div className="grid gap-4 sm:gap-6 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3">
                    {scholarships.data.map((scholarship) => (
                      <ScholarshipCard key={scholarship.id} scholarship={scholarship} />
                    ))}
                  </div>

                  {/* Pagination */}
                  {scholarships.last_page > 1 && (
                    <div className="flex justify-center gap-2 pt-6 sm:pt-8 flex-wrap">
                      {scholarships.links.map((link, index) => (
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
                  <Award className="h-12 w-12 sm:h-16 sm:w-16 text-muted-foreground mb-4" />
                  <h3 className="text-base sm:text-lg font-semibold mb-2">
                    {locale === 'ar' ? 'لم يتم العثور على منح' : 'No scholarships found'}
                  </h3>
                  <p className="text-sm sm:text-base text-muted-foreground">
                    {locale === 'ar' ? 'جرب تغيير معايير البحث أو الفلاتر' : 'Try changing your search criteria or filters'}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </AppLayout>
  );
}

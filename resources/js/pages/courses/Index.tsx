import { Head, usePage } from '@inertiajs/react';
import { GraduationCap } from 'lucide-react';
import AppLayout from '@/components/layout/AppLayout';
import CourseCard from '@/components/course/CourseCard';
import CourseFilters from '@/components/course/CourseFilters';
import { Button } from '@/components/ui/button';
import type { PageProps, Course, Platform, Category, LevelOption, Filters, PaginatedData } from '@/types';
import { useRTL } from '@/hooks/useRTL';
import ScrollReveal from '@/components/motion/ScrollReveal';

interface CoursesIndexProps extends PageProps {
  courses: PaginatedData<Course>;
  platforms: Platform[];
  categories: Category[];
  levels: LevelOption[];
  filters: Filters;
}

export default function CoursesIndex({ courses, platforms, categories, levels, filters }: CoursesIndexProps) {
  const { locale } = usePage<PageProps>().props;
  const { isRTL } = useRTL();

  return (
    <AppLayout>
      <Head title={locale === 'ar' ? 'الدورات' : 'Courses'} />

      {/* Header */}
      <ScrollReveal as="section" y={10} className="bg-gradient-to-br from-primary/5 to-secondary/5">
        <div className="container-responsive max-w-7xl mx-auto py-8 sm:py-12">
          <div className={`flex items-center ${isRTL ? 'flex-row-reverse' : ''} gap-3 sm:gap-4 mb-2`}>
            <div className="flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-full bg-primary/10">
              <GraduationCap className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />
            </div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold">
              {locale === 'ar' ? 'الدورات التعليمية' : 'Educational Courses'}
            </h1>
          </div>
          <p className="text-sm sm:text-base text-muted-foreground max-w-2xl">
            {locale === 'ar'
              ? 'استكشف مجموعة واسعة من الدورات التعليمية من أفضل المنصات العالمية'
              : 'Explore a wide range of educational courses from the best global platforms'}
          </p>
        </div>
      </ScrollReveal>

      {/* Content */}
      <ScrollReveal as="section" y={10}>
        <div className="container-responsive max-w-7xl mx-auto py-8 sm:py-12">
          <div className="grid gap-6 sm:gap-8 lg:grid-cols-[300px_minmax(0,1fr)] xl:grid-cols-[320px_minmax(0,1fr)]">
            {/* Filters */}
            <ScrollReveal as="aside" y={8} delay={40} className="lg:sticky lg:top-24 lg:self-start">
              <CourseFilters
                platforms={platforms}
                categories={categories}
                levels={levels}
                currentFilters={filters}
              />
            </ScrollReveal>

            {/* Results */}
            <div className="space-y-4 sm:space-y-6">
              <ScrollReveal as="div" y={6}>
                <div className="flex items-center justify-between">
                  <p className="text-sm text-muted-foreground">
                    {locale === 'ar'
                      ? `عرض ${courses.from}-${courses.to} من ${courses.total} نتيجة`
                      : `Showing ${courses.from}-${courses.to} of ${courses.total} results`}
                  </p>
                </div>
              </ScrollReveal>

              {courses.data.length > 0 ? (
                <>
                  <div className="grid gap-4 sm:gap-6 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3">
                    {courses.data.map((course, i) => (
                      <ScrollReveal key={course.id} y={12} delay={i * 50}>
                        <CourseCard course={course} />
                      </ScrollReveal>
                    ))}
                  </div>

                  {courses.last_page > 1 && (
                    <ScrollReveal as="div" y={6} delay={60}>
                      <div className="flex justify-center gap-2 pt-6 sm:pt-8 flex-wrap">
                        {courses.links.map((link, index) => (
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
                    </ScrollReveal>
                  )}
                </>
              ) : (
                <ScrollReveal y={10}>
                  <div className="flex flex-col items-center justify-center py-12 sm:py-16 text-center">
                    <GraduationCap className="h-12 w-12 sm:h-16 sm:w-16 text-muted-foreground mb-4" />
                    <h3 className="text-base sm:text-lg font-semibold mb-2">
                      {locale === 'ar' ? 'لم يتم العثور على دورات' : 'No courses found'}
                    </h3>
                    <p className="text-sm sm:text-base text-muted-foreground">
                      {locale === 'ar' ? 'جرب تغيير معايير البحث أو الفلاتر' : 'Try changing your search criteria or filters'}
                    </p>
                  </div>
                </ScrollReveal>
              )}
            </div>
          </div>
        </div>
      </ScrollReveal>
    </AppLayout>
  );
}

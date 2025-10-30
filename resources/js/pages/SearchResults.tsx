import { Head, usePage } from '@inertiajs/react';
import { Search, GraduationCap, Award } from 'lucide-react';
import AppLayout from '@/components/layout/AppLayout';
import CourseCard from '@/components/course/CourseCard';
import ScholarshipCard from '@/components/scholarship/ScholarshipCard';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import type { PageProps, Course, Scholarship } from '@/types';
import { useRTL } from '@/hooks/useRTL';

interface SearchResultsProps extends PageProps {
  results: { courses: Course[]; scholarships: Scholarship[]; };
  query: string;
}

export default function SearchResults({ results, query }: SearchResultsProps) {
  const { locale } = usePage<PageProps>().props;
  const { isRTL } = useRTL();
  const totalResults = results.courses.length + results.scholarships.length;

  return (
    <AppLayout>
      <Head title={`${locale === 'ar' ? 'نتائج البحث' : 'Search Results'}: ${query}`} />

      {/* Header */}
      <section className="bg-gradient-to-br from-primary/5 to-secondary/5">
        <div className="container-responsive max-w-7xl mx-auto py-8 sm:py-12">
          <div className={`flex items-center ${isRTL ? 'flex-row-reverse' : ''} gap-3 sm:gap-4 mb-2`}>
            <div className="flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-full bg-primary/10 shrink-0">
              <Search className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />
            </div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold">
              {locale === 'ar' ? 'نتائج البحث' : 'Search Results'}
            </h1>
          </div>
          <p className="text-sm sm:text-base text-muted-foreground">
            {locale === 'ar'
              ? `البحث عن: "${query}" - ${totalResults} نتيجة`
              : `Searching for: "${query}" - ${totalResults} results`}
          </p>
        </div>
      </section>

      {/* Content */}
      <section>
        <div className="container-responsive max-w-7xl mx-auto py-8 sm:py-12">
          {totalResults > 0 ? (
            <Tabs defaultValue="all" className="w-full">
              <TabsList className="mb-6 sm:mb-8 w-full sm:w-auto grid grid-cols-3 sm:inline-grid sm:auto-cols-max sm:grid-flow-col gap-2 h-auto">
                <TabsTrigger value="all" className="text-sm sm:text-base">
                  {locale === 'ar' ? 'الكل' : 'All'} ({totalResults})
                </TabsTrigger>
                <TabsTrigger value="courses" className="text-sm sm:text-base inline-flex items-center gap-2">
                  <GraduationCap className="h-4 w-4 hidden sm:inline" />
                  {locale === 'ar' ? 'الدورات' : 'Courses'} ({results.courses.length})
                </TabsTrigger>
                <TabsTrigger value="scholarships" className="text-sm sm:text-base inline-flex items-center gap-2">
                  <Award className="h-4 w-4 hidden sm:inline" />
                  {locale === 'ar' ? 'المنح' : 'Scholarships'} ({results.scholarships.length})
                </TabsTrigger>
              </TabsList>

              <TabsContent value="all" className="space-y-8 sm:space-y-12">
                {!!results.courses.length && (
                  <div className="space-y-4 sm:space-y-6">
                    <h2 className="text-xl sm:text-2xl font-bold">{locale === 'ar' ? 'الدورات' : 'Courses'}</h2>
                    <div className="grid gap-4 sm:gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                      {results.courses.map((c) => <CourseCard key={c.id} course={c} />)}
                    </div>
                  </div>
                )}
                {!!results.scholarships.length && (
                  <div className="space-y-4 sm:space-y-6">
                    <h2 className="text-xl sm:text-2xl font-bold">{locale === 'ar' ? 'المنح الدراسية' : 'Scholarships'}</h2>
                    <div className="grid gap-4 sm:gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                      {results.scholarships.map((s) => <ScholarshipCard key={s.id} scholarship={s} />)}
                    </div>
                  </div>
                )}
              </TabsContent>

              <TabsContent value="courses">
                {results.courses.length ? (
                  <div className="grid gap-4 sm:gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                    {results.courses.map((c) => <CourseCard key={c.id} course={c} />)}
                  </div>
                ) : (
                  <EmptyState icon="course" locale={locale} />
                )}
              </TabsContent>

              <TabsContent value="scholarships">
                {results.scholarships.length ? (
                  <div className="grid gap-4 sm:gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                    {results.scholarships.map((s) => <ScholarshipCard key={s.id} scholarship={s} />)}
                  </div>
                ) : (
                  <EmptyState icon="scholarship" locale={locale} />
                )}
              </TabsContent>
            </Tabs>
          ) : (
            <EmptyState icon="search" locale={locale} />
          )}
        </div>
      </section>
    </AppLayout>
  );
}

/* Small helper to keep empty states consistent */
function EmptyState({ icon, locale }: { icon: 'search' | 'course' | 'scholarship'; locale: string }) {
  const Icon = icon === 'search' ? Search : icon === 'course' ? GraduationCap : Award;
  const title =
    icon === 'course'
      ? (locale === 'ar' ? 'لم يتم العثور على دورات' : 'No courses found')
      : icon === 'scholarship'
      ? (locale === 'ar' ? 'لم يتم العثور على منح' : 'No scholarships found')
      : (locale === 'ar' ? 'لم يتم العثور على نتائج' : 'No results found');
  const subtitle =
    locale === 'ar' ? 'جرب البحث بكلمات مختلفة' : 'Try searching with different keywords';

  return (
    <div className="flex flex-col items-center justify-center py-12 sm:py-16 text-center">
      <Icon className="h-12 w-12 sm:h-16 sm:w-16 text-muted-foreground mb-4" />
      <h3 className="text-base sm:text-lg font-semibold mb-2">{title}</h3>
      <p className="text-sm sm:text-base text-muted-foreground px-4">{subtitle}</p>
    </div>
  );
}

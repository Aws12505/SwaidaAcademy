import { Head, Link, usePage } from '@inertiajs/react';
import { ArrowRight, GraduationCap, Award, Target, Eye } from 'lucide-react';
import AppLayout from '@/components/layout/AppLayout';
import CourseCard from '@/components/course/CourseCard';
import ScholarshipCard from '@/components/scholarship/ScholarshipCard';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import type { PageProps, Course, Scholarship, Vision, Mission, PaginatedData } from '@/types';
import { useRTL } from '@/hooks/useRTL';
import ScrollReveal from '@/components/motion/ScrollReveal';

interface LandingProps extends PageProps {
  courses: PaginatedData<Course>;
  scholarships: PaginatedData<Scholarship>;
  vision: Vision;
  mission: Mission;
}

export default function Landing({ courses, scholarships, vision, mission }: LandingProps) {
  const { locale } = usePage<PageProps>().props;
  const { isRTL } = useRTL();

  return (
    <AppLayout>
      <Head title={locale === 'ar' ? 'الرئيسية' : 'Home'} />

      {/* Hero (subtle) */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary/5 via-background to-secondary/5">
        <div className="container-responsive max-w-7xl mx-auto py-10 sm:py-14 lg:py-20 xl:py-24">
          <ScrollReveal as="div" y={12}>
            <div className="mx-auto max-w-4xl text-center space-y-5 sm:space-y-7">
              <h1 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold tracking-tight">
                <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                  {locale === 'ar' ? 'اكتشف مستقبلك التعليمي' : 'Discover Your Educational Future'}
                </span>
              </h1>

              <p className="text-base sm:text-lg lg:text-xl text-muted-foreground max-w-2xl mx-auto">
                {locale === 'ar'
                  ? 'استكشف آلاف الدورات والمنح الدراسية من أفضل المنصات التعليمية حول العالم'
                  : 'Explore thousands of courses and scholarships from the best educational platforms worldwide'}
              </p>

              <div className="flex flex-col sm:flex-row justify-center gap-3 sm:gap-4">
                <Button asChild size="lg" className="touch-target text-base sm:text-lg w-full sm:w-auto">
                  <Link href={`/${locale}/courses`} className={`inline-flex items-center justify-center ${isRTL ? 'flex-row-reverse' : ''} gap-2`}>
                    <GraduationCap className="h-5 w-5" />
                    {locale === 'ar' ? 'تصفح الدورات' : 'Browse Courses'}
                  </Link>
                </Button>
                <Button asChild size="lg" variant="outline" className="touch-target text-base sm:text-lg w-full sm:w-auto">
                  <Link href={`/${locale}/scholarships`} className={`inline-flex items-center justify-center ${isRTL ? 'flex-row-reverse' : ''} gap-2`}>
                    <Award className="h-5 w-5" />
                    {locale === 'ar' ? 'تصفح المنح' : 'Browse Scholarships'}
                  </Link>
                </Button>
              </div>
            </div>
          </ScrollReveal>
        </div>

        {/* Decorative blobs (static) */}
        <div className="pointer-events-none absolute top-0 right-0 -z-10 h-64 w-64 sm:h-96 sm:w-96 rounded-full bg-primary/10 blur-3xl" />
        <div className="pointer-events-none absolute bottom-0 left-0 -z-10 h-64 w-64 sm:h-96 sm:w-96 rounded-full bg-secondary/10 blur-3xl" />
      </section>

      {/* Vision & Mission */}
      <section>
        <div className="container-responsive max-w-7xl mx-auto py-10 sm:py-14 lg:py-20">
          <div className="grid gap-5 sm:gap-6 lg:gap-8 lg:grid-cols-2">
            {vision && (
              <ScrollReveal y={12}>
                <Card className="border-2">
                  <CardContent className="p-5 sm:p-7 lg:p-8 space-y-4">
                    <div className={`flex items-center ${isRTL ? 'flex-row-reverse' : ''} gap-3`}>
                      <div className="flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-full bg-primary/10 shrink-0">
                        <Eye className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />
                      </div>
                      <h2 className="text-xl sm:text-2xl font-bold">
                        {locale === 'ar' ? 'رؤيتنا' : 'Our Vision'}
                      </h2>
                    </div>
                    <div
                      className="prose prose-sm sm:prose-base max-w-none dark:prose-invert"
                      dangerouslySetInnerHTML={{ __html: vision.content }}
                    />
                  </CardContent>
                </Card>
              </ScrollReveal>
            )}

            {mission && (
              <ScrollReveal y={12} delay={80}>
                <Card className="border-2">
                  <CardContent className="p-5 sm:p-7 lg:p-8 space-y-4">
                    <div className={`flex items-center ${isRTL ? 'flex-row-reverse' : ''} gap-3`}>
                      <div className="flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-full bg-secondary/10 shrink-0">
                        <Target className="h-5 w-5 sm:h-6 sm:w-6 text-secondary" />
                      </div>
                      <h2 className="text-xl sm:text-2xl font-bold">
                        {locale === 'ar' ? 'مهمتنا' : 'Our Mission'}
                      </h2>
                    </div>
                    <div
                      className="prose prose-sm sm:prose-base max-w-none dark:prose-invert"
                      dangerouslySetInnerHTML={{ __html: mission.content }}
                    />
                  </CardContent>
                </Card>
              </ScrollReveal>
            )}
          </div>
        </div>
      </section>

      {/* Featured Courses */}
      <section className="bg-muted/30">
        <div className="container-responsive max-w-7xl mx-auto py-10 sm:py-14 lg:py-20">
          <ScrollReveal as="div" y={10}>
            <div className="mb-6 sm:mb-8 lg:mb-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4">
              <div>
                <h2 className="text-2xl sm:text-3xl font-bold">
                  {locale === 'ar' ? 'الدورات المميزة' : 'Featured Courses'}
                </h2>
                <p className="mt-2 text-sm sm:text-base text-muted-foreground">
                  {locale === 'ar' ? 'اكتشف أفضل الدورات التعليمية المتاحة' : 'Discover the best educational courses available'}
                </p>
              </div>
              <Button asChild variant="ghost" className="w-full sm:w-auto touch-target">
                <Link href={`/${locale}/courses`} className={`inline-flex items-center ${isRTL ? 'flex-row-reverse' : ''} gap-2`}>
                  {locale === 'ar' ? 'عرض الكل' : 'View All'}
                  <ArrowRight className={`h-4 w-4 ${isRTL ? 'rotate-180' : ''}`} />
                </Link>
              </Button>
            </div>
          </ScrollReveal>

          <div className="grid gap-4 sm:gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {courses.data.map((course, i) => (
              <ScrollReveal key={course.id} y={12} delay={i * 60}>
                <CourseCard course={course} />
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Scholarships */}
      <section>
        <div className="container-responsive max-w-7xl mx-auto py-10 sm:py-14 lg:py-20">
          <ScrollReveal as="div" y={10}>
            <div className="mb-6 sm:mb-8 lg:mb-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4">
              <div>
                <h2 className="text-2xl sm:text-3xl font-bold">
                  {locale === 'ar' ? 'المنح الدراسية المميزة' : 'Featured Scholarships'}
                </h2>
                <p className="mt-2 text-sm sm:text-base text-muted-foreground">
                  {locale === 'ar' ? 'فرص تعليمية مميزة من أفضل المؤسسات' : 'Exceptional educational opportunities from top institutions'}
                </p>
              </div>
              <Button asChild variant="ghost" className="w-full sm:w-auto touch-target">
                <Link href={`/${locale}/scholarships`} className={`inline-flex items-center ${isRTL ? 'flex-row-reverse' : ''} gap-2`}>
                  {locale === 'ar' ? 'عرض الكل' : 'View All'}
                  <ArrowRight className={`h-4 w-4 ${isRTL ? 'rotate-180' : ''}`} />
                </Link>
              </Button>
            </div>
          </ScrollReveal>

          <div className="grid gap-4 sm:gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {scholarships.data.map((scholarship, i) => (
              <ScrollReveal key={scholarship.id} y={12} delay={i * 60}>
                <ScholarshipCard scholarship={scholarship} />
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-gradient-to-br from-primary to-secondary">
        <div className="container-responsive max-w-7xl mx-auto py-12 sm:py-16 lg:py-20">
          <ScrollReveal as="div" y={12}>
            <div className="mx-auto max-w-2xl text-center space-y-4 sm:space-y-6 text-white">
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold">
                {locale === 'ar' ? 'ابدأ رحلتك التعليمية اليوم' : 'Start Your Educational Journey Today'}
              </h2>
              <p className="text-base sm:text-lg text-white/90">
                {locale === 'ar'
                  ? 'انضم إلى آلاف الطلاب الذين يحققون أهدافهم التعليمية معنا'
                  : 'Join thousands of students achieving their educational goals with us'}
              </p>
              <Button asChild size="lg" variant="secondary" className="touch-target text-base sm:text-lg w-full sm:w-auto">
                <Link href={`/${locale}/register`} className={`inline-flex items-center justify-center ${isRTL ? 'flex-row-reverse' : ''} gap-2`}>
                  {locale === 'ar' ? 'إنشاء حساب مجاني' : 'Create Free Account'}
                  <ArrowRight className={`h-5 w-5 ${isRTL ? 'rotate-180' : ''}`} />
                </Link>
              </Button>
            </div>
          </ScrollReveal>
        </div>
      </section>
    </AppLayout>
  );
}

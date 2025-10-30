import { usePage, router } from '@inertiajs/react';
import { Search, SlidersHorizontal, X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Separator } from '@/components/ui/separator';
import { Card } from '@/components/ui/card';
import { useState, useEffect, useMemo } from 'react';
import type { Platform, Category, LevelOption, Filters, PageProps } from '@/types';
import { useRTL } from '@/hooks/useRTL';

interface ScholarshipFiltersProps {
  platforms: Platform[];
  categories: Category[];
  levels: LevelOption[];
  currentFilters: Filters;
}

/** Sentinels for Radix Select to avoid empty-string items */
const ALL = '__all__';
const ANY = '__any__';

/** string[] -> string (first) | undefined */
const toSingle = (v: string | string[] | undefined | null): string | undefined =>
  Array.isArray(v) ? v[0] : (v || undefined);

/** Filters -> RequestPayload (Record<string, FormDataConvertible>) */
const toPayload = (obj: Filters): Record<string, any> => {
  const payload: Record<string, any> = {};
  for (const [k, v] of Object.entries(obj)) {
    if (v === undefined || v === '' || v === null) continue;
    payload[k] = Array.isArray(v) ? v[0] : v;
  }
  return payload;
};

export default function ScholarshipFilters({
  platforms,
  categories,
  levels,
  currentFilters,
}: ScholarshipFiltersProps) {
  const { locale } = usePage<PageProps>().props;
  const { isRTL } = useRTL();

  const [filters, setFilters] = useState<Filters>(currentFilters);
  const [searchInput, setSearchInput] = useState<string>(toSingle(currentFilters.search) ?? '');

  // Live active filters count (ignores page & empty values)
  const activeFiltersCount = useMemo(() => {
    return Object.entries(filters).filter(([k, v]) => {
      if (k === 'page') return false;
      if (v === undefined || v === '' || v === null) return false;
      return true;
    }).length;
  }, [filters]);

  const applyFilters = (next: Filters) => {
    const clean = toPayload(next);
    router.get(`/${locale}/scholarships`, clean, { preserveState: true, preserveScroll: true });
  };

  const clearFilters = () => {
    setFilters({});
    setSearchInput('');
    router.get(`/${locale}/scholarships`, {}, { preserveState: true, preserveScroll: true });
  };

  // Debounce search input -> filters.search
  useEffect(() => {
    const t = setTimeout(() => {
      setFilters((prev) => ({ ...prev, search: searchInput || undefined, page: undefined }));
    }, 400);
    return () => clearTimeout(t);
  }, [searchInput]);

  // Apply whenever filters change
  useEffect(() => {
    applyFilters(filters);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters]);

  const FilterContent = () => (
    <div className="space-y-4 sm:space-y-6">
      {/* Search */}
      <div className="space-y-2">
        <label className="text-sm font-medium">{locale === 'ar' ? 'البحث' : 'Search'}</label>
        <div className="relative">
          <Search className={`absolute top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground ${isRTL ? 'right-3' : 'left-3'}`} />
          <Input
            type="search"
            placeholder={locale === 'ar' ? 'ابحث عن منح...' : 'Search scholarships...'}
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            className={isRTL ? 'pr-9' : 'pl-9'}
          />
        </div>
      </div>

      <Separator />

      {/* Platform */}
      <div className="space-y-2">
        <label className="text-sm font-medium">{locale === 'ar' ? 'المؤسسة' : 'Institution'}</label>
        <Select
          value={filters.platform_id !== undefined ? String(filters.platform_id) : ALL}
          onValueChange={(v) =>
            setFilters((prev) => ({
              ...prev,
              platform_id: v === ALL ? undefined : parseInt(v),
              page: undefined,
            }))
          }
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder={locale === 'ar' ? 'جميع المؤسسات' : 'All Institutions'} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={ALL}>{locale === 'ar' ? 'جميع المؤسسات' : 'All Institutions'}</SelectItem>
            {platforms.map((p) => (
              <SelectItem key={p.id} value={String(p.id)}>{p.name}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Category */}
      <div className="space-y-2">
        <label className="text-sm font-medium">{locale === 'ar' ? 'الفئة' : 'Category'}</label>
        <Select
          value={filters.category_id !== undefined ? String(filters.category_id) : ALL}
          onValueChange={(v) =>
            setFilters((prev) => ({
              ...prev,
              category_id: v === ALL ? undefined : parseInt(v),
              page: undefined,
            }))
          }
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder={locale === 'ar' ? 'جميع الفئات' : 'All Categories'} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={ALL}>{locale === 'ar' ? 'جميع الفئات' : 'All Categories'}</SelectItem>
            {categories.map((c) => (
              <SelectItem key={c.id} value={String(c.id)}>{c.name}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Level */}
      <div className="space-y-2">
        <label className="text-sm font-medium">{locale === 'ar' ? 'المستوى' : 'Level'}</label>
        <Select
          value={toSingle(filters.level) ?? ALL}
          onValueChange={(v) =>
            setFilters((prev) => ({ ...prev, level: v === ALL ? undefined : v, page: undefined }))
          }
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder={locale === 'ar' ? 'جميع المستويات' : 'All Levels'} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={ALL}>{locale === 'ar' ? 'جميع المستويات' : 'All Levels'}</SelectItem>
            {levels.map((l) => (
              <SelectItem key={l.value} value={l.value}>{l.label}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Certificate */}
      <div className="space-y-2">
        <label className="text-sm font-medium">{locale === 'ar' ? 'الشهادة' : 'Certificate'}</label>
        <Select
          value={
            filters.have_certificate === undefined
              ? ANY
              : (filters.have_certificate ? 'true' : 'false')
          }
          onValueChange={(v) =>
            setFilters((prev) => ({
              ...prev,
              have_certificate: v === ANY ? undefined : v === 'true',
              page: undefined,
            }))
          }
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder={locale === 'ar' ? 'الكل' : 'All'} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={ANY}>{locale === 'ar' ? 'الكل' : 'All'}</SelectItem>
            <SelectItem value="true">{locale === 'ar' ? 'مع شهادة' : 'With Certificate'}</SelectItem>
            <SelectItem value="false">{locale === 'ar' ? 'بدون شهادة' : 'No Certificate'}</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Sort */}
      <div className="space-y-2">
        <label className="text-sm font-medium">{locale === 'ar' ? 'الترتيب' : 'Sort By'}</label>
        <Select
          value={toSingle(filters.sort_by)}
          onValueChange={(v) => setFilters((prev) => ({ ...prev, sort_by: v || undefined, page: undefined }))}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder={locale === 'ar' ? 'الأحدث' : 'Latest'} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="created_at">{locale === 'ar' ? 'الأحدث' : 'Latest'}</SelectItem>
            <SelectItem value="title">{locale === 'ar' ? 'العنوان' : 'Title'}</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Button onClick={clearFilters} variant="outline" className="w-full touch-target">
        <X className={`h-4 w-4 ${isRTL ? 'ml-2' : 'mr-2'}`} />
        {locale === 'ar' ? 'مسح الفلاتر' : 'Clear Filters'}
      </Button>
    </div>
  );

  return (
    <>
      {/* Desktop */}
      <div className="hidden lg:block">
        <Card className="p-4 sm:p-6">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-semibold text-base sm:text-lg">{locale === 'ar' ? 'الفلاتر' : 'Filters'}</h2>
            {activeFiltersCount > 0 && <Badge variant="secondary">{activeFiltersCount}</Badge>}
          </div>
          <FilterContent />
        </Card>
      </div>

      {/* Mobile */}
      <div className="lg:hidden">
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="outline" className="w-full touch-target">
              <SlidersHorizontal className={`h-4 w-4 ${isRTL ? 'ml-2' : 'mr-2'}`} />
              {locale === 'ar' ? 'الفلاتر' : 'Filters'}
              {activeFiltersCount > 0 && (
                <Badge variant="secondary" className={isRTL ? 'mr-2' : 'ml-2'}>
                  {activeFiltersCount}
                </Badge>
              )}
            </Button>
          </SheetTrigger>
          <SheetContent
            side={isRTL ? 'right' : 'left'}
            className="p-0 w-[86%] sm:w-[420px] pt-[env(safe-area-inset-top)]"
          >
            <SheetHeader className="px-4 py-3 border-b">
              <SheetTitle>{locale === 'ar' ? 'الفلاتر' : 'Filters'}</SheetTitle>
            </SheetHeader>
            <div className="px-4 py-5">
              <FilterContent />
            </div>
            <div className="h-[env(safe-area-inset-bottom)]" />
          </SheetContent>
        </Sheet>
      </div>
    </>
  );
}

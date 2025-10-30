import { usePage } from '@inertiajs/react';
import { useEffect } from 'react';
import type { PageProps } from '@/types';

export function useRTL() {
  const { locale } = usePage<PageProps>().props;
  const isRTL = locale === 'ar';

  useEffect(() => {
    // Set direction on html element
    document.documentElement.dir = isRTL ? 'rtl' : 'ltr';
    document.documentElement.lang = locale;
  }, [locale, isRTL]);

  return {
    isRTL,
    locale,
    dir: isRTL ? 'rtl' : 'ltr',
    // Helper for conditional classes
    rtl: (rtlClass: string, ltrClass: string = '') => isRTL ? rtlClass : ltrClass,
    // Helper for margin/padding
    ms: isRTL ? 'mr' : 'ml', // margin-start
    me: isRTL ? 'ml' : 'mr', // margin-end
    ps: isRTL ? 'pr' : 'pl', // padding-start
    pe: isRTL ? 'pl' : 'pr', // padding-end
  };
}

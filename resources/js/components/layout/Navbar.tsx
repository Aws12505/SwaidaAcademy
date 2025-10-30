import { Link, usePage } from '@inertiajs/react';
import {
  Menu, X, GraduationCap, Award, BookOpen,
  LogIn, UserPlus, User, LogOut
} from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem,
  DropdownMenuSeparator, DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import SearchBar from '@/components/common/SearchBar';
import LanguageSwitcher from '@/components/common/LanguageSwitcher';
import ThemeToggle from '@/components/common/ThemeToggle';
import { router } from '@inertiajs/react';
import type { PageProps } from '@/types';
import { useRTL } from '@/hooks/useRTL';

export default function Navbar() {
  const { auth, locale } = usePage<PageProps>().props;
  const [open, setOpen] = useState(false);
  const { isRTL } = useRTL();

  const navLinks = [
    { name: locale === 'ar' ? 'الرئيسية' : 'Home', href: `/${locale}`, icon: null },
    { name: locale === 'ar' ? 'الدورات' : 'Courses', href: `/${locale}/courses`, icon: GraduationCap },
    { name: locale === 'ar' ? 'المنح الدراسية' : 'Scholarships', href: `/${locale}/scholarships`, icon: Award },
    { name: locale === 'ar' ? 'المدونة' : 'Blog', href: `/${locale}/blogs`, icon: BookOpen },
  ];

  const handleLogout = () => router.post('/logout');

  return (
    <nav className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container-responsive max-w-7xl mx-auto">
        <div className="flex h-16 items-center justify-between gap-3">
          {/* Logo */}
          <Link href={`/${locale}`} className={`flex items-center ${isRTL ? 'space-x-reverse' : ''} gap-2`}>
            <img src="/logo.svg" alt="Logo" className="h-25 w-25" />
            <span className="hidden sm:inline-block font-bold text-xl bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              Swaida Academy
            </span>
          </Link>

          {/* Desktop nav */}
          <div className={`hidden md:flex items-center ${isRTL ? 'space-x-reverse' : ''} gap-5`}>
            {navLinks.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className={`inline-flex items-center ${isRTL ? 'space-x-reverse' : ''} gap-2 text-sm font-medium text-muted-foreground transition-colors hover:text-primary`}
              >
                {l.icon && <l.icon className="h-4 w-4" />}
                <span>{l.name}</span>
              </Link>
            ))}
          </div>

          {/* Right actions */}
          <div className={`flex items-center ${isRTL ? 'space-x-reverse' : ''} gap-1.5 sm:gap-2`}>
            <SearchBar placeholder={locale === 'ar' ? 'بحث...' : 'Search...'} />
            <ThemeToggle />
            <LanguageSwitcher currentLocale={locale} />

            {auth.user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="hidden md:flex touch-target">
                    <User className="h-5 w-5" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuItem disabled>
                    <div className="flex flex-col gap-0.5">
                      <p className="text-sm font-medium">{auth.user.name}</p>
                      <p className="text-xs text-muted-foreground">{auth.user.email}</p>
                      {auth.user.whatsapp_number && (
                        <p className="text-xs text-muted-foreground">{auth.user.whatsapp_number}</p>
                      )}
                    </div>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout} className="text-destructive">
                    <LogOut className="h-4 w-4" />
                    <span className="ms-2">{locale === 'ar' ? 'تسجيل الخروج' : 'Logout'}</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <div className={`hidden md:flex items-center ${isRTL ? 'space-x-reverse' : ''} gap-2`}>
                <Button asChild variant="ghost" size="sm" className="touch-target">
                  <Link href={`/${locale}/login`} className="inline-flex items-center gap-2">
                    <LogIn className="h-4 w-4" />
                    {locale === 'ar' ? 'تسجيل الدخول' : 'Login'}
                  </Link>
                </Button>
                <Button asChild size="sm" className="touch-target">
                  <Link href={`/${locale}/register`} className="inline-flex items-center gap-2">
                    <UserPlus className="h-4 w-4" />
                    {locale === 'ar' ? 'إنشاء حساب' : 'Sign Up'}
                  </Link>
                </Button>
              </div>
            )}

            {/* Mobile menu */}
            <Sheet open={open} onOpenChange={setOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="md:hidden touch-target" aria-label="Open menu">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>

              {/* CONTROL ALL PADDING INSIDE — p-0 here */}
              <SheetContent
                side={isRTL ? 'left' : 'right'}
                className="p-0 w-[86%] sm:w-[380px] pt-[env(safe-area-inset-top)]"
              >
                {/* Sheet header */}
                <div className="flex items-center justify-between px-4 py-3 border-b">
                  <Link
                    href={`/${locale}`}
                    onClick={() => setOpen(false)}
                    className={`flex items-center ${isRTL ? 'space-x-reverse' : ''} gap-2`}
                  >
                    <img src="/logo.svg" alt="Logo" className="h-25 w-25" />
                    <span className="font-semibold">Swaida Academy</span>
                  </Link>
                  {/* <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setOpen(false)}
                    className="touch-target"
                    aria-label={locale === 'ar' ? 'إغلاق القائمة' : 'Close menu'}
                  >
                    <X className="h-5 w-5" />
                  </Button> */}
                </div>

                {/* Primary nav */}
                <div className="px-2 py-2">
                  <nav className="flex flex-col gap-1">
                    {navLinks.map((l) => (
                      <Link
                        key={l.href}
                        href={l.href}
                        onClick={() => setOpen(false)}
                        className={`
                          rounded-md px-3 py-2 text-base
                          inline-flex items-center ${isRTL ? 'space-x-reverse' : ''} gap-3
                          hover:bg-muted/60 transition-colors
                        `}
                      >
                        {l.icon && <l.icon className="h-5 w-5 text-muted-foreground" />}
                        <span>{l.name}</span>
                      </Link>
                    ))}
                  </nav>
                </div>

                <div className="px-4 py-3 border-t">
                  {auth.user ? (
                    <div className="space-y-3">
                      <div>
                        <p className="text-sm font-medium">{auth.user.name}</p>
                        <p className="text-xs text-muted-foreground">{auth.user.email}</p>
                      </div>
                      <Button
                        variant="destructive"
                        className="w-full touch-target"
                        onClick={() => { handleLogout(); setOpen(false); }}
                      >
                        <LogOut className="h-4 w-4" />
                        <span className="ms-2">{locale === 'ar' ? 'تسجيل الخروج' : 'Logout'}</span>
                      </Button>
                    </div>
                  ) : (
                    <div className="grid grid-cols-2 gap-2">
                      <Button asChild variant="outline" className="touch-target">
                        <Link href={`/${locale}/login`} onClick={() => setOpen(false)} className="inline-flex items-center justify-center gap-2">
                          <LogIn className="h-4 w-4" />
                          {locale === 'ar' ? 'دخول' : 'Login'}
                        </Link>
                      </Button>
                      <Button asChild className="touch-target">
                        <Link href={`/${locale}/register`} onClick={() => setOpen(false)} className="inline-flex items-center justify-center gap-2">
                          <UserPlus className="h-4 w-4" />
                          {locale === 'ar' ? 'حساب' : 'Sign Up'}
                        </Link>
                      </Button>
                    </div>
                  )}
                </div>

                {/* Footer actions area
                <div className="px-4 py-3 border-t grid grid-cols-3 gap-2">
                  <SearchBar placeholder={locale === 'ar' ? 'بحث...' : 'Search...'} />
                  <ThemeToggle />
                  <LanguageSwitcher currentLocale={locale} />
                </div>
                <div className="h-[env(safe-area-inset-bottom)]" /> */}
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </nav>
  );
}

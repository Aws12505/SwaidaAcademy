import { Link, usePage } from '@inertiajs/react';
import { Mail, Facebook, Twitter, Linkedin, Instagram } from 'lucide-react';
import type { PageProps } from '@/types';
import { useRTL } from '@/hooks/useRTL';

export default function Footer() {
  const { locale } = usePage<PageProps>().props;
  const { isRTL } = useRTL();
  const currentYear = new Date().getFullYear();

  const footerLinks = [
    {
      title: locale === 'ar' ? 'روابط سريعة' : 'Quick Links',
      links: [
        { name: locale === 'ar' ? 'الرئيسية' : 'Home', href: `/${locale}` },
        { name: locale === 'ar' ? 'الدورات' : 'Courses', href: `/${locale}/courses` },
        { name: locale === 'ar' ? 'المنح الدراسية' : 'Scholarships', href: `/${locale}/scholarships` },
        { name: locale === 'ar' ? 'المدونة' : 'Blog', href: `/${locale}/blogs` },
      ],
    },
  ];

  const socialLinks = [
    { icon: Facebook, href: '#', label: 'Facebook' },
    { icon: Twitter, href: '#', label: 'Twitter' },
    { icon: Linkedin, href: '#', label: 'LinkedIn' },
    { icon: Instagram, href: '#', label: 'Instagram' },
  ];

  return (
    <footer className="border-t bg-card">
      <div className="container-responsive max-w-7xl mx-auto py-10 sm:py-14">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-10">
          {/* Brand */}
          <div className="space-y-4 text-center sm:text-start">
            <Link
              href={`/${locale}`}
              className={`flex items-center ${isRTL ? 'space-x-reverse' : ''} gap-2 justify-center sm:justify-start`}
            >
              <img src="/logo.svg" alt="Logo" className="h-25 w-25" />
              <span className="font-bold text-xl bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                Swaida Academy
              </span>
            </Link>
            <p className="text-sm text-muted-foreground max-w-md mx-auto sm:mx-0">
              {locale === 'ar'
                ? 'منصتك الموثوقة للوصول إلى أفضل الدورات والمنح الدراسية حول العالم.'
                : 'Your trusted platform to access the best courses and scholarships worldwide.'}
            </p>
          </div>

          {/* Quick Links */}
          {footerLinks.map((group) => (
            <div key={group.title} className="text-center sm:text-start">
              <h3 className="mb-4 text-sm font-semibold">{group.title}</h3>
              <ul className="space-y-2">
                {group.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-muted-foreground transition-colors hover:text-primary"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {/* Contact */}
          <div className="text-center sm:text-start">
            <h3 className="mb-4 text-sm font-semibold">
              {locale === 'ar' ? 'تواصل معنا' : 'Contact Us'}
            </h3>
            <div className="space-y-2">
              <a
                href="mailto:info@eduportal.com"
                className={`inline-flex items-center ${isRTL ? 'space-x-reverse' : ''} gap-2 text-sm text-muted-foreground transition-colors hover:text-primary`}
              >
                <Mail className="h-4 w-4" />
                <span>info@eduportal.com</span>
              </a>
            </div>
          </div>

          {/* Social */}
          <div className="text-center sm:text-start">
            <h3 className="mb-4 text-sm font-semibold">
              {locale === 'ar' ? 'تابعنا' : 'Follow Us'}
            </h3>
            <div className={`flex ${isRTL ? 'space-x-reverse' : ''} gap-3 justify-center sm:justify-start`}>
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  className="touch-target flex h-9 w-9 items-center justify-center rounded-full bg-muted text-muted-foreground transition-colors hover:bg-primary hover:text-primary-foreground"
                  aria-label={social.label}
                >
                  <social.icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-8 sm:mt-10 border-t pt-6">
          <p className="text-center text-xs sm:text-sm text-muted-foreground">
            © {currentYear} Swaida Academy. {locale === 'ar' ? 'جميع الحقوق محفوظة.' : 'All rights reserved.'}
          </p>
        </div>
      </div>
    </footer>
  );
}

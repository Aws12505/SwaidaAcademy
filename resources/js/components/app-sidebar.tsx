import { NavFooter } from '@/components/nav-footer';
import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '@/components/ui/sidebar';
import { type NavItem } from '@/types';
import { Link } from '@inertiajs/react';
import {
  LayoutDashboard,
  GraduationCap,
  Award,
  Layers,
  Tags,
  Target,
  Eye,
  Newspaper,
  Users,
} from "lucide-react";
import AppLogo from './app-logo';

const mainNavItems: NavItem[] = [
    {
    title: 'Dashboard',
    href: '/admin/dashboard',
    icon: LayoutDashboard,
    group: 'General',
  },
  {
    title: 'Courses',
    href: '/admin/courses',
    icon: GraduationCap,
    group: 'General',
  },
  {
    title: 'Scholarships',
    href: '/admin/scholarships',
    icon: Award,
    group: 'General',
  },
  {
    title: 'Platforms',
    href: '/admin/platforms',
    icon: Layers,
    group: 'General',
  },
  {
    title: 'Categories',
    href: '/admin/categories',
    icon: Tags,
    group: 'General',
  },
  {
    title: 'Mission',
    href: '/admin/mission/edit',
    icon: Target,
    group: 'General',
  },
  {
    title: 'Vision',
    href: '/admin/vision/edit',
    icon: Eye,
    group: 'General',
  },
  {
    title: 'Blogs',
    href: '/admin/blogs',
    icon: Newspaper,
    group: 'General',
  },
  {
    title: 'Users',
    href: '/admin/users',
    icon: Users,
    group: 'General',
  },
];

const footerNavItems: NavItem[] = [
    // {
    //     title: 'Repository',
    //     href: 'https://github.com/laravel/react-starter-kit',
    //     icon: Folder,
    // },
    // {
    //     title: 'Documentation',
    //     href: 'https://laravel.com/docs/starter-kits#react',
    //     icon: BookOpen,
    // },
];

export function AppSidebar() {
    return (
        <Sidebar collapsible="icon" variant="inset">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link href="/admin/header" prefetch>
                                <AppLogo />
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent>
                <NavMain items={mainNavItems} />
            </SidebarContent>

            <SidebarFooter>
                <NavFooter items={footerNavItems} className="mt-auto" />
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}

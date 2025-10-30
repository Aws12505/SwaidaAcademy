import { LucideIcon } from 'lucide-react';
import type { Config } from 'ziggy-js';

export interface Auth {
    user: User;
}

export interface BreadcrumbItem {
    title: string;
    href: string;
}

export interface NavGroup {
    title: string;
    items: NavItem[];
}

export interface NavItem {
    title: string;
    href: string;
    icon?: LucideIcon | null;
    isActive?: boolean;
    group: string;
}

export interface SharedData {
    name: string;
    quote: { message: string; author: string };
    auth: Auth;
    ziggy: Config & { location: string };
    sidebarOpen: boolean;
    flash?: {
        success?: string;
        error?: string;
    };
    locale: string;

    [key: string]: unknown;
}

export interface User {
  id: number;
  name: string;
  email: string;
  whatsapp_number?: string | null; // ✅ add
  is_admin: boolean;               // ✅ add
  email_verified_at?: string;
  created_at: string;
  updated_at: string;
}

export interface Platform {
  id: number;
  name: string;
}

export interface Category {
  id: number;
  name: string;
}

export interface ImageGallery {
  id: number;
  image_path: string;
  image_url: string;
  is_cover: boolean;
}

export interface Course {
  id: number;
  title: string;
  description: string;
  slug: string;
  external_url: string;
  duration?: string;
  platform_id: number;
  category_id: number;
  have_certificate: boolean;
  level: 'beginner' | 'intermediate' | 'expert';
  platform: Platform;
  category: Category;
  cover_image?: ImageGallery;
  images?: ImageGallery[];
  created_at: string;
  updated_at: string;
}

export interface Scholarship {
  id: number;
  title: string;
  slug: string;
  description: string;
  external_url: string;
  duration?: string;
  platform_id: number;
  category_id: number;
  have_certificate: boolean;
  level: 'beginner' | 'intermediate' | 'expert';
  platform: Platform;
  category: Category;
  cover_image?: ImageGallery;
  images?: ImageGallery[];
  created_at: string;
  updated_at: string;
}

export interface Blog {
  id: number;
  title: string;
  content: string;
  cover_image?: ImageGallery;
  images?: ImageGallery[];
  created_at: string;
  updated_at: string;
  slug: string;
}

export interface Vision {
  id: number;
  content: string;
}

export interface Mission {
  id: number;
  content: string;
}

export interface LevelOption {
  value: string;
  label: string;
}

export interface Filters {
  search?: string;
  platform_id?: number | number[];
  category_id?: number | number[];
  level?: string | string[];
  have_certificate?: boolean;
  duration?: string;
  sort_by?: string;
  sort_direction?: 'asc' | 'desc';
}

export interface PaginatedData<T> {
  data: T[];
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
  from: number;
  to: number;
  links: {
    url: string | null;
    label: string;
    active: boolean;
  }[];
}

export type PageProps<T extends Record<string, any> = Record<string, any>> = T & {
  auth: {
    user: User | null;
  };
  locale: string;
};


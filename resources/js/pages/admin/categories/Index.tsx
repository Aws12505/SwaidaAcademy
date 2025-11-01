import { Head, Link, router } from '@inertiajs/react';
import { Plus, Pencil, Trash2, Eye, Search } from 'lucide-react';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { BreadcrumbItem } from '@/types';
import type { Category } from '@/types';
import { useMemo, useState } from 'react';

type CatRow = Category & {
  name: string | { en?: string; ar?: string };
  courses_count?: number;
  scholarships_count?: number;
};

interface CategoriesIndexProps {
  categories: CatRow[];
}

const breadcrumbs: BreadcrumbItem[] = [
  { title: 'Dashboard', href: '/admin/dashboard' },
  { title: 'Categories', href: '/admin/categories' },
];

const isObj = (v: unknown): v is Record<string, any> =>
  v !== null && typeof v === 'object' && !Array.isArray(v);

const getName = (n: CatRow['name']) => (isObj(n) ? (n.en ?? n.ar ?? '') : (n ?? ''));

export default function CategoriesIndex({ categories }: CategoriesIndexProps) {
  const [search, setSearch] = useState('');

  const handleDelete = (id: number) => {
    router.delete(`/admin/categories/${id}`, { preserveScroll: true });
  };

  const filteredCategories = useMemo(() => {
    const q = search.toLowerCase();
    return categories.filter((c) => getName(c.name).toLowerCase().includes(q));
  }, [categories, search]);

  const totalItems = useMemo(
    () =>
      categories.reduce(
        (sum, c) => sum + (c.courses_count ?? 0) + (c.scholarships_count ?? 0),
        0
      ),
    [categories]
  );

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Categories Management" />

      <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4 overflow-x-auto">
        {/* Stats Cards */}
        <div className="grid auto-rows-min gap-4 md:grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Categories</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{categories.length}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{categories.length}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Items</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalItems}</div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <div className="relative min-h-[100vh] flex-1 rounded-xl border border-sidebar-border/70 md:min-h-min dark:border-sidebar-border">
          <div className="p-6 space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-2xl font-bold">Categories Management</h2>
                <p className="text-muted-foreground">Manage course and scholarship categories</p>
              </div>
              <Button asChild>
                <Link href="/admin/categories/create">
                  <Plus className="mr-2 h-4 w-4" />
                  Add Category
                </Link>
              </Button>
            </div>

            {/* Search */}
            <div className="relative max-w-sm">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search categories..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9"
              />
            </div>

            {/* Table */}
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Courses</TableHead>
                    <TableHead>Scholarships</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredCategories.length > 0 ? (
                    filteredCategories.map((category) => {
                      const name = getName(category.name);
                      return (
                        <TableRow key={category.id}>
                          <TableCell className="font-medium">{category.id}</TableCell>
                          <TableCell className="font-medium">{name}</TableCell>
                          <TableCell>
                            <Badge variant="outline">{category.courses_count ?? 0}</Badge>
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline">{category.scholarships_count ?? 0}</Badge>
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-2">
                              <Button asChild variant="ghost" size="icon">
                                <Link href={`/admin/categories/${category.id}`}>
                                  <Eye className="h-4 w-4" />
                                </Link>
                              </Button>
                              <Button asChild variant="ghost" size="icon">
                                <Link href={`/admin/categories/${category.id}/edit`}>
                                  <Pencil className="h-4 w-4" />
                                </Link>
                              </Button>
                              <AlertDialog>
                                <AlertDialogTrigger asChild>
                                  <Button variant="ghost" size="icon">
                                    <Trash2 className="h-4 w-4 text-destructive" />
                                  </Button>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                  <AlertDialogHeader>
                                    <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                                    <AlertDialogDescription>
                                      This action cannot be undone. This will permanently delete the category.
                                    </AlertDialogDescription>
                                  </AlertDialogHeader>
                                  <AlertDialogFooter>
                                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                                    <AlertDialogAction onClick={() => handleDelete(category.id)}>
                                      Delete
                                    </AlertDialogAction>
                                  </AlertDialogFooter>
                                </AlertDialogContent>
                              </AlertDialog>
                            </div>
                          </TableCell>
                        </TableRow>
                      );
                    })
                  ) : (
                    <TableRow>
                      <TableCell colSpan={5} className="h-24 text-center">
                        No categories found.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}

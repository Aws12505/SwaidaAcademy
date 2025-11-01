import { Head, Link, router } from '@inertiajs/react';
import { Plus, Pencil, Trash2, Eye, Search } from 'lucide-react';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from '@/components/ui/table';
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader,
  AlertDialogTitle, AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { BreadcrumbItem } from '@/types';
import { useMemo, useState } from 'react';

type Translatable = string | { en?: string; ar?: string };

type PlatformRow = {
  id: number;
  name: Translatable;
  courses_count?: number;
  scholarships_count?: number;
};

interface PlatformsIndexProps {
  platforms: PlatformRow[];
}

const breadcrumbs: BreadcrumbItem[] = [
  { title: 'Dashboard', href: '/admin/dashboard' },
  { title: 'Platforms', href: '/admin/platforms' },
];

const isObj = (v: unknown): v is Record<string, any> =>
  v !== null && typeof v === 'object' && !Array.isArray(v);

const getName = (n: Translatable) => (isObj(n) ? (n.en ?? n.ar ?? '') : (n ?? ''));

export default function PlatformsIndex({ platforms }: PlatformsIndexProps) {
  const [search, setSearch] = useState('');

  const handleDelete = (id: number) => {
    router.delete(`/admin/platforms/${id}`, { preserveScroll: true });
  };

  const filteredPlatforms = useMemo(() => {
    const q = search.toLowerCase();
    return platforms.filter((p) => getName(p.name).toLowerCase().includes(q));
  }, [platforms, search]);

  const totalItems = useMemo(
    () => platforms.reduce(
      (sum, p) => sum + (p.courses_count ?? 0) + (p.scholarships_count ?? 0),
      0
    ),
    [platforms]
  );

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Platforms Management" />

      <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4 overflow-x-auto">
        {/* Stats Cards */}
        <div className="grid auto-rows-min gap-4 md:grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Platforms</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{platforms.length}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{platforms.length}</div>
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
                <h2 className="text-2xl font-bold">Platforms Management</h2>
                <p className="text-muted-foreground">Manage course and scholarship platforms</p>
              </div>
              <Button asChild>
                <Link href="/admin/platforms/create">
                  <Plus className="mr-2 h-4 w-4" />
                  Add Platform
                </Link>
              </Button>
            </div>

            {/* Search */}
            <div className="relative max-w-sm">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search platforms..."
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
                  {filteredPlatforms.length > 0 ? (
                    filteredPlatforms.map((p) => {
                      const name = getName(p.name);
                      return (
                        <TableRow key={p.id}>
                          <TableCell className="font-medium">{p.id}</TableCell>
                          <TableCell className="font-medium">{name}</TableCell>
                          <TableCell>
                            <Badge variant="outline">{p.courses_count ?? 0}</Badge>
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline">{p.scholarships_count ?? 0}</Badge>
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-2">
                              <Button asChild variant="ghost" size="icon">
                                <Link href={`/admin/platforms/${p.id}`}>
                                  <Eye className="h-4 w-4" />
                                </Link>
                              </Button>
                              <Button asChild variant="ghost" size="icon">
                                <Link href={`/admin/platforms/${p.id}/edit`}>
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
                                      This action cannot be undone. This will permanently delete the platform.
                                    </AlertDialogDescription>
                                  </AlertDialogHeader>
                                  <AlertDialogFooter>
                                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                                    <AlertDialogAction onClick={() => handleDelete(p.id)}>
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
                        No platforms found.
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

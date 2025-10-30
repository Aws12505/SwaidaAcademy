// resources/js/pages/admin/users/Index.tsx
import { Head, Link, router } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Plus, Pencil, Trash2, Eye, Search, ShieldCheck, Shield } from 'lucide-react';
import type { BreadcrumbItem, PaginatedData, User } from '@/types';
import { useState } from 'react';

interface Props {
  users: PaginatedData<User>;
  filters: { search: string };
}

const breadcrumbs: BreadcrumbItem[] = [
  { title: 'Dashboard', href: '/admin/dashboard' },
  { title: 'Users', href: '/admin/users' },
];

export default function UsersIndex({ users, filters }: Props) {
  const [search, setSearch] = useState(filters.search || '');

  const handleDelete = (id: number) => {
    router.delete(`/admin/users/${id}`, { preserveScroll: true });
  };

  const onSearch = (e: React.FormEvent) => {
    e.preventDefault();
    router.get('/admin/users', { search }, { preserveScroll: true, replace: true });
  };

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Users Management" />

      <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4 overflow-x-auto">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold">Users Management</h2>
            <p className="text-muted-foreground">Manage platform users</p>
          </div>
          <Button asChild>
            <Link href="/admin/users/create">
              <Plus className="mr-2 h-4 w-4" />
              Add User
            </Link>
          </Button>
        </div>

        <form onSubmit={onSearch} className="relative max-w-sm">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search users..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </form>

        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>WhatsApp</TableHead>
                <TableHead>Role</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.data.length ? (
                users.data.map((u) => (
                  <TableRow key={u.id}>
                    <TableCell className="font-medium">{u.name}</TableCell>
                    <TableCell>{u.email}</TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {u.whatsapp_number ?? '—'}
                    </TableCell>
                    <TableCell>
                      {u.is_admin ? (
                        <Badge variant="outline" className="gap-1"><ShieldCheck className="h-3 w-3" /> Admin</Badge>
                      ) : (
                        <Badge variant="outline" className="gap-1"><Shield className="h-3 w-3" /> User</Badge>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button asChild variant="ghost" size="icon">
                          <Link href={`/admin/users/${u.id}`}>
                            <Eye className="h-4 w-4" />
                          </Link>
                        </Button>
                        <Button asChild variant="ghost" size="icon">
                          <Link href={`/admin/users/${u.id}/edit`}>
                            <Pencil className="h-4 w-4" />
                          </Link>
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => handleDelete(u.id)}>
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={5} className="h-24 text-center">No users found.</TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        {users.last_page > 1 && (
          <div className="flex justify-center gap-2">
            {users.links.map((link, i) => (
              <Button key={i} variant={link.active ? 'default' : 'outline'} size="sm" disabled={!link.url} asChild={!!link.url}>
                {link.url ? (
                  <a href={link.url} dangerouslySetInnerHTML={{ __html: link.label }} />
                ) : (
                  <span dangerouslySetInnerHTML={{ __html: link.label }} />
                )}
              </Button>
            ))}
          </div>
        )}
      </div>
    </AppLayout>
  );
}

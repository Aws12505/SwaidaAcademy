import { Head, Link, router, usePage } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from '@/components/ui/table';
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import {
  Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription,
} from '@/components/ui/dialog';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Eye, Trash2, Search } from 'lucide-react';
import { useMemo, useState } from 'react';
import type { BreadcrumbItem } from '@/types';
import type { ContactMessage, PaginatedData } from '@/types';
import { formatDate } from '@/lib/utils';

interface Props {
  messages: PaginatedData<ContactMessage>;
  filters: { search: string };
}

const breadcrumbs: BreadcrumbItem[] = [
  { title: 'Dashboard', href: '/admin/dashboard' },
  { title: 'Contact Messages', href: '/admin/contact-messages' },
];

export default function ContactsIndex({ messages, filters }: Props) {
  const [search, setSearch] = useState(filters?.search ?? '');

  const onSearch = (e: React.FormEvent) => {
    e.preventDefault();
    router.get('/admin/contact-messages', { search }, { preserveState: true, preserveScroll: true });
  };

  const totalThisMonth = useMemo(() => {
    const now = new Date();
    return messages.data.filter((m) => {
      const d = new Date(m.created_at as unknown as string);
      return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
    }).length;
  }, [messages.data]);

  const handleDelete = (id: number) => {
    router.delete(`/admin/contact-messages/${id}`, { preserveScroll: true });
  };

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Contact Messages" />

      <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4 overflow-x-auto">
        {/* Stats */}
        <div className="grid auto-rows-min gap-4 md:grid-cols-3">
          <Card><CardHeader className="pb-2"><CardTitle className="text-sm">Total Messages</CardTitle></CardHeader><CardContent><div className="text-2xl font-bold">{messages.total}</div></CardContent></Card>
          <Card><CardHeader className="pb-2"><CardTitle className="text-sm">This Month</CardTitle></CardHeader><CardContent><div className="text-2xl font-bold">{totalThisMonth}</div></CardContent></Card>
          <Card><CardHeader className="pb-2"><CardTitle className="text-sm">Per Page</CardTitle></CardHeader><CardContent><div className="text-2xl font-bold">{messages.per_page}</div></CardContent></Card>
        </div>

        {/* Shell */}
        <div className="relative min-h-[100vh] flex-1 rounded-xl border md:min-h-min dark:border-sidebar-border">
          <div className="p-6 space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-2xl font-bold">Contact Messages</h2>
                <p className="text-muted-foreground">Review and manage contact form submissions</p>
              </div>
            </div>

            {/* Search */}
            <form onSubmit={onSearch} className="relative max-w-sm">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search name, email, or WhatsApp..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9"
              />
            </form>

            {/* Table */}
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Full Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>WhatsApp</TableHead>
                    <TableHead>Received</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {messages.data.length ? messages.data.map((m) => (
                    <TableRow key={m.id}>
                      <TableCell className="font-medium">{m.full_name}</TableCell>
                      <TableCell className="text-sm text-muted-foreground">{m.email ?? '-'}</TableCell>
                      <TableCell className="text-sm">{m.whatsapp_number}</TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {formatDate(m.created_at as unknown as string, 'en')}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          {/* View Dialog */}
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button variant="ghost" size="icon">
                                <Eye className="h-4 w-4" />
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="sm:max-w-lg">
                              <DialogHeader>
                                <DialogTitle>Message from {m.full_name}</DialogTitle>
                                <DialogDescription>
                                  Received: {formatDate(m.created_at as unknown as string, 'en')}
                                </DialogDescription>
                              </DialogHeader>
                              <div className="space-y-2">
                                <div><span className="font-medium">Email:</span> {m.email ?? '—'}</div>
                                <div><span className="font-medium">WhatsApp:</span> {m.whatsapp_number}</div>
                                <div className="mt-4">
                                  <div className="font-medium mb-1">Message</div>
                                  <div className="rounded-md border p-3 whitespace-pre-wrap text-sm">{m.message}</div>
                                </div>
                              </div>
                            </DialogContent>
                          </Dialog>

                          {/* Delete with confirm */}
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button variant="ghost" size="icon">
                                <Trash2 className="h-4 w-4 text-destructive" />
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Delete this message?</AlertDialogTitle>
                                <AlertDialogDescription>
                                  This action cannot be undone.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction onClick={() => handleDelete(m.id)}>
                                  Delete
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </div>
                      </TableCell>
                    </TableRow>
                  )) : (
                    <TableRow>
                      <TableCell colSpan={5} className="h-24 text-center">No messages found.</TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>

            {/* Pagination */}
            {messages.last_page > 1 && (
              <div className="flex justify-center gap-2">
                {messages.links.map((link, idx) => (
                  <Button
                    key={idx}
                    variant={link.active ? 'default' : 'outline'}
                    size="sm"
                    disabled={!link.url}
                    asChild={!!link.url}
                  >
                    {link.url
                      ? <a href={link.url} dangerouslySetInnerHTML={{ __html: link.label }} />
                      : <span dangerouslySetInnerHTML={{ __html: link.label }} />
                    }
                  </Button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </AppLayout>
  );
}

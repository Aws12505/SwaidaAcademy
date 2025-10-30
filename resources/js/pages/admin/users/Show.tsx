// resources/js/pages/admin/users/Show.tsx
import { Head, Link } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Pencil, ShieldCheck, Shield } from 'lucide-react';
import type { BreadcrumbItem, User } from '@/types';

const breadcrumbs: BreadcrumbItem[] = [
  { title: 'Dashboard', href: '/admin/dashboard' },
  { title: 'Users', href: '/admin/users' },
  { title: 'View', href: '#' },
];

export default function ShowUser({ user }: { user: User }) {
  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title={user.name} />
      <div className="p-4">
        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button asChild variant="outline" size="icon">
              <Link href="/admin/users"><ArrowLeft className="h-4 w-4" /></Link>
            </Button>
            <div>
              <h2 className="text-2xl font-bold">User Details</h2>
              <p className="text-muted-foreground">View user information</p>
            </div>
          </div>
          <Button asChild><Link href={`/admin/users/${user.id}/edit`}><Pencil className="mr-2 h-4 w-4" />Edit</Link></Button>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <Card>
            <CardHeader><CardTitle>Basic</CardTitle></CardHeader>
            <CardContent className="space-y-3">
              <div><span className="text-sm text-muted-foreground">Name</span><div className="font-medium">{user.name}</div></div>
              <div><span className="text-sm text-muted-foreground">Email</span><div className="font-medium">{user.email}</div></div>
              <div><span className="text-sm text-muted-foreground">WhatsApp</span><div className="font-medium">{user.whatsapp_number ?? '—'}</div></div>
              <div>
                <span className="text-sm text-muted-foreground">Role</span>
                <div className="mt-1">
                  {user.is_admin ? (
                    <Badge variant="outline" className="gap-1"><ShieldCheck className="h-3 w-3" /> Admin</Badge>
                  ) : (
                    <Badge variant="outline" className="gap-1"><Shield className="h-3 w-3" /> User</Badge>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </AppLayout>
  );
}

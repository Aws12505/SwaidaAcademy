// resources/js/pages/admin/users/Edit.tsx
import { Head, useForm, Link } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft } from 'lucide-react';
import type { BreadcrumbItem, User } from '@/types';
import { FormEventHandler } from 'react';

const breadcrumbs: BreadcrumbItem[] = [
  { title: 'Dashboard', href: '/admin/dashboard' },
  { title: 'Users', href: '/admin/users' },
  { title: 'Edit', href: '#' },
];

export default function EditUser({ user }: { user: User }) {
  const { data, setData, put, processing, errors } = useForm<{
    name: string;
    email: string;
    whatsapp_number: string | null;
    is_admin: boolean;
    password: string;
    password_confirmation: string;
  }>({
    name: user.name,
    email: user.email,
    whatsapp_number: user.whatsapp_number ?? '',
    is_admin: user.is_admin,
    password: '',
    password_confirmation: '',
  });

  const whatsappRequired = !data.is_admin;

  const submit: FormEventHandler = (e) => {
    e.preventDefault();
    put(`/admin/users/${user.id}`);
  };

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title={`Edit: ${user.name}`} />
      <div className="p-4">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold">Edit User</h2>
            <p className="text-muted-foreground">Update user information</p>
          </div>
          <Button asChild variant="outline"><Link href="/admin/users"><ArrowLeft className="mr-2 h-4 w-4" />Back</Link></Button>
        </div>

        <form onSubmit={submit} className="space-y-6">
          <Card>
            <CardHeader><CardTitle>Basic Information</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Name *</Label>
                <Input id="name" value={data.name} onChange={e => setData('name', e.target.value)} />
                {errors.name && <p className="text-sm text-destructive">{errors.name}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email *</Label>
                <Input id="email" type="email" value={data.email} onChange={e => setData('email', e.target.value)} />
                {errors.email && <p className="text-sm text-destructive">{errors.email}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="is_admin">Role *</Label>
                <div className="flex items-center gap-2 pt-2">
                  <input
                    id="is_admin"
                    type="checkbox"
                    checked={data.is_admin}
                    onChange={(e) => setData('is_admin', e.target.checked)}
                    className="h-4 w-4 rounded border-gray-300"
                  />
                  <Label htmlFor="is_admin" className="font-normal cursor-pointer">Admin</Label>
                </div>
                {errors.is_admin && <p className="text-sm text-destructive">{errors.is_admin}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="whatsapp_number">
                  WhatsApp {whatsappRequired ? '*' : '(optional for admins)'}
                </Label>
                <Input
                  id="whatsapp_number"
                  value={data.whatsapp_number ?? ''}
                  onChange={e => setData('whatsapp_number', e.target.value)}
                  placeholder="e.g. +123456789"
                  required={whatsappRequired}
                />
                {errors.whatsapp_number && <p className="text-sm text-destructive">{errors.whatsapp_number}</p>}
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="password">New Password (optional)</Label>
                  <Input id="password" type="password" value={data.password} onChange={e => setData('password', e.target.value)} />
                  {errors.password && <p className="text-sm text-destructive">{errors.password}</p>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password_confirmation">Confirm Password</Label>
                  <Input id="password_confirmation" type="password" value={data.password_confirmation} onChange={e => setData('password_confirmation', e.target.value)} />
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-end gap-4">
            <Button type="button" variant="outline" asChild><Link href="/admin/users">Cancel</Link></Button>
            <Button type="submit" disabled={processing}>{processing ? 'Updating...' : 'Update User'}</Button>
          </div>
        </form>
      </div>
    </AppLayout>
  );
}
